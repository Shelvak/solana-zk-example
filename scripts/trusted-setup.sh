echo 'prepare phase1'
node vendor/snarkjs.cjs powersoftau new bn128 12 proofs/pot12_0000.ptau -v

echo 'contribute phase1 first'
node vendor/snarkjs.cjs powersoftau contribute proofs/pot12_0000.ptau proofs/pot12_0001.ptau --name="First contribution" -v -e="random text"

echo 'apply a random beacon'
node vendor/snarkjs.cjs powersoftau beacon proofs/pot12_0001.ptau proofs/pot12_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"

echo 'prepare phase2'
node vendor/snarkjs.cjs powersoftau prepare phase2 proofs/pot12_beacon.ptau proofs/pot12_final.ptau -v

echo 'Verify the final ptau'
node vendor/snarkjs.cjs powersoftau verify proofs/pot12_final.ptau

echo 'Removing unnecessary files'
rm proofs/pot12_0000.ptau proofs/pot12_0001.ptau proofs/pot12_beacon.ptau
