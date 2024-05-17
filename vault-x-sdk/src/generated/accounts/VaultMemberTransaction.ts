/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'
import {
  VaultTransactionMessage,
  vaultTransactionMessageBeet,
} from '../types/VaultTransactionMessage'

/**
 * Arguments used to create {@link VaultMemberTransaction}
 * @category Accounts
 * @category generated
 */
export type VaultMemberTransactionArgs = {
  creator: web3.PublicKey
  vault: web3.PublicKey
  transactionIndex: number
  bump: number
  fundBump: number
  ephemeralSignerBumps: Uint8Array
  message: VaultTransactionMessage
}

export const vaultMemberTransactionDiscriminator = [
  62, 94, 179, 175, 167, 48, 124, 108,
]
/**
 * Holds the data for the {@link VaultMemberTransaction} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class VaultMemberTransaction implements VaultMemberTransactionArgs {
  private constructor(
    readonly creator: web3.PublicKey,
    readonly vault: web3.PublicKey,
    readonly transactionIndex: number,
    readonly bump: number,
    readonly fundBump: number,
    readonly ephemeralSignerBumps: Uint8Array,
    readonly message: VaultTransactionMessage
  ) {}

  /**
   * Creates a {@link VaultMemberTransaction} instance from the provided args.
   */
  static fromArgs(args: VaultMemberTransactionArgs) {
    return new VaultMemberTransaction(
      args.creator,
      args.vault,
      args.transactionIndex,
      args.bump,
      args.fundBump,
      args.ephemeralSignerBumps,
      args.message
    )
  }

  /**
   * Deserializes the {@link VaultMemberTransaction} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [VaultMemberTransaction, number] {
    return VaultMemberTransaction.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link VaultMemberTransaction} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<VaultMemberTransaction> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(
        `Unable to find VaultMemberTransaction account at ${address}`
      )
    }
    return VaultMemberTransaction.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(
      programId,
      vaultMemberTransactionBeet
    )
  }

  /**
   * Deserializes the {@link VaultMemberTransaction} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(
    buf: Buffer,
    offset = 0
  ): [VaultMemberTransaction, number] {
    return vaultMemberTransactionBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link VaultMemberTransaction} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return vaultMemberTransactionBeet.serialize({
      accountDiscriminator: vaultMemberTransactionDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link VaultMemberTransaction} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: VaultMemberTransactionArgs) {
    const instance = VaultMemberTransaction.fromArgs(args)
    return vaultMemberTransactionBeet.toFixedFromValue({
      accountDiscriminator: vaultMemberTransactionDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link VaultMemberTransaction} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: VaultMemberTransactionArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      VaultMemberTransaction.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link VaultMemberTransaction} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      creator: this.creator.toBase58(),
      vault: this.vault.toBase58(),
      transactionIndex: this.transactionIndex,
      bump: this.bump,
      fundBump: this.fundBump,
      ephemeralSignerBumps: this.ephemeralSignerBumps,
      message: this.message,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const vaultMemberTransactionBeet = new beet.FixableBeetStruct<
  VaultMemberTransaction,
  VaultMemberTransactionArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['creator', beetSolana.publicKey],
    ['vault', beetSolana.publicKey],
    ['transactionIndex', beet.u32],
    ['bump', beet.u8],
    ['fundBump', beet.u8],
    ['ephemeralSignerBumps', beet.bytes],
    ['message', vaultTransactionMessageBeet],
  ],
  VaultMemberTransaction.fromArgs,
  'VaultMemberTransaction'
)
