use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use spl_account_compression::id as compression_program_id;

/// Accounts required to create a new vault
#[derive(Accounts)]
#[instruction(args: CreateVaultArgs)]
pub struct CreateVault<'info> {
    /// Global vault configuration account
    #[account(
        seeds = [SEED_PREFIX, SEED_VAULT_CONFIG],
        bump,
        has_one = treasury @ VaultError::InvalidAccount
    )]
    pub vault_config: Account<'info, VaultConfig>,

    /// The treasury where the creation fee is transferred to.
    /// CHECK: Validation is performed in the vault_config account constraint.
    #[account(mut)]
    pub treasury: SystemAccount<'info>,

    /// CHECK: This account is validated in the instruction
    pub merkle_tree: UncheckedAccount<'info>,

    #[account(
        init,
        payer = administrator,
        space = Vault::size(&args.initial_founders, &[]),
        seeds = [SEED_PREFIX, SEED_VAULT, create_key.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    /// An ephemeral signer used as a seed for the Multisig PDA.
    /// Must be a signer to prevent front-running attacks by others.
    pub create_key: Signer<'info>,

    #[account(mut)]
    pub administrator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// Arguments required to create a vault
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateVaultArgs {
    pub founder_threshold: u16,
    pub initial_founders: Vec<Pubkey>,
}

/// Creates a new vault
pub fn create(ctx: Context<CreateVault>, args: CreateVaultArgs) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let merkle_tree = &ctx.accounts.merkle_tree;
    let administrator = &ctx.accounts.administrator;

    require!(
        merkle_tree.owner.eq(&compression_program_id()),
        VaultError::InvalidAllowlist
    );

    let CreateVaultArgs {
        mut initial_founders,
        founder_threshold,
    } = args;

    // Sort and deduplicate founders for binary search
    initial_founders.sort();
    initial_founders.dedup();

    // Ensure the administrator isn't a founder
    require!(
        !vault.check_for_admin_presence(&initial_founders),
        VaultError::AdminCannotBeFounder
    );

    // Validate the initial founders list
    vault.role_array_validate(&initial_founders)?;

    // Validate the founder threshold
    if founder_threshold < 1 || usize::from(founder_threshold) > initial_founders.len() {
        return err!(VaultError::InvalidFounderThreshold);
    }

    // Set the vault fields
    vault.set_inner(Vault {
        allow_list_merkle_tree: merkle_tree.key(),
        administrator: administrator.key(),
        bump: ctx.bumps.vault,
        create_key: ctx.accounts.create_key.key(),
        founders: initial_founders,
        members: vec![],
        stale_transaction_index: 0,
        founder_threshold,
        transaction_index: 0,
    });

    // Transfer the creation fee to the treasury if applicable
    let creation_fee = ctx.accounts.vault_config.creation_fee;
    if creation_fee > 0 {
        msg!("Creation fee lamports: {}", creation_fee);
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.administrator.to_account_info(),
                    to: ctx.accounts.treasury.to_account_info(),
                },
            ),
            creation_fee,
        )?;
    }

    Ok(())
}
