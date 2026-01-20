/**
 * Centralized blockchain chain configuration and helpers.
 * All chain-specific values should live here to keep them in sync.
 */

export const CHAIN_IDS = {
  ARBITRUM_SEPOLIA: 421614,
  ARBITRUM_MAINNET: 42161,
} as const;

export type SupportedChainId =
  (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS];

// Alias for compatibility with existing naming
export const SUPPORTED_CHAINS = CHAIN_IDS;

export type ChainDefinition = {
  id: SupportedChainId;
  key: "testnet" | "mainnet";
  name: string;
  explorerUrl: string;
  isTestnet: boolean;
  safeWalletFactoryAddress: string;
  safeModuleAddress: string;
};

export const USE_TESTNET_ONLY =
  process.env.NEXT_PUBLIC_USE_TESTNET_ONLY !== "false";

const chainDefinitions: Record<SupportedChainId, ChainDefinition> = {
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: {
    id: CHAIN_IDS.ARBITRUM_SEPOLIA,
    key: "testnet",
    name: "Arbitrum Sepolia",
    explorerUrl: "https://sepolia.arbiscan.io",
    isTestnet: true,
    safeWalletFactoryAddress:
      process.env.NEXT_PUBLIC_SAFE_WALLET_FACTORY_ADDRESS || "",
    safeModuleAddress: process.env.NEXT_PUBLIC_SAFE_MODULE_ADDRESS || "",
  },
  [CHAIN_IDS.ARBITRUM_MAINNET]: {
    id: CHAIN_IDS.ARBITRUM_MAINNET,
    key: "mainnet",
    name: "Arbitrum Mainnet",
    explorerUrl: "https://arbiscan.io",
    isTestnet: false,
    safeWalletFactoryAddress:
      process.env.NEXT_PUBLIC_MAINNET_SAFE_WALLET_FACTORY_ADDRESS || "",
    safeModuleAddress:
      process.env.NEXT_PUBLIC_MAINNET_SAFE_MODULE_ADDRESS || "",
  },
};

export function isSupportedChain(
  chainId: number
): chainId is SupportedChainId {
  return (
    chainId === CHAIN_IDS.ARBITRUM_SEPOLIA ||
    chainId === CHAIN_IDS.ARBITRUM_MAINNET
  );
}

export function getChainInfo(chainId: number): ChainDefinition | undefined {
  return chainDefinitions[chainId as SupportedChainId];
}

export function getChainName(chainId: number): string {
  return getChainInfo(chainId)?.name ?? `Chain ${chainId}`;
}

export function getSupportedChains(): ChainDefinition[] {
  return Object.values(chainDefinitions);
}

export function getSelectableChains(): ChainDefinition[] {
  const base = [chainDefinitions[CHAIN_IDS.ARBITRUM_SEPOLIA]];
  if (!USE_TESTNET_ONLY) {
    base.push(chainDefinitions[CHAIN_IDS.ARBITRUM_MAINNET]);
  }
  return base;
}

export function getSafeWalletFactoryAddress(chainId: number): string {
  const info = getChainInfo(chainId);
  if (!info) {
    console.warn(`Chain ID ${chainId} not supported`);
    return "";
  }
  return info.safeWalletFactoryAddress || "";
}

export function getSafeModuleAddress(chainId: number): string {
  const info = getChainInfo(chainId);
  if (!info) {
    console.warn(`Chain ID ${chainId} not supported`);
    return "";
  }
  return info.safeModuleAddress || "";
}

import { arbitrum, arbitrumSepolia } from "viem/chains";
export { arbitrum, arbitrumSepolia };

// Array of viem chain objects for Privy and other providers
export const VIEM_CHAINS = [arbitrumSepolia, arbitrum] as const;

/**
 * Check if a chain ID corresponds to a testnet
 */
export function isTestnet(chainId: number | null | undefined): boolean {
  if (chainId == null) return false;
  return chainId === CHAIN_IDS.ARBITRUM_SEPOLIA;
}

/**
 * Check if a chain ID corresponds to mainnet
 */
export function isMainnet(chainId: number | null | undefined): boolean {
  if (chainId == null) return false;
  return chainId === CHAIN_IDS.ARBITRUM_MAINNET;
}

/**
 * Get the target chain ID for network switching
 * @param toTestnet - If true, returns testnet chain ID; otherwise mainnet
 */
export function getTargetChainId(toTestnet: boolean): number {
  return toTestnet ? CHAIN_IDS.ARBITRUM_SEPOLIA : CHAIN_IDS.ARBITRUM_MAINNET;
}

/**
 * Get the default chain for Privy configuration
 * Respects USE_TESTNET_ONLY flag
 */
export function getDefaultChainForPrivy() {
  return USE_TESTNET_ONLY ? arbitrumSepolia : arbitrum;
}

/**
 * Get supported chains array for Privy configuration
 * Respects USE_TESTNET_ONLY flag
 */
export function getSupportedChainsForPrivy() {
  if (USE_TESTNET_ONLY) {
    return [arbitrumSepolia];
  }
  return [arbitrumSepolia, arbitrum];
}

export * from "./safe";
