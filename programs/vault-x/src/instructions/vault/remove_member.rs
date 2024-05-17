use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to remove a member from the vault
#[derive(Accounts)]
pub struct VaultRemoveMember<'info> {
    #[account(
        mut,
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

/// Arguments required to remove a member from the vault
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VaultRemoveMemberArgs {
    member: Pubkey,
}

/// Removes a member from the vault
pub fn remove_member(ctx: Context<VaultRemoveMember>, args: VaultRemoveMemberArgs) -> Result<()> {
    let vault = &mut ctx.accounts.vault;

    if let Ok(member_index) = vault.members.binary_search(&args.member) {
        vault.members.remove(member_index);
    } else {
        return err!(VaultError::MemberNotFound);
    }

    vault.stale_transaction_index = vault.transaction_index;
    vault.validate()?;

    Ok(())
}
