"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowInstance,
} from "reactflow";
import {
  getBlockById,
  iconRegistry,
  blockCategories,
  startBlock,
  type BlockDefinition,
} from "@/components/blocks";
import { useCanvasDimensions, useUnsavedChanges } from "@/hooks";
import { calculateCanvasCenter } from "@/utils/canvas";
import { usePrivyEmbeddedWallet } from "@/hooks/usePrivyEmbeddedWallet";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";
import { arbitrum } from "viem/chains";
import { CheckSquare } from "lucide-react";

// The Start node ID - used to identify and protect it from deletion
const START_NODE_ID = "start-node";

// Initial nodes include the Start node which is always present
const initialNodes: Node[] = [
  {
    id: START_NODE_ID,
    type: "start",
    position: { x: 100, y: 200 },
    data: {
      ...startBlock.defaultData,
      blockId: startBlock.id,
      iconName: startBlock.iconName,
    },
    deletable: false,
  },
];
const initialEdges: Edge[] = [];

// Define handler types for React Flow events
type OnNodeClick = (event: React.MouseEvent, node: Node) => void;
type OnPaneClick = (event: React.MouseEvent) => void;

export interface WorkflowContextType {
  // State
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  lastSaved: Date | null;
  mobileMenuOpen: boolean;

  // Canvas dimensions
  canvasDimensions: ReturnType<typeof useCanvasDimensions>;

  // Actions - Node management
  setNodes: ReturnType<typeof useNodesState>[1];
  setEdges: ReturnType<typeof useEdgesState>[1];
  onNodesChange: ReturnType<typeof useNodesState>[2];
  onEdgesChange: ReturnType<typeof useEdgesState>[2];
  setSelectedNode: (node: Node | null) => void;
  handleNodeClick: OnNodeClick;
  handlePaneClick: OnPaneClick;
  handleNodeDataChange: (nodeId: string, data: Record<string, unknown>) => void;
  deleteNodes: (nodeIds: string[]) => void;
  onNodesDelete: (deleted: Node[]) => void;

  // Actions - Canvas operations
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitView: () => void;
  handleReactFlowInit: (instance: ReactFlowInstance) => void;

  // Actions - Workflow operations
  handleSave: () => void;
  handleRun: () => void;

  // Actions - Block operations
  handleBlockClick: (block: BlockDefinition) => void;
  handleBlockDragStart: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onConnect: (connection: Parameters<typeof addEdge>[0]) => void;

  // Actions - UI state
  setMobileMenuOpen: (open: boolean) => void;

