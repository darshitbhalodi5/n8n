import type { LucideIcon } from "lucide-react";

/**
 * Base interface for all block definitions
 */
export interface BlockDefinition {
  id: string;
  label: string;
  iconName: string;
  description?: string;
  category: string;
  nodeType?: string;
  defaultData?: Record<string, unknown>;
}

/**
 * Category definition interface
 */
export interface CategoryDefinition {
  id: string;
  label: string;
  iconName?: string;
  blocks: BlockDefinition[];
}

/**
 * Icon registry type
 */
export type IconRegistry = Record<string, LucideIcon>;

