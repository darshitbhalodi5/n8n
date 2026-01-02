const DEFAULT_SAFE_MULTISEND_CALL_ONLY_ADDRESS =
  "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D";

export const CONTRACT_ADDRESSES = {
  // Arbitrum Sepolia (chainId: 421614)
  421614: {
    TRIGGER_GAS_REGISTRY_ADDRESS:
      process.env.NEXT_PUBLIC_TRIGGER_GAS_REGISTRY_ADDRESS || "",
    JOB_REGISTRY_ADDRESS:
      process.env.NEXT_PUBLIC_JOB_CREATION_CONTRACT_ADDRESS || "",
    SAFE_WALLET_FACTORY_ADDRESS:
      process.env.NEXT_PUBLIC_SAFE_WALLET_FACTORY_ADDRESS || "",
    SAFE_MODULE_ADDRESS: process.env.NEXT_PUBLIC_SAFE_MODULE_ADDRESS || "",
    SAFE_MULTISEND_CALL_ONLY_ADDRESS:
      process.env.NEXT_PUBLIC_SAFE_MULTISEND_CALL_ONLY_ADDRESS ||
      DEFAULT_SAFE_MULTISEND_CALL_ONLY_ADDRESS,
    AAVE_POOL_ADDRESS: "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff",
    WETH_ADDRESS: "0x4200000000000000000000000000000000000006",
    RPC_URL: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL || "",
    API_NETWORK_NAME: "arbitrum_sepolia",
    DISPLAY_NETWORK_NAME: "Arbitrum Sepolia",
    EXPLORER_URL: "https://sepolia.arbiscan.io/address/",
    ETHERSCAN_API_KEY:
      process.env.NEXT_PUBLIC_ETHERSCAN_ARBITRUM_SEPOLIA_API_KEY || "",
    BLOCKSCOUT_API_URL: "https://sepolia.arbiscan.io/api",
    ETHERSCAN_API_URL: "https://api.etherscan.io/v2/api?chainid=421614&",
    PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_OPEN_RPC_URL || "",
  },
  // Arbitrum mainnet (chainId: 42161)
  42161: {
    TRIGGER_GAS_REGISTRY_ADDRESS:
      process.env.NEXT_PUBLIC_MAINNET_TRIGGER_GAS_REGISTRY_ADDRESS || "",
    JOB_REGISTRY_ADDRESS:
      process.env.NEXT_PUBLIC_MAINNET_JOB_CREATION_CONTRACT_ADDRESS || "",
    SAFE_WALLET_FACTORY_ADDRESS:
      process.env.NEXT_PUBLIC_MAINNET_SAFE_WALLET_FACTORY_ADDRESS || "",
    SAFE_MODULE_ADDRESS:
      process.env.NEXT_PUBLIC_MAINNET_SAFE_MODULE_ADDRESS || "",
    SAFE_MULTISEND_CALL_ONLY_ADDRESS:
      process.env.NEXT_PUBLIC_MAINNET_SAFE_MULTISEND_CALL_ONLY_ADDRESS ||
      process.env.NEXT_PUBLIC_SAFE_MULTISEND_CALL_ONLY_ADDRESS ||
      DEFAULT_SAFE_MULTISEND_CALL_ONLY_ADDRESS,
    AAVE_POOL_ADDRESS: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    WETH_ADDRESS: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    RPC_URL: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "",
    API_NETWORK_NAME: "arbitrum",
    DISPLAY_NETWORK_NAME: "Arbitrum",
    EXPLORER_URL: "https://arbiscan.io/address/",
    ETHERSCAN_API_KEY: process.env.NEXT_PUBLIC_ETHERSCAN_ARBITRUM_API_KEY || "",
    BLOCKSCOUT_API_URL: "https://arbiscan.io/api",
    ETHERSCAN_API_URL: "https://api.etherscan.io/v2/api?chainid=42161&",
    PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_ARBITRUM_OPEN_RPC_URL || "",
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;

export function getContractAddress(
  chainId: number,
  contractName: keyof (typeof CONTRACT_ADDRESSES)[SupportedChainId]
): string {
  const chainAddresses = CONTRACT_ADDRESSES[chainId as SupportedChainId];
  if (!chainAddresses) {
    console.warn(
      `Chain ID ${chainId} not supported, falling back to environment variable`
    );
    return process.env.NEXT_PUBLIC_TRIGGER_GAS_REGISTRY_ADDRESS || "";
  }

  return chainAddresses[contractName] || "";
}

export function getTriggerGasRegistryAddress(chainId: number): string {
  return getContractAddress(chainId, "TRIGGER_GAS_REGISTRY_ADDRESS");
}

export function getJobRegistryAddress(chainId: number): string {
  return getContractAddress(chainId, "JOB_REGISTRY_ADDRESS");
}

export function getRpcUrl(chainId: number): string {
  return getContractAddress(chainId, "RPC_URL");
}

export function getPublicRpcUrl(chainId: number): string {
  return getContractAddress(chainId, "PUBLIC_RPC_URL");
}

export function getApiNetworkName(chainId: number): string {
  return getContractAddress(chainId, "API_NETWORK_NAME");
}

export function getDisplayNetworkName(chainId: number): string {
  return getContractAddress(chainId, "DISPLAY_NETWORK_NAME");
}

export function getExplorerUrl(chainId: number): string {
  return getContractAddress(chainId, "EXPLORER_URL");
}

export function getEtherScanApiKey(chainId: number): string {
  return getContractAddress(chainId, "ETHERSCAN_API_KEY");
}

export function getBlockscoutApiUrl(chainId: number): string {
  return getContractAddress(chainId, "BLOCKSCOUT_API_URL");
}

export function getEtherScanApiUrl(chainId: number): string {
  return getContractAddress(chainId, "ETHERSCAN_API_URL");
}

export function getSafeWalletFactoryAddress(chainId: number): string {
  return getContractAddress(chainId, "SAFE_WALLET_FACTORY_ADDRESS");
}

export function getSafeModuleAddress(chainId: number): string {
  return getContractAddress(chainId, "SAFE_MODULE_ADDRESS");
}

export function getSafeMultiSendCallOnlyAddress(chainId: number): string {
  return getContractAddress(chainId, "SAFE_MULTISEND_CALL_ONLY_ADDRESS");
}

export function getAavePoolAddress(chainId: number): string {
  return getContractAddress(chainId, "AAVE_POOL_ADDRESS");
}

export function getWethAddress(chainId: number): string {
  return getContractAddress(chainId, "WETH_ADDRESS");
}
