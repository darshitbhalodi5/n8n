/**
 * Supported Chain IDs
 * Must match backend configuration
 */
export const SUPPORTED_CHAINS = {
  ARBITRUM_SEPOLIA: 421614,
  ARBITRUM_MAINNET: 42161,
} as const;

export type SupportedChainId =
  | typeof SUPPORTED_CHAINS.ARBITRUM_SEPOLIA
  | typeof SUPPORTED_CHAINS.ARBITRUM_MAINNET;

/**
 * Check if a chain ID is supported
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return (
    chainId === SUPPORTED_CHAINS.ARBITRUM_SEPOLIA ||
    chainId === SUPPORTED_CHAINS.ARBITRUM_MAINNET
  );
}

/**
 * Get chain name for display
 */
export function getChainName(chainId: number): string {
  if (chainId === SUPPORTED_CHAINS.ARBITRUM_SEPOLIA) return "Arbitrum Sepolia";
  if (chainId === SUPPORTED_CHAINS.ARBITRUM_MAINNET) return "Arbitrum Mainnet";
  return `Chain ${chainId}`;
}

/**
 * Get chain display info
 */
export function getChainInfo(chainId: number): {
  name: string;
  isTestnet: boolean;
  explorerUrl: string;
} {
  if (chainId === SUPPORTED_CHAINS.ARBITRUM_SEPOLIA) {
    return {
      name: "Arbitrum Sepolia",
      isTestnet: true,
      explorerUrl: "https://sepolia.arbiscan.io",
    };
  }
  if (chainId === SUPPORTED_CHAINS.ARBITRUM_MAINNET) {
    return {
      name: "Arbitrum Mainnet",
      isTestnet: false,
      explorerUrl: "https://arbiscan.io",
    };
  }
  return {
    name: `Chain ${chainId}`,
    isTestnet: false,
    explorerUrl: "",
  };
}

