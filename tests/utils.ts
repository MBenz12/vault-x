/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionMessage,
  TransactionInstruction,
  VersionedTransaction,
  Signer,
  AccountMeta,
  ComputeBudgetProgram,
} from '@solana/web3.js';

import testProgramKeypair from '../test-keypairs/test-program-keypair.json';
import testVaultConfigInitializerKeypair from '../test-keypairs/test-vault-config-initializer-keypair.json';
import testVaultConfigAuthorityKeypair from '../test-keypairs/test-vault-config-authority-keypair.json';
import testProgramTreasuryKeypair from '../test-keypairs/test-program-treasury-keypair.json';
import {
  ConcurrentMerkleTreeAccount,
  MerkleTree,
  ValidDepthSizePair,
  createAllocTreeIx,
  createAppendIx,
  createInitEmptyMerkleTreeIx,
} from '@solana/spl-account-compression';
import { Vault } from '../vault-x-sdk/src/accounts';
import { toBigInt } from '../vault-x-sdk/src/utils';

export function createLocalhostConnection() {
  return new Connection('http://127.0.0.1:8899', 'confirmed');
}

export function getTestProgramId() {
  const programKeypair = Keypair.fromSecretKey(Buffer.from(testProgramKeypair));
  return programKeypair.publicKey;
}

export function getTestVaultConfigInitializer() {
  return Keypair.fromSecretKey(Buffer.from(testVaultConfigInitializerKeypair));
}

export async function getVaultTransactionIndex(
  connection: Connection,
  vaultPda: PublicKey
) {
  const vaultAccount = await Vault.fromAccountAddress(connection, vaultPda);
  const transactionIndex = toBigInt(vaultAccount.transactionIndex) + 1n;
  return transactionIndex;
}

export async function sendTransaction(
  connection: Connection,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  signers: Signer[],
  skipPreflight: boolean = false
) {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  const message = new TransactionMessage({
    instructions,
    payerKey: payer,
    recentBlockhash: blockhash,
  }).compileToV0Message();

  const tx = new VersionedTransaction(message);
  tx.sign(signers);
  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight,
  });
  await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature,
  });

  return signature;
}

export async function generateFundedKeypair(
  connection: Connection,
  solAmount?: number
) {
  const keypair = Keypair.generate();

  const tx = await connection.requestAirdrop(
    keypair.publicKey,
    (solAmount ?? 1) * LAMPORTS_PER_SOL
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature: tx,
  });

  return keypair;
}

export async function generateFundedKeypairs(
  connection: Connection,
  keypairsCount: number
) {
  const keypairs = Array.from({ length: keypairsCount }).map(
    () => new Keypair()
  );

  await Promise.all(
    keypairs.map(async k => {
      const tx = await connection.requestAirdrop(
        k.publicKey,
        100 * LAMPORTS_PER_SOL
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      return connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: tx,
      });
    })
  );

  return keypairs;
}

export function getTestVaultConfigAuthority() {
  return Keypair.fromSecretKey(Buffer.from(testVaultConfigAuthorityKeypair));
}

export function getTestProgramTreasury() {
  return Keypair.fromSecretKey(Buffer.from(testProgramTreasuryKeypair))
    .publicKey;
}

export function createComputeLimitAndFeeIx() {
  const modifyComputeUnitsIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_000_000,
  });

  const addPriorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  return [modifyComputeUnitsIx, addPriorityFeeIx];
}

export async function createAndAddLeavesToMerkleTreeIx(
  connection: Connection,
  merkleTreeCreator: PublicKey,
  merkleTreeEphemeralSigner: Keypair,
  addresses: PublicKey[]
) {
  const merkleTreeParams: ValidDepthSizePair = {
    maxDepth: 3,
    maxBufferSize: 8,
  };

  const ixs: TransactionInstruction[] = [];

  const canopyDepth = merkleTreeParams.maxDepth - 2;
  ixs.push(
    await createAllocTreeIx(
      connection,
      merkleTreeEphemeralSigner.publicKey,
      merkleTreeCreator,
      merkleTreeParams,
      canopyDepth
    )
  );

  // Create an SPL compression instruction to initialize
  // the newly created ConcurrentMerkleTree
  ixs.push(
    createInitEmptyMerkleTreeIx(
      merkleTreeEphemeralSigner.publicKey,
      merkleTreeCreator,
      merkleTreeParams
    )
  );

  for (const address of addresses) {
    const addressLeaf = address.toBuffer();
    const appendIx = createAppendIx(
      merkleTreeEphemeralSigner.publicKey,
      merkleTreeCreator,
      addressLeaf
    );

    ixs.push(appendIx);
  }

  return ixs;
}

export async function fetchProof(
  connection: Connection,
  merkleTree: PublicKey,
  offChainMerkleTree: MerkleTree,
  leafIndex: number
) {
  const merkleTreeData = await ConcurrentMerkleTreeAccount.fromAccountAddress(
    connection,
    merkleTree
  );

  const proof = offChainMerkleTree.getProof(leafIndex);

  const remainingAccountMetas: AccountMeta[] = proof.proof
    .map(p => ({
      isSigner: false,
      isWritable: false,
      pubkey: new PublicKey(p),
    }))
    .slice(0, proof.proof.length - merkleTreeData.getCanopyDepth());

  return {
    remainingAccounts: remainingAccountMetas,
    index: proof.leafIndex,
    leaf: Array.from(proof.leaf),
    root: Array.from(proof.root),
  };
}
