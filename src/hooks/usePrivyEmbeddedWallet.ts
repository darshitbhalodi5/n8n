"use client";

import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState, useMemo } from "react";
import type { ConnectedWallet } from "@privy-io/react-auth";

// EIP-1193 provider type (minimal interface)
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    handler: (...args: unknown[]) => void
  ) => void;
}

export interface UsePrivyEmbeddedWalletReturn {
  embeddedWallet: ConnectedWallet | null;
  walletAddress: string | null;
  chainId: number | null;
  ethereumProvider: EthereumProvider | null;
  ready: boolean;
}

/**
 * Hook to access Privy embedded wallet and its chain/address/provider info
 * - chainId is nullable until wallet provider is ready
 * - walletAddress is nullable until wallet is available
 */
export function usePrivyEmbeddedWallet(): UsePrivyEmbeddedWalletReturn {
  const { wallets, ready } = useWallets();
  const [chainId, setChainId] = useState<number | null>(null);
  const [ethereumProvider, setEthereumProvider] =
    useState<EthereumProvider | null>(null);

  // Get the embedded wallet (Privy wallet client type)
  const embeddedWallet = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy") || null,
    [wallets]
  );

  const walletAddress = embeddedWallet?.address || null;

  // Fetch chain ID from wallet provider
  useEffect(() => {
    let isMounted = true;
    let cleanupListener: (() => void) | undefined;

    const initializeWallet = async () => {
      if (!embeddedWallet || !ready) {
        // Will be reset by next effect run or cleanup
        return;
      }

      try {
        const provider = await embeddedWallet.getEthereumProvider();
        if (!isMounted) return;

        setEthereumProvider(provider as EthereumProvider);

        if (provider) {
          const chainIdHex = await provider.request({ method: "eth_chainId" });
          if (isMounted) {
            const chainIdNum = parseInt(chainIdHex as string, 16);
            setChainId(chainIdNum);
          }

          // Set up chain change listener
          if (provider.on) {
            const handleChainChanged = (...args: unknown[]) => {
              const chainIdHex = args[0];
              if (isMounted) {
                const chainIdNum = parseInt(chainIdHex as string, 16);
                setChainId(chainIdNum);
              }
            };
            provider.on("chainChanged", handleChainChanged);

            cleanupListener = () => {
              if (provider.removeListener) {
                provider.removeListener("chainChanged", handleChainChanged);
              }
            };
          }
        } else if (isMounted) {
          setChainId(null);
        }
      } catch (error) {
        console.error("Failed to get chain ID from embedded wallet:", error);
        if (isMounted) {
          setChainId(null);
          setEthereumProvider(null);
        }
      }
    };

    initializeWallet();

    return () => {
      isMounted = false;
      if (cleanupListener) {
        cleanupListener();
      }
      // Reset state on cleanup
      setChainId(null);
      setEthereumProvider(null);
    };
  }, [embeddedWallet, ready]);

  return {
    embeddedWallet,
    walletAddress,
    chainId,
    ethereumProvider,
    ready,
  };
}
