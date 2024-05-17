/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  VaultUpdateFounderThresholdArgs,
  vaultUpdateFounderThresholdArgsBeet,
} from '../types/VaultUpdateFounderThresholdArgs'

/**
 * @category Instructions
 * @category UpdateFounderThreshold
 * @category generated
 */
export type UpdateFounderThresholdInstructionArgs = {
  args: VaultUpdateFounderThresholdArgs
}
/**
 * @category Instructions
 * @category UpdateFounderThreshold
 * @category generated
 */
export const updateFounderThresholdStruct = new beet.BeetArgsStruct<
  UpdateFounderThresholdInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', vaultUpdateFounderThresholdArgsBeet],
  ],
  'UpdateFounderThresholdInstructionArgs'
)
/**
 * Accounts required by the _updateFounderThreshold_ instruction
 *
 * @property [_writable_] vault
 * @property [_writable_, **signer**] administrator
 * @category Instructions
 * @category UpdateFounderThreshold
 * @category generated
 */
export type UpdateFounderThresholdInstructionAccounts = {
  vault: web3.PublicKey
  administrator: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const updateFounderThresholdInstructionDiscriminator = [
  22, 131, 127, 112, 31, 174, 248, 16,
]

/**
 * Creates a _UpdateFounderThreshold_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category UpdateFounderThreshold
 * @category generated
 */
export function createUpdateFounderThresholdInstruction(
  accounts: UpdateFounderThresholdInstructionAccounts,
  args: UpdateFounderThresholdInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = updateFounderThresholdStruct.serialize({
    instructionDiscriminator: updateFounderThresholdInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.vault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.administrator,
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
