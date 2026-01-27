/**
 * Workflow Constants
 * Centralized constants for workflow-related features
 */

export const WORKFLOW_CONSTANTS = {
    MAX_DESCRIPTION_LENGTH: 250,
    DEFAULT_FETCH_LIMIT: 20,
    SEARCH_DEBOUNCE_MS: 500,
    SKELETON_CARDS_COUNT: 6,
} as const;

export const WORKFLOW_VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list',
} as const;

export type WorkflowViewMode = typeof WORKFLOW_VIEW_MODES[keyof typeof WORKFLOW_VIEW_MODES];

/**
 * Tag mappings for workflow nodes
 * Maps node types to their associated tags
 */
export const TAG_MAPPINGS = {
    // DeFi protocols
    uniswap: ['defi', 'dex', 'swap'],
    aave: ['defi', 'lending'],
    compound: ['defi', 'lending'],
    oneinch: ['defi', 'aggregator'],
    relay: ['defi', 'bridge'],

    // Communication & Notifications
    email: ['notification', 'communication'],
    mail: ['notification', 'communication'],
    slack: ['notification', 'team', 'communication'],
    telegram: ['notification', 'messaging', 'communication'],

    // Logic nodes
    if: ['logic', 'conditional'],
    switch: ['logic', 'conditional'],

    // Wallet operations
    'wallet-node': ['wallet', 'crypto'],
    wallet: ['wallet', 'crypto'],

    // AI & Automation
    'ai-transform': ['ai', 'automation', 'transform'],
} as const;

/**
 * ReactFlow preview configuration
 */
export const PREVIEW_EDGE_OPTIONS = {
    type: "smoothstep",
    animated: true,
    style: {
        stroke: "#ffffff",
        strokeWidth: 1,
    },
} as const;

export const PREVIEW_BACKGROUND_CONFIG = {
    gap: 20,
    size: 2,
    color: "rgba(255, 255, 255, 0.08)",
} as const;
