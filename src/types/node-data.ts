/**
 * Node Data Type Definitions
 * Properly typed interfaces for all node configurations
 */

import type { SwitchCaseData } from "@/components/blocks";

// Base node data shared by all nodes
export interface BaseNodeData {
  label: string;
  description?: string;
  /** Icon name from iconRegistry - serializable */
  iconName?: string;
  status?: NodeStatus;
  blockId?: string;
}

export type NodeStatus = "idle" | "running" | "success" | "error";

// Slack Node Data
export interface SlackNodeData extends BaseNodeData {
  slackConnectionId?: string;
  slackConnectionType?: "webhook" | "oauth";
  slackConnectionName?: string;
  slackTeamName?: string;
  slackChannelId?: string;
  slackChannelName?: string;
  slackMessage?: string;
}

// Telegram Node Data
export interface TelegramNodeData extends BaseNodeData {
  telegramConnectionId?: string;
  telegramChatId?: string;
  telegramChatTitle?: string;
  telegramMessage?: string;
}

// Email Node Data
export interface EmailNodeData extends BaseNodeData {
  emailTo?: string;
  emailSubject?: string;
  emailBody?: string;
}

// If/Condition Node Data
export interface IfNodeData extends BaseNodeData {
  leftPath?: string;
  operator?: ConditionOperator;
  rightValue?: string;
}

export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "isEmpty"
  | "regex";

// Switch Node Data
export interface SwitchNodeData extends BaseNodeData {
  valuePath?: string;
  cases?: SwitchCaseData[];
}

// Wallet Node Data
export interface WalletNodeData extends BaseNodeData {
  walletAddress?: string;
  safeAddress?: string;
  moduleEnabled?: boolean;
}

// Start Node Data (type alias since it has no additional fields)
export type StartNodeData = BaseNodeData;

// Swap Node Data (for Uniswap, Relay, 1inch blocks)
export interface SwapNodeData extends BaseNodeData {
  swapProvider?: "UNISWAP" | "RELAY" | "ONEINCH";
  swapChain?: "ARBITRUM" | "ARBITRUM_SEPOLIA";
  swapType?: "EXACT_INPUT" | "EXACT_OUTPUT";
  sourceTokenAddress?: string;
  sourceTokenSymbol?: string;
  sourceTokenDecimals?: number;
  destinationTokenAddress?: string;
  destinationTokenSymbol?: string;
  destinationTokenDecimals?: number;
  swapAmount?: string;
  walletAddress?: string;
  simulateFirst?: boolean;
  autoRetryOnFailure?: boolean;
  maxRetries?: number;
  hasQuote?: boolean;
  quoteAmountOut?: string;
  quotePriceImpact?: string;
  quoteGasEstimate?: string;
  lastTxHash?: string;
  lastExecutedAt?: string;
}

// Discriminated union for all node types
export type WorkflowNodeData =
  | ({ nodeType: "slack" } & SlackNodeData)
  | ({ nodeType: "telegram" } & TelegramNodeData)
  | ({ nodeType: "mail" } & EmailNodeData)
  | ({ nodeType: "if" } & IfNodeData)
  | ({ nodeType: "switch" } & SwitchNodeData)
  | ({ nodeType: "wallet-node" } & WalletNodeData)
  | ({ nodeType: "start" } & StartNodeData)
  | ({ nodeType: "uniswap" } & SwapNodeData)
  | ({ nodeType: "relay" } & SwapNodeData)
  | ({ nodeType: "oneinch" } & SwapNodeData)
  | ({ nodeType: "base" } & BaseNodeData);

// Type guard functions
export function isSlackNodeData(data: unknown): data is SlackNodeData {
  return (
    typeof data === "object" &&
    data !== null &&
    ("slackConnectionId" in data || "slackMessage" in data)
  );
}

export function isTelegramNodeData(data: unknown): data is TelegramNodeData {
  return (
    typeof data === "object" &&
    data !== null &&
    ("telegramConnectionId" in data || "telegramMessage" in data)
  );
}

export function isEmailNodeData(data: unknown): data is EmailNodeData {
  return (
    typeof data === "object" &&
    data !== null &&
    ("emailTo" in data || "emailSubject" in data || "emailBody" in data)
  );
}

export function isIfNodeData(data: unknown): data is IfNodeData {
  return (
    typeof data === "object" &&
    data !== null &&
    ("leftPath" in data || "operator" in data || "rightValue" in data)
  );
}

export function isSwitchNodeData(data: unknown): data is SwitchNodeData {
  return (
    typeof data === "object" &&
    data !== null &&
    ("valuePath" in data || "cases" in data)
  );
}

export function isSwapNodeData(data: unknown): data is SwapNodeData {
  return (
    typeof data === "object" &&
    data !== null &&
    ("swapProvider" in data || "sourceTokenAddress" in data || "swapAmount" in data)
  );
}
