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
 * @category RejectFounderTransaction
 * @category generated
 */
export const rejectFounderTransactionStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'RejectFounderTransactionInstructionArgs'
)
/**
 * Accounts required by the _rejectFounderTransaction_ instruction
 *
 * @property [_writable_] transaction
 * @property [] vault
 * @property [_writable_, **signer**] founder
 * @category Instructions
 * @category RejectFounderTransaction
 * @category generated
 */
export type RejectFounderTransactionInstructionAccounts = {
  transaction: web3.PublicKey
  vault: web3.PublicKey
  founder: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const rejectFounderTransactionInstructionDiscriminator = [
  60, 137, 136, 159, 241, 69, 14, 152,
]

/**
 * Creates a _RejectFounderTransaction_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category RejectFounderTransaction
 * @category generated
 */
export function createRejectFounderTransactionInstruction(
  accounts: RejectFounderTransactionInstructionAccounts,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = rejectFounderTransactionStruct.serialize({
    instructionDiscriminator: rejectFounderTransactionInstructionDiscriminator,
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
      pubkey: accounts.founder,
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
