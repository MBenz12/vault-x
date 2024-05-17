/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'

/**
 * @category Instructions
 * @category VaultConfigUpdateTreasury
 * @category generated
 */
export type VaultConfigUpdateTreasuryInstructionArgs = {
  newTreasury: web3.PublicKey
}
/**
 * @category Instructions
 * @category VaultConfigUpdateTreasury
 * @category generated
 */
export const vaultConfigUpdateTreasuryStruct = new beet.BeetArgsStruct<
  VaultConfigUpdateTreasuryInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['newTreasury', beetSolana.publicKey],
  ],
  'VaultConfigUpdateTreasuryInstructionArgs'
)
/**
 * Accounts required by the _vaultConfigUpdateTreasury_ instruction
 *
 * @property [_writable_] vaultConfig
 * @property [_writable_, **signer**] authority
 * @category Instructions
 * @category VaultConfigUpdateTreasury
 * @category generated
 */
export type VaultConfigUpdateTreasuryInstructionAccounts = {
  vaultConfig: web3.PublicKey
  authority: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const vaultConfigUpdateTreasuryInstructionDiscriminator = [
  155, 146, 173, 130, 102, 51, 89, 117,
]

/**
 * Creates a _VaultConfigUpdateTreasury_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category VaultConfigUpdateTreasury
 * @category generated
 */
export function createVaultConfigUpdateTreasuryInstruction(
  accounts: VaultConfigUpdateTreasuryInstructionAccounts,
  args: VaultConfigUpdateTreasuryInstructionArgs,
  programId = new web3.PublicKey('GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A')
) {
  const [data] = vaultConfigUpdateTreasuryStruct.serialize({
    instructionDiscriminator: vaultConfigUpdateTreasuryInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.vaultConfig,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
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
