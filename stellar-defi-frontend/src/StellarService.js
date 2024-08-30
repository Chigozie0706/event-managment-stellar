import {
  Keypair,
  SorobanRpc,
  Networks,
  TransactionBuilder,
  Operation,
  BASE_FEE,
  InvokeHostFunctionType,
} from "@stellar/stellar-sdk";

// Initialize Soroban server
const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");

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
        func: InvokeHostFunctionType.INVOKE_FUNCTION,
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
