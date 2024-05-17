use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use crate::utils::*;
use anchor_lang::prelude::*;
use solana_program::program::invoke_signed;

/// Accounts required for a member to execute a transaction
#[derive(Accounts)]
pub struct VaultMemberExecuteTransaction<'info> {
    #[account(
        mut,
        seeds = [
            SEED_PREFIX,
            vault.key().as_ref(),
            SEED_MEMBER_TRANSACTION,
            &transaction.transaction_index.to_le_bytes(),
        ],
        bump = transaction.bump,
        has_one = vault @ VaultError::InvalidInstructionAccount,
    )]
    pub transaction: Account<'info, VaultMemberTransaction>,

    #[account(
        seeds = [SEED_PREFIX, SEED_VAULT, vault.create_key.key().as_ref()],
        bump = vault.bump,
        constraint = vault.to_account_info().owner.eq(&id()) @ VaultError::InvalidProgram
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = vault.is_member(&member.key()) @ VaultError::MemberNotFound
    )]
    pub member: Signer<'info>,
}

/// Executes a member transaction by invoking the associated instructions
pub fn execute(ctx: Context<VaultMemberExecuteTransaction>) -> Result<()> {
    let transaction = &mut ctx.accounts.transaction;
    let vault = &ctx.accounts.vault;
    let vault_key = vault.key();

    let fund_bump = transaction.fund_bump;
    let fund_seeds = &[SEED_PREFIX, vault_key.as_ref(), SEED_FUND, &[fund_bump]];
    let fund_key = Pubkey::create_program_address(fund_seeds, &id()).unwrap();

    // Generate keys and seeds for ephemeral signers
    let transaction_key = transaction.key();
    let (ephemeral_signer_keys, ephemeral_signer_seeds) =
        fetch_ephemeral_keys(&transaction.ephemeral_signer_bumps, &transaction.key());

    // Remaining accounts for the transaction
    let transaction_account_infos = ctx.remaining_accounts;
    let transaction_message = &transaction.message;

    // Validate and sanitize instructions and account infos
    transaction_message.validate_message_account_infos(
        transaction_account_infos,
        &fund_key,
        &ephemeral_signer_keys,
    )?;

    // Protect specific accounts from writable access during execution
    let protected_accounts = &[vault_key, transaction_key];

    let instructions_with_ordered_account_infos = transaction_message
        .fetch_instructions_with_ordered_account_infos(
            transaction_account_infos,
            protected_accounts,
        )?;

    // Execute each instruction with the appropriate signers
    for (instruction, account_infos) in instructions_with_ordered_account_infos.iter() {
        let ephemeral_signer_seeds_slice = ephemeral_signer_seeds
            .iter()
            .map(|second_layer| {
                second_layer
                    .iter()
                    .map(|third_layer| third_layer.as_slice())
                    .collect::<Vec<&[u8]>>()
            })
            .collect::<Vec<Vec<&[u8]>>>();

        let mut ephemeral_signer_seeds_int_slice = ephemeral_signer_seeds_slice
            .iter()
            .map(Vec::as_slice)
            .collect::<Vec<&[&[u8]]>>();

        ephemeral_signer_seeds_int_slice.push(fund_seeds);
        let signers_seeds = ephemeral_signer_seeds_int_slice.as_slice();

        invoke_signed(instruction, account_infos, signers_seeds)?;
    }

    Ok(())
}
