/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
export type VaultRemoveFounderArgs = {
  founder: web3.PublicKey
  newFounderThreshold: beet.COption<number>
}

/**
 * @category userTypes
 * @category generated
 */
export const vaultRemoveFounderArgsBeet =
  new beet.FixableBeetArgsStruct<VaultRemoveFounderArgs>(
    [
      ['founder', beetSolana.publicKey],
      ['newFounderThreshold', beet.coption(beet.u16)],
    ],
    'VaultRemoveFounderArgs'
  )
