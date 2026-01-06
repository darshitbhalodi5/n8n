/**
 * Node Types Configuration
 * Centralized node type registry for React Flow
 * 
 * IMPORTANT: Components are defined as stable references outside any
 * React component to prevent recreation on renders. This is critical
 * for React Flow performance.
 */

import React from 'react';
import { Position, NodeTypes } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { BaseNode } from './nodes/BaseNode';
import { WalletNode } from './nodes/WalletNode';

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
BaseNodeWrapper.displayName = 'BaseNodeWrapper';

// Wallet node wrapper - specialized for wallet nodes
const WalletNodeWrapper: React.FC<NodeProps> = (props) => (
    <WalletNode {...props} {...DEFAULT_HANDLE_CONFIG} />
);
WalletNodeWrapper.displayName = 'WalletNodeWrapper';

/**
 * Node type registry
 * Maps node type strings to React components
 * 
 * CRITICAL: This object must have stable references. Adding new node types
 * here will NOT cause re-renders because this is defined at module level.
 * 
 * To add a new node type:
 * 1. Create the component in ./nodes/
 * 2. Create a wrapper function above
 * 3. Add the mapping below
 */
export const nodeTypes: NodeTypes = {
    // Generic base node
    base: BaseNodeWrapper,

    // Social/messaging nodes (all use base node for now)
    telegram: BaseNodeWrapper,
    mail: BaseNodeWrapper,
    slack: BaseNodeWrapper,

    // Wallet node (specialized)
    'wallet-node': WalletNodeWrapper,
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
