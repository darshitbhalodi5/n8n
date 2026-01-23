/**
 * Blocks Module
 * Centralized export for all blocks, categories, and utilities
 */

import type {
  BlockDefinition,
  CategoryDefinition,
  IconRegistry,
} from "./types";
import { socialBlocks } from "./social/social-blocks";
import { walletBlocks } from "./wallet/wallet-blocks";
import { triggerBlocks, startBlock } from "./triggers/triggers";
import { controlBlocks } from "./control/control-blocks";
import { defiBlocks } from "./defi/defi-blocks";
import { oracleBlocks } from "./oracle/oracle-blocks";
import { aiBlocks } from "./ai/ai-blocks";
import {
  Share2,
  Play,
  GitBranch,
  Wallet,
  ArrowRightLeft,
  Eye,
  TrendingUp,
  ArrowLeftRight,
  LineChart,
  Droplets,
  Layers,
  DollarSign,
  Gamepad2,
  Vote,
  BarChart3,
  Shield,
  Clock,
  BrainCircuit,
} from "lucide-react";
import {
  // Existing logos
  TelegramLogo,
  MailLogo,
  WalletLogo,
  SlackLogo,
  StartLogo,
  IfElseLogo,
  SwitchLogo,
  UniswapLogo,
  RelayLogo,
  OneInchLogo,
  AaveLogo,
  CompoundLogo,
  // Coming Soon - Oracle
  ChainlinkLogo,
  PythLogo,
  // Coming Soon - Yield
  YearnLogo,
  BeefyLogo,
  // Coming Soon - Bridges
  StargateLogo,
  AcrossLogo,
  // Coming Soon - Perpetuals
  GMXLogo,
  HyperliquidLogo,
  OstiumLogo,
  // Coming Soon - Liquidity
  CamelotLogo,
  GammaLogo,
  // Coming Soon - Staking
  LidoLogo,
  PendleLogo,
  // Coming Soon - Stablecoins
  FraxLogo,
  RadiantLogo,
  // Coming Soon - Gaming
  TreasureLogo,
  OpenSeaLogo,
  // Coming Soon - Governance
  SnapshotLogo,
  TallyLogo,
  // Coming Soon - Analytics
  DefiLlamaLogo,
  ZapperLogo,
  // Coming Soon - Insurance
  NexusMutualLogo,
  InsurAceLogo,
  QwenLogo,
  GLMLogo,
  DeepSeekLogo,
  ChatGPTLogo,
} from "./logos/logos";

// Re-export types
export type { BlockDefinition, CategoryDefinition, IconRegistry };

// Re-export startBlock for initial node setup
export { startBlock };

export {
  MAX_SWITCH_CASES,
  createDefaultCase,
  createNewCase,
  type SwitchCaseData,
} from "./control/control-blocks";

// Re-export Coming Soon module
export * from "./coming-soon/coming-soon";

// Icon registry - maps icon names to actual components (logos and icons)
export const iconRegistry: IconRegistry = {
  // Existing logos
  TelegramLogo,
  MailLogo,
  WalletLogo,
  SlackLogo,
  StartLogo,
  IfElseLogo,
  SwitchLogo,
  UniswapLogo,
  RelayLogo,
  OneInchLogo,
  AaveLogo,
  CompoundLogo,

  // Coming Soon - Oracle
  ChainlinkLogo,
  PythLogo,

  // Coming Soon - Yield
  YearnLogo,
  BeefyLogo,

  // Coming Soon - Bridges
  StargateLogo,
  AcrossLogo,

  // Coming Soon - Perpetuals
  GMXLogo,
  HyperliquidLogo,
  OstiumLogo,

  // Coming Soon - Liquidity
  CamelotLogo,
  GammaLogo,

  // Coming Soon - Staking
  LidoLogo,
  PendleLogo,

  // Coming Soon - Stablecoins
  FraxLogo,
  RadiantLogo,

  // Coming Soon - Gaming
  TreasureLogo,
  OpenSeaLogo,

  // Coming Soon - Governance
  SnapshotLogo,
  TallyLogo,

  // Coming Soon - Analytics
  DefiLlamaLogo,
  ZapperLogo,

  // Coming Soon - Insurance
  NexusMutualLogo,
  InsurAceLogo,

  // Category icons (Lucide)
  Share2, // Social category icon
  Play, // Triggers category icon
  GitBranch, // Control category icon
  Wallet, // Wallet category icon
  ArrowRightLeft, // DeFi category
  BrainCircuit, // AI category icon
  QwenLogo,
  GLMLogo,
  DeepSeekLogo,
  ChatGPTLogo,

  // Coming Soon category icons
  Eye, // Oracle
  TrendingUp, // Yield
  ArrowLeftRight, // Bridges
  LineChart, // Perpetuals
  Droplets, // Liquidity
  Layers, // Staking
  DollarSign, // Stablecoins
  Gamepad2, // Gaming
  Vote, // Governance
  BarChart3, // Analytics
  Shield, // Insurance
  Clock, // Coming Soon main
};


/**
 * All block categories
 * Add new categories here as they are created
 * Note: Triggers category is internal-only (Start block is default and not user-addable)
 */
export const blockCategories: CategoryDefinition[] = [
  {
    id: "control",
    label: "Control",
    iconName: "GitBranch",
    blocks: controlBlocks,
  },
  {
    id: "ai",
    label: "AI",
    iconName: "BrainCircuit",
    blocks: aiBlocks,
  },
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
  {
    id: "defi",
    label: "DeFi",
    iconName: "ArrowRightLeft",
    blocks: defiBlocks,
  },
  {
    id: "oracle",
    label: "Oracle",
    iconName: "Eye",
    blocks: oracleBlocks,
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
export function getBlockByNodeType(
  nodeType: string
): BlockDefinition | undefined {
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
export function getCategoryById(
  categoryId: string
): CategoryDefinition | undefined {
  return blockCategories.find((cat) => cat.id === categoryId);
}
