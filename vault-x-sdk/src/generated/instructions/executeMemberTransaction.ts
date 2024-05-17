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
 * @category ExecuteMemberTransaction
 * @category generated
 */
export const executeMemberTransactionStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'ExecuteMemberTransactionInstructionArgs'
)
/**
 * Accounts required by the _executeMemberTransaction_ instruction
 *
 * @property [_writable_] transaction
 * @property [] vault
 * @property [_writable_, **signer**] member
 * @category Instructions
 * @category ExecuteMemberTransaction
 * @category generated
 */
export type ExecuteMemberTransactionInstructionAccounts = {
  transaction: web3.PublicKey
  vault: web3.PublicKey
  member: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const executeMemberTransactionInstructionDiscriminator = [
  81, 216, 229, 225, 29, 32, 183, 91,
]

/**
 * Creates a _ExecuteMemberTransaction_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ExecuteMemberTransaction
 * @category generated
 */
export function createExecuteMemberTransactionInstruction(
  accounts: ExecuteMemberTransactionInstructionAccounts,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = executeMemberTransactionStruct.serialize({
    instructionDiscriminator: executeMemberTransactionInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.transaction,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.vault,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.member,
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
