use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to update the creation fee of the vault configuration
#[derive(Accounts)]
pub struct VaultConfigUpdateCreationFee<'info> {
    #[account(
        mut,
        seeds = [SEED_PREFIX, SEED_VAULT_CONFIG],
        bump,
    )]
    pub vault_config: Account<'info, VaultConfig>,

    #[account(
        mut,
        address = vault_config.authority @ VaultError::Unauthorized
    )]
    pub authority: Signer<'info>,
}

/// Updates the creation fee of the vault configuration
pub fn update_creation_fee(
    ctx: Context<VaultConfigUpdateCreationFee>,
    new_creation_fee: u64,
) -> Result<()> {
    let vault_config = &mut ctx.accounts.vault_config;
    vault_config.creation_fee = new_creation_fee;

    Ok(())
}
