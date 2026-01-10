/**
 * Triggers Category Blocks
 * Export all blocks in the triggers category (including Start)
 */
import type { BlockDefinition } from "../types";

/**
 * Start Block
 * The entry point of every workflow - always present on canvas
 */
export const startBlock: BlockDefinition = {
  id: "start",
  label: "Start",
  iconName: "StartLogo",
  description: "Workflow starting point",
  category: "triggers",
  nodeType: "start",
  defaultData: {
    label: "Start",
    description: "Workflow entry point",
    status: "idle" as const,
  },
};

/**
 * All blocks in the triggers category
 */
export const triggerBlocks: BlockDefinition[] = [startBlock];
