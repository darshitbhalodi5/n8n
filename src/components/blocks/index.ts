/**
 * Blocks Module
 * Centralized export for all blocks, categories, and utilities
 */

import type { BlockDefinition, CategoryDefinition, IconRegistry } from "./types";
import { socialBlocks } from "./social";
import { walletBlocks } from "./wallet";
import { Share2 } from "lucide-react";
import {
  TelegramLogo,
  MailLogo,
  WalletLogo,
  SlackLogo,
} from "./logos";

// Re-export types
export type { BlockDefinition, CategoryDefinition, IconRegistry };

// Icon registry - maps icon names to actual components (logos and icons)
export const iconRegistry: IconRegistry = {
  TelegramLogo,
  MailLogo,
  WalletLogo,
  SlackLogo,
  Share2, // Keep for category icon
};

/**
 * All block categories
 * Add new categories here as they are created
 */
export const blockCategories: CategoryDefinition[] = [
  {
    id: "social",
    label: "Social",
    iconName: "Share2",
    blocks: socialBlocks,
  },
  {
    id: "wallet",
    label: "Wallet",
    iconName: "Wallet",
    blocks: walletBlocks,
  },
];

/**
 * Get all blocks for a specific category
 */
export function getBlocksByCategory(categoryId: string): BlockDefinition[] {
  const category = blockCategories.find((cat) => cat.id === categoryId);
  return category?.blocks || [];
}

/**
 * Get all blocks (for "All" category)
 */
export function getAllBlocks(): BlockDefinition[] {
  return blockCategories.flatMap((category) => category.blocks);
}

/**
 * Get block definition by ID
 */
export function getBlockById(blockId: string): BlockDefinition | undefined {
  return blockCategories
    .flatMap((category) => category.blocks)
    .find((block) => block.id === blockId);
}

/**
 * Get block definition by node type
 */
export function getBlockByNodeType(nodeType: string): BlockDefinition | undefined {
  return blockCategories
    .flatMap((category) => category.blocks)
    .find((block) => block.nodeType === nodeType);
}

/**
 * Get category definition by ID
 */
export function getCategoryById(categoryId: string): CategoryDefinition | undefined {
  return blockCategories.find((cat) => cat.id === categoryId);
}

