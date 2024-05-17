/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  VaultAddMemberArgs,
  vaultAddMemberArgsBeet,
} from '../types/VaultAddMemberArgs'

/**
 * @category Instructions
 * @category AddMember
 * @category generated
 */
export type AddMemberInstructionArgs = {
  args: VaultAddMemberArgs
}
/**
 * @category Instructions
 * @category AddMember
 * @category generated
 */
export const addMemberStruct = new beet.BeetArgsStruct<
  AddMemberInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', vaultAddMemberArgsBeet],
  ],
  'AddMemberInstructionArgs'
)
/**
 * Accounts required by the _addMember_ instruction
 *
 * @property [_writable_] vault
 * @property [**signer**] founder
 * @property [_writable_, **signer**] rentPayer (optional)
 * @category Instructions
 * @category AddMember
 * @category generated
 */
export type AddMemberInstructionAccounts = {
  vault: web3.PublicKey
  founder: web3.PublicKey
  rentPayer?: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const addMemberInstructionDiscriminator = [
  13, 116, 123, 130, 126, 198, 57, 34,
]

/**
 * Creates a _AddMember_ instruction.
 *
 * Optional accounts that are not provided default to the program ID since
 * this was indicated in the IDL from which this instruction was generated.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category AddMember
 * @category generated
 */
export function createAddMemberInstruction(
  accounts: AddMemberInstructionAccounts,
  args: AddMemberInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = addMemberStruct.serialize({
    instructionDiscriminator: addMemberInstructionDiscriminator,
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
