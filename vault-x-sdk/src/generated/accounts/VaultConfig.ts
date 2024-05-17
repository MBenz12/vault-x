/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * Arguments used to create {@link VaultConfig}
 * @category Accounts
 * @category generated
 */
export type VaultConfigArgs = {
  bump: number
  creationFee: beet.bignum
  authority: web3.PublicKey
  treasury: web3.PublicKey
}

export const vaultConfigDiscriminator = [99, 86, 43, 216, 184, 102, 119, 77]
/**
 * Holds the data for the {@link VaultConfig} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class VaultConfig implements VaultConfigArgs {
  private constructor(
    readonly bump: number,
    readonly creationFee: beet.bignum,
    readonly authority: web3.PublicKey,
    readonly treasury: web3.PublicKey
  ) {}

  /**
   * Creates a {@link VaultConfig} instance from the provided args.
   */
  static fromArgs(args: VaultConfigArgs) {
    return new VaultConfig(
      args.bump,
      args.creationFee,
      args.authority,
      args.treasury
    )
  }

  /**
   * Deserializes the {@link VaultConfig} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [VaultConfig, number] {
    return VaultConfig.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link VaultConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<VaultConfig> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find VaultConfig account at ${address}`)
    }
    return VaultConfig.fromAccountInfo(accountInfo, 0)[0]
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
    return beetSolana.GpaBuilder.fromStruct(programId, vaultConfigBeet)
  }

  /**
   * Deserializes the {@link VaultConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [VaultConfig, number] {
    return vaultConfigBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link VaultConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return vaultConfigBeet.serialize({
      accountDiscriminator: vaultConfigDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link VaultConfig}
   */
  static get byteSize() {
    return vaultConfigBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link VaultConfig} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      VaultConfig.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link VaultConfig} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === VaultConfig.byteSize
  }

  /**
   * Returns a readable version of {@link VaultConfig} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      creationFee: (() => {
        const x = <{ toNumber: () => number }>this.creationFee
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      authority: this.authority.toBase58(),
      treasury: this.treasury.toBase58(),
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const vaultConfigBeet = new beet.BeetStruct<
  VaultConfig,
  VaultConfigArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['bump', beet.u8],
    ['creationFee', beet.u64],
    ['authority', beetSolana.publicKey],
    ['treasury', beetSolana.publicKey],
  ],
  VaultConfig.fromArgs,
  'VaultConfig'
)
