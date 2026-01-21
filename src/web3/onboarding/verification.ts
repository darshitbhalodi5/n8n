/**
 * Onboarding Verification Module
 * Handles on-chain verification with retry logic
 */

import { ethers } from "ethers";
import SafeArtifact from "../artifacts/Safe.json";
import { getSafeModuleAddress } from "@/web3/chains";

/**
 * Verify that module is enabled for a Safe (with retry logic)
 * @param safeAddress - Safe wallet address
 * @param chainId - Chain ID
 * @param provider - Ethereum provider
 * @param maxRetries - Maximum number of retries (default 5)
 * @param delayMs - Delay between retries in ms (default 2000)
 * @returns true if module is enabled, false otherwise
 */
export async function verifyModuleEnabled(
  safeAddress: string,
  chainId: number,
  provider: ethers.Eip1193Provider,
  maxRetries: number = 5,
  delayMs: number = 2000
): Promise<boolean> {
  const moduleAddress = getSafeModuleAddress(chainId);
  
  if (!moduleAddress) {
    throw new Error(`Module address not configured for chain ${chainId}`);
  }

  const ethersProvider = new ethers.BrowserProvider(provider);
  const safeContract = new ethers.Contract(
    safeAddress,
    SafeArtifact.abi,
    ethersProvider
  );

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const isEnabled: boolean = await safeContract.isModuleEnabled(moduleAddress);
      return isEnabled;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If not the last attempt, wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(1.5, attempt)));
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to verify module status after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}`
  );
}

/**
 * Wait for transaction confirmation (with timeout)
 * @param txHash - Transaction hash
 * @param provider - Ethereum provider
 * @param timeoutMs - Timeout in milliseconds (default 60000)
 * @returns Receipt when confirmed
 */
export async function waitForTransactionConfirmation(
  txHash: string,
  provider: ethers.Eip1193Provider,
  timeoutMs: number = 60000
): Promise<ethers.TransactionReceipt> {
  const ethersProvider = new ethers.BrowserProvider(provider);
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const receipt = await ethersProvider.getTransactionReceipt(txHash);
      
      if (receipt && receipt.status === 1) {
        return receipt;
      }
      
      if (receipt && receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      
      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      // If it's not a "transaction not found" error, rethrow
      if (error instanceof Error && !error.message.includes("not found")) {
        throw error;
      }
      
      // Otherwise wait and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  throw new Error(`Transaction ${txHash} not confirmed within ${timeoutMs}ms`);
}
