/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import { VaultInstruction, vaultInstructionBeet } from './VaultInstruction'
export type VaultTransactionMessage = {
  numSigners: number
  numWritableSigners: number
  numWritableNonSigners: number
  accountKeys: web3.PublicKey[]
  instructions: VaultInstruction[]
}

/**
 * @category userTypes
 * @category generated
 */
export const vaultTransactionMessageBeet =
  new beet.FixableBeetArgsStruct<VaultTransactionMessage>(
    [
      ['numSigners', beet.u8],
      ['numWritableSigners', beet.u8],
      ['numWritableNonSigners', beet.u8],
      ['accountKeys', beet.array(beetSolana.publicKey)],
      ['instructions', beet.array(vaultInstructionBeet)],
    ],
    'VaultTransactionMessage'
  )
