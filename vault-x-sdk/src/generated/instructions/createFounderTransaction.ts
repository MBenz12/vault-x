/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  VaultFounderCreateTransactionArgs,
  vaultFounderCreateTransactionArgsBeet,
} from '../types/VaultFounderCreateTransactionArgs'

/**
 * @category Instructions
 * @category CreateFounderTransaction
 * @category generated
 */
export type CreateFounderTransactionInstructionArgs = {
  args: VaultFounderCreateTransactionArgs
}
/**
 * @category Instructions
 * @category CreateFounderTransaction
 * @category generated
 */
export const createFounderTransactionStruct = new beet.FixableBeetArgsStruct<
  CreateFounderTransactionInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', vaultFounderCreateTransactionArgsBeet],
  ],
  'CreateFounderTransactionInstructionArgs'
)
/**
 * Accounts required by the _createFounderTransaction_ instruction
 *
 * @property [_writable_] transaction
 * @property [_writable_] vault
 * @property [_writable_, **signer**] creator
 * @category Instructions
 * @category CreateFounderTransaction
 * @category generated
 */
export type CreateFounderTransactionInstructionAccounts = {
  transaction: web3.PublicKey
  vault: web3.PublicKey
  creator: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const createFounderTransactionInstructionDiscriminator = [
  228, 49, 156, 122, 164, 212, 83, 97,
]

/**
 * Creates a _CreateFounderTransaction_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateFounderTransaction
 * @category generated
 */
export function createCreateFounderTransactionInstruction(
  accounts: CreateFounderTransactionInstructionAccounts,
  args: CreateFounderTransactionInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = createFounderTransactionStruct.serialize({
    instructionDiscriminator: createFounderTransactionInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.transaction,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.vault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.creator,
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
