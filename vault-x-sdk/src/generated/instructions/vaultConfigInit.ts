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
 * @category VaultConfigInit
 * @category generated
 */
export type VaultConfigInitInstructionArgs = {
  creationFee: beet.bignum
}
/**
 * @category Instructions
 * @category VaultConfigInit
 * @category generated
 */
export const vaultConfigInitStruct = new beet.BeetArgsStruct<
  VaultConfigInitInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['creationFee', beet.u64],
  ],
  'VaultConfigInitInstructionArgs'
)
/**
 * Accounts required by the _vaultConfigInit_ instruction
 *
 * @property [_writable_] vaultConfig
 * @property [_writable_, **signer**] initializer
 * @property [] authority
 * @property [] treasury
 * @category Instructions
 * @category VaultConfigInit
 * @category generated
 */
export type VaultConfigInitInstructionAccounts = {
  vaultConfig: web3.PublicKey
  initializer: web3.PublicKey
  authority: web3.PublicKey
  treasury: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const vaultConfigInitInstructionDiscriminator = [
  220, 222, 127, 46, 70, 236, 91, 216,
]

/**
 * Creates a _VaultConfigInit_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category VaultConfigInit
 * @category generated
 */
export function createVaultConfigInitInstruction(
  accounts: VaultConfigInitInstructionAccounts,
  args: VaultConfigInitInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = vaultConfigInitStruct.serialize({
    instructionDiscriminator: vaultConfigInitInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.vaultConfig,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.initializer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.treasury,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
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
