use crate::state::transaction_message::*;
use anchor_lang::prelude::*;
use solana_program::borsh0_10::get_instance_packed_len;

/// Account representing a member transaction in the Vault
#[account]
pub struct VaultMemberTransaction {
    // Creator of the transaction
    pub creator: Pubkey,
    // The vault this transaction belongs to
    pub vault: Pubkey,
    // Used for seed
    pub transaction_index: u32,
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
}

impl VaultMemberTransaction {
    /// Calculates the size of the member transaction account
    pub fn size(ephemeral_signers_count: u8, transaction_message: &Vec<u8>) -> Result<usize> {
        let message = VaultTransactionMessage::deserialize(&mut transaction_message.as_slice())?;
        let message_size = get_instance_packed_len(&message)?;

        Ok(
            8 +   // Anchor account discriminator
            32 +  // Creator
            32 +  // Vault
            8 +   // Transaction index
            1 +   // Bump
            1 +   // Fund bump
            (4 + usize::from(ephemeral_signers_count)) +   // Ephemeral signer bumps vec
            message_size, // Transaction message
        )
    }
}
