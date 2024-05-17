/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { CreateVaultArgs, createVaultArgsBeet } from '../types/CreateVaultArgs'

/**
 * @category Instructions
 * @category CreateVault
 * @category generated
 */
export type CreateVaultInstructionArgs = {
  args: CreateVaultArgs
}
/**
 * @category Instructions
 * @category CreateVault
 * @category generated
 */
export const createVaultStruct = new beet.FixableBeetArgsStruct<
  CreateVaultInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', createVaultArgsBeet],
  ],
  'CreateVaultInstructionArgs'
)
/**
 * Accounts required by the _createVault_ instruction
 *
 * @property [] vaultConfig
 * @property [_writable_] treasury
 * @property [] merkleTree
 * @property [_writable_] vault
 * @property [**signer**] createKey
 * @property [_writable_, **signer**] administrator
 * @category Instructions
 * @category CreateVault
 * @category generated
 */
export type CreateVaultInstructionAccounts = {
  vaultConfig: web3.PublicKey
  treasury: web3.PublicKey
  merkleTree: web3.PublicKey
  vault: web3.PublicKey
  createKey: web3.PublicKey
  administrator: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const createVaultInstructionDiscriminator = [
  29, 237, 247, 208, 193, 82, 54, 135,
]

/**
 * Creates a _CreateVault_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateVault
 * @category generated
 */
export function createCreateVaultInstruction(
  accounts: CreateVaultInstructionAccounts,
  args: CreateVaultInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = createVaultStruct.serialize({
    instructionDiscriminator: createVaultInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.vaultConfig,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.treasury,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.merkleTree,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.vault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.createKey,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.administrator,
      isWritable: true,
      isSigner: true,
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
