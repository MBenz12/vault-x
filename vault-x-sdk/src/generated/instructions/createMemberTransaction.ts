/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  VaultMemberCreateTransactionArgs,
  vaultMemberCreateTransactionArgsBeet,
} from '../types/VaultMemberCreateTransactionArgs'

/**
 * @category Instructions
 * @category CreateMemberTransaction
 * @category generated
 */
export type CreateMemberTransactionInstructionArgs = {
  args: VaultMemberCreateTransactionArgs
}
/**
 * @category Instructions
 * @category CreateMemberTransaction
 * @category generated
 */
export const createMemberTransactionStruct = new beet.FixableBeetArgsStruct<
  CreateMemberTransactionInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', vaultMemberCreateTransactionArgsBeet],
  ],
  'CreateMemberTransactionInstructionArgs'
)
/**
 * Accounts required by the _createMemberTransaction_ instruction
 *
 * @property [_writable_] transaction
 * @property [_writable_] vault
 * @property [_writable_, **signer**] creator
 * @property [] merkleTree
 * @property [] accountCompressionProgram
 * @category Instructions
 * @category CreateMemberTransaction
 * @category generated
 */
export type CreateMemberTransactionInstructionAccounts = {
  transaction: web3.PublicKey
  vault: web3.PublicKey
  creator: web3.PublicKey
  merkleTree: web3.PublicKey
  accountCompressionProgram: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const createMemberTransactionInstructionDiscriminator = [
  185, 253, 215, 67, 41, 191, 135, 154,
]

/**
 * Creates a _CreateMemberTransaction_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateMemberTransaction
 * @category generated
 */
export function createCreateMemberTransactionInstruction(
  accounts: CreateMemberTransactionInstructionAccounts,
  args: CreateMemberTransactionInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = createMemberTransactionStruct.serialize({
    instructionDiscriminator: createMemberTransactionInstructionDiscriminator,
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
      pubkey: accounts.merkleTree,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.accountCompressionProgram,
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
