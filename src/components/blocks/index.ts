/**
 * Blocks Module
 * Centralized export for all blocks, categories, and utilities
 */

import type { BlockDefinition, CategoryDefinition, IconRegistry } from "./types";
import { socialBlocks } from "./social";
import { walletBlocks } from "./wallet";
import { MessageCircle, Mail, Send, Share2, Wallet } from "lucide-react";

// Re-export types
export type { BlockDefinition, CategoryDefinition, IconRegistry };

// Icon registry - maps icon names to actual components
export const iconRegistry: IconRegistry = {
  MessageCircle,
  Mail,
  Send,
  Share2,
  Wallet,
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
 * Get category definition by ID
 */
export function getCategoryById(categoryId: string): CategoryDefinition | undefined {
  return blockCategories.find((cat) => cat.id === categoryId);
}

