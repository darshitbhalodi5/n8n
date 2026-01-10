/**
 * Type Definitions
 * Centralized export for all type definitions
 */

// Integration-specific types (connections, channels, etc.)
export type {
  SlackConnection,
  SlackChannel,
  SlackNotification,
  SlackLoadingState,
  ConnectionType,
  SlackConnectionsResponse,
  SlackChannelsResponse,
  SlackAuthUrlResponse,
} from "./slack";

export type {
  TelegramBotInfo,
  TelegramConnection,
  TelegramChat,
  TelegramNotification,
  TelegramLoadingState,
} from "./telegram";

export type { EmailNotification, EmailLoadingState } from "./email";

// Node data types (canonical definitions with type guards)
export type {
  BaseNodeData,
  NodeStatus,
  SlackNodeData,
  TelegramNodeData,
  EmailNodeData,
  IfNodeData,
  ConditionOperator,
  SwitchNodeData,
  WalletNodeData,
  StartNodeData,
  WorkflowNodeData,
} from "./node-data";

export {
  isSlackNodeData,
  isTelegramNodeData,
  isEmailNodeData,
  isIfNodeData,
  isSwitchNodeData,
} from "./node-data";

// API types
export type { ApiResponse, ApiError, ApiErrorCode, RetryConfig } from "./api";

export {
  getErrorCodeFromStatus,
  createApiError,
  getUserFriendlyErrorMessage,
  calculateBackoffDelay,
  DEFAULT_RETRY_CONFIG,
} from "./api";
