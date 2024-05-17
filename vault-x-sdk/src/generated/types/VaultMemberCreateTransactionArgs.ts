/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
export type VaultMemberCreateTransactionArgs = {
  ephemeralSigners: number
  transactionMessage: Uint8Array
  allowListRoot: number[] /* size: 32 */
  allowListLeaf: number[] /* size: 32 */
  allowListLeafIndex: number
}

/**
 * @category userTypes
 * @category generated
 */
export const vaultMemberCreateTransactionArgsBeet =
  new beet.FixableBeetArgsStruct<VaultMemberCreateTransactionArgs>(
    [
      ['ephemeralSigners', beet.u8],
      ['transactionMessage', beet.bytes],
      ['allowListRoot', beet.uniformFixedSizeArray(beet.u8, 32)],
      ['allowListLeaf', beet.uniformFixedSizeArray(beet.u8, 32)],
      ['allowListLeafIndex', beet.u32],
    ],
    'VaultMemberCreateTransactionArgs'
  )
