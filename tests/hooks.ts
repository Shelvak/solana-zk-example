import * as anchor from "@coral-xyz/anchor";
// import { } from "@solana/spl-token";
// import { } from "@solana/web3.js";

export const provider = anchor.AnchorProvider.local(null, {
  commitment: "processed",
  preflightCommitment: "processed",
  skipPreflight: true,
});

anchor.setProvider(provider);

export const mochaHooks = {
  /* Before hook to run before all tests */
  beforeAll: [
    async () => {
      // any global setup
    },
  ],
};
