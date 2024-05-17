use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to update the treasury of the vault configuration
#[derive(Accounts)]
pub struct VaultConfigUpdateTreasury<'info> {
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

/// Updates the treasury of the vault configuration
pub fn update_treasury(
    ctx: Context<VaultConfigUpdateTreasury>,
    new_treasury: Pubkey,
) -> Result<()> {
    require!(
        new_treasury.ne(&Pubkey::default()),
        VaultError::InvalidAccount
    );

    let vault_config = &mut ctx.accounts.vault_config;
    vault_config.treasury = new_treasury;

    Ok(())
}
