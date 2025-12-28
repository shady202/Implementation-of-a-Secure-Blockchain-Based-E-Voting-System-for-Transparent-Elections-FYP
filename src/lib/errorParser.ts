// Helper to parse blockchain errors into user-friendly messages
export function parseBlockchainError(error: any): string {
  // Extract the message from various error formats
  let errorMessage = "";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.reason) {
    errorMessage = error.reason;
  } else if (error?.data?.message) {
    errorMessage = error.data.message;
  } else if (error?.error?.message) {
    errorMessage = error.error.message;
  } else {
    errorMessage = error?.toString() || "Unknown error";
  }

  // Remove technical details and transaction hashes
  errorMessage = errorMessage.replace(/0x[a-fA-F0-9]+/g, "[transaction]");
  errorMessage = errorMessage.split("\n")[0]; // Take only first line

  // Check for common blockchain errors with user-friendly messages
  if (errorMessage.includes("End election first")) {
    return "⚠️ The election must be ended before resetting the system. Please use the 'End Election' button first.";
  }

  if (errorMessage.includes("Reset first")) {
    return "⚠️ An election already exists. Please end the current election and reset the system before creating a new one.";
  }

  if (
    errorMessage.includes("user rejected") ||
    errorMessage.includes("User denied") ||
    errorMessage.includes("user rejected transaction")
  ) {
    return "❌ Transaction cancelled. You rejected the MetaMask signature request.";
  }

  if (errorMessage.includes("insufficient funds")) {
    return "💰 Insufficient funds. You don't have enough ETH to pay for gas fees.";
  }

  if (errorMessage.includes("Election is not active")) {
    return "⚠️ Election is not active yet. Please start the election first.";
  }

  if (errorMessage.includes("Election ended")) {
    return "⚠️ This election has already ended. No more changes can be made.";
  }

  if (errorMessage.includes("Only admin")) {
    return "🚫 Access denied. Only the admin wallet can perform this action.";
  }

  if (errorMessage.includes("Setup locked")) {
    return "🔒 Election setup is locked. Cannot modify categories/candidates after election has started.";
  }

  if (errorMessage.includes("Already voted")) {
    return "✅ You have already voted in this category.";
  }

  if (errorMessage.includes("Not registered")) {
    return "📝 You must register as a voter before you can vote.";
  }

  if (
    errorMessage.includes("network changed") ||
    errorMessage.includes("chain mismatch") ||
    errorMessage.includes("wrong network")
  ) {
    return "🌐 Network error. Please make sure you're connected to the correct blockchain network.";
  }

  if (errorMessage.includes("nonce")) {
    return "🔄 Transaction error. Please refresh the page and try again.";
  }

  if (errorMessage.includes("CALL_EXCEPTION")) {
    return "❌ Smart contract error. The operation could not be completed. Please try again.";
  }

  // Clean up the error message
  const cleanMessage = errorMessage
    .replace(/Error:/gi, "")
    .replace(/execution reverted:/gi, "")
    .replace(/VM Exception/gi, "")
    .trim();

  // Return cleaned message
  return `❌ ${
    cleanMessage || "An unexpected error occurred. Please try again."
  }`;
}
