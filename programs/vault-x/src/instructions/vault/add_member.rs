use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to add a new member to the vault
#[derive(Accounts)]
pub struct VaultAddMember<'info> {
    #[account(
        mut,
        seeds = [SEED_PREFIX, SEED_VAULT, vault.create_key.key().as_ref()],
        bump = vault.bump,
        constraint = vault.to_account_info().owner.eq(&id()) @ VaultError::InvalidProgram
    )]
    pub vault: Account<'info, Vault>,

    #[account(constraint = vault.is_founder(&founder.key()) @ VaultError::FounderNotFound)]
    pub founder: Signer<'info>,

    /// The account used to pay for additional storage if the vault needs to expand.
    #[account(mut)]
    pub rent_payer: Option<Signer<'info>>,

    /// Required if reallocation is needed
    pub system_program: Option<Program<'info, System>>,
}

/// Arguments required to add a new member to the vault
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VaultAddMemberArgs {
    new_member: Pubkey,
}

/// Adds a new member to the vault and reallocates if necessary
pub fn add_member(ctx: Context<VaultAddMember>, args: VaultAddMemberArgs) -> Result<()> {
    let VaultAddMemberArgs { new_member } = args;
    let vault = &mut ctx.accounts.vault;
    let payer = &ctx.accounts.rent_payer;
    let system_program = &ctx.accounts.system_program;

    match vault.members.binary_search(&new_member) {
        Ok(_) => return err!(VaultError::MemberAlreadyExists),
        Err(member_index) => vault.members.insert(member_index, new_member),
    };

    // Ensure the number of members doesn't exceed the limit
    require!(
        vault.members.len() <= usize::from(MAX_VAULT_ROLES),
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
