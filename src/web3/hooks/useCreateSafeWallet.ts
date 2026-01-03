import { useState, useRef } from "react";
import { useChainId } from "wagmi";
import { ethers } from "ethers";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";
import { getSafeModuleAddress } from "../utils/contractAddresses";
import {
  SUPPORTED_CHAINS,
  isSupportedChain,
  getChainName,
} from "../utils/supportedChains";
import Safe from "@safe-global/protocol-kit";
import SafeArtifact from "../artifacts/Safe.json";
import type { SafeTransaction } from "@safe-global/safe-core-sdk-types";
import type {
  CreateSafeResult,
  SignResult,
  SubmitResult,
  EnableModuleResult,
} from "../types/safe";

// Backend API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export const useCreateSafeWallet = () => {
  const chainId = useChainId();
  const { wallet, getPrivyAccessToken } = usePrivyWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [isEnablingModule, setIsEnablingModule] = useState(false);
  const [isSigningEnableModule, setIsSigningEnableModule] = useState(false);
  const [isExecutingEnableModule, setIsExecutingEnableModule] = useState(false);

  // Store signed transaction data for the two-step flow
  const signedTxRef = useRef<{
    safeSdk: Safe;
    signedSafeTx: SafeTransaction;
    safeTxHash: string;
    safeAddress: string;
    threshold: number;
    owners: string[];
    signerAddress: string;
  } | null>(null);

  // Helper: Read Safe info with retry logic
  const readSafeInfo = async (
    safeAddress: string,
    moduleAddress: string,
    provider: ethers.BrowserProvider
  ): Promise<{
    threshold: number;
    owners: string[];
    isEnabled: boolean;
  }> => {
    const safeProxy = new ethers.Contract(
      safeAddress,
      SafeArtifact.abi,
      provider
    );
    let thresholdBig: bigint | undefined;
    let owners: string[] | undefined;
    let isEnabled: boolean | undefined;
    let retryCount = 0;
    const maxRetries = 5;

    while (retryCount < maxRetries) {
      try {
        const results = await Promise.all([
          safeProxy.getThreshold(),
          safeProxy.getOwners(),
          safeProxy.isModuleEnabled(moduleAddress),
        ]);
        thresholdBig = results[0];
        owners = results[1];
        isEnabled = results[2];
        break;
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          throw error;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, retryCount))
        );
      }
    }

    if (!thresholdBig || !owners || isEnabled === undefined) {
      throw new Error("Failed to read Safe information after retries");
    }

    return {
      threshold: Number(thresholdBig),
      owners,
      isEnabled,
    };
  };

  // Create Safe wallet
  // Note: userAddress parameter kept for API compatibility but not used
  // Backend uses authenticated Privy wallet address from the access token
  const createSafeWallet = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userAddress: string
  ): Promise<CreateSafeResult> => {
    setIsCreating(true);
    try {
      // Validate chain ID
      if (!isSupportedChain(chainId)) {
        return {
          success: false,
          safeAddress: null,
          error: `Unsupported chain. Please switch to Arbitrum Sepolia (${SUPPORTED_CHAINS.ARBITRUM_SEPOLIA}) or Arbitrum Mainnet (${SUPPORTED_CHAINS.ARBITRUM_MAINNET}). Current chain: ${chainId}`,
        };
      }

      // Get Privy access token
      const accessToken = await getPrivyAccessToken();
      if (!accessToken) {
        return {
          success: false,
          safeAddress: null,
          error: "Authentication required. Please log in with Privy.",
        };
      }

      // Call backend relay API
      const response = await fetch(`${API_BASE_URL}/relay/create-safe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          chainId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          safeAddress: null,
          error: errorData.error || `Server error: ${response.status}`,
        };
      }

      const data = await response.json();

      if (!data.success || !data.data?.safeAddress) {
        return {
          success: false,
          safeAddress: null,
          error: data.error || "Failed to create Safe wallet",
        };
      }

      return {
        success: true,
        safeAddress: data.data.safeAddress,
      };
    } catch (err) {
      const getShortErrorMessage = (error: Error): string => {
        const message = error.message.toLowerCase();

        if (message.includes("fetch") || message.includes("network")) {
          return "Network error. Please check your connection.";
        }
        if (message.includes("timeout")) {
          return "Request timeout. Please try again.";
        }

        // Fallback: take first sentence or 50 chars
        const msg = error.message.split(".")[0];
        return msg.length > 50 ? msg.substring(0, 50) + "..." : msg;
      };

      return {
        success: false,
        safeAddress: null,
        error:
          err instanceof Error
            ? getShortErrorMessage(err)
            : "Failed to create Safe wallet",
      };
    } finally {
      setIsCreating(false);
    }
  };

  // Sign enable module transaction (Step 2)
  const signEnableModule = async (safeAddress: string): Promise<SignResult> => {
    setIsSigningEnableModule(true);

    try {
      // Validate chain ID
      if (!isSupportedChain(chainId)) {
        return {
          success: false,
          error: `Unsupported chain. Please switch to Arbitrum Sepolia (${SUPPORTED_CHAINS.ARBITRUM_SEPOLIA}) or Arbitrum Mainnet (${SUPPORTED_CHAINS.ARBITRUM_MAINNET}). Current chain: ${chainId}`,
        };
      }

      const moduleAddress = getSafeModuleAddress(chainId);
      if (!moduleAddress) {
        return {
          success: false,
          error: `Safe Module address not configured for ${getChainName(
            chainId
          )}. Please check your environment variables.`,
        };
      }

      if (!wallet) {
        return {
          success: false,
          error: "Privy wallet not available. Please log in.",
        };
      }

      // Get Privy EIP-1193 provider
      const provider = await wallet.getEthereumProvider();
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const signerAddress = await signer.getAddress();

      // Read Safe info with retry logic
      const { threshold, owners, isEnabled } = await readSafeInfo(
        safeAddress,
        moduleAddress,
        ethersProvider
      );

      const normalizedOwners = owners.map((owner: string) =>
        owner.toLowerCase()
      );

      if (!normalizedOwners.includes(signerAddress.toLowerCase())) {
        return {
          success: false,
          error: "Connected wallet is not an owner of this Safe",
        };
      }

      if (isEnabled) {
        // Module already enabled - this is actually a success state
        signedTxRef.current = null;
        return {
          success: true,
          data: {
            threshold,
            owners,
            safeTxHash: "", // No transaction needed
          },
        };
      }

      // Initialize Safe SDK with Privy provider
      const safeSdk = await Safe.init({
        provider: provider as unknown as ethers.Eip1193Provider,
        safeAddress,
      });

      // Create enable module transaction
      const safeTransaction = await safeSdk.createEnableModuleTx(moduleAddress);

      // Sign the transaction using Safe SDK (this triggers the EIP-712 signature)
      const signedSafeTx = await safeSdk.signTransaction(safeTransaction);
      const safeTxHash = await safeSdk.getTransactionHash(signedSafeTx);

      // Store signed transaction for submitEnableModule
      signedTxRef.current = {
        safeSdk,
        signedSafeTx,
        safeTxHash,
        safeAddress,
        threshold,
        owners,
        signerAddress,
      };

      return {
        success: true,
        data: {
          threshold,
          owners,
          safeTxHash,
        },
      };
    } catch (err) {
      signedTxRef.current = null;

      const getErrorMessage = (error: Error): string => {
        const message = error.message.toLowerCase();

        if (
          message.includes("user rejected") ||
          message.includes("user denied")
        ) {
          return "Signature rejected by user";
        }
        if (message.includes("network")) {
          return "Network error occurred";
        }

        // Fallback: take first sentence or 50 chars
        const msg = error.message.split(".")[0];
        return msg.length > 50 ? msg.substring(0, 50) + "..." : msg;
      };

      return {
        success: false,
        error:
          err instanceof Error
            ? getErrorMessage(err)
            : "Failed to sign transaction",
      };
    } finally {
      setIsSigningEnableModule(false);
    }
  };

  // Submit (execute) the signed enable module transaction
  const submitEnableModule = async (): Promise<SubmitResult> => {
    if (!signedTxRef.current) {
      return {
        success: false,
        error: "No signed transaction found. Please sign first.",
      };
    }

    const { signedSafeTx, threshold, owners, safeAddress } =
      signedTxRef.current;

    try {
      // Validate chain ID
      if (!isSupportedChain(chainId)) {
        return {
          success: false,
          error: `Unsupported chain. Please switch to Arbitrum Sepolia (${SUPPORTED_CHAINS.ARBITRUM_SEPOLIA}) or Arbitrum Mainnet (${SUPPORTED_CHAINS.ARBITRUM_MAINNET}). Current chain: ${chainId}`,
        };
      }

      const moduleAddress = getSafeModuleAddress(chainId);
      if (!moduleAddress) {
        return {
          success: false,
          error: `Safe Module address not configured for ${getChainName(
            chainId
          )}. Please check your environment variables.`,
        };
      }

      setIsExecutingEnableModule(true);

      // Get Privy access token
      const accessToken = await getPrivyAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: "Authentication required. Please log in with Privy.",
        };
      }

      // Extract Safe transaction data
      const safeTxData = {
        to: signedSafeTx.data.to,
        value: signedSafeTx.data.value,
        data: signedSafeTx.data.data,
        operation: signedSafeTx.data.operation,
        safeTxGas: signedSafeTx.data.safeTxGas,
        baseGas: signedSafeTx.data.baseGas,
        gasPrice: signedSafeTx.data.gasPrice,
        gasToken: signedSafeTx.data.gasToken,
        refundReceiver: signedSafeTx.data.refundReceiver,
        nonce: signedSafeTx.data.nonce,
      };

      // Get encoded signatures
      const signatures = signedSafeTx.encodedSignatures();

      // Call backend relay API
      const response = await fetch(`${API_BASE_URL}/relay/enable-module`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          chainId,
          safeAddress,
          safeTxData,
          signatures,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status}`,
        };
      }

      const data = await response.json();

      if (!data.success || !data.data?.txHash) {
        return {
          success: false,
          error: data.error || "Failed to enable module",
        };
      }

      // Clear signed tx after execution
      signedTxRef.current = null;

      return {
        success: true,
        data: {
          status: "executed",
          threshold,
          owners,
          transactionHash: data.data.txHash,
        },
      };
    } catch (err) {
      const getErrorMessage = (error: Error): string => {
        const message = error.message.toLowerCase();

        if (message.includes("fetch") || message.includes("network")) {
          return "Network error. Please check your connection.";
        }
        if (message.includes("timeout")) {
          return "Request timeout. Please try again.";
        }

        // Fallback: take first sentence or 50 chars
        const msg = error.message.split(".")[0];
        return msg.length > 50 ? msg.substring(0, 50) + "..." : msg;
      };

      return {
        success: false,
        error:
          err instanceof Error
            ? getErrorMessage(err)
            : "Failed to submit transaction",
      };
    } finally {
      setIsExecutingEnableModule(false);
    }
  };

  // Keep existing enableModule for backward compatibility - now uses the two-step flow
  const enableModule = async (
    safeAddress: string
  ): Promise<EnableModuleResult | null> => {
    setIsEnablingModule(true);

    try {
      const moduleAddress = getSafeModuleAddress(chainId);
      if (!moduleAddress) {
        throw new Error("Safe Module address not configured for this network");
      }

      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Read Safe info with retry logic
      const { threshold, owners, isEnabled } = await readSafeInfo(
        safeAddress,
        moduleAddress,
        provider
      );

      const normalizedOwners = owners.map((owner: string) =>
        owner.toLowerCase()
      );

      if (!normalizedOwners.includes(signerAddress.toLowerCase())) {
        throw new Error("Connected wallet is not an owner of this Safe");
      }

      if (isEnabled) {
        return {
          status: "already_enabled",
          threshold,
          owners,
        };
      }

      // Use the two-step flow
      const signResult = await signEnableModule(safeAddress);
      if (!signResult.success || !signResult.data) {
        return null;
      }

      const submitResult = await submitEnableModule();
      if (!submitResult.success || !submitResult.data) {
        return null;
      }

      return submitResult.data;
    } catch {
      return null;
    } finally {
      setIsEnablingModule(false);
    }
  };

  return {
    createSafeWallet,
    signEnableModule,
    submitEnableModule,
    enableModule,
    isCreating,
    isEnablingModule,
    isSigningEnableModule,
    isExecutingEnableModule,
  };
};
