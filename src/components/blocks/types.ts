import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

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
 * Icon registry type - accepts both Lucide icons and custom React components
 */
export type IconRegistry = Record<string, LucideIcon | ComponentType<{ className?: string }>>;

