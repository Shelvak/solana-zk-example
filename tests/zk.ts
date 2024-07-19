import * as anchor from "@coral-xyz/anchor";
import { groth16 } from "snarkjs";
import path from "path";
import { assert } from "chai";
import { buildBn128, utils } from "ffjavascript";
const { unstringifyBigInts } = utils;

// Local libs
import { Verifier } from "../target/types/verifier";
import { convert_proof } from "wasm_utils"; // vendor/wasm_utils

const wasmPath = path.join(__dirname, "../circuits/build/Multiplier_js", "Multiplier.wasm");
const zkeyPath = path.join(__dirname, "../circuits/build", "Multiplier_final.zkey");

// ====== Uncomment in case verifier are needed ======
// import * as fs from "fs"
// const verifier = JSON.parse(
//   fs.readFileSync(
//     path.join(__dirname, "../circuits/build", "verification_key.json")
//   ).toString()
// )

describe('Groth16 Verifier', () => {
  it.only('should verify a valid proof', async () => {
    // Generate proof using snarkjs
    let input = { "a": 3, "b": 4, "c": 12 }; //  a * b === c
    let { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);

    let curve = await buildBn128();
    let proofProc = unstringifyBigInts(proof);

    let pi_a = g1Uncompressed(curve, proofProc.pi_a);
    let pi_a_0_u8_array = Array.from(convert_proof(pi_a));
    // console.log("proof a: ", pi_a_0_u8_array);

    const pi_b = g2Uncompressed(curve, proofProc.pi_b);
    let pi_b_0_u8_array = Array.from(pi_b);
    // console.log("proof b", pi_b_0_u8_array.slice(0, 64));
    // console.log("proof b", pi_b_0_u8_array.slice(64, 128));

    const pi_c = g1Uncompressed(curve, proofProc.pi_c);
    let pi_c_0_u8_array = Array.from(pi_c);
    // console.log("proof c", pi_c_0_u8_array);

    // ====== Uncomment in case publicSignals are needed ======
    // publicSignals = unstringifyBigInts(publicSignals);
    // Assuming publicSignals has only one element
    // const publicSignalsBuffer = to32ByteBuffer(BigInt(publicSignals[0]));
    // let public_signal_0_u8_array = [Array.from(publicSignalsBuffer)]; // method expects an array of signals
    // console.log("pub:", public_signal_0_u8_array);

    // assert(
    //   await groth16.verify(
    //     verifier,
    //     publicSignals,
    //     newProof,
    //   ),
    //   "Invalid proof"
    // ) // doesn't make much sense to verify the proof here

    const program = anchor.workspace.Verifier as anchor.Program<Verifier>;

    await program.methods
      .verify(
        pi_a_0_u8_array,
        pi_b_0_u8_array,
        pi_c_0_u8_array,
        // ====== Uncomment in case publicSignals are needed ======
        // public_signal_0_u8_array // publicSignals if needed
      )
      .rpc({ skipPreflight: true, commitment: "processed" });
  });
});

function to32ByteBuffer(bigInt) {
  const hexString = bigInt.toString(16).padStart(64, '0'); // Pad to 64 hex characters (32 bytes)
  const buffer = Buffer.from(hexString, "hex");
  return buffer;
}

function g1Uncompressed(curve, p1Raw) {
  let p1 = curve.G1.fromObject(p1Raw);

  let buff = new Uint8Array(64); // 64 bytes for G1 uncompressed
  curve.G1.toRprUncompressed(buff, 0, p1);

  return Buffer.from(buff);
}

// Function to negate G1 element
function negateG1(curve, buffer) {
  let p1 = curve.G1.fromRprUncompressed(buffer, 0);
  let negatedP1 = curve.G1.neg(p1);
  let negatedBuffer = new Uint8Array(64);
  curve.G1.toRprUncompressed(negatedBuffer, 0, negatedP1);
  return Buffer.from(negatedBuffer);
}

// Function to reverse endianness of a buffer
function reverseEndianness(buffer) {
  return Buffer.from(buffer.reverse());
}

async function negateAndSerializeG1(curve, reversedP1Uncompressed) {
  if (!reversedP1Uncompressed || !(reversedP1Uncompressed instanceof Uint8Array || Buffer.isBuffer(reversedP1Uncompressed))) {
    console.error('Invalid input to negateAndSerializeG1:', reversedP1Uncompressed);
    throw new Error('Invalid input to negateAndSerializeG1');
  }
  // Negate the G1 point
  let p1 = curve.G1.toAffine(curve.G1.fromRprUncompressed(reversedP1Uncompressed, 0));
  let negatedP1 = curve.G1.neg(p1);

  // Serialize the negated point
  // The serialization method depends on your specific library
  let serializedNegatedP1 = new Uint8Array(64); // 32 bytes for x and 32 bytes for y
  curve.G1.toRprUncompressed(serializedNegatedP1, 0, negatedP1);
  // curve.G1.toRprUncompressed(serializedNegatedP1, 32, negatedP1.y);
  console.log(serializedNegatedP1)

  // Change endianness if necessary
  let proof_a = reverseEndianness(serializedNegatedP1);

  return proof_a;
}

function g2Uncompressed(curve, p2Raw) {
  let p2 = curve.G2.fromObject(p2Raw);

  let buff = new Uint8Array(128); // 128 bytes for G2 uncompressed
  curve.G2.toRprUncompressed(buff, 0, p2);

  return Buffer.from(buff);
}
