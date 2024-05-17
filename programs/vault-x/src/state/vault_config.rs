use anchor_lang::prelude::*;

/// Account representing the global Vault configuration
#[account]
pub struct VaultConfig {
    pub bump: u8,          // PDA bump
    pub creation_fee: u64, // Creation fee in lamports
    pub authority: Pubkey, // Authority that can manage this account
    pub treasury: Pubkey,  // Treasury where the creation fees are transferred
}

impl VaultConfig {
    /// Calculates the size of the VaultConfig account
    pub fn size() -> usize {
        8 +  // Anchor account discriminator
        1 +  // PDA bump
        8 +  // Creation fee
        32 + // Authority
        32 // Treasury
    }
}
