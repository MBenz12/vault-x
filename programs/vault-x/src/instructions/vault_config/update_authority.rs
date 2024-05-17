use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to update the authority of the vault configuration
#[derive(Accounts)]
pub struct VaultConfigUpdateAuthority<'info> {
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

/// Updates the authority of the vault configuration
pub fn update_authority(
    ctx: Context<VaultConfigUpdateAuthority>,
    new_update_authority: Pubkey,
) -> Result<()> {
    require!(
        new_update_authority.ne(&Pubkey::default()),
        VaultError::InvalidAccount
    );

    let vault_config = &mut ctx.accounts.vault_config;
    vault_config.authority = new_update_authority;

    Ok(())
}
