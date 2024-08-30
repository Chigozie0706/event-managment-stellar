import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
// import * as StellarSdk from "@stellar/stellar-sdk";

import { Server } from "@stellar/stellar-sdk";

// const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
const server = new Server("https://horizon-testnet.stellar.org");

function LiquidityPoolForm() {
  const [secretKey, setSecretKey] = useState("");
  const [amount, setAmount] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //   const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
      //   const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

      const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
      const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

      // Create a custom asset (replace with your asset details)
      const customAsset = new StellarSdk.LiquidityPoolAsset(
        StellarSdk.Asset.native(),
        customAsset,
        StellarSdk.LiquidityPoolFeeV18
      );
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: lpAsset,
          })
        )
        .addOperation(
          StellarSdk.Operation.liquidityPoolDeposit({
            liquidityPoolId: lpAsset.getLiquidityPoolId(),
            maxAmountA: amount,
            maxAmountB: amount,
            minPrice: { n: 1, d: 1 },
            maxPrice: { n: 1, d: 1 },
          })
        )
        .setTimeout(30)
        .build();
      transaction.sign(sourceKeypair);
      const result = await server.submitTransaction(transaction);
      console.log("Transaction successful:", result);
      alert("Liquidity added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding liquidity. Check console for details.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Button type="submit" variant="contained">
          Add Liquidity
        </Button>
      </Box>
    </form>
  );
}
export default LiquidityPoolForm;
