# ZK example
After long hours trying different repos and tools, here's a complete clone+run zk proof verifier working with anchor.
The base multiplier is changed to receive a 3rd input `c` as the result of the multiplication (just to play)

## Requirements
- yarn install
- install [circom 2](https://docs.circom.io/getting-started/installation/)
- avm install 0.30.1; avm use 0.30.1 # anchor 0.30.1

## Running
1) anchor build
2) Edit scripts/trusted-setup.sh for secret/random words
3) `yarn trusted-setup`
4) `yarn circom` # Will compile circuits
5) Edit scripts/generate-zkey.sh for secret/random words
6) `yarn generate-zkey`
7) anchor test
8) tail -F .anchor/program-logs/*
    - The program log will show Verification Success/Error/Failed

## Changing/Playing with the Multiplier.circom
1) Edit circuits/Multiplier.circom
2) Run step 4 `yarn circom`
3) Run step 6 `yarn generate-zkey`


### Comments
- The multiplier secret files are in the repo for tests purposes. If you change Multiplier, then the files have to be commited.
- `generate-zkey` script convert the verifier_key.json to verifying_key.rs inside the program
- `wasm_utils` (inside vendor) result from compiling (Apocentre/example => wasm)[https://github.com/Apocentre/solana-zk-example/tree/main/wasm] with `wasm-pack build --target nodejs` (thanks for that)
- `snarks.cjs` (inside vendor) result from renaming (iden3/snarkjs => build/snarkjs.js)[https://github.com/iden3/snarkjs/tree/master/build] Thanks to nodeJS people for always change the repl :rocket:
- `groth16-solana-parse_vk_to_rust.js` (inside vendor) result from cloning (lightprotocol/groth16-solana => parse_vk_to_rust)[https://github.com/Lightprotocol/groth16-solana/] and change the tabs for spaces
- `tests-zk-light-protocol.ts` (inside vendor) is a "working" test from js to test the proof/verifier inside the (groth16-solana repo)[https://github.com/Lightprotocol/groth16-solana/blob/master/src/groth16.rs#L146]
