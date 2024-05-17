/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  VaultRemoveMemberArgs,
  vaultRemoveMemberArgsBeet,
} from '../types/VaultRemoveMemberArgs'

/**
 * @category Instructions
 * @category RemoveMember
 * @category generated
 */
export type RemoveMemberInstructionArgs = {
  args: VaultRemoveMemberArgs
}
/**
 * @category Instructions
 * @category RemoveMember
 * @category generated
 */
export const removeMemberStruct = new beet.BeetArgsStruct<
  RemoveMemberInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', vaultRemoveMemberArgsBeet],
  ],
  'RemoveMemberInstructionArgs'
)
/**
 * Accounts required by the _removeMember_ instruction
 *
 * @property [_writable_] vault
 * @property [_writable_, **signer**] founder
 * @category Instructions
 * @category RemoveMember
 * @category generated
 */
export type RemoveMemberInstructionAccounts = {
  vault: web3.PublicKey
  founder: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const removeMemberInstructionDiscriminator = [
  171, 57, 231, 150, 167, 128, 18, 55,
]

/**
 * Creates a _RemoveMember_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category RemoveMember
 * @category generated
 */
export function createRemoveMemberInstruction(
  accounts: RemoveMemberInstructionAccounts,
  args: RemoveMemberInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = removeMemberStruct.serialize({
    instructionDiscriminator: removeMemberInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.vault,
      isWritable: true,
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
