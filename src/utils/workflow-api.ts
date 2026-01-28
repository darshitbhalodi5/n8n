/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Workflow API utilities
 * Functions to interact with the backend workflow API
 */

import type { Node, Edge } from "reactflow";
import { api, formatErrorWithRequestId, ApiClientError } from "@/lib/api-client";
import { getAiModelConfig } from "@/config/ai";
import type {
  WorkflowListResponse,
  WorkflowDetailResponse,
  WorkflowSummary,
  WorkflowDetail,
  BackendNode,
  BackendEdge,
  ExecutionListResponse,
  WorkflowExecution,
  PublicWorkflowListResponse,
  PublicWorkflowDetailResponse,
  PublicWorkflowSummary,
  PublicWorkflowDetail,
} from "@/types/workflow";

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
    chainlink: "CHAINLINK_PRICE_ORACLE", // Chainlink oracle node
    pyth: "PYTH_PRICE_ORACLE", // Pyth oracle node
    "ai-transform": "LLM_TRANSFORM", // AI Transform node
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
        message: data.slackMessage || data.testMessage || "",
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

    case "ai-transform":
      {
        const aiConfig = getAiModelConfig(data.llmModel);

        return {
          provider: data.llmProvider,
          model: data.llmModel,
          userPromptTemplate: data.userPromptTemplate,
          outputSchema: data.outputSchema,
          // Temperature and max tokens are enforced by internal config
          temperature: aiConfig.temperature,
          maxOutputTokens: aiConfig.maxOutputTokens,
        };
      }

    case "start":
      return {};

    case "wallet-node":
      return {};

    case "chainlink":
      return {
        provider: "CHAINLINK",
        chain: data.oracleChain || "ARBITRUM_SEPOLIA",
        aggregatorAddress: data.aggregatorAddress,
        staleAfterSeconds: data.staleAfterSeconds || 3600,
        // Include metadata for debugging
        ...(data.symbol && { symbol: data.symbol }),
        ...(data.feedName && { feedName: data.feedName }),
      };

    case "pyth":
      return {
        provider: "PYTH",
        chain: data.oracleChain || "ARBITRUM_SEPOLIA",
        priceFeedId: data.priceFeedId,
        staleAfterSeconds: data.staleAfterSeconds || 3600,
        // Include metadata for debugging
        ...(data.symbol && { symbol: data.symbol }),
        ...(data.feedName && { feedName: data.feedName }),
      };

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
    condition: {}, // Empty object for future use (backend expects object type)
    dataMapping: {}, // Empty object for future use (backend expects object type)
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
  isPublic?: boolean;
  tags?: string[];
}): Promise<{ success: boolean; data?: any; error?: ApiError; requestId?: string }> {
  // Find trigger node (start node)
  const startNode = params.nodes.find(
    (n) => n.type === "start" || n.id === "start-node"
  );

  const response = await api.post<{ data: any }>(
    "/workflows",
    {
      name: params.name,
      description: params.description || "",
      nodes: params.nodes.map(transformNodeToBackend),
      edges: params.edges.map(transformEdgeToBackend),
      triggerNodeId: startNode?.id,
      category: "automation",
      tags: params.tags || [],
      isPublic: params.isPublic || false,
    },
    { accessToken: params.accessToken }
  );

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error creating workflow:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data,
    requestId: response.requestId,
  };
}

/**
 * Execute workflow response data
 */
export interface ExecuteWorkflowResponseData {
  executionId: string;
  status: string;
  message: string;
  subscriptionToken: string; // Token for SSE subscription
}

/**
 * API error response (type alias for ApiClientError for request ID support)
 */
export type ApiError = ApiClientError;

/**
 * Execute a workflow
 */
export async function executeWorkflow(params: {
  workflowId: string;
  accessToken: string;
  initialInput?: Record<string, any>;
}): Promise<{
  success: boolean;
  data?: ExecuteWorkflowResponseData;
  error?: ApiError;
  statusCode?: number;
  requestId?: string;
}> {
  const response = await api.post<{ data: ExecuteWorkflowResponseData; retryAfter?: number }>(
    `/workflows/${params.workflowId}/execute`,
    { initialInput: params.initialInput || {} },
    { accessToken: params.accessToken }
  );

  if (!response.ok) {
    const error = response.error!;

    // Handle rate limiting (429)
    if (response.status === 429) {
      error.code = "RATE_LIMIT_EXCEEDED";
      error.message = `Rate limit exceeded. Please try again ${error.retryAfter
        ? `in ${Math.ceil(error.retryAfter / 1000)} seconds`
        : "later"
        }.`;
    }

    // Handle validation errors (400)
    if (response.status === 400 && error.code === "VALIDATION_ERROR") {
      error.message = "Validation failed: " +
        (error.details?.map((d) => d.message).join(", ") || error.message);
    }

    console.error(
      `[${response.requestId}] Error executing workflow:`,
      formatErrorWithRequestId(error)
    );

    return {
      success: false,
      error: error as ApiError,
      statusCode: response.status,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data,
    statusCode: response.status,
    requestId: response.requestId,
  };
}

/**
 * Get execution status
 */
export async function getExecutionStatus(params: {
  executionId: string;
  accessToken: string;
}): Promise<{ success: boolean; data?: any; error?: ApiError; requestId?: string }> {
  const response = await api.get<{ data: any }>(
    `/workflows/executions/${params.executionId}`,
    { accessToken: params.accessToken }
  );

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error getting execution status:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data,
    requestId: response.requestId,
  };
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
    executionId: executeResult.data?.executionId,
    data: executeResult.data,
  };
}

