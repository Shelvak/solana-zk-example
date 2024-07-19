use anchor_lang::prelude::*;
use instructions::*;

pub mod instructions;
pub mod verifying_key;

declare_id!("5nSooqgQdbS8Upvk8ojpSrYQgzNMQFKXno2ttWCtRCBa");

#[program]
pub mod verifier {
    use super::*;

    pub fn verify(ctx: Context<Verify>,
        proof_a: [u8; 64],
        proof_b: [u8; 128],
        proof_c: [u8; 64],
        // ====== Uncomment in case publicSignals are needed ======
        // public_inputs: [[u8; 32]; 1] // add public inputs
    ) -> Result<()> {
        verify::verify(ctx, proof_a, proof_b, proof_c) // , public_inputs)
    }
}
