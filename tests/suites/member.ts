/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as sdk from '../../vault-x-sdk';
import assert from 'assert';

import {
  createLocalhostConnection,
  generateFundedKeypair,
  getTestProgramId,
  sendTransaction,
  generateFundedKeypairs,
  createAndAddLeavesToMerkleTreeIx,
  getVaultTransactionIndex,
  fetchProof,
} from '../utils';

import {
  Keypair,
  PublicKey,
  TransactionMessage,
  SystemProgram,
} from '@solana/web3.js';

import {
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  getMint,
} from '@solana/spl-token';
import {
  MerkleTree,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
} from '@solana/spl-account-compression';
import {
  createAddMemberInstruction,
  createCreateMemberTransactionInstruction,
  createExecuteMemberTransactionInstruction,
  vaultTransactionMessageBeet,
} from '../../vault-x-sdk/src/generated';
import { populateVaultTransactionExecuteRemainingAccounts } from '../../vault-x-sdk/src/utils';

const connection = createLocalhostConnection();
const programId = getTestProgramId();

describe('Instructions / Member', () => {
  let administrator: Keypair;
  let merkleTree: Keypair;
  let founders: Keypair[];
  let members: Keypair[];
  let offChainTree: MerkleTree;

  let programTreasury: PublicKey;
  const allowList = [TOKEN_PROGRAM_ID, SPL_ACCOUNT_COMPRESSION_PROGRAM_ID];

  let vaultPda: PublicKey;

  before(async () => {
    offChainTree = new MerkleTree(allowList.map(a => a.toBuffer()));
    administrator = await generateFundedKeypair(connection);
    founders = await generateFundedKeypairs(connection, 1);
    members = await generateFundedKeypairs(connection, 4);

    const [vaultConfigPda] = sdk.getVaultConfigPda({ programId });
    const vaultConfig = await sdk.accounts.VaultConfig.fromAccountAddress(
      connection,
      vaultConfigPda
    );
    programTreasury = vaultConfig.treasury;

    const createKey = Keypair.generate();
    merkleTree = Keypair.generate();

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
          founderThreshold: 1,
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

  it('create all 4 members via 1 founder', async () => {
    const founder = founders[0];
    const addMemberIxs = members.map(m => {
      return createAddMemberInstruction(
        {
          founder: founder.publicKey,
          vault: vaultPda,
          rentPayer: founder.publicKey,
          systemProgram: SystemProgram.programId,
        },
        {
          args: {
            newMember: m.publicKey,
          },
        }
      );
    });

    await sendTransaction(connection, addMemberIxs, founder.publicKey, [
      founder,
    ]);
  });

  it('creates a mint account through the vault as a member', async () => {
    /** REGION CREATE/EXECUTE MEMBER TRANSACTION */
    const transactionIndex = await getVaultTransactionIndex(
      connection,
      vaultPda
    );

    const [memberTransactionPda] = sdk.getMemberTransactionPda({
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
    const [mintPda, mintBump] = sdk.getEphemeralSignerPda({
      transactionPda: memberTransactionPda,
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

    const leafIndex = allowList.findIndex(a => a.equals(TOKEN_PROGRAM_ID));
    const {
      leaf: allowListLeaf,
      index: allowListLeafIndex,
      root: allowListRoot,
      remainingAccounts,
    } = await fetchProof(
      connection,
      merkleTree.publicKey,
      offChainTree,
      leafIndex
    );

    const member = members[0];
    const createMemberTransactionIx = createCreateMemberTransactionInstruction(
      {
        accountCompressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        creator: member.publicKey,
        vault: vaultPda,
        merkleTree: merkleTree.publicKey,
        transaction: memberTransactionPda,
        anchorRemainingAccounts: remainingAccounts,
      },
      {
        args: {
          allowListLeaf,
          allowListLeafIndex,
          allowListRoot,
          ephemeralSigners: 1,
          transactionMessage,
        },
      }
    );

    const [txMessage] =
      vaultTransactionMessageBeet.deserialize(transactionMessage);

    const executeVaultTransactionIx = createExecuteMemberTransactionInstruction(
      {
        member: member.publicKey,
        vault: vaultPda,
        transaction: memberTransactionPda,
        anchorRemainingAccounts:
          populateVaultTransactionExecuteRemainingAccounts(
            txMessage,
            [mintBump],
            fundPda,
            memberTransactionPda
          ),
      }
    );

    await sendTransaction(
      connection,
      [createMemberTransactionIx, executeVaultTransactionIx],
      member.publicKey,
      [member],
      true
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

  it('fails to create a mint account through the vault as a member via non allowed address', async () => {
    /** REGION CREATE/EXECUTE MEMBER TRANSACTION */
    const transactionIndex = await getVaultTransactionIndex(
      connection,
      vaultPda
    );

    const [memberTransactionPda] = sdk.getMemberTransactionPda({
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
    const [mintPda, mintBump] = sdk.getEphemeralSignerPda({
      transactionPda: memberTransactionPda,
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

    /** REGION FAKE OFF CHAIN TREE */
    const fakeAllowList = [
      TOKEN_2022_PROGRAM_ID,
      SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    ];
    const leafIndex = fakeAllowList.findIndex(a =>
      a.equals(TOKEN_2022_PROGRAM_ID)
    );
    const fakeOffChainTree = new MerkleTree(
      fakeAllowList.map(fA => fA.toBuffer())
    );

    const {
      leaf: allowListLeaf,
      index: allowListLeafIndex,
      root: allowListRoot,
      remainingAccounts,
    } = await fetchProof(
      connection,
      merkleTree.publicKey,
      fakeOffChainTree,
      leafIndex
    );
    /** ENDREGION */

    const member = members[0];
    const createMemberTransactionIx = createCreateMemberTransactionInstruction(
      {
        accountCompressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        creator: member.publicKey,
        vault: vaultPda,
        merkleTree: merkleTree.publicKey,
        transaction: memberTransactionPda,
        anchorRemainingAccounts: remainingAccounts,
      },
      {
        args: {
          allowListLeaf,
          allowListLeafIndex,
          allowListRoot,
          ephemeralSigners: 1,
          transactionMessage,
        },
      }
    );

    const [txMessage] =
      vaultTransactionMessageBeet.deserialize(transactionMessage);

    const executeMemberTransactionIx =
      createExecuteMemberTransactionInstruction({
        member: member.publicKey,
        vault: vaultPda,
        transaction: memberTransactionPda,
        anchorRemainingAccounts:
          populateVaultTransactionExecuteRemainingAccounts(
            txMessage,
            [mintBump],
            fundPda,
            memberTransactionPda
          ),
      });

    await assert.rejects(() =>
      sendTransaction(
        connection,
        [createMemberTransactionIx, executeMemberTransactionIx],
        member.publicKey,
        [member]
      )
    );
    /** ENDREGION */
  });
});
