/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as sdk from '../../vault-x-sdk/src';
import assert from 'assert';

import {
  createLocalhostConnection,
  generateFundedKeypair,
  getTestProgramId,
  sendTransaction,
  generateFundedKeypairs,
  createAndAddLeavesToMerkleTreeIx,
  getVaultTransactionIndex,
} from '../utils';

import {
  Keypair,
  PublicKey,
  TransactionMessage,
  SystemProgram,
} from '@solana/web3.js';

import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  getMint,
} from '@solana/spl-token';
import { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID } from '@solana/spl-account-compression';
import {
  VaultFounderTransaction,
  createApproveFounderTransactionInstruction,
  createCreateFounderTransactionInstruction,
  createExecuteFounderTransactionInstruction,
} from '../../vault-x-sdk/src/generated';
import { populateVaultTransactionExecuteRemainingAccounts } from '../../vault-x-sdk/src/utils';

const connection = createLocalhostConnection();
const programId = getTestProgramId();

describe('Instructions / Founder', () => {
  let administrator: Keypair;
  let founders: Keypair[];

  let programTreasury: PublicKey;
  const allowList = [TOKEN_PROGRAM_ID, SPL_ACCOUNT_COMPRESSION_PROGRAM_ID];

  let vaultPda: PublicKey;

  before(async () => {
    administrator = await generateFundedKeypair(connection);
    founders = await generateFundedKeypairs(connection, 4);
    const [vaultConfigPda] = sdk.getVaultConfigPda({ programId });
    const vaultConfig = await sdk.accounts.VaultConfig.fromAccountAddress(
      connection,
      vaultConfigPda
    );
    programTreasury = vaultConfig.treasury;

    const createKey = Keypair.generate();
    const merkleTree = Keypair.generate();

    [vaultPda] = sdk.getVaultPda({
      createKey: createKey.publicKey,
      programId,
    });

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

    const instructions = [...merkleTreeIxs, createVaultIx];
    await sendTransaction(connection, instructions, administrator.publicKey, [
      administrator,
      merkleTree,
      createKey,
    ]);
  });

  it('creates a mint account through the vault as a founder', async () => {
    /** REGION CREATE FOUNDER TRANSACTION */
    const transactionIndex = await getVaultTransactionIndex(
      connection,
      vaultPda
    );

    const [founderTransactionPda] = sdk.getFounderTransactionPda({
      vaultPda,
      index: Number(transactionIndex),
    });

    const [fundPda] = sdk.getFundPda({
      vaultPda,
      programId,
    });

    const lamportsForMintRent = await getMinimumBalanceForRentExemptMint(
      connection
    );

    // fund will pay for the Mint account rent, airdrop this amount.
    const airdropSig = await connection.requestAirdrop(
      fundPda,
      lamportsForMintRent
    );

    await connection.confirmTransaction({
      ...(await connection.getLatestBlockhash()),
      signature: airdropSig,
    });

    // Mint account is a signer in the SystemProgram.createAccount ix,
    // so we use an Ephemeral Signer provided by the Vault program as the Mint account.
    const [mintPda] = sdk.getEphemeralSignerPda({
      transactionPda: founderTransactionPda,
      ephemeralSignerIndex: 0,
      programId,
    });

    console.log('\nMint PDA:', mintPda.toString());

    // Usually this would be sent to blockchain, but this is what we would execute through the vault's fund. The fund is now the authority of this mint after execution
    const message = new TransactionMessage({
      payerKey: fundPda,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
      instructions: [
        SystemProgram.createAccount({
          fromPubkey: fundPda,
          newAccountPubkey: mintPda,
          space: MINT_SIZE,
          lamports: lamportsForMintRent,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMint2Instruction(
          mintPda,
          9,
          fundPda,
          null,
          TOKEN_PROGRAM_ID
        ),
      ],
    }).compileToV0Message();

    const transactionMessage =
      sdk.utils.serializeVaultTransactionMessage(message);

    const initiator = founders[0];

    const createFounderTransactionIx =
      createCreateFounderTransactionInstruction(
        {
          creator: initiator.publicKey,
          vault: vaultPda,
          transaction: founderTransactionPda,
        },
        {
          args: {
            ephemeralSigners: 1,
            transactionMessage,
          },
        }
      );

    await sendTransaction(
      connection,
      [createFounderTransactionIx],
      initiator.publicKey,
      [initiator],
      true
    );
    /** ENDREGION */

    /** REGION APPROVE FOUNDER TRANSACTION */
    const firstVoter = founders[1];
    const approve1Ix = createApproveFounderTransactionInstruction({
      founder: firstVoter.publicKey,
      vault: vaultPda,
      transaction: founderTransactionPda,
    });

    await sendTransaction(connection, [approve1Ix], firstVoter.publicKey, [
      firstVoter,
    ]);
    /** ENDREGION */

    /** REGION APPROVE FOUNDER TRANSACTION */
    const secondVoter = founders[2];
    const approve2Ix = createApproveFounderTransactionInstruction({
      founder: secondVoter.publicKey,
      vault: vaultPda,
      transaction: founderTransactionPda,
    });

    await sendTransaction(connection, [approve2Ix], secondVoter.publicKey, [
      secondVoter,
    ]);
    /** ENDREGION */

    /** REGION EXECUTE FOUNDER TRANSACTION */
    const executor = founders[3];

    const { message: txMessage, ephemeralSignerBumps } =
      await VaultFounderTransaction.fromAccountAddress(
        connection,
        founderTransactionPda
      );

    const executeFounderTransactionIx =
      createExecuteFounderTransactionInstruction({
        founder: executor.publicKey,
        vault: vaultPda,
        transaction: founderTransactionPda,
        anchorRemainingAccounts:
          populateVaultTransactionExecuteRemainingAccounts(
            txMessage,
            [...ephemeralSignerBumps],
            fundPda,
            founderTransactionPda
          ),
      });

    await sendTransaction(
      connection,
      [executeFounderTransactionIx],
      executor.publicKey,
      [executor]
    );
    /** ENDREGION */

    const { isInitialized, mintAuthority, decimals, supply } = await getMint(
      connection,
      mintPda
    );
    assert.ok(isInitialized);
    assert.strictEqual(mintAuthority?.toString(), fundPda.toBase58());
    assert.strictEqual(decimals, 9);
    assert.strictEqual(supply, 0n);
  });
});
