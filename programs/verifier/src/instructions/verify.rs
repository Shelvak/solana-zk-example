use anchor_lang::prelude::*;

use groth16_solana::groth16::Groth16Verifier;

use crate::verifying_key::VERIFYINGKEY;

#[derive(Accounts)]
pub struct Verify {}

pub fn verify(_: Context<Verify>,
    proof_a: [u8; 64],
    proof_b: [u8; 128],
    proof_c: [u8; 64],
    // ====== Uncomment in case publicSignals are needed ======
    // public_inputs: [[u8; 32]; 1] // <= to add public inputs
) -> Result<()> {
    // msg!("verify.rs:18 {:?}", proof_a);
    // msg!("verify.rs:19 {:?}", proof_b);
    // msg!("verify.rs:20 {:?}", proof_c);

    // Initialize the verifier
    let mut verifier =
        Groth16Verifier::new(&proof_a, &proof_b, &proof_c, &[], &VERIFYINGKEY) // change empty array with public_inputs
            .map_err(|_| ProgramError::Custom(123))?; // Use a custom error code

    // Perform the verification
    let result = verifier.verify();
    match result {
        Ok(true) => msg!("Verification succeeded"),
        Ok(false) => msg!("Verification failed"),
        Err(e) => msg!("Verification error: {:?}", e),
    }

    Ok(())
}
