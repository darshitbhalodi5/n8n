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
  SwapNodeData,
  LendingNodeData,
  WorkflowNodeData,
} from "./node-data";

export {
  isSlackNodeData,
  isTelegramNodeData,
  isEmailNodeData,
  isIfNodeData,
  isSwitchNodeData,
  isSwapNodeData,
  isLendingNodeData,
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

// Swap/DeFi types
export type {
  TokenInfo,
  SwapInputConfig,
  SwapNodeConfig,
  SwapQuote,
} from "./swap";

export {
  SupportedChain,
  SwapProvider,
  SwapType,
  ARBITRUM_MAINNET_TOKENS,
  ARBITRUM_SEPOLIA_TOKENS,
  ARBITRUM_TOKENS,
  CUSTOM_TOKEN_OPTION,
  getTokensForChain,
  allowsCustomTokens,
  CHAIN_LABELS,
  PROVIDER_LABELS,
  SWAP_TYPE_LABELS,
  SLIPPAGE_PRESETS,
  DEFAULT_SWAP_CONFIG,
} from "./swap";

// Lending types (Aave, Compound)
export type {
  LendingTokenInfo,
  LendingInputConfig,
  LendingPosition,
  LendingQuote,
  AssetReserveData,
  LendingAccountData,
} from "./lending";

export {
  LendingProvider,
  LendingOperation,
  InterestRateMode,
  AAVE_ARBITRUM_TOKENS,
  COMPOUND_ARBITRUM_TOKENS,
  getTokensForLendingProvider,
  LENDING_PROVIDER_LABELS,
  LENDING_OPERATION_LABELS,
  INTEREST_RATE_MODE_LABELS,
  DEFAULT_LENDING_CONFIG,
} from "./lending";