// ===========================================
// WORKFLOW CRUD OPERATIONS
// ===========================================

/**
 * List all workflows for the current user
 */
export async function listWorkflows(params: {
  accessToken: string;
  limit?: number;
  offset?: number;
  category?: string;
  isActive?: boolean;
}): Promise<{
  success: boolean;
  data?: WorkflowSummary[];
  total?: number;
  error?: ApiError;
  requestId?: string;
}> {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.offset) queryParams.set("offset", params.offset.toString());
  if (params.category) queryParams.set("category", params.category);
  if (params.isActive !== undefined) queryParams.set("isActive", params.isActive.toString());

  const queryString = queryParams.toString();
  const url = `/workflows${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<WorkflowListResponse>(url, {
    accessToken: params.accessToken,
  });

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error listing workflows:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data || [],
    total: response.data?.meta?.total || 0,
    requestId: response.requestId,
  };
}

/**
 * Get a single workflow with all nodes and edges
 */
export async function getWorkflow(params: {
  workflowId: string;
  accessToken: string;
}): Promise<{
  success: boolean;
  data?: WorkflowDetail;
  error?: ApiError;
  requestId?: string;
}> {
  const response = await api.get<WorkflowDetailResponse>(
    `/workflows/${params.workflowId}`,
    { accessToken: params.accessToken }
  );

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error getting workflow:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data,
    requestId: response.requestId,
  };
}

/**
 * Full update a workflow (replace all nodes and edges)
 */
export async function fullUpdateWorkflow(params: {
  workflowId: string;
  accessToken: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}): Promise<{
  success: boolean;
  data?: WorkflowDetail;
  error?: ApiError;
  requestId?: string;
}> {
  // Find trigger node (start node)
  const startNode = params.nodes.find(
    (n) => n.type === "start" || n.id === "start-node"
  );

  const response = await api.put<WorkflowDetailResponse>(
    `/workflows/${params.workflowId}/full`,
    {
      name: params.name,
      description: params.description || "",
      nodes: params.nodes.map(transformNodeToBackend),
      edges: params.edges.map(transformEdgeToBackend),
      triggerNodeId: startNode?.id,
      category: params.category || "automation",
      tags: params.tags || [],
      isPublic: params.isPublic,
    },
    { accessToken: params.accessToken }
  );

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error updating workflow:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data,
    requestId: response.requestId,
  };
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(params: {
  workflowId: string;
  accessToken: string;
}): Promise<{
  success: boolean;
  error?: ApiError;
  requestId?: string;
}> {
  const response = await api.delete(
    `/workflows/${params.workflowId}`,
    { accessToken: params.accessToken }
  );

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error deleting workflow:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    requestId: response.requestId,
  };
}

/**
 * Get workflow execution history
 */
export async function getWorkflowExecutions(params: {
  workflowId: string;
  accessToken: string;
  limit?: number;
  offset?: number;
}): Promise<{
  success: boolean;
  data?: WorkflowExecution[];
  total?: number;
  error?: ApiError;
  requestId?: string;
}> {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.offset) queryParams.set("offset", params.offset.toString());

  const queryString = queryParams.toString();
  const url = `/workflows/${params.workflowId}/executions${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<ExecutionListResponse>(url, {
    accessToken: params.accessToken,
  });

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error getting workflow executions:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data || [],
    total: response.data?.meta?.total || 0,
    requestId: response.requestId,
  };
}

// ===========================================
// CANVAS TRANSFORMATION UTILITIES
// ===========================================

/**
 * Transform backend node to React Flow format
 */
