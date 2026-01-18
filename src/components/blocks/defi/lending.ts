import type { BlockDefinition } from "../types";
import {
    LendingProvider,
    LendingOperation,
    InterestRateMode,
    SupportedChain,
} from "@/types/lending";

/**
 * Aave Lending Block Definition
 * Allows users to supply, withdraw, borrow, and repay via Aave V3
 * Only available on Arbitrum mainnet
 */
export const aaveBlock: BlockDefinition = {
    id: "aave",
    label: "Aave",
    iconName: "AaveLogo",
    description: "Lending & borrowing via Aave V3",
    category: "defi",
    nodeType: "aave",
    defaultData: {
        label: "Aave Lending",
        description: "Lend or borrow via Aave V3",
        status: "idle" as const,
        // Fixed provider for this block
        lendingProvider: LendingProvider.AAVE,
        lendingChain: SupportedChain.ARBITRUM, // Only Arbitrum mainnet
        lendingOperation: LendingOperation.SUPPLY,
        // Asset configuration
        assetAddress: "",
        assetSymbol: "",
        assetDecimals: 18,
        // Amount
        lendingAmount: "",
        // Interest rate mode (for borrow/repay)
        interestRateMode: InterestRateMode.VARIABLE,
        // Execution settings
        simulateFirst: true,
        // Wallet address (will be populated from connected wallet)
        walletAddress: "",
        // Quote data (populated after getting a quote)
        hasQuote: false,
        quoteSupplyAPY: "",
        quoteBorrowAPY: "",
        quoteGasEstimate: "",
        quoteHealthFactor: "",
        // Position data
        suppliedAmount: "",
        borrowedAmount: "",
        isCollateral: false,
        // Transaction tracking
        lastTxHash: "",
        lastExecutedAt: "",
    },
};

/**
 * Compound Lending Block Definition
 * Allows users to supply, withdraw, borrow, and repay via Compound V3
 * Only available on Arbitrum mainnet
 */
export const compoundBlock: BlockDefinition = {
    id: "compound",
    label: "Compound",
    iconName: "CompoundLogo",
    description: "Lending & borrowing via Compound V3",
    category: "defi",
    nodeType: "compound",
    defaultData: {
        label: "Compound Lending",
        description: "Lend or borrow via Compound V3",
        status: "idle" as const,
        // Fixed provider for this block
        lendingProvider: LendingProvider.COMPOUND,
        lendingChain: SupportedChain.ARBITRUM, // Only Arbitrum mainnet
        lendingOperation: LendingOperation.SUPPLY,
        // Asset configuration
        assetAddress: "",
        assetSymbol: "",
        assetDecimals: 6, // Default to USDC (Compound V3 base asset)
        // Amount
        lendingAmount: "",
        // Interest rate mode (Compound uses variable only)
        interestRateMode: InterestRateMode.VARIABLE,
        // Execution settings
        simulateFirst: true,
        // Wallet address (will be populated from connected wallet)
        walletAddress: "",
        // Quote data (populated after getting a quote)
        hasQuote: false,
        quoteSupplyAPY: "",
        quoteBorrowAPY: "",
        quoteGasEstimate: "",
        quoteHealthFactor: "",
        // Position data
        suppliedAmount: "",
        borrowedAmount: "",
        isCollateral: false,
        // Transaction tracking
        lastTxHash: "",
        lastExecutedAt: "",
    },
};
