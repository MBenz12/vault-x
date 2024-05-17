use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to update the founder threshold
#[derive(Accounts)]
pub struct VaultUpdateFounderThreshold<'info> {
    #[account(
        mut,
        seeds = [SEED_PREFIX, SEED_VAULT, vault.create_key.key().as_ref()],
        bump = vault.bump,
        has_one = administrator @ VaultError::Unauthorized,
        constraint = vault.to_account_info().owner.eq(&id()) @ VaultError::InvalidProgram
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub administrator: Signer<'info>,
}

/// Arguments required to update the founder threshold
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VaultUpdateFounderThresholdArgs {
    new_founder_threshold: u16,
}

/// Changes the founder threshold for the vault
pub fn update_founder_threshold(
    ctx: Context<VaultUpdateFounderThreshold>,
    args: VaultUpdateFounderThresholdArgs,
) -> Result<()> {
    require!(
        args.new_founder_threshold > 1,
        VaultError::InvalidFounderThreshold
    );

    let vault = &mut ctx.accounts.vault;
    vault.founder_threshold = args.new_founder_threshold;

    // Update the change index to deprecate any active transactions
    vault.stale_transaction_index = vault.transaction_index;

    vault.validate()?;

    Ok(())
}
