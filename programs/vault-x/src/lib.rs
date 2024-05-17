#![allow(unknown_lints)]
#![allow(ambiguous_glob_reexports)]

use anchor_lang::prelude::*;
use instructions::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

declare_id!("GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A");

#[program]
pub mod vaultx {
    use super::*;

    /** VAULT CONFIG INSTRUCTIONS */
    pub fn vault_config_init(ctx: Context<VaultConfigInit>, creation_fee: u64) -> Result<()> {
        vault_config::init(ctx, creation_fee)
    }

    pub fn vault_config_update_authority(
        ctx: Context<VaultConfigUpdateAuthority>,
        new_authority: Pubkey,
    ) -> Result<()> {
        vault_config::update_authority(ctx, new_authority)
    }

    pub fn vault_config_update_creation_fee(
        ctx: Context<VaultConfigUpdateCreationFee>,
        new_creation_fee: u64,
    ) -> Result<()> {
        vault_config::update_creation_fee(ctx, new_creation_fee)
    }

    pub fn vault_config_update_treasury(
        ctx: Context<VaultConfigUpdateTreasury>,
        new_treasury: Pubkey,
    ) -> Result<()> {
        vault_config::update_treasury(ctx, new_treasury)
    }

    /** VAULT INSTRUCTIONS */
    pub fn create_vault(ctx: Context<CreateVault>, args: CreateVaultArgs) -> Result<()> {
        vault::create(ctx, args)
    }

    pub fn add_member(ctx: Context<VaultAddMember>, args: VaultAddMemberArgs) -> Result<()> {
        vault::add_member(ctx, args)
    }

    pub fn remove_member(
        ctx: Context<VaultRemoveMember>,
        args: VaultRemoveMemberArgs,
    ) -> Result<()> {
        vault::remove_member(ctx, args)
    }

    pub fn add_founder(ctx: Context<VaultAddFounder>, args: VaultAddFounderArgs) -> Result<()> {
        vault::add_founder(ctx, args)
    }

    pub fn remove_founder(
        ctx: Context<VaultRemoveFounder>,
        args: VaultRemoveFounderArgs,
    ) -> Result<()> {
        vault::remove_founder(ctx, args)
    }

    pub fn update_founder_threshold(
        ctx: Context<VaultUpdateFounderThreshold>,
        args: VaultUpdateFounderThresholdArgs,
    ) -> Result<()> {
        vault::update_founder_threshold(ctx, args)
    }

    /** FOUNDER TRANSACTION INSTRUCTIONS */
    pub fn create_founder_transaction(
        ctx: Context<VaultFounderCreateTransaction>,
        args: VaultFounderCreateTransactionArgs,
    ) -> Result<()> {
        transaction::founder::create(ctx, args)
    }

    pub fn approve_founder_transaction(ctx: Context<VaultFounderApproveTransaction>) -> Result<()> {
        transaction::founder::approve(ctx)
    }

    pub fn reject_founder_transaction(ctx: Context<VaultFounderRejectTransaction>) -> Result<()> {
        transaction::founder::reject(ctx)
    }

    pub fn cancel_founder_transaction(ctx: Context<VaultFounderCancelTransaction>) -> Result<()> {
        transaction::founder::cancel(ctx)
    }

    pub fn execute_founder_transaction(ctx: Context<VaultFounderExecuteTransaction>) -> Result<()> {
        transaction::founder::execute(ctx)
    }

    /** MEMBER TRANSACTION INSTRUCTIONS */
    pub fn create_member_transaction<'info>(
        ctx: Context<'_, '_, '_, 'info, VaultMemberCreateTransaction<'info>>,
        args: VaultMemberCreateTransactionArgs,
    ) -> Result<()> {
        transaction::member::create(ctx, args)
    }

    pub fn execute_member_transaction(ctx: Context<VaultMemberExecuteTransaction>) -> Result<()> {
        transaction::member::execute(ctx)
    }
}
