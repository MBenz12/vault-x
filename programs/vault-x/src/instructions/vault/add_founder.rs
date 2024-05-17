use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to add a new founder to the vault
#[derive(Accounts)]
pub struct VaultAddFounder<'info> {
    #[account(
        mut,
        seeds = [SEED_PREFIX, SEED_VAULT, vault.create_key.key().as_ref()],
        bump = vault.bump,
        has_one = administrator @ VaultError::Unauthorized,
        constraint = vault.to_account_info().owner.eq(&id()) @ VaultError::InvalidProgram
    )]
    pub vault: Account<'info, Vault>,

    pub administrator: Signer<'info>,

    /// The account used to pay for additional storage if the vault needs to expand
    #[account(mut)]
    pub rent_payer: Option<Signer<'info>>,

    /// Required if reallocation is needed
    pub system_program: Option<Program<'info, System>>,
}

/// Arguments required to add a new founder to the vault
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VaultAddFounderArgs {
    new_founder: Pubkey,
}

/// Adds a new founder to the vault and reallocates if necessary
pub fn add_founder(ctx: Context<VaultAddFounder>, args: VaultAddFounderArgs) -> Result<()> {
    let VaultAddFounderArgs { new_founder } = args;
    let vault = &mut ctx.accounts.vault;
    let payer = &ctx.accounts.rent_payer;
    let system_program = &ctx.accounts.system_program;

    match vault.founders.binary_search(&new_founder) {
        Ok(_) => return err!(VaultError::FounderAlreadyExists),
        Err(founder_index) => vault.founders.insert(founder_index, new_founder),
    };

    // Ensure the number of founders doesn't exceed the limit
    require!(
        vault.founders.len() <= usize::from(MAX_VAULT_ROLES),
        VaultError::InvalidRoleCount
    );

    // Reallocate if necessary
    Vault::realloc_if_needed(
        vault.to_account_info(),
        &vault.founders,
        &vault.members,
        payer.as_ref().map(ToAccountInfo::to_account_info),
        system_program.as_ref().map(ToAccountInfo::to_account_info),
    )?;

    vault.stale_transaction_index = vault.transaction_index;
    vault.validate()?;

    Ok(())
}
