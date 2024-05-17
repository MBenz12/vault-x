use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;
use spl_account_compression::{
    cpi::{accounts::VerifyLeaf, verify_leaf},
    id as compression_program_id,
    program::SplAccountCompression,
};

/// Accounts required to create a member transaction
#[derive(Accounts)]
#[instruction(args: VaultMemberCreateTransactionArgs)]
pub struct VaultMemberCreateTransaction<'info> {
    #[account(
        init,
        payer = creator,
        space = VaultMemberTransaction::size(args.ephemeral_signers, &args.transaction_message)?,
        seeds = [
            SEED_PREFIX,
            vault.key().as_ref(),
            SEED_MEMBER_TRANSACTION,
            &vault.transaction_index.checked_add(1).unwrap().to_le_bytes(),
        ],
        bump
    )]
    pub transaction: Account<'info, VaultMemberTransaction>,

    #[account(
        mut,
        seeds = [SEED_PREFIX, SEED_VAULT, vault.create_key.key().as_ref()],
        bump = vault.bump,
        constraint = vault.to_account_info().owner.eq(&id()) @ VaultError::InvalidProgram
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = vault.is_member(&creator.key()) @ VaultError::MemberNotFound
    )]
    pub creator: Signer<'info>,

    /// CHECK: This account is validated in the instruction
    pub merkle_tree: UncheckedAccount<'info>,

    /// Account compression program
    pub account_compression_program: Program<'info, SplAccountCompression>,

    pub system_program: Program<'info, System>,
}

/// Creates a member transaction in the Vault
pub fn create<'info>(
    ctx: Context<'_, '_, '_, 'info, VaultMemberCreateTransaction<'info>>,
    args: VaultMemberCreateTransactionArgs,
) -> Result<()> {
    let VaultMemberCreateTransaction {
        vault,
        transaction,
        creator,
        merkle_tree,
        account_compression_program,
        ..
    } = ctx.accounts;

    let proof_accounts = ctx.remaining_accounts;

    // Validate that the Merkle tree account belongs to the account-compression program
    require_eq!(
        merkle_tree.owner,
        &compression_program_id(),
        VaultError::InvalidAllowlist
    );

    // Validate that the Merkle tree account matches the one under the current vault
    require_eq!(
        merkle_tree.key(),
        vault.allow_list_merkle_tree,
        VaultError::InvalidAllowlist
    );

    // Proof verification
    let VaultMemberCreateTransactionArgs {
        allow_list_leaf,
        allow_list_leaf_index,
        allow_list_root,
        transaction_message,
        ephemeral_signers,
    } = args;

    verify_leaf(
        CpiContext::new(
            account_compression_program.to_account_info(),
            VerifyLeaf {
                merkle_tree: merkle_tree.to_account_info(),
            },
        )
        .with_remaining_accounts(proof_accounts.to_vec()),
        allow_list_root,
        allow_list_leaf,
        allow_list_leaf_index,
    )?;

    // Validate and deserialize the transaction message
    let transaction_message =
        match VaultTransactionMessage::deserialize(&mut transaction_message.as_slice()) {
            Ok(transaction_message) => transaction_message,
            Err(_) => return err!(VaultError::InvalidVaultTransactionMessage),
        };
    transaction_message.is_valid()?;

    // Retrieve keys for vault and transaction
    let vault_key = vault.key();
    let transaction_key = transaction.key();

    // Fetch fund bump to store in the transaction
    let (_, fund_bump) =
        Pubkey::find_program_address(&[SEED_PREFIX, vault_key.as_ref(), SEED_FUND], &id());

    // Generate ephemeral signer bumps
    let ephemeral_signer_bumps: Vec<u8> = (0..ephemeral_signers)
        .map(|ephemeral_signer_index| {
            let (_, ephemeral_signer_bump) = Pubkey::find_program_address(
                &[
                    SEED_PREFIX,
                    transaction_key.as_ref(),
                    SEED_EPHEMERAL_SIGNER,
                    &ephemeral_signer_index.to_le_bytes(),
                ],
                &id(),
            );

            ephemeral_signer_bump
        })
        .collect();

    // Increment transaction index for this vault
    let transaction_index = vault.transaction_index.checked_add(1).unwrap();
    vault.transaction_index = transaction_index;

    // Set the transaction fields
    transaction.set_inner(VaultMemberTransaction {
        creator: creator.key(),
        vault: vault_key,
        transaction_index,
        bump: ctx.bumps.transaction,
        fund_bump,
        ephemeral_signer_bumps,
        message: transaction_message,
    });

    Ok(())
}

/// Arguments required to create a member transaction
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VaultMemberCreateTransactionArgs {
    pub ephemeral_signers: u8,
    pub transaction_message: Vec<u8>,
    pub allow_list_root: [u8; 32],
    pub allow_list_leaf: [u8; 32],
    pub allow_list_leaf_index: u32,
}
