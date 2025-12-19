// Helper to parse blockchain errors into user-friendly messages
export function parseBlockchainError(error: any): string {
  const errorMessage = error?.message || error?.toString() || "Unknown error";

  // Check for common blockchain errors
  if (errorMessage.includes("Reset first")) {
    return "⚠️ An election already exists. Please end the current election and reset the system before creating a new one.";
  }

  if (
    errorMessage.includes("user rejected") ||
    errorMessage.includes("User denied")
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
    errorMessage.includes("chain")
  ) {
    return "🌐 Network error. Please make sure you're connected to the correct blockchain network.";
  }

  if (errorMessage.includes("nonce")) {
    return "🔄 Transaction error. Please refresh the page and try again.";
  }

  // Show full error for debugging
  return `❌ ${errorMessage}`;
}
