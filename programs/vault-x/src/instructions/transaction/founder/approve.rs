use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required for a founder to approve a transaction
#[derive(Accounts)]
pub struct VaultFounderApproveTransaction<'info> {
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

/// Approves a founder transaction, moving it to the "Approved" state if enough approvals are collected
pub fn approve(ctx: Context<VaultFounderApproveTransaction>) -> Result<()> {
    let founder = &ctx.accounts.founder;
    let transaction = &mut ctx.accounts.transaction;
    let vault = &ctx.accounts.vault;

    // Remove founder from the rejected list if previously rejected
    if let Ok(rejected_index) = transaction.rejected.binary_search(founder.key) {
        transaction.rejected.remove(rejected_index);
    }

    // Insert founder into the approved list, or return an error if already approved
    match transaction.approved.binary_search(founder.key) {
        Ok(_) => return err!(VaultError::AlreadyApproved),
        Err(index) => transaction.approved.insert(index, founder.key()),
    };

    // Move transaction to the "Approved" state if approval threshold is reached
    if transaction
        .approved
        .len()
        .ge(&vault.founder_threshold.into())
    {
        msg!("Approval threshold reached");
        transaction.status = VaultTransactionStatus::Approved;
    }

    Ok(())
}
