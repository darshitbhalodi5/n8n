const CONTRACT_ADDRESSES = {
  // Arbitrum Sepolia (chainId: 421614)
  421614: {
    SAFE_WALLET_FACTORY_ADDRESS:
      process.env.NEXT_PUBLIC_SAFE_WALLET_FACTORY_ADDRESS || "",
    SAFE_MODULE_ADDRESS: process.env.NEXT_PUBLIC_SAFE_MODULE_ADDRESS || "",
  },
  // Arbitrum mainnet (chainId: 42161)
  42161: {
    SAFE_WALLET_FACTORY_ADDRESS:
      process.env.NEXT_PUBLIC_MAINNET_SAFE_WALLET_FACTORY_ADDRESS || "",
    SAFE_MODULE_ADDRESS:
      process.env.NEXT_PUBLIC_MAINNET_SAFE_MODULE_ADDRESS || "",
  },
} as const;

type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;

export function getSafeWalletFactoryAddress(chainId: number): string {
  const chainAddresses = CONTRACT_ADDRESSES[chainId as SupportedChainId];
  if (!chainAddresses) {
    console.warn(`Chain ID ${chainId} not supported`);
    return "";
  }
  return chainAddresses.SAFE_WALLET_FACTORY_ADDRESS || "";
}

export function getSafeModuleAddress(chainId: number): string {
  const chainAddresses = CONTRACT_ADDRESSES[chainId as SupportedChainId];
  if (!chainAddresses) {
    console.warn(`Chain ID ${chainId} not supported`);
    return "";
  }
  return chainAddresses.SAFE_MODULE_ADDRESS || "";
}
