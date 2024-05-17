/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { u8, u64, bignum, u32 } from '@metaplex-foundation/beet';
import { AccountMeta, MessageV0, PublicKey } from '@solana/web3.js';
import {
  VaultTransactionMessage,
  vaultTransactionMessageBeet,
} from './generated';
import { getEphemeralSignerPda } from './pda';

export function toU8Bytes(num: number): Uint8Array {
  const bytes = Buffer.alloc(1);
  u8.write(bytes, 0, num);
  return bytes;
}

export function toBigInt(number: bignum): bigint {
  return BigInt(number.toString());
}

export function toU32Bytes(num: number): Uint8Array {
  const bytes = Buffer.alloc(4);
  u32.write(bytes, 0, num);
  return bytes;
}

export function toU64Bytes(num: bigint): Uint8Array {
  const bytes = Buffer.alloc(8);
  u64.write(bytes, 0, num);
  return bytes;
}

export function serializeVaultTransactionMessage(message: MessageV0) {
  const {
    header: {
      numRequiredSignatures,
      numReadonlySignedAccounts,
      numReadonlyUnsignedAccounts,
    },
    compiledInstructions,
  } = message;

  const staticAccountKeys = message.getAccountKeys().staticAccountKeys;

  const [transactionMessage] = vaultTransactionMessageBeet.serialize({
    numSigners: numRequiredSignatures,
    numWritableSigners: numRequiredSignatures - numReadonlySignedAccounts,
    accountKeys: staticAccountKeys,
    numWritableNonSigners:
      staticAccountKeys.length -
      numRequiredSignatures -
      numReadonlyUnsignedAccounts,
    instructions: compiledInstructions.map(
      ({ programIdIndex, data, accountKeyIndexes }) => {
        return {
          programIdIndex,
          accountIndexes: Uint8Array.from(accountKeyIndexes),
          data,
        };
      }
    ),
  });

  return transactionMessage;
}

export function populateVaultTransactionExecuteRemainingAccounts(
  message: VaultTransactionMessage,
  ephemeralSignerBumps: number[],
  fundPda: PublicKey,
  transactionPda: PublicKey
): AccountMeta[] {
  // 1. Getting the signer public keys
  const ephemeralSignerPdas = ephemeralSignerBumps.map(
    (_, ephemeralSignerIndex) =>
      getEphemeralSignerPda({
        transactionPda,
        ephemeralSignerIndex,
      })[0]
  );

  // 2. Generating the account keys required for the transaction that's executed in the smart contract
  return message.accountKeys.map((accountKey, accountKeyIndex) => {
    const isSignerIndex = accountKeyIndex < message.numSigners;
    const isAccountVault = accountKey.equals(fundPda);
    const isAccountEphemeralSigner = ephemeralSignerPdas.find(pda =>
      pda.equals(accountKey)
    );

    return {
      pubkey: accountKey,
      isSigner: isSignerIndex && !isAccountVault && !isAccountEphemeralSigner,
      isWritable: isWritableIndex(message, accountKeyIndex),
    };
  });
}

export function isWritableIndex(
  message: VaultTransactionMessage,
  index: number
) {
  const { numSigners, numWritableSigners, numWritableNonSigners } = message;

  if (index < numWritableSigners) {
    // `index` is within the range of writable signer keys.
    return true;
  }

  if (index >= numSigners) {
    // `index` is within the range of non-signer keys.
    const indexIntoNonSigners = index - numSigners;
    // Whether `index` is within the range of writable non-signer keys.
    return indexIntoNonSigners < numWritableNonSigners;
  }

  return false;
}
