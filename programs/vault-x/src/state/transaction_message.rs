use crate::errors::*;
use anchor_lang::prelude::*;
use solana_program::instruction::Instruction;

/// Represents an instruction within a transaction
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VaultInstruction {
    pub program_id_index: u8,
    pub account_indexes: Vec<u8>,
    pub data: Vec<u8>,
}

/// Represents a message containing instructions for a transaction
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VaultTransactionMessage {
    /// The number of signer public keys in the account_keys vec
    pub num_signers: u8,

    /// The number of writable signer public keys in the account_keys vec.
    /// Scenario of someone who is paying rent, so lamports change refer to mut and signer.
    pub num_writable_signers: u8,

    /// The number of writable non-signer public keys in the account_keys vec.
    /// Normal state accounts are considered writable non-signers.
    pub num_writable_non_signers: u8,

    /// The account keys required for the transaction.
    /// The way the keys are arranged are by the following (0 - n index order):
    /// 1. Writable Signers
    /// 2. Non-Writable Signers
    /// 3. Writable Non-Signers
    /// 4. Non-Writable Non-Signers
    /// 5. Program IDs (if any)
    pub account_keys: Vec<Pubkey>,

    /// The instructions that make up the transaction
    pub instructions: Vec<VaultInstruction>,
}

impl VaultTransactionMessage {
    /// Validates the transaction message structure
    pub fn is_valid(&self) -> Result<()> {
        let VaultTransactionMessage {
            account_keys,
            num_signers,
            num_writable_signers,
            num_writable_non_signers,
            instructions,
            ..
        } = self;

        let account_keys_len = account_keys.len();

        // 1. Check total signers length
        require!(
            usize::from(*num_signers) <= account_keys_len,
            VaultError::InvalidVaultTransactionMessage
        );

        // 2. Check number of writable signers
        require!(
            num_writable_signers <= num_signers,
            VaultError::InvalidVaultTransactionMessage
        );

        // 3. Check number of writable non-signers
        let expected_num_writable_non_signers =
            account_keys_len.saturating_sub(usize::from(*num_signers));

        require!(
            usize::from(*num_writable_non_signers) <= expected_num_writable_non_signers,
            VaultError::InvalidVaultTransactionMessage
        );

        // 4. Check all instructions
        for instruction in instructions {
            let VaultInstruction {
                program_id_index,
                account_indexes,
                ..
            } = instruction;

            // 1. Check if the program_id_index is within bounds
            require!(
                usize::from(*program_id_index) < account_keys_len,
                VaultError::InvalidVaultTransactionMessage
            );

            for account_index in account_indexes {
                // 2. Check each account's index boundary inside current instruction
                require!(
                    usize::from(*account_index) < account_keys_len,
                    VaultError::InvalidVaultTransactionMessage
                );
            }
        }

        Ok(())
    }

    /// Validates the transaction message account infos against the expected keys and attributes
    pub fn validate_message_account_infos(
        &self,
        account_infos: &[AccountInfo],
        fund_key: &Pubkey,
        ephemeral_signer_keys: &[Pubkey],
    ) -> Result<()> {
        let VaultTransactionMessage { account_keys, .. } = self;

        let account_keys_len = account_keys.len();
        let account_infos_len = account_infos.len();

        // Passed accounts should match the accounts len when the transaction was created
        require!(
            account_keys_len.eq(&account_infos_len),
            VaultError::InvalidNumberOfAccounts
        );

        for (account_key_index, account_key) in account_keys.iter().enumerate() {
            let account_info_key = account_infos[account_key_index].key;

            require!(account_key.eq(account_info_key), VaultError::InvalidAccount);

            // If the account is marked as a signer in the message, it must be a signer in the account infos too.
            // Unless it's a fund or an ephemeral signer PDA, as they cannot be passed as signers to `remaining_accounts`,
            // because they are PDAs and can't sign the transaction.
            let is_account_info_signer = self.check_account_index_signer(account_key_index);
            let is_account_info_fund = account_info_key.eq(fund_key);
            let is_account_info_ephemeral_signer = ephemeral_signer_keys.contains(account_info_key);

            if is_account_info_signer && !is_account_info_fund && !is_account_info_ephemeral_signer
            {
                require!(
                    account_infos[account_key_index].is_signer,
                    VaultError::InvalidAccount
                );
            }

            // If the account is marked as writable in the message, it must be writable in the account infos too
            let is_account_info_writable = self.check_account_index_writable(account_key_index);

            if is_account_info_writable {
                require!(
                    account_infos[account_key_index].is_writable,
                    VaultError::InvalidAccount
                )
            }
        }

        Ok(())
    }

