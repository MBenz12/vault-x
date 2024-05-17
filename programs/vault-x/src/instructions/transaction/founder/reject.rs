use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required for a founder to reject a transaction
#[derive(Accounts)]
pub struct VaultFounderRejectTransaction<'info> {
    #[account(
        mut,
        seeds = [
            SEED_PREFIX,
            vault.key().as_ref(),
            SEED_FOUNDER_TRANSACTION,
            &transaction.transaction_index.to_le_bytes(),
        ],
        bump = transaction.bump,
        has_one = vault @ VaultError::InvalidInstructionAccount,
        constraint = transaction.is_transaction_valid(&VaultTransactionStatus::Active, &vault) @ VaultError::InvalidTransactionStatus
    )]
    pub transaction: Account<'info, VaultFounderTransaction>,

    #[account(
        seeds = [SEED_PREFIX, SEED_VAULT, vault.create_key.key().as_ref()],
        bump = vault.bump,
        constraint = vault.to_account_info().owner.eq(&id()) @ VaultError::InvalidProgram
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = vault.is_founder(&founder.key()) @ VaultError::FounderNotFound
    )]
    pub founder: Signer<'info>,
}

/// Rejects a founder transaction, moving it to the "Rejected" state if enough rejections are collected
pub fn reject(ctx: Context<VaultFounderRejectTransaction>) -> Result<()> {
    let founder = &ctx.accounts.founder;
    let transaction = &mut ctx.accounts.transaction;
    let vault = &ctx.accounts.vault;

    // Remove founder from the approved list if previously approved
    if let Ok(approved_index) = transaction.approved.binary_search(founder.key) {
        transaction.approved.remove(approved_index);
    }

    // Insert founder into the rejected list, or return an error if already rejected
    match transaction.rejected.binary_search(founder.key) {
        Ok(_) => return err!(VaultError::AlreadyApproved),
        Err(index) => transaction.rejected.insert(index, founder.key()),
    };

    // Move transaction to the "Rejected" state if rejection threshold is reached
    let vault_cutoff = vault
        .founders
        .len()
        .checked_sub(vault.founder_threshold.into())
        .unwrap();

    if transaction.rejected.len().ge(&vault_cutoff) {
        msg!("Reject threshold reached");
        transaction.status = VaultTransactionStatus::Rejected;
    }

    Ok(())
}
