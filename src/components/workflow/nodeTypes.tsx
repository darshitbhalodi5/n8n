/**
 * Node Types Configuration
 * Centralized node type registry for React Flow
 */

import React from "react";
import { Position, NodeTypes } from "reactflow";
import type { NodeProps } from "reactflow";
import { BaseNode } from "./nodes/BaseNode";
import { WalletNode } from "./nodes/WalletNode";
import { StartNode } from "./nodes/StartNode";
import { IfNode } from "./nodes/IfNode";
import { SwitchNode } from "./nodes/SwitchNode";

/**
 * Default configuration for node handles
 */
export const DEFAULT_HANDLE_CONFIG = {
  showHandles: true,
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
} as const;

/**
 * Stable node wrapper components
 * Defined as named functions with displayName for React DevTools
 * These are created once at module load time, not on each render
 */

// Base node wrapper - used for most node types
const BaseNodeWrapper: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} {...DEFAULT_HANDLE_CONFIG} />
);
BaseNodeWrapper.displayName = "BaseNodeWrapper";

// Wallet node wrapper - specialized for wallet nodes
const WalletNodeWrapper: React.FC<NodeProps> = (props) => (
  <WalletNode {...props} {...DEFAULT_HANDLE_CONFIG} />
);
WalletNodeWrapper.displayName = "WalletNodeWrapper";

// Start node wrapper - specialized for the workflow start point
const StartNodeWrapper: React.FC<NodeProps> = (props) => (
  <StartNode {...props} sourcePosition={Position.Right} />
);
StartNodeWrapper.displayName = "StartNodeWrapper";

// If node wrapper - specialized for conditional branching
const IfNodeWrapper: React.FC<NodeProps> = (props) => (
  <IfNode {...props} {...DEFAULT_HANDLE_CONFIG} />
);
IfNodeWrapper.displayName = "IfNodeWrapper";

// Switch node wrapper - specialized for multi-branch routing
const SwitchNodeWrapper: React.FC<NodeProps> = (props) => (
  <SwitchNode {...props} {...DEFAULT_HANDLE_CONFIG} />
);
SwitchNodeWrapper.displayName = "SwitchNodeWrapper";

/**
 * Node type registry
 * Maps node type strings to React components
 *
 * To add a new node type:
 * 1. Create the component in ./nodes/
 * 2. Create a wrapper function above
 * 3. Add the mapping below
 */
export const nodeTypes: NodeTypes = {
  // Start node - workflow entry point (special shape)
  start: StartNodeWrapper,

  // Generic base node
  base: BaseNodeWrapper,

  // Control flow nodes
  if: IfNodeWrapper,
  switch: SwitchNodeWrapper,

  // Social/messaging nodes (all use base node for now)
  telegram: BaseNodeWrapper,
  mail: BaseNodeWrapper,
  slack: BaseNodeWrapper,

  // DeFi / swap nodes (Uniswap, Relay, 1inch) - use base node visuals
  uniswap: BaseNodeWrapper,
  relay: BaseNodeWrapper,
  oneinch: BaseNodeWrapper,

  // DeFi / lending nodes (Aave, Compound) - use base node visuals
  aave: BaseNodeWrapper,
  compound: BaseNodeWrapper,

  // AI Transform node - use base node visuals
  "ai-transform": BaseNodeWrapper,

  // Wallet node (specialized)
  "wallet-node": WalletNodeWrapper,
};

/**
 * List of available node type keys
 * Useful for validation and type guards
 */
export const NODE_TYPE_KEYS = Object.keys(nodeTypes);

/**
 * Type guard to check if a string is a valid node type
 */
export function isValidNodeType(type: string): boolean {
  return NODE_TYPE_KEYS.includes(type);
}
