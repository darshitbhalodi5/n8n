/**
 * Blocks Module
 * Centralized export for all blocks, categories, and utilities
 */

import type { BlockDefinition, CategoryDefinition, IconRegistry } from "./types";
import { socialBlocks } from "./social";
import { walletBlocks } from "./wallet";
import { triggerBlocks, startBlock } from "./triggers";
import { Share2, Play } from "lucide-react";
import {
  TelegramLogo,
  MailLogo,
  WalletLogo,
  SlackLogo,
  StartLogo,
} from "./logos";

// Re-export types
export type { BlockDefinition, CategoryDefinition, IconRegistry };

// Re-export startBlock for initial node setup
export { startBlock };

// Icon registry - maps icon names to actual components (logos and icons)
export const iconRegistry: IconRegistry = {
  TelegramLogo,
  MailLogo,
  WalletLogo,
  SlackLogo,
  StartLogo,
  Share2, // Keep for category icon
  Play,   // For triggers category
};

/**
 * All block categories
 * Add new categories here as they are created
 * Note: Triggers category is internal-only (Start block is default and not user-addable)
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
  // Note: triggers category intentionally excluded from sidebar
  // Start block is auto-added and cannot be manually placed
];

/**
 * Internal categories (not shown in sidebar)
 */
export const internalCategories: CategoryDefinition[] = [
  {
    id: "triggers",
    label: "Triggers",
    iconName: "Play",
    blocks: triggerBlocks,
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
 * Get block definition by ID (includes internal blocks like Start)
 */
export function getBlockById(blockId: string): BlockDefinition | undefined {
  // Check regular categories first
  const regularBlock = blockCategories
    .flatMap((category) => category.blocks)
    .find((block) => block.id === blockId);

  if (regularBlock) return regularBlock;

  // Check internal categories (for Start block, etc.)
  return internalCategories
    .flatMap((category) => category.blocks)
    .find((block) => block.id === blockId);
}

/**
 * Get block definition by node type (includes internal blocks)
 */
export function getBlockByNodeType(nodeType: string): BlockDefinition | undefined {
  // Check regular categories first
  const regularBlock = blockCategories
    .flatMap((category) => category.blocks)
    .find((block) => block.nodeType === nodeType);

  if (regularBlock) return regularBlock;

  // Check internal categories
  return internalCategories
    .flatMap((category) => category.blocks)
    .find((block) => block.nodeType === nodeType);
}

/**
 * Get category definition by ID
 */
export function getCategoryById(categoryId: string): CategoryDefinition | undefined {
  return blockCategories.find((cat) => cat.id === categoryId);
}