function transformNodeToCanvas(backendNode: BackendNode): Node {
  const metadata = backendNode.metadata || {};
  const config = backendNode.config || {};

  // Determine the frontend node type from metadata or backend type
  const frontendType = (metadata.frontendType as string) ||
    backendNode.type.toLowerCase() ||
    "base";

  // Reconstruct node data from config
  const nodeData: Record<string, unknown> = {
    label: backendNode.name || backendNode.id,
    description: backendNode.description || "",
    blockId: metadata.blockId,
    iconName: metadata.iconName,
    status: metadata.status,
  };

  // Map config back to frontend data format based on type
  switch (frontendType) {
    case "slack":
      nodeData.slackConnectionId = config.connectionId;
      nodeData.testMessage = config.message;
      nodeData.slackMessage = config.message;
      nodeData.slackConnectionType = config.connectionType;
      nodeData.slackChannelId = config.channelId;
      break;

    case "telegram":
      nodeData.telegramConnectionId = config.connectionId;
      nodeData.telegramChatId = config.chatId;
      nodeData.telegramMessage = config.message;
      break;

    case "uniswap":
    case "relay":
    case "oneinch":
      nodeData.swapProvider = config.provider;
      nodeData.swapChain = config.chain;
      if (config.inputConfig) {
        const inputConfig = config.inputConfig as Record<string, any>;
        nodeData.sourceTokenAddress = inputConfig.sourceToken?.address;
        nodeData.sourceTokenSymbol = inputConfig.sourceToken?.symbol;
        nodeData.sourceTokenDecimals = inputConfig.sourceToken?.decimals;
        nodeData.destinationTokenAddress = inputConfig.destinationToken?.address;
        nodeData.destinationTokenSymbol = inputConfig.destinationToken?.symbol;
        nodeData.destinationTokenDecimals = inputConfig.destinationToken?.decimals;
        nodeData.swapAmount = inputConfig.amount;
        nodeData.swapType = inputConfig.swapType;
        nodeData.walletAddress = inputConfig.walletAddress;
      }
      nodeData.simulateFirst = config.simulateFirst;
      nodeData.autoRetryOnFailure = config.autoRetryOnFailure;
      nodeData.maxRetries = config.maxRetries;
      break;

    case "if":
      nodeData.leftPath = config.leftPath;
      nodeData.operator = config.operator;
      nodeData.rightValue = config.rightValue;
      break;

    case "switch":
      nodeData.cases = config.cases;
      nodeData.defaultCaseId = config.defaultCaseId;
      break;

    case "mail":
      nodeData.emailTo = config.to;
      nodeData.emailSubject = config.subject;
      nodeData.emailBody = config.body;
      break;

    case "ai-transform": {
      nodeData.llmProvider = config.provider;
      nodeData.llmModel = config.model;
      nodeData.userPromptTemplate = config.userPromptTemplate;
      nodeData.outputSchema = config.outputSchema;

      const aiConfig = getAiModelConfig(config.model as string | undefined);
      // Use backend-provided values if present, otherwise fall back to internal config
      nodeData.temperature =
        (config.temperature as number | undefined) ?? aiConfig.temperature;
      nodeData.maxOutputTokens =
        (config.maxOutputTokens as number | undefined) ?? aiConfig.maxOutputTokens;
      break;
    }
  }

  return {
    id: backendNode.id,
    type: frontendType,
    position: backendNode.position || { x: 0, y: 0 },
    data: nodeData,
    deletable: frontendType !== "start",
  };
}

/**
 * Transform backend edge to React Flow format
 */
function transformEdgeToCanvas(backendEdge: BackendEdge): Edge {
  return {
    id: backendEdge.id,
    source: backendEdge.source_node_id,
    target: backendEdge.target_node_id,
    sourceHandle: backendEdge.source_handle || undefined,
    targetHandle: backendEdge.target_handle || undefined,
    type: "smoothstep",
    animated: true,
  };
}

/**
 * Transform complete backend workflow to canvas format
 */
export function transformWorkflowToCanvas(
  workflow: Pick<WorkflowDetail, "nodes" | "edges">
): {
  nodes: Node[];
  edges: Edge[];
} {
  return {
    nodes: workflow.nodes.map(transformNodeToCanvas),
    edges: workflow.edges.map(transformEdgeToCanvas),
  };
}

/**
 * Save workflow - creates new or updates existing
 */