  // Utilities
  isProtectedNode: (nodeId: string) => boolean;
  isBlockDisabled: (blockId: string) => boolean;
  isSwapBlockDisabled: (blockId: string) => boolean;
  categories: Array<{
    id: string;
    label: string;
    icon: React.ReactNode | null;
  }>;
  hasUnsavedChanges: boolean;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
};

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs to track the selected node without causing re-renders
  const selectedNodeIdRef = useRef<string | null>(null);
  const selectedNodeRef = useRef<Node | null>(null);
  const pendingUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    selectedNodeIdRef.current = selectedNode?.id ?? null;
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  // Cleanup pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (pendingUpdateTimeoutRef.current) {
        clearTimeout(pendingUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Responsive canvas dimensions hook
  const canvasDimensions = useCanvasDimensions();

  // Warn users when leaving with unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return nodes.length > 1 && !lastSaved;
  }, [nodes.length, lastSaved]);

  useUnsavedChanges({ hasUnsavedChanges });

  // Canvas control handlers
  const handleZoomIn = useCallback(() => {
    reactFlowInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    reactFlowInstanceRef.current?.zoomOut();
  }, []);

  const handleFitView = useCallback(() => {
    reactFlowInstanceRef.current?.fitView({ padding: 0.2 });
  }, []);

  const handleReactFlowInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  const handleSave = useCallback(() => {
    setLastSaved(new Date());
    // TODO: Implement actual save logic
    console.log("Saving workflow...", { nodes, edges });
  }, [nodes, edges]);

  // Get Privy access token function
  const { getPrivyAccessToken, authenticated } = usePrivyWallet();

  const handleRun = useCallback(() => {
    const executeWorkflowHandler = async () => {
      try {
        console.log("Running workflow...", { nodes, edges });

        // Check if user is authenticated
        if (!authenticated) {
          alert("Please log in to run workflows");
          return;
        }

        // Get the access token
        const accessToken = await getPrivyAccessToken();
        if (!accessToken) {
          alert("Unable to authenticate. Please try logging in again.");
          return;
        }

        const { saveAndExecuteWorkflow } = await import("@/utils/workflow-api");

        const result = await saveAndExecuteWorkflow({
          accessToken,
          workflowName: `Workflow ${new Date().toLocaleDateString()}`,
          nodes,
          edges,
          initialInput: {
            amount: 150,
            status: "active",
            email: "test@example.com",
          },
        });

        if (result.success) {
          console.log("Workflow executed successfully!", result);
          alert(
            `Workflow executed successfully!\n\n` +
            `Workflow ID: ${result.workflowId}\n` +
            `Execution ID: ${result.executionId}\n` +
            `Status: ${result.data?.status || "PENDING"}\n\n` +
            `Check backend logs for execution trace.`
          );
        } else {
          console.error("Workflow execution failed:", result.error);
          alert(
            `Workflow execution failed!\n\n` +
            `Error: ${result.error?.message || "Unknown error"}\n\n` +
            `Make sure the backend is running`
          );
        }
      } catch (error) {
        console.error("Failed to execute workflow:", error);
        alert(
          `Failed to execute workflow!\n\n` +
          `Error: ${error instanceof Error ? error.message : String(error)}\n\n` +
          `Is the backend running?`
        );
      }
    };

    executeWorkflowHandler();
  }, [nodes, edges, authenticated, getPrivyAccessToken]);

  // Check if a node is protected from deletion
  const isProtectedNode = useCallback((nodeId: string): boolean => {
    return nodeId === START_NODE_ID;
  }, []);

  // Shared utility to delete nodes and their connected edges
  const deleteNodes = useCallback(
    (nodeIds: string[]) => {
      const deletableIds = nodeIds.filter((id) => !isProtectedNode(id));

      if (deletableIds.length === 0) {
        console.log("Cannot delete Start node");
        return;
      }

      setNodes((nds) => nds.filter((n) => !deletableIds.includes(n.id)));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !deletableIds.includes(edge.source) &&
            !deletableIds.includes(edge.target)
        )
      );
      // Clear selection if the selected node was deleted
      if (
        selectedNodeIdRef.current &&
        deletableIds.includes(selectedNodeIdRef.current)
      ) {
        setSelectedNode(null);
      }
    },
    [setNodes, setEdges, isProtectedNode]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTypingInInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.getAttribute("contenteditable") === "true";

      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }

      // Ctrl/Cmd + Enter: Run
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }

      // Escape: Close modals/panels
      if (e.key === "Escape") {
        setSelectedNode(null);
        setMobileMenuOpen(false);
      }

      // Delete/Backspace: Delete selected node
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedNodeIdRef.current &&
        !isTypingInInput
      ) {
        e.preventDefault();
        deleteNodes([selectedNodeIdRef.current]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleRun, deleteNodes]);

  // Handle block click to add (mobile tap-to-add)
  const handleBlockClick = useCallback(
    (block: BlockDefinition) => {
      if (!reactFlowInstanceRef.current) {
        return;
      }

      const blockDefinition = getBlockById(block.id);
      if (!blockDefinition) {
        return;
      }

      // Guard: prevent duplicate wallet blocks
      if (blockDefinition.nodeType === "wallet-node") {
        const walletNodeExists = nodes.some((n) => n.type === "wallet-node");
        if (walletNodeExists) {
          console.warn("Wallet block already exists on canvas");
          return;
        }
      }

      const canvasCenter = calculateCanvasCenter(
        reactFlowInstanceRef.current,
        canvasDimensions,
        null
      );

      const newNode: Node = {
        id: `${block.id}-${Date.now()}`,
        type: blockDefinition.nodeType || "base",
        position: canvasCenter,
        data: {
          ...blockDefinition.defaultData,
          blockId: block.id,
          iconName: blockDefinition.iconName,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setMobileMenuOpen(false);
    },
    [nodes, setNodes, canvasDimensions]
  );

  // React Flow's built-in node deletion handler
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const deletedIds = deleted.map((node) => node.id);
      deleteNodes(deletedIds);
    },
    [deleteNodes]
  );

  const onConnect = useCallback(
    (connection: Parameters<typeof addEdge>[0]) => {
      setEdges((eds) => {
        const baseEdge = {
          ...connection,
          type: "smoothstep",
          animated: true,
        };

        const sourceNode = nodes.find((n) => n.id === connection.source);

        // If the source is an If node, add a label based on the sourceHandle
        if (
          sourceNode &&
          (sourceNode.type === "if" || sourceNode.data?.blockId === "if")
        ) {
          if (connection.sourceHandle === "true") {
            return addEdge(
              {
                ...baseEdge,
                label: "True",
                labelStyle: { fill: "#10b981", fontWeight: 600, fontSize: 12 },
                labelBgStyle: { fill: "#064e3b", fillOpacity: 0.8 },
                style: { stroke: "#10b981", strokeWidth: 2 },
              } as Edge,
              eds
            );
          } else if (connection.sourceHandle === "false") {
            return addEdge(
              {
                ...baseEdge,
                label: "False",
                labelStyle: { fill: "#ef4444", fontWeight: 600, fontSize: 12 },
                labelBgStyle: { fill: "#7f1d1d", fillOpacity: 0.8 },
                style: { stroke: "#ef4444", strokeWidth: 2 },
              } as Edge,
              eds
            );
          }
        }

        // If the source is a Switch node, add label based on the case
        if (
          sourceNode &&
          (sourceNode.type === "switch" ||
            sourceNode.data?.blockId === "switch")
        ) {
          const cases =
            (sourceNode.data?.cases as Array<{
              id: string;
              label: string;
              isDefault?: boolean;
            }>) || [];

          const matchedCase = cases.find(
            (c) => c.id === connection.sourceHandle
          );

          if (matchedCase) {
            const caseColors = [
              { stroke: "#3b82f6", fill: "#1e40af" },
              { stroke: "#22c55e", fill: "#166534" },
              { stroke: "#eab308", fill: "#854d0e" },
              { stroke: "#a855f7", fill: "#6b21a8" },
            ];

            const caseIndex = cases
              .filter((c) => !c.isDefault)
              .findIndex((c) => c.id === matchedCase.id);
            const isDefault = matchedCase.isDefault;

            const color = isDefault
              ? { stroke: "#6b7280", fill: "#374151" }
              : caseColors[caseIndex % caseColors.length];

            return addEdge(
              {
                ...baseEdge,
                label: matchedCase.label,
                labelStyle: {
                  fill: color.stroke,
                  fontWeight: 600,
                  fontSize: 11,
                },
                labelBgStyle: { fill: color.fill, fillOpacity: 0.8 },
                style: { stroke: color.stroke, strokeWidth: 2 },
              } as Edge,
              eds
            );
          }
        }

        return addEdge(baseEdge, eds);
      });
    },
    [setEdges, nodes]
  );

  // Handle block drag and drop to canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const blockData = event.dataTransfer.getData("application/reactflow");
      if (!blockData || !reactFlowInstanceRef.current) {
        return;
      }

      try {
        const block: BlockDefinition = JSON.parse(blockData);
        const blockDefinition = getBlockById(block.id);

        if (!blockDefinition) {
          return;
        }

        // Guard: prevent duplicate wallet blocks
        if (blockDefinition.nodeType === "wallet-node") {
          const walletNodeExists = nodes.some((n) => n.type === "wallet-node");
          if (walletNodeExists) {
            console.warn("Wallet block already exists on canvas");
            return;
          }
        }

        const reactFlowBounds = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        const position = reactFlowInstanceRef.current.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode: Node = {
          id: `${block.id}-${Date.now()}`,
          type: blockDefinition.nodeType || "base",
          position,
          data: {
            ...blockDefinition.defaultData,
            blockId: block.id,
            iconName: blockDefinition.iconName,
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error("Error dropping block:", error);
      }
    },
    [nodes, setNodes]
  );

  const handleBlockDragStart = useCallback(() => {
    // Optional: Add visual feedback or tracking
  }, []);

  // Get current network from user menu
  const { chainId } = usePrivyEmbeddedWallet();

  // Check if a swap block is disabled based on network availability
  const isSwapBlockDisabled = useCallback(
    (blockId: string): boolean => {
      const isMainnet = chainId === arbitrum.id;

      if (blockId === "relay") {
        return true;
      }

      if (blockId === "oneinch") {
        return !isMainnet;
      }

      if (blockId === "uniswap") {
        return false;
      }

      return false;
    },
    [chainId]
  );

  // Check if block is disabled
  const isBlockDisabled = useCallback(
    (blockId: string) => {
      if (blockId === "wallet") {
        return nodes.some((n) => n.type === "wallet-node");
      }

      return isSwapBlockDisabled(blockId);
    },
    [nodes, isSwapBlockDisabled]
  );

  // Handle node click - select node
  const handleNodeClick: OnNodeClick = useCallback((_event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle pane click - deselect node
  const handlePaneClick: OnPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle node data change from right sidebar
  const handleNodeDataChange = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) => {
        const updatedNodes = nds.map((node) =>
          node.id === nodeId
            ? {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            }
            : node
        );

        if (selectedNodeIdRef.current === nodeId) {
          const updatedNode = updatedNodes.find((n) => n.id === nodeId);
          if (updatedNode) {
            if (pendingUpdateTimeoutRef.current) {
              clearTimeout(pendingUpdateTimeoutRef.current);
            }
            pendingUpdateTimeoutRef.current = setTimeout(() => {
              setSelectedNode(updatedNode);
              pendingUpdateTimeoutRef.current = null;
            }, 0);
          }
        }

        return updatedNodes;
      });
    },
    [setNodes]
  );

  // Sync selectedNode with nodes array when nodes change
  useEffect(() => {
    const currentSelectedId = selectedNodeIdRef.current;
    const previousSelectedNode = selectedNodeRef.current;
    if (!currentSelectedId) return;

    const nodeInArray = nodes.find((n) => n.id === currentSelectedId);

    if (!nodeInArray) {
      queueMicrotask(() => setSelectedNode(null));
      selectedNodeRef.current = null;
    } else if (nodeInArray !== previousSelectedNode) {
      queueMicrotask(() => setSelectedNode(nodeInArray));
      selectedNodeRef.current = nodeInArray;
    }
  }, [nodes]);

  // Build categories dynamically from blockCategories
  const categories = useMemo(() => {
    const allCategory = {
      id: "all",
      label: "All",
      icon: <CheckSquare className="w-4 h-4" />,
    };

    const dynamicCategories = blockCategories.map((cat) => {
      const IconComponent = cat.iconName ? iconRegistry[cat.iconName] : null;
      return {
        id: cat.id,
        label: cat.label,
        icon: IconComponent ? <IconComponent className="w-4 h-4" /> : null,
      };
    });

    return [allCategory, ...dynamicCategories];
  }, []);

  const contextValue = useMemo<WorkflowContextType>(
    () => ({
      nodes,
      edges,
      selectedNode,
      lastSaved,
      mobileMenuOpen,
      canvasDimensions,
      setNodes,
      setEdges,
      onNodesChange,
      onEdgesChange,
      setSelectedNode,
      handleNodeClick,
      handlePaneClick,
      handleNodeDataChange,
      deleteNodes,
      onNodesDelete,
      handleZoomIn,
      handleZoomOut,
      handleFitView,
      handleReactFlowInit,
      handleSave,
      handleRun,
      handleBlockClick,
      handleBlockDragStart,
      onDragOver,
      onDrop,
      onConnect,
      setMobileMenuOpen,
      isProtectedNode,
      isBlockDisabled,
      isSwapBlockDisabled,
      categories,
      hasUnsavedChanges,
    }),
    [
      nodes,
      edges,
      selectedNode,
      lastSaved,
      mobileMenuOpen,
      canvasDimensions,
      setNodes,
      setEdges,
      onNodesChange,
      onEdgesChange,
      handleNodeClick,
      handlePaneClick,
      handleNodeDataChange,
      deleteNodes,
      onNodesDelete,
      handleZoomIn,
      handleZoomOut,
      handleFitView,
      handleReactFlowInit,
      handleSave,
      handleRun,
      handleBlockClick,
      handleBlockDragStart,
      onDragOver,
      onDrop,
      onConnect,
      isProtectedNode,
      isBlockDisabled,
      isSwapBlockDisabled,
      categories,
      hasUnsavedChanges,
    ]
  );

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
};
