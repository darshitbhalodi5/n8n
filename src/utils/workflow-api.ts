/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Workflow API utilities
 * Functions to interact with the backend workflow API
 */

import type { Node, Edge } from "reactflow";
import { buildApiUrl } from "@/config/api";

/**
 * Normalize frontend node type to backend NodeType enum
 * Maps frontend types to backend processor types
 */
function normalizeNodeType(frontendType: string): string {
  const typeMap: Record<string, string> = {
    start: "START", // Start node
    if: "IF", // IF node
    switch: "SWITCH", // Switch node
    slack: "SLACK", // Slack node (has dedicated processor)
    telegram: "TELEGRAM", // Telegram node (has dedicated processor)
    mail: "EMAIL", // Email node (has dedicated processor)
    uniswap: "SWAP", // Uniswap is a swap
    relay: "SWAP", // Relay is a swap
    oneinch: "SWAP", // 1inch is a swap
    "wallet-node": "WALLET", // Wallet node
  };
  // Default to the uppercase version if not in map, or TRIGGER as fallback
  return typeMap[frontendType] || frontendType.toUpperCase() || "TRIGGER";
}

/**
 * Extract node-specific configuration from node data
 */
function extractNodeConfig(node: Node): any {
  const data = node.data || {};
  const type = node.type;

  switch (type) {
    case "slack":
      return {
        connectionId: data.slackConnectionId,
        message: data.testMessage || data.slackMessage || "",
        connectionType: data.slackConnectionType || "webhook",
        channelId: data.slackChannelId,
      };

    case "telegram":
      return {
        connectionId: data.telegramConnectionId,
        chatId: data.telegramChatId,
        message: data.telegramMessage || "",
      };

    case "uniswap":
    case "relay":
    case "oneinch":
      return {
        provider: data.swapProvider,
        chain: data.swapChain,
        inputConfig: {
          sourceToken: {
            address: data.sourceTokenAddress,
            symbol: data.sourceTokenSymbol,
            decimals: data.sourceTokenDecimals || 18,
          },
          destinationToken: {
            address: data.destinationTokenAddress,
            symbol: data.destinationTokenSymbol,
            decimals: data.destinationTokenDecimals || 18,
          },
          amount: data.swapAmount,
          swapType: data.swapType || "EXACT_INPUT",
          walletAddress: data.walletAddress,
        },
        simulateFirst: data.simulateFirst ?? true,
        autoRetryOnFailure: data.autoRetryOnFailure ?? true,
        maxRetries: data.maxRetries ?? 3,
      };

    case "if":
      return {
        leftPath: data.leftPath,
        operator: data.operator,
        rightValue: data.rightValue,
      };

    case "switch":
      return {
        cases: data.cases || [],
        defaultCaseId: data.defaultCaseId,
      };

    case "mail":
      return {
        to: data.emailTo,
        subject: data.emailSubject,
        body: data.emailBody,
      };

    case "start":
      return {};

    case "wallet-node":
      return {};

    default:
      // Fallback: extract common fields
      return {
        ...(data.leftPath && { leftPath: data.leftPath }),
        ...(data.operator && { operator: data.operator }),
        ...(data.rightValue && { rightValue: data.rightValue }),
      };
  }
}

/**
 * Transform React Flow nodes to backend format
 */
function transformNodeToBackend(node: Node) {
  const backendType = normalizeNodeType(node.type || "base");

  return {
    id: node.id,
    type: backendType,
    name: node.data?.label || node.id,
    description: node.data?.description || "",
    config: extractNodeConfig(node),
    position: node.position,
    metadata: {
      blockId: node.data?.blockId,
      iconName: node.data?.iconName,
      status: node.data?.status,
      frontendType: node.type, // Preserve original frontend type
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
  accessToken: string;
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
        "Authorization": `Bearer ${params.accessToken}`,
      },
      body: JSON.stringify({
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
  accessToken: string;
  initialInput?: Record<string, any>;
}): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const response = await fetch(
      buildApiUrl(`/workflows/${params.workflowId}/execute`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${params.accessToken}`,
        },
        body: JSON.stringify({
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
  accessToken: string;
}): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const response = await fetch(
      buildApiUrl(`/workflows/executions/${params.executionId}`),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${params.accessToken}`,
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
  accessToken: string;
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
    accessToken: params.accessToken,
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
    accessToken: params.accessToken,
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

