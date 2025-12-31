/**
 * Wallet Category Blocks
 * Export all blocks in the wallet category
 */
export { walletBlock } from "./wallet";

import { walletBlock } from "./wallet";
import type { BlockDefinition } from "../types";

/**
 * All blocks in the wallet category
 */
export const walletBlocks: BlockDefinition[] = [walletBlock];

