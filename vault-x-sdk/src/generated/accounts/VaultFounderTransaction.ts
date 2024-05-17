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
  VaultTransactionStatus,
  vaultTransactionStatusBeet,
} from '../types/VaultTransactionStatus'
import {
  VaultTransactionMessage,
  vaultTransactionMessageBeet,
} from '../types/VaultTransactionMessage'

/**
 * Arguments used to create {@link VaultFounderTransaction}
 * @category Accounts
 * @category generated
 */
export type VaultFounderTransactionArgs = {
  creator: web3.PublicKey
  vault: web3.PublicKey
  transactionIndex: number
  status: VaultTransactionStatus
  bump: number
  fundBump: number
  ephemeralSignerBumps: Uint8Array
  message: VaultTransactionMessage
  approved: web3.PublicKey[]
  rejected: web3.PublicKey[]
  cancelled: web3.PublicKey[]
}

export const vaultFounderTransactionDiscriminator = [
  7, 114, 150, 192, 2, 36, 98, 245,
]
/**
 * Holds the data for the {@link VaultFounderTransaction} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class VaultFounderTransaction implements VaultFounderTransactionArgs {
  private constructor(
    readonly creator: web3.PublicKey,
    readonly vault: web3.PublicKey,
    readonly transactionIndex: number,
    readonly status: VaultTransactionStatus,
    readonly bump: number,
    readonly fundBump: number,
    readonly ephemeralSignerBumps: Uint8Array,
    readonly message: VaultTransactionMessage,
    readonly approved: web3.PublicKey[],
    readonly rejected: web3.PublicKey[],
    readonly cancelled: web3.PublicKey[]
  ) {}

  /**
   * Creates a {@link VaultFounderTransaction} instance from the provided args.
   */
  static fromArgs(args: VaultFounderTransactionArgs) {
    return new VaultFounderTransaction(
      args.creator,
      args.vault,
      args.transactionIndex,
      args.status,
      args.bump,
      args.fundBump,
      args.ephemeralSignerBumps,
      args.message,
      args.approved,
      args.rejected,
      args.cancelled
    )
  }

  /**
   * Deserializes the {@link VaultFounderTransaction} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [VaultFounderTransaction, number] {
    return VaultFounderTransaction.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link VaultFounderTransaction} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<VaultFounderTransaction> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(
        `Unable to find VaultFounderTransaction account at ${address}`
      )
    }
    return VaultFounderTransaction.fromAccountInfo(accountInfo, 0)[0]
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
      vaultFounderTransactionBeet
    )
  }

  /**
   * Deserializes the {@link VaultFounderTransaction} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(
    buf: Buffer,
    offset = 0
  ): [VaultFounderTransaction, number] {
    return vaultFounderTransactionBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link VaultFounderTransaction} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return vaultFounderTransactionBeet.serialize({
      accountDiscriminator: vaultFounderTransactionDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link VaultFounderTransaction} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: VaultFounderTransactionArgs) {
    const instance = VaultFounderTransaction.fromArgs(args)
    return vaultFounderTransactionBeet.toFixedFromValue({
      accountDiscriminator: vaultFounderTransactionDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link VaultFounderTransaction} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: VaultFounderTransactionArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      VaultFounderTransaction.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link VaultFounderTransaction} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      creator: this.creator.toBase58(),
      vault: this.vault.toBase58(),
      transactionIndex: this.transactionIndex,
      status: 'VaultTransactionStatus.' + VaultTransactionStatus[this.status],
      bump: this.bump,
      fundBump: this.fundBump,
      ephemeralSignerBumps: this.ephemeralSignerBumps,
      message: this.message,
      approved: this.approved,
      rejected: this.rejected,
      cancelled: this.cancelled,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const vaultFounderTransactionBeet = new beet.FixableBeetStruct<
  VaultFounderTransaction,
  VaultFounderTransactionArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['creator', beetSolana.publicKey],
    ['vault', beetSolana.publicKey],
    ['transactionIndex', beet.u32],
    ['status', vaultTransactionStatusBeet],
    ['bump', beet.u8],
    ['fundBump', beet.u8],
    ['ephemeralSignerBumps', beet.bytes],
    ['message', vaultTransactionMessageBeet],
    ['approved', beet.array(beetSolana.publicKey)],
    ['rejected', beet.array(beetSolana.publicKey)],
    ['cancelled', beet.array(beetSolana.publicKey)],
  ],
  VaultFounderTransaction.fromArgs,
  'VaultFounderTransaction'
)
