/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export * from './Vault'
export * from './VaultConfig'
export * from './VaultFounderTransaction'
export * from './VaultMemberTransaction'

import { VaultFounderTransaction } from './VaultFounderTransaction'
import { VaultMemberTransaction } from './VaultMemberTransaction'
import { VaultConfig } from './VaultConfig'
import { Vault } from './Vault'

export const accountProviders = {
  VaultFounderTransaction,
  VaultMemberTransaction,
  VaultConfig,
  Vault,
}
