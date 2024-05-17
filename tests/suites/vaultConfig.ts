/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as sdk from '../../vault-x-sdk/lib';
import {
  createLocalhostConnection,
  generateFundedKeypair,
  getTestVaultConfigAuthority,
  getTestVaultConfigInitializer,
  getTestProgramId,
  getTestProgramTreasury,
} from '../utils';

import {
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import assert from 'assert';

const programId = getTestProgramId();
const vaultConfigInitializer = getTestVaultConfigInitializer();
const vaultConfigAuthority = getTestVaultConfigAuthority();
const programTreasury = getTestProgramTreasury();
const vaultConfigPda = sdk.getVaultConfigPda({ programId })[0];

const connection = createLocalhostConnection();

describe('Instructions / VaultConfig', () => {
  before(async () => {
    console.log('Program id:', programId.toString());
    // Airdrop to the program config initializer
    const signature = await connection.requestAirdrop(
      vaultConfigInitializer.publicKey,
      LAMPORTS_PER_SOL
    );
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
  });

  it('error: invalid initializer', async () => {
    const fakeInitializer = await generateFundedKeypair(connection);

    const initIx = sdk.generated.createVaultConfigInitInstruction(
      {
        vaultConfig: vaultConfigPda,
        initializer: fakeInitializer.publicKey,
        authority: vaultConfigAuthority.publicKey,
        treasury: programTreasury,
      },
      {
        creationFee: 0,
      },
      programId
    );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    const message = new TransactionMessage({
      recentBlockhash: blockhash,
      payerKey: fakeInitializer.publicKey,
      instructions: [initIx],
    }).compileToV0Message();
    const tx = new VersionedTransaction(message);
    tx.sign([fakeInitializer]);

    await assert.rejects(
      () =>
        connection
          .sendRawTransaction(tx.serialize())
          .catch(sdk.errors.translateAndThrowAnchorError),
      /Unauthorized: Unauthorized action attempted/
    );
  });

  it('error: `authority` is PublicKey.default', async () => {
    const initIx = sdk.generated.createVaultConfigInitInstruction(
      {
        vaultConfig: vaultConfigPda,
        initializer: vaultConfigInitializer.publicKey,
        authority: PublicKey.default,
        treasury: programTreasury,
      },
      {
        creationFee: 0,
      },
      programId
    );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    const message = new TransactionMessage({
      recentBlockhash: blockhash,
      payerKey: vaultConfigInitializer.publicKey,
      instructions: [initIx],
    }).compileToV0Message();
    const tx = new VersionedTransaction(message);
    tx.sign([vaultConfigInitializer]);

    await assert.rejects(
      () =>
        connection
          .sendRawTransaction(tx.serialize())
          .catch(sdk.errors.translateAndThrowAnchorError),
      /AccountNotSystemOwned: The given account is not owned by the system program/
    );
  });

  it('error: `treasury` is PublicKey.default', async () => {
    const initIx = sdk.generated.createVaultConfigInitInstruction(
      {
        vaultConfig: vaultConfigPda,
        initializer: vaultConfigInitializer.publicKey,
        authority: vaultConfigAuthority.publicKey,
        treasury: PublicKey.default,
      },
      {
        creationFee: 0,
      },
      programId
    );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    const message = new TransactionMessage({
      recentBlockhash: blockhash,
      payerKey: vaultConfigInitializer.publicKey,
      instructions: [initIx],
    }).compileToV0Message();
    const tx = new VersionedTransaction(message);
    tx.sign([vaultConfigInitializer]);

    await assert.rejects(
      () =>
        connection
          .sendRawTransaction(tx.serialize())
          .catch(sdk.errors.translateAndThrowAnchorError),
      /AccountNotSystemOwned: The given account is not owned by the system program/
    );
  });

  it('initialize program config', async () => {
    const initIx = sdk.generated.createVaultConfigInitInstruction(
      {
        vaultConfig: vaultConfigPda,
        initializer: vaultConfigInitializer.publicKey,
        authority: vaultConfigAuthority.publicKey,
        treasury: programTreasury,
      },
      {
        creationFee: 0.1 * LAMPORTS_PER_SOL,
      },
      programId
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    const message = new TransactionMessage({
      recentBlockhash: blockhash,
      payerKey: vaultConfigInitializer.publicKey,
      instructions: [initIx],
    }).compileToV0Message();
    const tx = new VersionedTransaction(message);
    tx.sign([vaultConfigInitializer]);

    const signature = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });

    const vaultConfigData = await sdk.accounts.VaultConfig.fromAccountAddress(
      connection,
      vaultConfigPda
    );

    assert.strictEqual(
      vaultConfigData.authority.toBase58(),
      vaultConfigAuthority.publicKey.toBase58()
    );
    assert.strictEqual(
      vaultConfigData.creationFee.toString(),
      (0.1 * LAMPORTS_PER_SOL).toString()
    );
    assert.strictEqual(
      vaultConfigData.treasury.toBase58(),
      programTreasury.toBase58()
    );
  });

  it('error: initialize program config twice', async () => {
    const initIx = sdk.generated.createVaultConfigInitInstruction(
      {
        vaultConfig: vaultConfigPda,
        initializer: vaultConfigInitializer.publicKey,
        authority: vaultConfigAuthority.publicKey,
        treasury: programTreasury,
      },
      {
        creationFee: 0,
      },
      programId
    );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    const message = new TransactionMessage({
      recentBlockhash: blockhash,
      payerKey: vaultConfigInitializer.publicKey,
      instructions: [initIx],
    }).compileToV0Message();
    const tx = new VersionedTransaction(message);
    tx.sign([vaultConfigInitializer]);

    const err = await connection
      .sendRawTransaction(tx.serialize())
      .catch(err => {
        return err;
      });

    assert.ok(sdk.errors.isErrorWithLogs(err));
    assert.ok(
      err.logs.find(line => {
        return line.includes('already in use');
      })
    );
  });
});
