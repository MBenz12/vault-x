use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to remove a founder from the vault
#[derive(Accounts)]
pub struct VaultRemoveFounder<'info> {
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

/// Arguments required to remove a founder from the vault
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VaultRemoveFounderArgs {
    founder: Pubkey,
    new_founder_threshold: Option<u16>,
}

/// Removes a founder from the vault and optionally updates the founder threshold
pub fn remove_founder(
    ctx: Context<VaultRemoveFounder>,
    args: VaultRemoveFounderArgs,
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;

    if let Ok(founder_index) = vault.founders.binary_search(&args.founder) {
        vault.founders.remove(founder_index);
    } else {
        return err!(VaultError::FounderNotFound);
    }

    if let Some(new_founder_threshold) = args.new_founder_threshold {
        require!(
            new_founder_threshold > 0 && usize::from(new_founder_threshold) <= vault.founders.len(),
            VaultError::InvalidFounderThreshold
        );
        vault.founder_threshold = new_founder_threshold;
    }

    vault.stale_transaction_index = vault.transaction_index;
    vault.validate()?;

    Ok(())
}
