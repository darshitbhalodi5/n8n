"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  type ApiError,
  createApiError,
  calculateBackoffDelay,
  DEFAULT_RETRY_CONFIG,
  type RetryConfig,
} from "@/types/api";

interface UseAsyncActionState<T> {
  /** Whether the action is currently running */
  isLoading: boolean;
  /** The result data from the last successful action */
  data: T | null;
  /** Error from the last failed action */
  error: ApiError | null;
  /** Whether the action has been executed at least once */
  hasRun: boolean;
}

interface UseAsyncActionReturn<T, Args extends unknown[]>
  extends UseAsyncActionState<T> {
  /** Execute the async action */
  execute: (...args: Args) => Promise<T | null>;
  /** Reset state to initial */
  reset: () => void;
  /** Clear error only */
  clearError: () => void;
}

interface UseAsyncActionOptions {
  /** Retry configuration */
  retry?: Partial<RetryConfig>;
  /** Callback on success */
  onSuccess?: (data: unknown) => void;
  /** Callback on error */
  onError?: (error: ApiError) => void;
  /** Reset data on new execution */
  resetOnExecute?: boolean;
}

/**
 * useAsyncAction - Custom hook for managing async operations with loading, error, and retry states
 *
 * Features:
 * - Automatic loading state management
 * - Typed error handling
 * - Exponential backoff retry for transient failures
 * - Request cancellation on unmount
 * - Success/error callbacks
 */
export function useAsyncAction<T, Args extends unknown[] = []>(
  action: (...args: Args) => Promise<T>,
  options: UseAsyncActionOptions = {}
): UseAsyncActionReturn<T, Args> {
  const { retry = {}, onSuccess, onError, resetOnExecute = false } = options;

  // Memoize retryConfig to prevent it from changing on every render
  const retryConfig = useMemo(
    () => ({ ...DEFAULT_RETRY_CONFIG, ...retry }),
    // Stringify retry to detect deep equality changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(retry)]
  );

  const [state, setState] = useState<UseAsyncActionState<T>>({
    isLoading: false,
    data: null,
    error: null,
    hasRun: false,
  });

  // Track mounted state to prevent state updates after unmount
  const isMountedRef = useRef(true);
  // Track current execution to cancel stale responses
  const executionIdRef = useRef(0);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      const currentExecutionId = ++executionIdRef.current;

      if (resetOnExecute) {
        setState((prev) => ({
          ...prev,
          data: null,
          error: null,
          isLoading: true,
          hasRun: true,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: null,
          isLoading: true,
          hasRun: true,
        }));
      }

      let lastError: ApiError | null = null;
      let attempt = 0;

      while (attempt <= retryConfig.maxRetries) {
        try {
          const result = await action(...args);

          // Check if this execution is still current
          if (executionIdRef.current !== currentExecutionId) {
            return null; // Stale execution, ignore result
          }

          if (isMountedRef.current) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              data: result,
              error: null,
            }));
            onSuccess?.(result);
          }

          return result;
        } catch (err) {
          // Convert error to ApiError
          if (err instanceof Response) {
            lastError = await createApiError(err);
          } else if (err instanceof Error) {
            lastError = {
              code: err.name === "AbortError" ? "TIMEOUT" : "UNKNOWN",
              message: err.message,
            };
          } else {
            lastError = {
              code: "UNKNOWN",
              message: String(err),
            };
          }

          // Check if error is retryable
          const isRetryable = retryConfig.retryableErrors.includes(
            lastError.code
          );

          if (isRetryable && attempt < retryConfig.maxRetries) {
            const delay = calculateBackoffDelay(attempt, retryConfig);
            await new Promise((resolve) => setTimeout(resolve, delay));
            attempt++;
            continue;
          }

          // Not retryable or max retries reached
          break;
        }
      }

      // Check if this execution is still current
      if (executionIdRef.current !== currentExecutionId) {
        return null;
      }

      if (isMountedRef.current && lastError) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: lastError,
        }));
        onError?.(lastError);
      }

      return null;
    },
    [action, retryConfig, resetOnExecute, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      data: null,
      error: null,
      hasRun: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError,
  };
}

// ============ useLoadingState ============

interface LoadingStateMap {
  [key: string]: boolean;
}

interface UseLoadingStateReturn<K extends string> {
  /** Check if a specific key is loading */
  isLoading: (key: K) => boolean;
  /** Check if any key is loading */
  isAnyLoading: boolean;
  /** Set loading state for a key */
  setLoading: (key: K, loading: boolean) => void;
  /** Start loading for a key (returns stop function) */
  startLoading: (key: K) => () => void;
  /** Reset all loading states */
  resetAll: () => void;
}

/**
 * useLoadingState - Manage multiple loading states with a single hook
 */
export function useLoadingState<K extends string>(
  initialState: Partial<Record<K, boolean>> = {}
): UseLoadingStateReturn<K> {
  const [loadingMap, setLoadingMap] = useState<LoadingStateMap>(
    initialState as LoadingStateMap
  );

  const isLoading = useCallback(
    (key: K): boolean => loadingMap[key] ?? false,
    [loadingMap]
  );

  const isAnyLoading = Object.values(loadingMap).some(Boolean);

  const setLoading = useCallback((key: K, loading: boolean) => {
    setLoadingMap((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const startLoading = useCallback((key: K): (() => void) => {
    setLoadingMap((prev) => ({ ...prev, [key]: true }));
    return () => {
      setLoadingMap((prev) => ({ ...prev, [key]: false }));
    };
  }, []);

  const resetAll = useCallback(() => {
    setLoadingMap({});
  }, []);

  return {
    isLoading,
    isAnyLoading,
    setLoading,
    startLoading,
    resetAll,
  };
}

// ============ useDebounce ============

/**
 * useDebounce - Debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============ useDebouncedCallback ============

/**
 * useDebouncedCallback - Create a debounced version of a callback
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback reference fresh
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}
