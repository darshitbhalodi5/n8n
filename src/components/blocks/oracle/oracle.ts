import type { BlockDefinition } from "../types";
import { OracleProvider, OracleChain } from "@/types/oracle";

/**
 * Chainlink Oracle Block Definition
 * Allows users to fetch price data and other oracle services from Chainlink
 */
export const chainlinkBlock: BlockDefinition = {
    id: "chainlink",
    label: "Chainlink",
    iconName: "ChainlinkLogo",
    description: "Industry-standard price feeds, VRF, and automation",
    category: "oracle",
    nodeType: "chainlink",
    defaultData: {
        label: "Chainlink Oracle",
        description: "Fetch price data from Chainlink",
        status: "idle" as const,
        // Oracle configuration
        oracleProvider: OracleProvider.CHAINLINK,
        oracleChain: OracleChain.ARBITRUM_SEPOLIA,
        // Chainlink specific
        aggregatorAddress: "",
        selectedPriceFeed: "",
        // Optional configuration
        staleAfterSeconds: undefined,
        outputMapping: {},
        // Output data
        priceData: "",
        formattedPrice: "",
        timestamp: "",
        decimals: undefined,
        // Execution settings
        simulateFirst: true,
        lastFetchedAt: "",
    },
};

/**
 * Pyth Network Oracle Block Definition
 * Allows users to fetch low-latency price data from Pyth Network
 */
export const pythBlock: BlockDefinition = {
    id: "pyth",
    label: "Pyth Network",
    iconName: "PythLogo",
    description: "Low-latency price oracles for DeFi",
    category: "oracle",
    nodeType: "pyth",
    defaultData: {
        label: "Pyth Oracle",
        description: "Fetch price data from Pyth Network",
        status: "idle" as const,
        // Oracle configuration
        oracleProvider: OracleProvider.PYTH,
        oracleChain: OracleChain.ARBITRUM_SEPOLIA,
        // Pyth specific
        priceFeedId: "",
        selectedPriceFeed: "",
        // Optional configuration
        staleAfterSeconds: undefined,
        outputMapping: {},
        // Output data
        priceData: "",
        formattedPrice: "",
        confidence: "",
        timestamp: "",
        // Execution settings
        simulateFirst: true,
        lastFetchedAt: "",
    },
};

