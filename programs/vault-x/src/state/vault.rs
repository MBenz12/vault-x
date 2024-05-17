use anchor_lang::{prelude::*, system_program};

use crate::constants::*;
use crate::errors::*;

/// Account representing the Vault
#[account]
pub struct Vault {
    pub allow_list_merkle_tree: Pubkey, // Account compression Merkle tree
    pub administrator: Pubkey,          // Administrator authority
    pub bump: u8,                       // PDA bump
    pub create_key: Pubkey,             // Vault creation ephemeral key
    pub founders: Vec<Pubkey>,          // Founders list
    pub members: Vec<Pubkey>,           // Members list
    pub stale_transaction_index: u32,   // Transactions created before this index are invalid
    pub founder_threshold: u16,         // Minimum approvals required for founder transactions
    pub transaction_index: u32,         // Last transaction index created for this vault
}

impl Vault {
    /// Calculates the size of the vault account based on the founders and members
    pub fn size(founders: &[Pubkey], members: &[Pubkey]) -> usize {
        8 +  // Anchor account discriminator
        32 + // Allow list merkle tree
        32 + // Administrator
        1 +  // PDA bump
        32 + // Create key
        (4 + founders.len() * 32) + // Founders vector
        (4 + members.len() * 32) +  // Members vector
        4 + // Stale transaction index
        2 + // Founder threshold
        4 // Transaction index
    }

    /// Validates that the vault's configuration is consistent and correct
    pub fn validate(&self) -> Result<()> {
        // Founder threshold must not exceed the number of founders
        require!(
            usize::from(self.founder_threshold) <= self.founders.len(),
            VaultError::InvalidFounderThreshold
        );

        // Stale transaction index must be less than or equal to transaction index
        require!(
            self.stale_transaction_index <= self.transaction_index,
            VaultError::InvalidStaleTransactionIndex
        );
        Ok(())
    }

    pub fn is_founder(&self, founder: &Pubkey) -> bool {
        self.founders.binary_search(founder).ok().is_some()
    }

    pub fn is_member(&self, member: &Pubkey) -> bool {
        self.members.binary_search(member).ok().is_some()
    }

    pub fn check_for_admin_presence(&self, role_array: &[Pubkey]) -> bool {
        // Admin cannot be a founder/member
        role_array.binary_search(&self.administrator).ok().is_some()
    }

    pub fn role_array_validate(&self, role_array: &[Pubkey]) -> Result<()> {
        let role_len = role_array.len();
        if role_len < 1 || role_len > usize::from(MAX_VAULT_ROLES) {
            return err!(VaultError::InvalidRoleCount);
        }
        Ok(())
    }

    /// Reallocates a vault account if the new founders or members size requires more space
    pub fn realloc_if_needed<'info>(
        vault: AccountInfo<'info>,
        founders: &[Pubkey],
        members: &[Pubkey],
        payer: Option<AccountInfo<'info>>,
        system_program: Option<AccountInfo<'info>>,
    ) -> Result<bool> {
        let vault_current_size = vault.data.borrow().len();
        let vault_current_lamports = vault.lamports();
        let required_size = Vault::size(founders, members);

        // Check if we need to reallocate space
        if vault_current_size >= required_size {
            return Ok(false);
        }

        let rent = Rent::get()?;

        // If more lamports are needed, transfer them to the account
        let required_lamports = rent.minimum_balance(required_size).max(1);

        let lmaports_diff = required_lamports.saturating_sub(vault_current_lamports);

        if lmaports_diff > 0 {
            let system_program = system_program.ok_or(VaultError::MissingAccount)?;

            let payer = payer.ok_or(VaultError::MissingAccount)?;

            require_keys_eq!(
                *system_program.key,
                system_program::ID,
                VaultError::InvalidProgram
            );

            system_program::transfer(
                CpiContext::new(
                    system_program,
                    system_program::Transfer {
                        from: payer,
                        to: vault.clone(),
                    },
                ),
                lmaports_diff,
            )?;
        }

        // Reallocate more space
        msg!("Expanding vault's space");
        AccountInfo::realloc(&vault, required_size, false)?;

        Ok(true)
    }
}
