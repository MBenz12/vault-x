use super::Vault;
use crate::state::transaction_message::*;
use anchor_lang::prelude::*;
use solana_program::borsh0_10::get_instance_packed_len;

/// Enum representing the status of a Vault Transaction
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VaultTransactionStatus {
    Active,
    Executed,
    Rejected,
    Cancelled,
    Approved,
}

/// Account representing a founder transaction in the Vault
#[account]
pub struct VaultFounderTransaction {
    // Creator of the transaction
    pub creator: Pubkey,
    // The vault this transaction belongs to
    pub vault: Pubkey,
    // Used for seed
    pub transaction_index: u32,
    // The status of the transaction
    pub status: VaultTransactionStatus,
    // Bump for the seed
    pub bump: u8,
    /// Derivation bump of the fund PDA this transaction belongs to
    pub fund_bump: u8,

    /* EXPLANATION OF EPHEMERAL BUMPS */
    // These signer bumps are for ephemeral PDAs that replace ephemeral keypairs.
    // They are used for signing actions like creating a mint token, which requires
    // an ephemeral keypair. Instead, PDAs controlled by the vault replace these keypairs.
    // The bumps for these signer PDAs are stored here
    pub ephemeral_signer_bumps: Vec<u8>,

    // The transaction message
    pub message: VaultTransactionMessage,

    // Keys that have approved/signed
    pub approved: Vec<Pubkey>,
    // Keys that have rejected
    pub rejected: Vec<Pubkey>,
    // Keys that have cancelled (ExecuteReady only)
    pub cancelled: Vec<Pubkey>,
}

impl VaultFounderTransaction {
    /// Calculates the size of the founder transaction account
    pub fn size(
        ephemeral_signers_count: u8,
        transaction_message: &Vec<u8>,
        founders_length: usize,
    ) -> Result<usize> {
        let message = VaultTransactionMessage::deserialize(&mut transaction_message.as_slice())?;
        let message_size = get_instance_packed_len(&message)?;

        Ok(
            8 +   // Anchor account discriminator
            32 +  // Creator
            32 +  // Vault
            4 +   // Transaction index
            (1 + std::mem::size_of::<VaultTransactionStatus>()) + // Enum discriminator and size
            1 +   // Bump
            1 +   // Fund bump
            (4 + usize::from(ephemeral_signers_count)) +   // Ephemeral signer bumps vec
            message_size +
            3 * ( // Approved, rejected, cancelled
                4 + // Vector discriminator
                (32 * founders_length)
            ), // Message
        )
    }

    /// Checks if a transaction is valid based on its status and the vault's stale transaction index
    pub fn is_transaction_valid(
        &self,
        transaction_status: &VaultTransactionStatus,
        vault: &Vault,
    ) -> bool {
        let VaultFounderTransaction {
            status,
            transaction_index,
            ..
        } = self;

        if status.ne(transaction_status) {
            return false;
        }

        if transaction_status.eq(&VaultTransactionStatus::Active)
            && transaction_index.le(&vault.stale_transaction_index)
        {
            return false;
        }

        true
    }
}
