import type { BlockDefinition } from "../types";

/**
 * Wallet Block Definition
 * Allows users to connect their wallet and manage Safe wallets
 */
export const walletBlock: BlockDefinition = {
  id: "wallet",
  label: "Wallet",
  iconName: "WalletLogo",
  description: "Connect wallet and manage Safe",
  category: "wallet",
  nodeType: "wallet-node",
  defaultData: {
    label: "Wallet",
    description: "Connect wallet and manage Safe",
    status: "idle",
  },
};

