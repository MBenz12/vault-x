use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey;

/// The public key of the mainnet initializer's account.
/// TODO: Replace this pubkey with the mainnet initializer's pubkey before deploying
const INITIALIZER: Pubkey = pubkey!("BrQAbGdWQ9YUHmWWgKFdFe4miTURH71jkYFPXfaosqDv");

/// Accounts required to initialize the vault configuration
#[derive(Accounts)]
pub struct VaultConfigInit<'info> {
    /// Vault configuration account to be initialized
    #[account(
        init,
        payer = initializer,
        space = VaultConfig::size(),
        seeds = [SEED_PREFIX, SEED_VAULT_CONFIG],
        bump
    )]
    pub vault_config: Account<'info, VaultConfig>,

    /// Hard-coded initializer account used to initialize the vault config once
    #[account(
        mut,
        address = INITIALIZER @ VaultError::Unauthorized
    )]
    pub initializer: Signer<'info>,

    /// Authority that can manage the vault configuration (change treasury, etc.)
    #[account(
        constraint = authority.key().ne(&Pubkey::default()) @ VaultError::InvalidAccount
    )]
    pub authority: SystemAccount<'info>,

    /// The treasury where the creation fee is transferred to
    #[account(
        constraint = treasury.key().ne(&Pubkey::default()) @ VaultError::InvalidAccount
    )]
    pub treasury: SystemAccount<'info>,

    /// The system program used for initializing the vault config
    pub system_program: Program<'info, System>,
}

/// Initializes the global vault configuration
pub fn init(ctx: Context<VaultConfigInit>, creation_fee: u64) -> Result<()> {
    let vault_config = &mut ctx.accounts.vault_config;

    vault_config.bump = ctx.bumps.vault_config;
    vault_config.creation_fee = creation_fee;
    vault_config.authority = ctx.accounts.authority.key();
    vault_config.treasury = ctx.accounts.treasury.key();

    Ok(())
}
