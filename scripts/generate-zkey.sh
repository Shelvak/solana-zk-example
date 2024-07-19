set -e

node vendor/snarkjs.cjs zkey new circuits/build/Multiplier.r1cs proofs/pot12_final.ptau circuits/build/Multiplier_0000.zkey

echo "some random text" | node vendor/snarkjs.cjs zkey contribute circuits/build/Multiplier_0000.zkey circuits/build/Multiplier_final.zkey --name="1st Contributor" -v -e="more random text"

node vendor/snarkjs.cjs zkey export verificationkey circuits/build/Multiplier_final.zkey circuits/build/verification_key.json

node vendor/groth16-solana-parse_vk_to_rust.js circuits/build/verification_key.json programs/verifier/src/
