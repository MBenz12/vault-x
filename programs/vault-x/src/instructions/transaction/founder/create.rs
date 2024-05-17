use crate::constants::*;
use crate::errors::*;
use crate::id;
use crate::state::*;
use anchor_lang::prelude::*;

/// Accounts required to create a founder transaction
#[derive(Accounts)]
#[instruction(args: VaultFounderCreateTransactionArgs)]
pub struct VaultFounderCreateTransaction<'info> {
    #[account(
        init,
        payer = creator,
        space = VaultFounderTransaction::size(args.ephemeral_signers, &args.transaction_message, vault.founders.len())?,
        seeds = [
            SEED_PREFIX,
            vault.key().as_ref(),
            SEED_FOUNDER_TRANSACTION,
            &vault.transaction_index.checked_add(1).unwrap().to_le_bytes(),
        ],
        bump
    )]
    pub transaction: Account<'info, VaultFounderTransaction>,

    #[account(
        mut,
        seeds = [SEED_PREFIX, SEED_VAULT, vault.create_key.key().as_ref()],
        bump = vault.bump,
        constraint = vault.to_account_info().owner.eq(&id()) @ VaultError::InvalidProgram
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = vault.is_founder(&creator.key()) @ VaultError::FounderNotFound
    )]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Creates a founder transaction in the Vault
pub fn create(
    ctx: Context<VaultFounderCreateTransaction>,
    args: VaultFounderCreateTransactionArgs,
) -> Result<()> {
    let VaultFounderCreateTransactionArgs {
        transaction_message,
        ephemeral_signers,
    } = args;

    let VaultFounderCreateTransaction {
        vault,
        transaction,
        creator,
        ..
    } = ctx.accounts;

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
    transaction.set_inner(VaultFounderTransaction {
        creator: creator.key(),
        vault: vault_key,
        transaction_index,
        status: VaultTransactionStatus::Active,
        bump: ctx.bumps.transaction,
        fund_bump,
        ephemeral_signer_bumps,
        message: transaction_message,
        approved: Vec::new(),
        rejected: Vec::new(),
        cancelled: Vec::new(),
    });

    Ok(())
}

/// Arguments required to create a founder transaction
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VaultFounderCreateTransactionArgs {
    pub ephemeral_signers: u8,
    pub transaction_message: Vec<u8>,
}
