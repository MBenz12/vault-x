/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category VaultConfigUpdateCreationFee
 * @category generated
 */
export type VaultConfigUpdateCreationFeeInstructionArgs = {
  newCreationFee: beet.bignum
}
/**
 * @category Instructions
 * @category VaultConfigUpdateCreationFee
 * @category generated
 */
export const vaultConfigUpdateCreationFeeStruct = new beet.BeetArgsStruct<
  VaultConfigUpdateCreationFeeInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['newCreationFee', beet.u64],
  ],
  'VaultConfigUpdateCreationFeeInstructionArgs'
)
/**
 * Accounts required by the _vaultConfigUpdateCreationFee_ instruction
 *
 * @property [_writable_] vaultConfig
 * @property [_writable_, **signer**] authority
 * @category Instructions
 * @category VaultConfigUpdateCreationFee
 * @category generated
 */
export type VaultConfigUpdateCreationFeeInstructionAccounts = {
  vaultConfig: web3.PublicKey
  authority: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const vaultConfigUpdateCreationFeeInstructionDiscriminator = [
  169, 29, 15, 104, 111, 119, 167, 139,
]

/**
 * Creates a _VaultConfigUpdateCreationFee_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category VaultConfigUpdateCreationFee
 * @category generated
 */
export function createVaultConfigUpdateCreationFeeInstruction(
  accounts: VaultConfigUpdateCreationFeeInstructionAccounts,
  args: VaultConfigUpdateCreationFeeInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = vaultConfigUpdateCreationFeeStruct.serialize({
    instructionDiscriminator:
      vaultConfigUpdateCreationFeeInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.vaultConfig,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
