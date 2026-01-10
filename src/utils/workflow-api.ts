/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Workflow API utilities
 * Functions to interact with the backend workflow API
 */

import type { Node, Edge } from "reactflow";
import { buildApiUrl } from "@/config/api";

/**
 * Transform React Flow nodes to backend format
 */
function transformNodeToBackend(node: Node) {
  return {
    id: node.id,
    type: node.type || "base",
    name: node.data?.label || node.id,
    description: node.data?.description || "",
    config: {
      // Extract configuration from node data
      ...(node.data?.leftPath && { leftPath: node.data.leftPath }),
      ...(node.data?.operator && { operator: node.data.operator }),
      ...(node.data?.rightValue && { rightValue: node.data.rightValue }),
      ...(node.data?.emailTo && { to: node.data.emailTo }),
      ...(node.data?.emailSubject && { subject: node.data.emailSubject }),
      ...(node.data?.emailBody && { body: node.data.emailBody }),
      // Add other node-specific config here
    },
    position: node.position,
    metadata: {
      blockId: node.data?.blockId,
      iconName: node.data?.iconName,
      status: node.data?.status,
    },
  };
}

/**
 * Transform React Flow edges to backend format
 */
function transformEdgeToBackend(edge: Edge) {
  return {
    sourceNodeId: edge.source,
    targetNodeId: edge.target,
    sourceHandle: edge.sourceHandle || null,
    targetHandle: edge.targetHandle || null,
    condition: null, // For future use
    dataMapping: null, // For future use
  };
}

/**
 * Create a new workflow in the backend
 */
export async function createWorkflow(params: {
  userId: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
}): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    // Find trigger node (start node)
    const startNode = params.nodes.find(
      (n) => n.type === "start" || n.id === "start-node"
    );

    const response = await fetch(buildApiUrl("/workflows"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: params.userId,
        name: params.name,
        description: params.description || "",
        nodes: params.nodes.map(transformNodeToBackend),
        edges: params.edges.map(transformEdgeToBackend),
        triggerNodeId: startNode?.id,
        category: "automation",
        tags: ["if-else", "conditional"],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || { message: "Failed to create workflow" },
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating workflow:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR",
      },
    };
  }
}

/**
 * Execute a workflow
 */
export async function executeWorkflow(params: {
  workflowId: string;
  userId: string;
  initialInput?: Record<string, any>;
}): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const response = await fetch(
      buildApiUrl(`/workflows/${params.workflowId}/execute`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: params.userId,
          initialInput: params.initialInput || {},
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || { message: "Failed to execute workflow" },
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error executing workflow:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR",
      },
    };
  }
}

/**
 * Get execution status
 */
export async function getExecutionStatus(params: {
  executionId: string;
  userId: string;
}): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const response = await fetch(
      buildApiUrl(`/workflows/executions/${params.executionId}`),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": params.userId, // Assuming user ID is passed in header
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || { message: "Failed to get execution status" },
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error getting execution status:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR",
      },
    };
  }
}

/**
 * Save and execute workflow (convenience function)
 */
export async function saveAndExecuteWorkflow(params: {
  userId: string;
  workflowName: string;
  nodes: Node[];
  edges: Edge[];
  initialInput?: Record<string, any>;
}): Promise<{
  success: boolean;
  workflowId?: string;
  executionId?: string;
  data?: any;
  error?: any;
}> {
  // Step 1: Create workflow
  const createResult = await createWorkflow({
    userId: params.userId,
    name: params.workflowName,
    nodes: params.nodes,
    edges: params.edges,
  });

  if (!createResult.success) {
    return {
      success: false,
      error: createResult.error,
    };
  }

  const workflowId = createResult.data.id;

  // Step 2: Execute workflow
  const executeResult = await executeWorkflow({
    workflowId,
    userId: params.userId,
    initialInput: params.initialInput,
  });

  if (!executeResult.success) {
    return {
      success: false,
      workflowId,
      error: executeResult.error,
    };
  }

  return {
    success: true,
    workflowId,
    executionId: executeResult.data.executionId,
    data: executeResult.data,
  };
}

