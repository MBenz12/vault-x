/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as sdk from '../../vault-x-sdk/lib';

import {
  createLocalhostConnection,
  generateFundedKeypairs,
  generateFundedKeypair,
  getTestProgramId,
  createComputeLimitAndFeeIx,
  createAndAddLeavesToMerkleTreeIx,
  sendTransaction,
} from '../utils';

import { Keypair, PublicKey } from '@solana/web3.js';

import assert from 'assert';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID } from '@solana/spl-account-compression';

const { Vault } = sdk.accounts;

const connection = createLocalhostConnection();

const programId = getTestProgramId();
const vaultConfigPda = sdk.getVaultConfigPda({ programId })[0];

describe('Instructions / Vault', () => {
  let founders: Keypair[] = [];
  let programTreasury: PublicKey;
  const allowList = [TOKEN_PROGRAM_ID, SPL_ACCOUNT_COMPRESSION_PROGRAM_ID];

  before(async () => {
    founders = await generateFundedKeypairs(connection, 4);
    const [vaultConfigPda] = sdk.getVaultConfigPda({ programId });
    const vaultConfig = await sdk.accounts.VaultConfig.fromAccountAddress(
      connection,
      vaultConfigPda
    );
    programTreasury = vaultConfig.treasury;
  });

  it('error: missing signature from `createKey`', async () => {
    const administrator = await generateFundedKeypair(connection);
    const createKey = Keypair.generate();
    const merkleTree = Keypair.generate();

    const [vaultPda] = sdk.getVaultPda({
      createKey: createKey.publicKey,
      programId,
    });

    const computeIxs = createComputeLimitAndFeeIx();
    const merkleTreeIxs = await createAndAddLeavesToMerkleTreeIx(
      connection,
      administrator.publicKey,
      merkleTree,
      allowList
    );

    const createVaultIx = sdk.generated.createCreateVaultInstruction(
      {
        administrator: administrator.publicKey,
        createKey: createKey.publicKey,
        vault: vaultPda,
        vaultConfig: vaultConfigPda,
        merkleTree: merkleTree.publicKey,
        treasury: programTreasury,
      },
      {
        args: {
          founderThreshold: 2,
          initialFounders: founders.map(f => f.publicKey),
        },
      }
    );

    const instructions = [...computeIxs, ...merkleTreeIxs, createVaultIx];
    await assert.rejects(
      () =>
        sendTransaction(connection, instructions, administrator.publicKey, [
          administrator,
          merkleTree,
        ]).catch(sdk.errors.translateAndThrowAnchorError),
      /Transaction signature verification failure/
    );
  });

  it('error: empty founders', async () => {
    const administrator = await generateFundedKeypair(connection);
    const createKey = Keypair.generate();
    const merkleTree = Keypair.generate();

    const [vaultPda] = sdk.getVaultPda({
      createKey: createKey.publicKey,
      programId,
    });

    const computeIxs = createComputeLimitAndFeeIx();
    const merkleTreeIxs = await createAndAddLeavesToMerkleTreeIx(
      connection,
      administrator.publicKey,
      merkleTree,
      allowList
    );

    const createVaultIx = sdk.generated.createCreateVaultInstruction(
      {
        administrator: administrator.publicKey,
        createKey: createKey.publicKey,
        vault: vaultPda,
        vaultConfig: vaultConfigPda,
        merkleTree: merkleTree.publicKey,
        treasury: programTreasury,
      },
      {
        args: {
          founderThreshold: 2,
          initialFounders: [],
        },
      }
    );

    const instructions = [...computeIxs, ...merkleTreeIxs, createVaultIx];

    await assert.rejects(
      () =>
        sendTransaction(connection, instructions, administrator.publicKey, [
          administrator,
          merkleTree,
          createKey,
        ]).catch(sdk.errors.translateAndThrowAnchorError),
      /Invalid role count/
    );
  });

  it('error: invalid threshold (< 1)', async () => {
    const administrator = await generateFundedKeypair(connection);
    const createKey = Keypair.generate();
    const merkleTree = Keypair.generate();

    const [vaultPda] = sdk.getVaultPda({
      createKey: createKey.publicKey,
      programId,
    });

    const computeIxs = createComputeLimitAndFeeIx();
    const merkleTreeIxs = await createAndAddLeavesToMerkleTreeIx(
      connection,
      administrator.publicKey,
      merkleTree,
      allowList
    );

    const createVaultIx = sdk.generated.createCreateVaultInstruction(
      {
        administrator: administrator.publicKey,
        createKey: createKey.publicKey,
        vault: vaultPda,
        vaultConfig: vaultConfigPda,
        merkleTree: merkleTree.publicKey,
        treasury: programTreasury,
      },
      {
        args: {
          founderThreshold: 0,
          initialFounders: founders.map(f => f.publicKey),
        },
      }
    );

    const instructions = [...computeIxs, ...merkleTreeIxs, createVaultIx];
    await assert.rejects(
      () =>
        sendTransaction(connection, instructions, administrator.publicKey, [
          administrator,
          merkleTree,
          createKey,
        ]).catch(sdk.errors.translateAndThrowAnchorError),
      /Invalid founder threshold/
    );
  });

  it('error: invalid threshold (> founders with permission to Vote)', async () => {
    const administrator = await generateFundedKeypair(connection);
    const createKey = Keypair.generate();
    const merkleTree = Keypair.generate();

    const [vaultPda] = sdk.getVaultPda({
      createKey: createKey.publicKey,
      programId,
    });

    const computeIxs = createComputeLimitAndFeeIx();
    const merkleTreeIxs = await createAndAddLeavesToMerkleTreeIx(
      connection,
      administrator.publicKey,
      merkleTree,
      allowList
    );

    const createVaultIx = sdk.generated.createCreateVaultInstruction(
      {
        administrator: administrator.publicKey,
        createKey: createKey.publicKey,
        vault: vaultPda,
        vaultConfig: vaultConfigPda,
        merkleTree: merkleTree.publicKey,
        treasury: programTreasury,
      },
      {
        args: {
          founderThreshold: 5,
          initialFounders: founders.map(f => f.publicKey),
        },
      }
    );

    const instructions = [...computeIxs, ...merkleTreeIxs, createVaultIx];
    await assert.rejects(
      () =>
        sendTransaction(connection, instructions, administrator.publicKey, [
          administrator,
          merkleTree,
          createKey,
        ]).catch(sdk.errors.translateAndThrowAnchorError),
      /Invalid founder threshold/
    );
  });

  it('create a new autonomous multisig', async () => {
    const administrator = await generateFundedKeypair(connection);
    const createKey = Keypair.generate();
    const merkleTree = Keypair.generate();

    const [vaultPda, vaultBump] = sdk.getVaultPda({
      createKey: createKey.publicKey,
      programId,
    });

    const computeIxs = createComputeLimitAndFeeIx();
    const merkleTreeIxs = await createAndAddLeavesToMerkleTreeIx(
      connection,
      administrator.publicKey,
      merkleTree,
      allowList
    );

    const createVaultIx = sdk.generated.createCreateVaultInstruction(
      {
        administrator: administrator.publicKey,
        createKey: createKey.publicKey,
        vault: vaultPda,
        vaultConfig: vaultConfigPda,
        merkleTree: merkleTree.publicKey,
        treasury: programTreasury,
      },
      {
        args: {
          founderThreshold: 2,
          initialFounders: founders.map(f => f.publicKey),
        },
      }
    );

    const instructions = [...computeIxs, ...merkleTreeIxs, createVaultIx];
    await sendTransaction(connection, instructions, administrator.publicKey, [
      administrator,
      merkleTree,
      createKey,
    ]);

    const vaultAccount = await Vault.fromAccountAddress(connection, vaultPda);

    assert.strictEqual(
      vaultAccount.administrator.toBase58(),
      administrator.publicKey.toBase58()
    );

    assert.strictEqual(vaultAccount.founderThreshold, 2);
    assert.deepEqual(
      vaultAccount.founders,
      founders
        .map(f => f.publicKey)
        .sort((a, b) => a.toBuffer().compare(b.toBuffer()))
    );
    assert.strictEqual(vaultAccount.transactionIndex.toString(), '0');
    assert.strictEqual(vaultAccount.staleTransactionIndex.toString(), '0');
    assert.strictEqual(
      vaultAccount.createKey.toBase58(),
      createKey.publicKey.toBase58()
    );
    assert.strictEqual(vaultAccount.bump, vaultBump);
  });
});
