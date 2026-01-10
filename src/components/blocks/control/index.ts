/**
 * Control Category Blocks
 * Export all blocks in the control category (If/Else, Switch, etc.)
 */
export { ifBlock } from "./if";

import { ifBlock } from "./if";
import type { BlockDefinition } from "../types";

/**
 * All blocks in the control category
 */
export const controlBlocks: BlockDefinition[] = [ifBlock];

