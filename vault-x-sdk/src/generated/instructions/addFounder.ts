/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  VaultAddFounderArgs,
  vaultAddFounderArgsBeet,
} from '../types/VaultAddFounderArgs'

/**
 * @category Instructions
 * @category AddFounder
 * @category generated
 */
export type AddFounderInstructionArgs = {
  args: VaultAddFounderArgs
}
/**
 * @category Instructions
 * @category AddFounder
 * @category generated
 */
export const addFounderStruct = new beet.BeetArgsStruct<
  AddFounderInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', vaultAddFounderArgsBeet],
  ],
  'AddFounderInstructionArgs'
)
/**
 * Accounts required by the _addFounder_ instruction
 *
 * @property [_writable_] vault
 * @property [**signer**] administrator
 * @property [_writable_, **signer**] rentPayer (optional)
 * @category Instructions
 * @category AddFounder
 * @category generated
 */
export type AddFounderInstructionAccounts = {
  vault: web3.PublicKey
  administrator: web3.PublicKey
  rentPayer?: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const addFounderInstructionDiscriminator = [
  10, 186, 170, 74, 201, 225, 6, 91,
]

/**
 * Creates a _AddFounder_ instruction.
 *
 * Optional accounts that are not provided default to the program ID since
 * this was indicated in the IDL from which this instruction was generated.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category AddFounder
 * @category generated
 */
export function createAddFounderInstruction(
  accounts: AddFounderInstructionAccounts,
  args: AddFounderInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = addFounderStruct.serialize({
    instructionDiscriminator: addFounderInstructionDiscriminator,
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
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.rentPayer ?? programId,
      isWritable: accounts.rentPayer != null,
      isSigner: accounts.rentPayer != null,
    },
    {
      pubkey: accounts.systemProgram ?? programId,
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
