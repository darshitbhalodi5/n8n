/**
 * Oracle Category - Coming Soon
 * Data Feeds & Off-chain Data providers
 */

import type { ComingSoonBlockDefinition } from "./types";

export const chainlinkBlock: ComingSoonBlockDefinition = {
    id: "chainlink",
    label: "Chainlink",
    iconName: "ChainlinkLogo",
    description: "Industry-standard price feeds, VRF, and automation",
    category: "oracle",
    isComingSoon: true,
    protocolUrl: "https://chain.link",
    automationCapabilities: [
        "Trigger workflows when price hits threshold",
        "Fetch real-time token prices for swaps",
        "Generate verifiable random numbers for gaming/NFTs",
        "Automated keeper functions",
    ],
};

export const pythBlock: ComingSoonBlockDefinition = {
    id: "pyth",
    label: "Pyth Network",
    iconName: "PythLogo",
    description: "Low-latency price oracles for DeFi",
    category: "oracle",
    isComingSoon: true,
    protocolUrl: "https://pyth.network",
    automationCapabilities: [
        "High-frequency price updates",
        "Sub-second latency for trading bots",
        "Cross-chain price consistency",
        "Confidence interval monitoring",
    ],
};

export const oracleBlocks: ComingSoonBlockDefinition[] = [
    chainlinkBlock,
    pythBlock,
];
