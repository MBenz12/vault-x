use crate::constants::*;
use crate::id;

use anchor_lang::prelude::*;

pub fn fetch_ephemeral_keys(
    ephemeral_signer_bumps: &[u8],
    transction: &Pubkey,
) -> (Vec<Pubkey>, Vec<Vec<Vec<u8>>>) {
    ephemeral_signer_bumps
        .iter()
        // Adding enumerate to include index like JS map
        .enumerate()
        // Iterating all bumps
        .map(|(ephemeral_signer_index, ephemeral_signer_bump)| {
            let ephemeral_signer_seeds = vec![
                SEED_PREFIX.to_vec(),
                transction.to_bytes().to_vec(),
                SEED_EPHEMERAL_SIGNER.to_vec(),
                u8::try_from(ephemeral_signer_index)
                    .unwrap()
                    .to_le_bytes()
                    .to_vec(),
                vec![*ephemeral_signer_bump],
            ];

            let ephemeral_signer_key = Pubkey::create_program_address(
                ephemeral_signer_seeds
                    // Changing Vector to Iterator for iteration
                    .iter()
                    // Taking inner array and changing into a reference
                    .map(Vec::as_slice)
                    .collect::<Vec<&[u8]>>()
                    // Changing the outer array into a reference
                    .as_slice(),
                &id(),
            )
            .unwrap();

            (ephemeral_signer_key, ephemeral_signer_seeds)
        })
        // Unzip takes the 1st and 2nd element of a tuple and inserts into their own arrays when returned from a map function
        .unzip()
}
