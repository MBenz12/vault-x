/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
export type VaultInstruction = {
  programIdIndex: number
  accountIndexes: Uint8Array
  data: Uint8Array
}

/**
 * @category userTypes
 * @category generated
 */
export const vaultInstructionBeet =
  new beet.FixableBeetArgsStruct<VaultInstruction>(
    [
      ['programIdIndex', beet.u8],
      ['accountIndexes', beet.bytes],
      ['data', beet.bytes],
    ],
    'VaultInstruction'
  )
