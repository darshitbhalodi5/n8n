/**
 * Oracle Category Blocks
 * Export all blocks in the Oracle category
 */
export { chainlinkBlock, pythBlock } from "./oracle";

import { chainlinkBlock, pythBlock } from "./oracle";
import type { BlockDefinition } from "../types";

/**
 * All blocks in the Oracle category
 */
export const oracleBlocks: BlockDefinition[] = [
    chainlinkBlock,
    pythBlock,
];

