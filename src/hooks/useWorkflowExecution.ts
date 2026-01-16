/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * useWorkflowExecution Hook
 *
 * Provides workflow execution functionality with real-time status updates via SSE.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { executeWorkflow as executeWorkflowApi, ApiError } from "@/utils/workflow-api";
import { API_CONFIG } from "@/config/api";

/**
 * Node execution status
 */
export interface NodeExecutionStatus {
  nodeId: string;
  status: "pending" | "running" | "success" | "failed";
  output?: any;
  error?: {
    message: string;
    code?: string;
  };
  timestamp?: Date;
}

/**
 * Execution event from SSE
 */
interface ExecutionEvent {
  type: string;
  executionId: string;
  workflowId?: string;
  nodeId?: string;
  nodeType?: string;
  status: string;
  output?: any;
  error?: {
    message: string;
    code?: string;
  };
  timestamp: string;
}

/**
 * Hook return type
 */
export interface UseWorkflowExecutionReturn {
  /** Execute the workflow */
  execute: (initialInput?: Record<string, any>) => Promise<string | null>;
  /** Whether execution is in progress */
  isExecuting: boolean;
  /** Current execution ID */
  executionId: string | null;
  /** Overall execution status */
  executionStatus: "pending" | "running" | "success" | "failed" | null;
  /** Map of node IDs to their execution status */
  nodeStatuses: Map<string, NodeExecutionStatus>;
  /** Error message if any */
  error: string | null;
  /** Structured API error (includes rate limit info, validation details) */
  apiError: ApiError | null;
  /** Reset execution state */
  reset: () => void;
}

/**
 * Hook for executing workflows with real-time status updates
 */