    /// Retrieves the instructions with ordered account infos for execution
    pub fn fetch_instructions_with_ordered_account_infos<'info>(
        &self,
        transaction_account_infos: &[AccountInfo<'info>],
        protected_accounts: &[Pubkey],
    ) -> Result<Vec<(Instruction, Vec<AccountInfo<'info>>)>> {
        let VaultTransactionMessage { instructions, .. } = self;

        let mut ix_account_infos_ordered = vec![];

        for compiled_instruction in instructions.iter() {
            let program_id_index = usize::from(compiled_instruction.program_id_index);
            let account_indexes = &compiled_instruction.account_indexes;

            if !self.check_ix_account_index_boundary(program_id_index) {
                return err!(VaultError::InvalidVaultTransactionMessage);
            }

            let program_id_account_info = &transaction_account_infos[program_id_index];
            let mut account_infos: Vec<AccountInfo> = vec![];
            let mut account_metas: Vec<AccountMeta> = vec![];

            for account_index in account_indexes.iter() {
                let account_index = usize::from(*account_index);
                if !self.check_ix_account_index_boundary(account_index) {
                    return err!(VaultError::InvalidVaultTransactionMessage);
                }

                let account_info = &transaction_account_infos[account_index];
                let account_info_pubkey = account_info.key();

                let is_signer = self.check_account_index_signer(account_index);
                let is_writable = self.check_account_index_writable(account_index);

                if is_writable && protected_accounts.contains(&account_info_pubkey) {
                    return err!(VaultError::ProtectedAccount);
                }

                let account_meta = if is_writable {
                    AccountMeta::new(account_info_pubkey, is_signer)
                } else {
                    AccountMeta::new_readonly(account_info_pubkey, is_signer)
                };

                account_metas.push(account_meta);
                account_infos.push(account_info.clone());
            }

            let instruction = Instruction {
                program_id: program_id_account_info.key(),
                accounts: account_metas,
                data: compiled_instruction.data.clone(),
            };

            // Add program ID at the end of each account info batch
            account_infos.push(program_id_account_info.clone());

            // Add sanitized instruction and account infos
            ix_account_infos_ordered.push((instruction, account_infos));
        }

        Ok(ix_account_infos_ordered)
    }

    /// Checks if the given instruction index is within bounds
    pub fn check_ix_account_index_boundary(&self, instruction_index: usize) -> bool {
        instruction_index < self.account_keys.len()
    }

    /// Checks if the account index corresponds to a signer
    pub fn check_account_index_signer(&self, account_key_index: usize) -> bool {
        account_key_index < usize::from(self.num_signers)
    }

    /// Checks if the account index corresponds to a writable account
    pub fn check_account_index_writable(&self, account_key_index: usize) -> bool {
        let VaultTransactionMessage {
            num_signers,
            num_writable_non_signers,
            num_writable_signers,
            ..
        } = self;

        let num_signers_usize = usize::from(*num_signers);
        let num_writable_signers_usize = &usize::from(*num_writable_signers);
        let num_writable_non_signers_usize = usize::from(*num_writable_non_signers);

        // Check if account_key_index falls under writable signers
        if account_key_index.lt(num_writable_signers_usize) {
            return true;
        }

        // Check if account_key_index falls under non-signers
        if account_key_index.ge(&num_signers_usize) {
            // Convert index to writable aligning index
            let account_key_writable_converted_index =
                account_key_index.saturating_sub(num_signers_usize);
            // Check if the converted index is with the writable non signers count
            return account_key_writable_converted_index.lt(&num_writable_non_signers_usize);
        }

        false
    }
}
