/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as beet from '@metaplex-foundation/beet'
/**
 * @category enums
 * @category generated
 */
export enum VaultTransactionStatus {
  Active,
  Executed,
  Rejected,
  Cancelled,
  Approved,
}

/**
 * @category userTypes
 * @category generated
 */
export const vaultTransactionStatusBeet = beet.fixedScalarEnum(
  VaultTransactionStatus
) as beet.FixedSizeBeet<VaultTransactionStatus, VaultTransactionStatus>
