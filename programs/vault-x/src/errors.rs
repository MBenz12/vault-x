use anchor_lang::prelude::*;

/// Enumeration of possible errors in the VaultX program
#[error_code]
pub enum VaultError {
    #[msg("Invalid role count. Valid role count is between 1 and MAX_VAULT_ROLES")]
    InvalidRoleCount,
    #[msg("Invalid founder threshold")]
    InvalidFounderThreshold,
    #[msg("Unauthorized action attempted")]
    Unauthorized,
    #[msg("Missing account required for transaction")]
    MissingAccount,
    #[msg("Founder already exists")]
    FounderAlreadyExists,
    #[msg("Member already exists")]
    MemberAlreadyExists,
    #[msg("Founder does not exist")]
    FounderNotFound,
    #[msg("Member does not exist")]
    MemberNotFound,
    #[msg("Invalid stale transaction index")]
    InvalidStaleTransactionIndex,
    #[msg("Account is not part of the program")]
    InvalidProgram,
    #[msg("Member already approved the transaction")]
    AlreadyApproved,
    #[msg("Member already rejected the transaction")]
    AlreadyRejected,
    #[msg("Member already cancelled the transaction")]
    AlreadyCancelled,
    #[msg("Transaction message is malformed")]
    InvalidVaultTransactionMessage,
    #[msg("Cannot modify protected account")]
    ProtectedAccount,
    #[msg("Invalid account provided")]
    InvalidAccount,
    #[msg("Invalid allowlist provided")]
    InvalidAllowlist,
    #[msg("Wrong number of accounts provided")]
    InvalidNumberOfAccounts,
    #[msg("Invalid transaction status for voting")]
    InvalidTransactionStatus,
    #[msg("Invalid instruction account")]
    InvalidInstructionAccount,
    #[msg("Administrator cannot be a founder")]
    AdminCannotBeFounder,
    #[msg("Administrator cannot be a member")]
    AdminCannotBeMember,
}
