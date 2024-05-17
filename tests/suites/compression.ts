/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createLocalhostConnection, sendTransaction } from '../utils';

import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
  AccountMeta,
} from '@solana/web3.js';

import {
  MerkleTree,
  ValidDepthSizePair,
  createAllocTreeIx,
  createAppendIx,
  createInitEmptyMerkleTreeIx,
  createVerifyLeafInstruction,
} from '@solana/spl-account-compression';

const connection = createLocalhostConnection();

describe('Account compression tests', () => {
  const creator = Keypair.generate();
  const merkleTreeParams: ValidDepthSizePair = {
    maxDepth: 3,
    maxBufferSize: 8,
  };
  const canopyDepth = merkleTreeParams.maxDepth - 2;

  const offChainMerkleTreeLeaves = Array(2 ** merkleTreeParams.maxDepth).fill(
    Buffer.alloc(32)
  );
  const offChainMerkleTree = new MerkleTree(offChainMerkleTreeLeaves);
  const merkleTreeEphemeralSigner = Keypair.generate();

  before(async () => {
    // Airdrop to the program config initializer
    const signature = await connection.requestAirdrop(
      creator.publicKey,
      10 * LAMPORTS_PER_SOL
    );
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
  });

  it('creates a merkle tree', async () => {
    // Create a system instruction to allocate enough
    // space for the tree
    const allocAccountIx = await createAllocTreeIx(
      connection,
      merkleTreeEphemeralSigner.publicKey,
      creator.publicKey,
      merkleTreeParams,
      canopyDepth
    );

    // Create an SPL compression instruction to initialize
    // the newly created ConcurrentMerkleTree
    const initTreeIx = createInitEmptyMerkleTreeIx(
      merkleTreeEphemeralSigner.publicKey,
      creator.publicKey,
      merkleTreeParams
    );

    const sig = await sendTransaction(
      connection,
      [allocAccountIx, initTreeIx],
      creator.publicKey,
      [creator, merkleTreeEphemeralSigner]
    );

    console.log(
      'Merkle tree account:',
      merkleTreeEphemeralSigner.publicKey.toString()
    );
    console.log('Create Merkle tree tx:', sig);
  });

  it('adds leaves to created merkle tree', async () => {
    const addressesToAddAsLeaves = Array(2 ** merkleTreeParams.maxDepth)
      .fill(PublicKey.default)
      .map(() => Keypair.generate().publicKey);

    let index = 0;
    for (const address of addressesToAddAsLeaves) {
      console.log('\nAdding address:', address.toString());
      const addressLeaf = address.toBuffer();
      const appendIx = createAppendIx(
        merkleTreeEphemeralSigner.publicKey,
        creator.publicKey,
        addressLeaf
      );

      const signature = await sendTransaction(
        connection,
        [appendIx],
        creator.publicKey,
        [creator]
      );

      console.log('Added leaf successfully. Tx:', signature);
      offChainMerkleTree.updateLeaf(index, addressLeaf);
      index += 1;
    }
  });

  it('Verifies a leaf', async () => {
    const proofIndex = 3;
    const proof = offChainMerkleTree.getProof(proofIndex);

    const remainingAccountMetas: AccountMeta[] = proof.proof
      .map(p => ({
        isSigner: false,
        isWritable: false,
        pubkey: new PublicKey(p),
      }))
      .slice(0, proof.proof.length - canopyDepth);

    const verifyIx = createVerifyLeafInstruction(
      {
        merkleTree: merkleTreeEphemeralSigner.publicKey,
        anchorRemainingAccounts: remainingAccountMetas,
      },
      {
        index: proof.leafIndex,
        leaf: Array.from(proof.leaf),
        root: Array.from(proof.root),
      }
    );

    await sendTransaction(
      connection,
      [verifyIx],
      creator.publicKey,
      [creator],
      true
    );
  });
});