export async function saveWorkflow(params: {
  workflowId?: string | null;
  accessToken: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}): Promise<{
  success: boolean;
  workflowId?: string;
  data?: WorkflowDetail;
  error?: ApiError;
  requestId?: string;
  isNew?: boolean;
}> {
  // If we have a workflow ID, update; otherwise create
  if (params.workflowId) {
    const result = await fullUpdateWorkflow({
      workflowId: params.workflowId,
      accessToken: params.accessToken,
      name: params.name,
      description: params.description,
      nodes: params.nodes,
      edges: params.edges,
      category: params.category,
      tags: params.tags,
      isPublic: params.isPublic,
    });

    return {
      ...result,
      workflowId: params.workflowId,
      isNew: false,
    };
  } else {
    const result = await createWorkflow({
      accessToken: params.accessToken,
      name: params.name,
      description: params.description,
      nodes: params.nodes,
      edges: params.edges,
      isPublic: params.isPublic,
      tags: params.tags,
    });

    return {
      success: result.success,
      workflowId: result.data?.id,
      data: result.data,
      error: result.error,
      requestId: result.requestId,
      isNew: true,
    };
  }
}

/**
 * List public workflows (no authentication required)
 */
export async function listPublicWorkflows(params: {
  q?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  success: boolean;
  data?: PublicWorkflowSummary[];
  total?: number;
  error?: ApiError;
  requestId?: string;
}> {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.set("q", params.q);
  if (params.tag) queryParams.set("tag", params.tag);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.offset) queryParams.set("offset", params.offset.toString());

  const queryString = queryParams.toString();
  const url = `/workflows/public${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<PublicWorkflowListResponse>(url, {
    // No accessToken required
  });

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error listing public workflows:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data || [],
    total: response.data?.meta?.total || 0,
    requestId: response.requestId,
  };
}

/**
 * Get a public workflow detail (no authentication required)
 */
export async function getPublicWorkflow(params: {
  workflowId: string;
}): Promise<{
  success: boolean;
  data?: PublicWorkflowDetail;
  error?: ApiError;
  requestId?: string;
}> {
  const response = await api.get<PublicWorkflowDetailResponse>(
    `/workflows/public/${params.workflowId}`,
    {
      // No accessToken required
    }
  );

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error getting public workflow:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    data: response.data?.data,
    requestId: response.requestId,
  };
}

/**
 * Clone a public workflow to the user's account
 */
export async function clonePublicWorkflow(params: {
  workflowId: string;
  accessToken: string;
}): Promise<{
  success: boolean;
  newWorkflowId?: string;
  data?: WorkflowDetail;
  error?: ApiError;
  requestId?: string;
}> {
  const response = await api.post<{ data: WorkflowDetail }>(
    `/workflows/public/${params.workflowId}/clone`,
    {},
    { accessToken: params.accessToken }
  );

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error cloning public workflow:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    newWorkflowId: response.data?.data?.id,
    data: response.data?.data,
    requestId: response.requestId,
  };
}

// ===========================================
// WORKFLOW VERSION HISTORY
// ===========================================

export interface WorkflowVersionSummary {
  id: string;
  version_number: number;
  change_summary: string | null;
  created_at: string;
  created_by: string | null;
}

export interface WorkflowVersionDetail {
  id: string;
  workflowId: string;
  versionNumber: number;
  changeSummary: string | null;
  nodes: BackendNode[];
  edges: BackendEdge[];
  metadata: Record<string, any> | null;
  createdAt: string;
  createdBy: string | null;
}

/**
 * Get workflow version history
 */
export async function getWorkflowVersions(params: {
  workflowId: string;
  accessToken: string;
}): Promise<{
  success: boolean;
  currentVersion?: number;
  versions?: WorkflowVersionSummary[];
  error?: ApiError;
  requestId?: string;
}> {
  const response = await api.get<{
    data: { currentVersion: number; versions: WorkflowVersionSummary[] };
  }>(`/workflows/${params.workflowId}/versions`, {
    accessToken: params.accessToken,
  });

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error fetching workflow versions:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    currentVersion: response.data?.data?.currentVersion,
    versions: response.data?.data?.versions || [],
    requestId: response.requestId,
  };
}

/**
 * Restore workflow to a previous version
 */
export async function restoreWorkflowVersion(params: {
  workflowId: string;
  versionNumber: number;
  accessToken: string;
}): Promise<{
  success: boolean;
  newVersion?: number;
  error?: ApiError;
  requestId?: string;
}> {
  const response = await api.post<{
    data: { workflowId: string; restoredFromVersion: number; newVersion: number };
  }>(
    `/workflows/${params.workflowId}/versions/${params.versionNumber}/restore`,
    {},
    { accessToken: params.accessToken }
  );

  if (!response.ok) {
    console.error(
      `[${response.requestId}] Error restoring workflow version:`,
      formatErrorWithRequestId(response.error!)
    );
    return {
      success: false,
      error: response.error as ApiError,
      requestId: response.requestId,
    };
  }

  return {
    success: true,
    newVersion: response.data?.data?.newVersion,
    requestId: response.requestId,
  };
}
