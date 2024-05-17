/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID } from './generated';
import { toU32Bytes, toU8Bytes } from './utils';

const SEED_PREFIX = new TextEncoder().encode('vaultx');
const SEED_VAULT_CONFIG = new TextEncoder().encode('vault_config');
const SEED_VAULT = new TextEncoder().encode('vault');
const SEED_FOUNDER_TRANSACTION = new TextEncoder().encode(
  'founder_transaction'
);
const SEED_MEMBER_TRANSACTION = new TextEncoder().encode('member_transaction');
const SEED_FUND = new TextEncoder().encode('fund');
const SEED_EPHEMERAL_SIGNER = new TextEncoder().encode('ephemeral_signer');

export function getVaultConfigPda({
  programId = PROGRAM_ID,
}: {
  programId?: PublicKey;
}): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEED_PREFIX, SEED_VAULT_CONFIG],
    programId
  );
}

export function getVaultPda({
  createKey,
  programId = PROGRAM_ID,
}: {
  createKey: PublicKey;
  programId?: PublicKey;
}): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEED_PREFIX, SEED_VAULT, createKey.toBytes()],
    programId
  );
}

export function getFundPda({
  vaultPda,
  programId = PROGRAM_ID,
}: {
  vaultPda: PublicKey;
  programId?: PublicKey;
}): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEED_PREFIX, vaultPda.toBytes(), SEED_FUND],
    programId
  );
}

export function getEphemeralSignerPda({
  transactionPda,
  ephemeralSignerIndex,
  programId = PROGRAM_ID,
}: {
  transactionPda: PublicKey;
  ephemeralSignerIndex: number;
  programId?: PublicKey;
}): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      SEED_PREFIX,
      transactionPda.toBytes(),
      SEED_EPHEMERAL_SIGNER,
      toU8Bytes(ephemeralSignerIndex),
    ],
    programId
  );
}

export function getMemberTransactionPda({
  vaultPda,
  index,
  programId = PROGRAM_ID,
}: {
  vaultPda: PublicKey;
  /** Transaction index. */
  index: number;
  programId?: PublicKey;
}): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      SEED_PREFIX,
      vaultPda.toBytes(),
      SEED_MEMBER_TRANSACTION,
      toU32Bytes(index),
    ],
    programId
  );
}

export function getFounderTransactionPda({
  vaultPda,
  index,
  programId = PROGRAM_ID,
}: {
  vaultPda: PublicKey;
  /** Transaction index. */
  index: number;
  programId?: PublicKey;
}): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      SEED_PREFIX,
      vaultPda.toBytes(),
      SEED_FOUNDER_TRANSACTION,
      toU32Bytes(index),
    ],
    programId
  );
}
