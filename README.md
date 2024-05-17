# Blockpal VaultX Wallet

## Overview

VaultX is a highly secure and versatile multi-signature Role-Based Access Control (RBAC) wallet designed specifically for the Solana blockchain. It empowers organizations and individuals to manage assets securely using a sophisticated access control mechanism, ensuring only authorized actions are executed.

With VaultX, users can configure intricate permission models that support both founder and member roles, enabling a flexible and decentralized governance structure.

## Key Features

- **Multi-Signature Wallets**: Protect assets by requiring multiple signatures for approvals
- **Role-Based Access Control**:
  - **Founder Roles**: Special privileges, high thresholds for approvals
  - **Member Roles**: Limited permissions but can initiate and vote on transactions
- **Secure PDA Transactions**:
  - **Ephemeral Signers**: Replace ephemeral keypairs with PDAs
  - **Protected Accounts**: Specific accounts are safeguarded against unauthorized modifications
- **Highly Configurable**:
  - **Custom Approval Thresholds**: Define unique quorum rules for each role
  - **Transaction Allowlists**: Control which members can execute specific transactions
- **Seamless Solana Integration**: Optimized for Solana's high throughput and low fees

## Getting Started

### Prerequisites

- Rust: Install the Rust toolchain via [Rustup](https://rustup.rs/)
- Solana CLI: Install the Solana CLI via [official instructions](https://docs.solana.com/cli/install-solana-cli-tools)
- Anchor: Install Anchor framework via `npm`:
  ```bash
  npm install -g @project-serum/anchor-cli
  ```

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/blockpal-io/vault-x.git
   cd vault-x
   ```

2. **Build the Program**

- `yarn install` for installing the packages
- `yarn build` for building the sdk and the program
- `yarn test` for testing the suites

### Deployment

Set `provider` in [Anchor.toml](./Anchor.toml) and then run `anchor deploy` to deploy to target provider.

```
[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"
```

### Usage

After deploying the VaultX program, you can interact with it using the provided instructions.

#### Create a New Vault

```rust
let vault = vaultx::create_vault(ctx, CreateVaultArgs {
    founder_threshold: 2,
    initial_founders: vec![founder1_pubkey, founder2_pubkey],
})
```

#### Add a New Founder

```rust
vaultx::add_founder(ctx, VaultAddFounderArgs {
    new_founder: new_founder_pubkey,
})
```

#### Create and Approve a Transaction

**Create a Founder Transaction**

```rust
vaultx::create_founder_transaction(ctx, VaultFounderCreateTransactionArgs {
    ephemeral_signers: 2,
    transaction_message: transaction_data,
})
```

**Approve the Transaction**

```rust
vaultx::approve_founder_transaction(ctx)
```

## Project Structure

### Source Code Layout

The source code follows a modular design with clearly separated components:

- **`src/constants.rs`**: Defines various constant values used across the project
- **`src/errors.rs`**: Enumerates all error codes used in VaultX
- **`src/instructions`**: Contains instructions for managing vaults and transactions
  - **`transaction`**:
    - **`founder`**: Instructions related to founder transactions
    - **`member`**: Instructions related to member transactions
  - **`vault`**: Instructions for managing vaults (create, add/remove founders, etc)
  - **`vault_config`**: Instructions to initialize and update global vault configuration
- **`src/state`**: Defines the on-chain account structures
  - **`founder_transaction.rs`**: Founder transaction structure
  - **`member_transaction.rs`**: Member transaction structure
  - **`vault.rs`**: Vault structure and validation logic
  - **`vault_config.rs`**: Vault configuration structure
- **`src/utils.rs`**: Utility functions for deriving ephemeral keys

### Major Modules

#### Instructions

The `instructions` module contains the business logic for managing vaults and transactions:

- **Vault Instructions**:

  - `create.rs`: Create a new vault
  - `add_founder.rs`: Add a new founder to a vault
  - `remove_founder.rs`: Remove a founder from a vault
  - `add_member.rs`: Add a new member to a vault
  - `remove_member.rs`: Remove a member from a vault
  - `update_founder_threshold.rs`: Change the founder approval threshold

- **Transaction Instructions**:

  - **Founder**:
    - `create.rs`: Create a new founder transaction
    - `approve.rs`: Approve a founder transaction
    - `reject.rs`: Reject a founder transaction
    - `cancel.rs`: Cancel a founder transaction
    - `execute.rs`: Execute a founder transaction
  - **Member**:
    - `create.rs`: Create a new member transaction
    - `execute.rs`: Execute a member transaction

- **Vault Config Instructions**:
  - `init.rs`: Initialize vault configuration
  - `update_authority.rs`: Update vault config authority
  - `update_creation_fee.rs`: Update vault creation fee
  - `update_treasury.rs`: Update vault config treasury

#### State

The `state` module defines all on-chain account structures used in the program:

- **Vault**: Represents the core vault account with founders and members
- **VaultConfig**: Configuration account for global program settings
- **VaultFounderTransaction**: Founder transaction account
- **VaultMemberTransaction**: Member transaction account

## Error Codes

All error codes are defined in `errors.rs` and returned through the Anchor `#[error_code]` macro. Some common errors include:

- `Unauthorized`: Attempted action without sufficient permissions
- `InvalidRoleCount`: Invalid number of roles (founders/members)
- `InvalidFounderThreshold`: Invalid founder threshold value
- `MissingAccount`: Required account not provided
- `FounderAlreadyExists`: The founder already exists
- `FounderNotFound`: Specified founder does not exist
- `MemberAlreadyExists`: The member already exists
- `MemberNotFound`: Specified member does not exist

## Contribution Guide

### Development

We welcome contributions to VaultX! To start developing:

1. Fork the repository
2. Create a new branch for your feature/fix
3. Write clean, tested, and well-documented code
4. Submit a pull request with a detailed description of your changes

### Code of Conduct

We adhere to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). Please read and follow these guidelines.

## License

This software is proprietary and not open source. It is the confidential and proprietary information of Blockpal LLC ("Proprietary Information"). You shall not disclose such Proprietary Information and shall use it only in accordance with the terms of the license agreement you entered into with Blockpal LLC.

**Restrictions**

- You may not copy, modify, distribute, or reverse-engineer any part of this software without express written permission from Blockpal LLC
- This software is provided under a specific licensing agreement, which governs the use of the software
- Unauthorized use or distribution is strictly prohibited

**Contact**  
For licensing inquiries or further questions, please reach out to `tedoc` on Discord.