export function useWorkflowExecution(
  workflowId: string | null,
  accessToken: string | null
): UseWorkflowExecutionReturn {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<
    "pending" | "running" | "success" | "failed" | null
  >(null);
  const [nodeStatuses, setNodeStatuses] = useState<
    Map<string, NodeExecutionStatus>
  >(new Map());
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const subscriptionTokenRef = useRef<string | null>(null);

  /**
   * Reset execution state
   */
  const reset = useCallback(() => {
    setIsExecuting(false);
    setExecutionId(null);
    setExecutionStatus(null);
    setNodeStatuses(new Map());
    setError(null);
    setApiError(null);
    subscriptionTokenRef.current = null;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  /**
   * Subscribe to execution updates via SSE
   * Now requires a subscription token for authentication
   */
  const subscribeToUpdates = useCallback((execId: string, token: string) => {
    // Build URL with subscription token as query parameter
    const url = `${API_CONFIG.BASE_URL}/workflows/executions/${execId}/subscribe?token=${encodeURIComponent(token)}`;

    console.log("[SSE] Connecting to execution updates...");

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("[SSE] Connection opened");
    };

    eventSource.onerror = (err) => {
      console.error("[SSE] Connection error:", err);

      // Check if connection was closed due to auth error
      if (eventSource.readyState === EventSource.CLOSED) {
        // Attempt to determine if it was an auth failure
        console.log("[SSE] Connection closed - may be due to expired/invalid token");

        // Set error state if execution hasn't completed
        if (executionStatus === "running" || executionStatus === "pending") {
          setError("Lost connection to execution updates. The subscription token may have expired.");
        }
      }
    };

    // Handle named events
    eventSource.addEventListener("connected", (event) => {
      console.log("[SSE] Connected:", event.data);
    });

    eventSource.addEventListener("execution:started", (event) => {
      console.log("[SSE] Execution started:", event.data);
      setExecutionStatus("running");
    });

    eventSource.addEventListener("node:started", (event) => {
      try {
        const data: ExecutionEvent = JSON.parse(event.data);
        console.log("[SSE] Node started:", data.nodeId);

        setNodeStatuses((prev) => {
          const next = new Map(prev);
          next.set(data.nodeId!, {
            nodeId: data.nodeId!,
            status: "running",
            timestamp: new Date(data.timestamp),
          });
          return next;
        });
      } catch (e) {
        console.error("[SSE] Failed to parse node:started event:", e);
      }
    });

    eventSource.addEventListener("node:completed", (event) => {
      try {
        const data: ExecutionEvent = JSON.parse(event.data);
        console.log("[SSE] Node completed:", data.nodeId, data.output);

        setNodeStatuses((prev) => {
          const next = new Map(prev);
          next.set(data.nodeId!, {
            nodeId: data.nodeId!,
            status: "success",
            output: data.output,
            timestamp: new Date(data.timestamp),
          });
          return next;
        });
      } catch (e) {
        console.error("[SSE] Failed to parse node:completed event:", e);
      }
    });

    eventSource.addEventListener("node:failed", (event) => {
      try {
        const data: ExecutionEvent = JSON.parse(event.data);
        console.log("[SSE] Node failed:", data.nodeId, data.error);

        setNodeStatuses((prev) => {
          const next = new Map(prev);
          next.set(data.nodeId!, {
            nodeId: data.nodeId!,
            status: "failed",
            error: data.error,
            timestamp: new Date(data.timestamp),
          });
          return next;
        });
      } catch (e) {
        console.error("[SSE] Failed to parse node:failed event:", e);
      }
    });

    eventSource.addEventListener("execution:completed", (event) => {
      console.log("[SSE] Execution completed:", event.data);
      setExecutionStatus("success");
      setIsExecuting(false);
      eventSource.close();
    });

    eventSource.addEventListener("execution:failed", (event) => {
      try {
        const data: ExecutionEvent = JSON.parse(event.data);
        console.log("[SSE] Execution failed:", data.error);
        setExecutionStatus("failed");
        setError(data.error?.message || "Execution failed");
        setIsExecuting(false);
        eventSource.close();
      } catch (e) {
        console.error("[SSE] Failed to parse execution:failed event:", e);
        setExecutionStatus("failed");
        setIsExecuting(false);
        eventSource.close();
      }
    });

    eventSource.addEventListener("close", () => {
      console.log("[SSE] Server requested close");
      eventSource.close();
    });

    // Fallback for generic messages
    eventSource.onmessage = (event) => {
      console.log("[SSE] Generic message:", event.data);
    };
  }, [executionStatus]);

  /**
   * Execute the workflow
   */
  const execute = useCallback(
    async (initialInput?: Record<string, any>): Promise<string | null> => {
      if (!workflowId) {
        setError("No workflow ID provided");
        return null;
      }

      if (!accessToken) {
        setError("Not authenticated");
        return null;
      }

      // Reset state
      setIsExecuting(true);
      setError(null);
      setApiError(null);
      setNodeStatuses(new Map());
      setExecutionStatus("pending");

      // Close any existing SSE connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      try {
        const result = await executeWorkflowApi({
          workflowId,
          accessToken,
          initialInput,
        });

        if (result.success && result.data?.executionId) {
          const execId = result.data.executionId;
          const subscriptionToken = result.data.subscriptionToken;

          setExecutionId(execId);
          setExecutionStatus("running");

          // Store the token for potential reconnection
          subscriptionTokenRef.current = subscriptionToken;

          // Subscribe to real-time updates with the authentication token
          if (subscriptionToken) {
            subscribeToUpdates(execId, subscriptionToken);
          } else {
            console.warn("[SSE] No subscription token received - SSE updates may not work");
            // Still set as running, just won't have real-time updates
          }

          return execId;
        } else {
          // Store structured error for detailed error handling
          if (result.error) {
            setApiError(result.error);
          }

          setError(result.error?.message || "Failed to start execution");
          setIsExecuting(false);
          setExecutionStatus("failed");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setIsExecuting(false);
        setExecutionStatus("failed");
        return null;
      }
    },
    [workflowId, accessToken, subscribeToUpdates]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    execute,
    isExecuting,
    executionId,
    executionStatus,
    nodeStatuses,
    error,
    apiError,
    reset,
  };
}
