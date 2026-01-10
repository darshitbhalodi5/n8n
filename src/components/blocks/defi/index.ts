/**
 * DeFi Category Blocks
 * Export all blocks in the DeFi category
 */
export { uniswapBlock, relayBlock, oneInchBlock } from "./swap";

import { uniswapBlock, relayBlock, oneInchBlock } from "./swap";
import type { BlockDefinition } from "../types";

/**
 * All blocks in the DeFi category
 */
export const defiBlocks: BlockDefinition[] = [
    uniswapBlock,
    relayBlock,
    oneInchBlock,
];
