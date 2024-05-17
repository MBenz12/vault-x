pub const MAX_VAULT_ROLES: u16 = u16::MAX;

/// Seed prefixes for various PDAs used in the program
pub const SEED_PREFIX: &[u8] = b"vaultx";
pub const SEED_VAULT: &[u8] = b"vault";
pub const SEED_VAULT_CONFIG: &[u8] = b"vault_config";
pub const SEED_FOUNDER_TRANSACTION: &[u8] = b"founder_transaction";
pub const SEED_MEMBER_TRANSACTION: &[u8] = b"member_transaction";
pub const SEED_FUND: &[u8] = b"fund";
pub const SEED_EPHEMERAL_SIGNER: &[u8] = b"ephemeral_signer";
