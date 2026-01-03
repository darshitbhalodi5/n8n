"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCallback } from "react";

/**
 * Hook for interacting with Privy embedded wallet
 * Provides utilities for sending sponsored transactions and getting access tokens
 */
export function usePrivyWallet() {
  const { authenticated, ready, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  // Get the embedded wallet (first wallet is typically the embedded one)
  const wallet = wallets.find((w) => w.walletClientType === "privy");

  /**
   * Get Privy access token for API authentication
   */
  const getPrivyAccessToken = useCallback(async (): Promise<string | null> => {
    if (!authenticated || !ready) {
      return null;
    }
    
    try {
      const token = await getAccessToken();
      return token;
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  }, [authenticated, ready, getAccessToken]);

  /**
   * Send a sponsored transaction to TriggerX registry
   * @param to - TriggerX registry contract address
   * @param value - Amount in wei (calculated gas fees)
   * @param data - Optional transaction data
   * @returns Transaction hash
   */
  const sendSponsoredTransaction = useCallback(
    async (
      to: string,
      value: string,
      data?: string
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!ready) {
        return { success: false, error: "Privy not ready" };
      }

      if (!authenticated) {
        return { success: false, error: "User not authenticated" };
      }

      if (!wallet) {
        return { success: false, error: "Wallet not available" };
      }

      try {
        // Use the wallet's provider to send transaction
        // Privy will automatically sponsor the transaction based on your policy
        const provider = await wallet.getEthereumProvider();
        
        // Convert value to hex if needed
        const valueHex = typeof value === "string" && value.startsWith("0x") 
          ? value 
          : `0x${BigInt(value).toString(16)}`;

        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: wallet.address,
              to,
              value: valueHex,
              data: data || "0x",
              // Gas sponsorship is handled by Privy based on your dashboard policy
            },
          ],
        });

        return { success: true, txHash: txHash as string };
      } catch (error) {
        console.error("Transaction failed:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    [wallet, authenticated, ready]
  );

  /**
   * Calculate gas fees for TriggerX job creation
   * This is a placeholder - implement your actual fee calculation logic
   */
  const calculateGasFees = useCallback(
    (jobComplexity: "simple" | "medium" | "complex" = "medium"): string => {
      // Placeholder fee calculation
      // Replace with your actual TriggerX fee calculation logic
      const baseFee = BigInt("1000000000000000"); // 0.001 RBTC in wei
      const complexityMultiplier = {
        simple: BigInt("1"),
        medium: BigInt("2"),
        complex: BigInt("5"),
      };

      return (baseFee * complexityMultiplier[jobComplexity]).toString();
    },
    []
  );

  return {
    wallet,
    authenticated,
    ready,
    sendSponsoredTransaction,
    calculateGasFees,
    walletAddress: wallet?.address,
    getPrivyAccessToken,
  };
}

