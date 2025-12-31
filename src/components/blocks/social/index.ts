/**
 * Social Category Blocks
 * Export all blocks in the social category
 */
export { telegramBlock } from "./telegram";
export { mailBlock } from "./mail";
export { sendMessageBlock } from "./send-message";

import { telegramBlock } from "./telegram";
import { mailBlock } from "./mail";
import { sendMessageBlock } from "./send-message";
import type { BlockDefinition } from "../types";

/**
 * All blocks in the social category
 */
export const socialBlocks: BlockDefinition[] = [
  telegramBlock,
  mailBlock,
  sendMessageBlock,
];

