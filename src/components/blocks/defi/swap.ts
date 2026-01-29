import type { BlockDefinition } from "../types";
import {
    SwapProvider,
    SupportedChain,
    SwapType,
} from "@/types/swap";

/**
 * Uniswap Swap Block Definition
 * Allows users to perform token swaps via Uniswap
 */
export const uniswapBlock: BlockDefinition = {
    id: "uniswap",
    label: "Uniswap",
    iconName: "UniswapLogo",
    description: "Swap tokens via Uniswap DEX",
    category: "defi",
    nodeType: "uniswap",
    defaultData: {
        label: "Uniswap Swap",
        description: "Swap tokens via Uniswap",
        status: "idle" as const,
        // Fixed provider for this block
        swapProvider: SwapProvider.UNISWAP,
        swapChain: SupportedChain.ARBITRUM,
        swapType: SwapType.EXACT_INPUT,
        // Source token
        sourceTokenAddress: "",
        sourceTokenSymbol: "",
        sourceTokenDecimals: 18,
        // Destination token
        destinationTokenAddress: "",
        destinationTokenSymbol: "",
        destinationTokenDecimals: 18,
        // Amount and settings
        swapAmount: "",
        // slippageTolerance removed - backend uses default 0.5%
        simulateFirst: true,
        autoRetryOnFailure: true,
        maxRetries: 3,
        // Wallet address (will be populated from connected wallet)
        walletAddress: "",
        // Quote data (populated after getting a quote)
        hasQuote: false,
        quoteAmountOut: "",
        quotePriceImpact: "",
        quoteGasEstimate: "",
    },
};

/**
 * Relay Swap Block Definition
 * Allows users to perform cross-chain swaps via Relay
 */
export const relayBlock: BlockDefinition = {
    id: "relay",
    label: "Relay",
    iconName: "RelayLogo",
    description: "Cross-chain swaps via Relay",
    category: "defi",
    nodeType: "relay",
    defaultData: {
        label: "Relay Swap",
        description: "Cross-chain swap via Relay",
        status: "idle" as const,
        // Fixed provider for this block
        swapProvider: SwapProvider.RELAY,
        swapChain: SupportedChain.ARBITRUM,
        swapType: SwapType.EXACT_INPUT,
        // Source token
        sourceTokenAddress: "",
        sourceTokenSymbol: "",
        sourceTokenDecimals: 18,
        // Destination token
        destinationTokenAddress: "",
        destinationTokenSymbol: "",
        destinationTokenDecimals: 18,
        // Amount and settings
        swapAmount: "",
        // slippageTolerance removed - backend uses default 0.5%
        simulateFirst: true,
        autoRetryOnFailure: true,
        maxRetries: 3,
        // Wallet address (will be populated from connected wallet)
        walletAddress: "",
        // Quote data (populated after getting a quote)
        hasQuote: false,
        quoteAmountOut: "",
        quotePriceImpact: "",
        quoteGasEstimate: "",
    },
};

/**
 * 1inch Swap Block Definition
 * Allows users to perform token swaps via 1inch aggregator
 */
export const oneInchBlock: BlockDefinition = {
    id: "oneinch",
    label: "1inch",
    iconName: "OneInchLogo",
    description: "Swap tokens via 1inch aggregator",
    category: "defi",
    nodeType: "oneinch",
    defaultData: {
        label: "1inch Swap",
        description: "Swap tokens via 1inch",
        status: "idle" as const,
        // Fixed provider for this block
        swapProvider: SwapProvider.ONEINCH,
        swapChain: SupportedChain.ARBITRUM,
        swapType: SwapType.EXACT_INPUT,
        // Source token
        sourceTokenAddress: "",
        sourceTokenSymbol: "",
        sourceTokenDecimals: 18,
        // Destination token
        destinationTokenAddress: "",
        destinationTokenSymbol: "",
        destinationTokenDecimals: 18,
        // Amount and settings
        swapAmount: "",
        // slippageTolerance removed - backend uses default 0.5%
        simulateFirst: true,
        autoRetryOnFailure: true,
        maxRetries: 3,
        // Wallet address (will be populated from connected wallet)
        walletAddress: "",
        // Quote data (populated after getting a quote)
        hasQuote: false,
        quoteAmountOut: "",
        quotePriceImpact: "",
        quoteGasEstimate: "",
    },
};

/**
 * LI.FI Swap Block Definition
 * Allows users to perform swaps via LI.FI DEX aggregator
 */
export const lifiBlock: BlockDefinition = {
    id: "lifi",
    label: "LI.FI",
    iconName: "LiFiLogo",
    description: "DEX aggregator for optimal swap routes",
    category: "defi",
    nodeType: "lifi",
    defaultData: {
        label: "LI.FI Swap",
        description: "Swap via LI.FI aggregator",
        status: "idle" as const,
        // Fixed provider for this block
        swapProvider: SwapProvider.LIFI,
        swapChain: SupportedChain.ARBITRUM,
        swapType: SwapType.EXACT_INPUT,
        // Source token
        sourceTokenAddress: "",
        sourceTokenSymbol: "",
        sourceTokenDecimals: 18,
        // Destination token
        destinationTokenAddress: "",
        destinationTokenSymbol: "",
        destinationTokenDecimals: 18,
        // Amount and settings
        swapAmount: "",
        simulateFirst: true,
        autoRetryOnFailure: true,
        maxRetries: 3,
        // Wallet address (will be populated from connected wallet)
        walletAddress: "",
        // Quote data (populated after getting a quote)
        hasQuote: false,
        quoteAmountOut: "",
        quotePriceImpact: "",
        quoteGasEstimate: "",
    },
};
