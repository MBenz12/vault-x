/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// NOTE: order is important here since must create config+vault before others
// TODO cleanup tests to not rely on these side effects
import './suites/vaultConfig';
import './suites/vault';
import './suites/founder';
import './suites/member';
import './suites/compression';
