/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'

/**
 * Arguments used to create {@link Vault}
 * @category Accounts
 * @category generated
 */
export type VaultArgs = {
  allowListMerkleTree: web3.PublicKey
  administrator: web3.PublicKey
  bump: number
  createKey: web3.PublicKey
  founders: web3.PublicKey[]
  members: web3.PublicKey[]
  staleTransactionIndex: number
  founderThreshold: number
  transactionIndex: number
}

export const vaultDiscriminator = [211, 8, 232, 43, 2, 152, 117, 119]
/**
 * Holds the data for the {@link Vault} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Vault implements VaultArgs {
  private constructor(
    readonly allowListMerkleTree: web3.PublicKey,
    readonly administrator: web3.PublicKey,
    readonly bump: number,
    readonly createKey: web3.PublicKey,
    readonly founders: web3.PublicKey[],
    readonly members: web3.PublicKey[],
    readonly staleTransactionIndex: number,
    readonly founderThreshold: number,
    readonly transactionIndex: number
  ) {}

  /**
   * Creates a {@link Vault} instance from the provided args.
   */
  static fromArgs(args: VaultArgs) {
    return new Vault(
      args.allowListMerkleTree,
      args.administrator,
      args.bump,
      args.createKey,
      args.founders,
      args.members,
      args.staleTransactionIndex,
      args.founderThreshold,
      args.transactionIndex
    )
  }

  /**
   * Deserializes the {@link Vault} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [Vault, number] {
    return Vault.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Vault} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<Vault> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find Vault account at ${address}`)
    }
    return Vault.fromAccountInfo(accountInfo, 0)[0]
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
    return beetSolana.GpaBuilder.fromStruct(programId, vaultBeet)
  }

  /**
   * Deserializes the {@link Vault} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Vault, number] {
    return vaultBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Vault} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return vaultBeet.serialize({
      accountDiscriminator: vaultDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Vault} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: VaultArgs) {
    const instance = Vault.fromArgs(args)
    return vaultBeet.toFixedFromValue({
      accountDiscriminator: vaultDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Vault} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: VaultArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Vault.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link Vault} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      allowListMerkleTree: this.allowListMerkleTree.toBase58(),
      administrator: this.administrator.toBase58(),
      bump: this.bump,
      createKey: this.createKey.toBase58(),
      founders: this.founders,
      members: this.members,
      staleTransactionIndex: this.staleTransactionIndex,
      founderThreshold: this.founderThreshold,
      transactionIndex: this.transactionIndex,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const vaultBeet = new beet.FixableBeetStruct<
  Vault,
  VaultArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['allowListMerkleTree', beetSolana.publicKey],
    ['administrator', beetSolana.publicKey],
    ['bump', beet.u8],
    ['createKey', beetSolana.publicKey],
    ['founders', beet.array(beetSolana.publicKey)],
    ['members', beet.array(beetSolana.publicKey)],
    ['staleTransactionIndex', beet.u32],
    ['founderThreshold', beet.u16],
    ['transactionIndex', beet.u32],
  ],
  Vault.fromArgs,
  'Vault'
)
