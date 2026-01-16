/**
 * API Error Handler Utilities
 * 
 * Provides helper functions and components for handling API errors
 * including rate limiting and validation errors.
 */

import { ApiError } from "./workflow-api";

/**
 * Error types that can be returned by the API
 */
export type ApiErrorCode =
    | "RATE_LIMIT_EXCEEDED"
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "NOT_FOUND"
    | "NETWORK_ERROR"
    | "INTERNAL_ERROR"
    | string;

/**
 * Check if an error is a rate limit error
 */
export function isRateLimitError(error: ApiError | null | undefined): boolean {
    return error?.code === "RATE_LIMIT_EXCEEDED";
}

/**
 * Check if an error is a validation error
 */
export function isValidationError(error: ApiError | null | undefined): boolean {
    return error?.code === "VALIDATION_ERROR";
}

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: ApiError | null | undefined): boolean {
    return error?.code === "UNAUTHORIZED";
}

/**
 * Get retry time from rate limit error
 * @returns Time in seconds until rate limit resets, or null if not a rate limit error
 */
export function getRetryAfterSeconds(error: ApiError | null | undefined): number | null {
    if (!isRateLimitError(error) || !error?.retryAfter) {
        return null;
    }
    return Math.ceil(error.retryAfter / 1000);
}

/**
 * Get validation error details as a formatted string
 */
export function getValidationErrorSummary(error: ApiError | null | undefined): string {
    if (!isValidationError(error)) {
        return error?.message || "Unknown error";
    }

    if (!error?.details || error.details.length === 0) {
        return error?.message || "Validation failed";
    }

    return error.details.map(d => `${d.field}: ${d.message}`).join("; ");
}

/**
 * Get validation errors as a map of field -> message
 * Useful for highlighting form fields with errors
 */
export function getValidationErrorsByField(
    error: ApiError | null | undefined
): Record<string, string> {
    if (!isValidationError(error) || !error?.details) {
        return {};
    }

    const errors: Record<string, string> = {};
    for (const detail of error.details) {
        errors[detail.field] = detail.message;
    }
    return errors;
}

/**
 * Get a user-friendly error message
 */
export function getErrorMessage(error: ApiError | null | undefined): string {
    if (!error) {
        return "An unknown error occurred";
    }

    // Handle specific error codes with better messages
    switch (error.code) {
        case "RATE_LIMIT_EXCEEDED":
            const retryAfter = getRetryAfterSeconds(error);
            if (retryAfter) {
                return `Rate limit exceeded. Please try again in ${retryAfter} seconds.`;
            }
            return "Rate limit exceeded. Please try again later.";

        case "VALIDATION_ERROR":
            return getValidationErrorSummary(error);

        case "UNAUTHORIZED":
            return "You are not authorized to perform this action. Please log in again.";

        case "NOT_FOUND":
            return "The requested resource was not found.";

        case "NETWORK_ERROR":
            return "Network error. Please check your connection and try again.";

        default:
            return error.message || "An error occurred";
    }
}

/**
 * Hook-friendly error state object
 */
export interface ErrorState {
    hasError: boolean;
    message: string;
    code: ApiErrorCode | null;
    isRateLimit: boolean;
    isValidation: boolean;
    isAuth: boolean;
    retryAfterSeconds: number | null;
    fieldErrors: Record<string, string>;
}

/**
 * Create an error state object from an ApiError
 */
export function createErrorState(error: ApiError | null | undefined): ErrorState {
    if (!error) {
        return {
            hasError: false,
            message: "",
            code: null,
            isRateLimit: false,
            isValidation: false,
            isAuth: false,
            retryAfterSeconds: null,
            fieldErrors: {},
        };
    }

    return {
        hasError: true,
        message: getErrorMessage(error),
        code: error.code || null,
        isRateLimit: isRateLimitError(error),
        isValidation: isValidationError(error),
        isAuth: isAuthError(error),
        retryAfterSeconds: getRetryAfterSeconds(error),
        fieldErrors: getValidationErrorsByField(error),
    };
}
