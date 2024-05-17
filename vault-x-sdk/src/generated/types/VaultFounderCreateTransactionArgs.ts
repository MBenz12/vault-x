/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
export type VaultFounderCreateTransactionArgs = {
  ephemeralSigners: number
  transactionMessage: Uint8Array
}

/**
 * @category userTypes
 * @category generated
 */
export const vaultFounderCreateTransactionArgsBeet =
  new beet.FixableBeetArgsStruct<VaultFounderCreateTransactionArgs>(
    [
      ['ephemeralSigners', beet.u8],
      ['transactionMessage', beet.bytes],
    ],
    'VaultFounderCreateTransactionArgs'
  )
