/**
 * Control Category Blocks
 * Export all blocks in the control category (If/Else, Switch, etc.)
 */
export { ifBlock } from "./if";
export {
  switchBlock,
  createDefaultCase,
  createNewCase,
  MAX_SWITCH_CASES,
  type SwitchCaseData,
} from "./switch";

import { ifBlock } from "./if";
import { switchBlock } from "./switch";
import type { BlockDefinition } from "../types";

/**
 * All blocks in the control category
 */
export const controlBlocks: BlockDefinition[] = [ifBlock, switchBlock];
