// import {
//   Keypair,
//   Asset,
//   TransactionBuilder,
//   Operation,
//   Networks,
//   BASE_FEE,
//   SorobanRpc,
//   Server,
// } from "@stellar/stellar-sdk";

// const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
// // const server = new Server("https://horizon-testnet.stellar.org");

// // Generate a new keypair
// const newKeypair = Keypair.random();

// // Get the secret key (private key)
// const secretKey = newKeypair.secret();

// // Get the public key
// const publicKey = newKeypair.publicKey();

// console.log("Secret Key:", secretKey);
// console.log("Public Key:", publicKey);

// export async function createEvent(eventName, organizerSecret) {
//   const organizerKeypair = Keypair.fromSecret(organizerSecret);
//   const eventAsset = new Asset(eventName, organizerKeypair.publicKey());
//   const organizerAccount = await server.loadAccount(
//     organizerKeypair.publicKey()
//   );

//   const transaction = new TransactionBuilder(organizerAccount, {
//     fee: BASE_FEE,
//     networkPassphrase: Networks.TESTNET,
//   })
//     .addOperation(
//       Operation.changeTrust({
//         asset: eventAsset,
//       })
//     )
//     .addOperation(
//       Operation.payment({
//         destination: organizerKeypair.publicKey(),
//         asset: eventAsset,
//         amount: "100", // Initial ticket issuance
//       })
//     )
//     .setTimeout(30)
//     .build();

//   transaction.sign(organizerKeypair);

//   try {
//     await server.submitTransaction(transaction);
//     return { success: true, eventAsset };
//   } catch (error) {
//     return { success: false, error };
//   }
// }

// export async function purchaseTicket(
//   eventAsset,
//   participantSecret,
//   ticketPrice
// ) {
//   const participantKeypair = Keypair.fromSecret(participantSecret);
//   const participantAccount = await server.loadAccount(
//     participantKeypair.publicKey()
//   );

//   const transaction = new TransactionBuilder(participantAccount, {
//     fee: BASE_FEE,
//     networkPassphrase: Networks.TESTNET,
//   })
//     .addOperation(
//       Operation.changeTrust({
//         asset: eventAsset,
//       })
//     )
//     .addOperation(
//       Operation.payment({
//         destination: participantKeypair.publicKey(),
//         asset: eventAsset,
//         amount: "1", // Purchase 1 ticket
//       })
//     )
//     .addOperation(
//       Operation.pathPaymentStrictReceive({
//         sendAsset: Asset.native(),
//         sendMax: ticketPrice,
//         destination: participantKeypair.publicKey(),
//         destAsset: eventAsset,
//         destAmount: "1", // 1 ticket
//       })
//     )
//     .setTimeout(30)
//     .build();

//   transaction.sign(participantKeypair);

//   try {
//     await server.submitTransaction(transaction);
//     return { success: true };
//   } catch (error) {
//     return { success: false, error };
//   }
// }

// export async function viewTickets(publicKey) {
//   try {
//     const account = await server.loadAccount(publicKey);
//     const balances = account.balances.filter(
//       (balance) => balance.asset_type !== "native"
//     );
//     return { success: true, balances };
//   } catch (error) {
//     return { success: false, error };
//   }
// }

import {
  Keypair,
  SorobanRpc,
  Networks,
  TransactionBuilder,
  Operation,
  BASE_FEE,
} from "@stellar/stellar-sdk";

const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
const sourceAccount = await server.getAccount(defiKeypair.publicKey());

// Initialize Soroban server
// const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");

// Generate a new keypair
const newKeypair = Keypair.random();

// Get the secret key (private key)
const secretKey = newKeypair.secret();
const publicKey = newKeypair.publicKey();

console.log("Secret Key:", secretKey);
console.log("Public Key:", publicKey);

export async function createEvent(eventName, organizerSecret, contractId) {
  const organizerKeypair = Keypair.fromSecret(organizerSecret);

  const organizerAccount = await server.getAccount(
    organizerKeypair.publicKey()
  );

  // Create a transaction to invoke the contract
  const transaction = new TransactionBuilder(organizerAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.invokeHostFunction({
        contractId: contractId,
        method: "create_event",
        args: [eventName, organizerKeypair.publicKey()],
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(organizerKeypair);

  try {
    const result = await server.sendTransaction(transaction);
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}

export async function purchaseTicket(eventId, participantSecret, contractId) {
  const participantKeypair = Keypair.fromSecret(participantSecret);
  const participantAccount = await server.getAccount(
    participantKeypair.publicKey()
  );

  // Create a transaction to invoke the contract
  const transaction = new TransactionBuilder(participantAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.invokeHostFunction({
        contractId: contractId,
        method: "purchase_ticket",
        args: [eventId, participantKeypair.publicKey()],
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(participantKeypair);

  try {
    const result = await server.sendTransaction(transaction);
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}

export async function viewTickets(publicKey, contractId) {
  try {
    const account = await server.getAccount(publicKey);

    // Create a transaction to invoke the contract
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.invokeHostFunction({
          contractId: contractId,
          method: "view_tickets",
          args: [publicKey],
        })
      )
      .setTimeout(30)
      .build();

    const result = await server.sendTransaction(transaction);
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}
