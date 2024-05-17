use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required for a founder to cancel a transaction
#[derive(Accounts)]
pub struct VaultFounderCancelTransaction<'info> {
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
        constraint = transaction.is_transaction_valid(&VaultTransactionStatus::Approved, &vault) @ VaultError::InvalidTransactionStatus
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

/// Cancels a founder transaction if enough cancellations are collected
pub fn cancel(ctx: Context<VaultFounderCancelTransaction>) -> Result<()> {
    let founder = &ctx.accounts.founder;
    let transaction = &mut ctx.accounts.transaction;
    let vault = &ctx.accounts.vault;

    // Insert founder into the cancelled list, or return an error if already cancelled
    match transaction.cancelled.binary_search(founder.key) {
        Ok(_) => return err!(VaultError::AlreadyCancelled),
        Err(cancelled_index) => transaction.cancelled.insert(cancelled_index, founder.key()),
    }

    // Move transaction to the "Cancelled" state if cancellation threshold is reached
    if transaction
        .cancelled
        .len()
        .ge(&vault.founder_threshold.into())
    {
        msg!("Cancel threshold reached");
        transaction.status = VaultTransactionStatus::Cancelled;
    }

    Ok(())
}
