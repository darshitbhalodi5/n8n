/**
 * API Types and Error Definitions
 * Centralized API response types and error handling
 */

// Standard API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// API Error structure
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

// Error codes for typed error handling
export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN";

// Map HTTP status to error code
export function getErrorCodeFromStatus(status: number): ApiErrorCode {
  switch (status) {
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "VALIDATION_ERROR";
    case 429:
      return "RATE_LIMITED";
    case 500:
    case 502:
    case 503:
      return "INTERNAL_ERROR";
    default:
      return "UNKNOWN";
  }
}

// Create a typed API error from response
export async function createApiError(response: Response): Promise<ApiError> {
  const code = getErrorCodeFromStatus(response.status);

  try {
    const data = await response.json();
    return {
      code,
      message:
        data.error?.message ||
        data.message ||
        `Request failed with status ${response.status}`,
      details: data.error?.details || data.details,
    };
  } catch {
    return {
      code,
      message: `Request failed with status ${response.status}`,
    };
  }
}

// User-friendly error messages
export function getUserFriendlyErrorMessage(error: ApiError): string {
  switch (error.code) {
    case "UNAUTHORIZED":
      return "Please log in to continue.";
    case "FORBIDDEN":
      return "You don't have permission to perform this action.";
    case "NOT_FOUND":
      return "The requested resource was not found.";
    case "RATE_LIMITED":
      return "Too many requests. Please wait a moment and try again.";
    case "VALIDATION_ERROR":
      return error.message || "Please check your input and try again.";
    case "NETWORK_ERROR":
      return "Network error. Please check your connection.";
    case "TIMEOUT":
      return "Request timed out. Please try again.";
    case "INTERNAL_ERROR":
      return "Something went wrong on our end. Please try again later.";
    default:
      return error.message || "An unexpected error occurred.";
  }
}

// Retry configuration
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryableErrors: ApiErrorCode[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  retryableErrors: [
    "RATE_LIMITED",
    "INTERNAL_ERROR",
    "NETWORK_ERROR",
    "TIMEOUT",
  ],
};

// Calculate exponential backoff delay
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const delay = Math.min(
    config.baseDelayMs * Math.pow(2, attempt),
    config.maxDelayMs
  );
  // Add jitter (±20%)
  const jitter = delay * 0.2 * (Math.random() - 0.5);
  return Math.round(delay + jitter);
}
