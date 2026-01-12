"use client";

import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import { CheckSquare } from "lucide-react";
import {
  WorkflowLayout,
  WorkflowSidebar,
  WorkflowRightSidebar,
} from "@/components/workflow-layout";
import { TooltipProvider } from "@/components/ui";
import { Navbar } from "@/components/layout";
import {
  WorkflowCanvas,
  nodeTypes,
  WorkflowToolbar,
  WorkflowStatusBar,
} from "@/components/workflow";
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
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePrivyEmbeddedWallet } from "@/hooks/usePrivyEmbeddedWallet";
import { arbitrum } from "viem/chains";

// The Start node ID - used to identify and protect it from deletion
const START_NODE_ID = "start-node";

// Define handler types for React Flow events
type OnNodeClick = (event: React.MouseEvent, node: Node) => void;
type OnPaneClick = (event: React.MouseEvent) => void;

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
    // Deletable is hint to React Flow, we also enforce this in our code
    deletable: false,
  },
];
const initialEdges: Edge[] = [];

// nodeTypes imported from centralized location to prevent re-creation on every render

function WorkflowPageInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs to track the selected node without causing re-renders
  // This pattern prevents infinite loops and stabilizes callbacks
  const selectedNodeIdRef = useRef<string | null>(null);
  const selectedNodeRef = useRef<Node | null>(null);
  // Timeout ref for cleanup on unmount (prevents memory leaks)
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

  // Responsive canvas dimensions hook (fixes window.innerWidth in callbacks)
  const canvasDimensions = useCanvasDimensions();

  // Warn users when leaving with unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    // Consider having unsaved changes when there are nodes beyond the start node
    // and the workflow hasn't been saved
    return nodes.length > 1 && !lastSaved;
  }, [nodes.length, lastSaved]);

  useUnsavedChanges({ hasUnsavedChanges });

  // Canvas control handlers
  const handleZoomIn = useCallback(() => {
    reactFlowInstance.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.current?.zoomOut();
  }, []);

  const handleFitView = useCallback(() => {
    reactFlowInstance.current?.fitView({ padding: 0.2 });
  }, []);

  // Memoized onInit callback to prevent recreation on every render
  const handleReactFlowInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const handleSave = useCallback(() => {
    setLastSaved(new Date());
    // TODO: Implement actual save logic
    console.log("Saving workflow...", { nodes, edges });
  }, [nodes, edges]);

  const handleRun = useCallback(() => {
    const executeWorkflow = async () => {
      try {
        console.log("Running workflow...", { nodes, edges });

        // Import the workflow API
        const { saveAndExecuteWorkflow } = await import("@/utils/workflow-api");

        // In production, get this from auth context
        const userId = "demo-user-" + Date.now();

        // Save and execute the workflow
        const result = await saveAndExecuteWorkflow({
          userId,
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
          `Error: ${error instanceof Error ? error.message : String(error)
          }\n\n` +
          `Is the backend running?`
        );
      }
    };

    executeWorkflow();
  }, [nodes, edges]);

  /**
   * Check if a node is protected from deletion (e.g., Start node)
   */
  const isProtectedNode = useCallback((nodeId: string): boolean => {
    return nodeId === START_NODE_ID;
  }, []);

  /**
   * Shared utility to delete nodes and their connected edges
   * Extracted to avoid duplication between keyboard handler and onNodesDelete
   * Note: Start node cannot be deleted - it's filtered out automatically
   */
  const deleteNodes = useCallback(
    (nodeIds: string[]) => {
      // Filter out protected nodes (Start node)
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
      // Check if user is typing in an input field - don't intercept those events
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

      // Delete/Backspace: Delete selected node (using ref to avoid stale closure)
      // ONLY when not typing in an input field
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
      if (!reactFlowInstance.current) {
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

      // Use utility to calculate canvas center (eliminates duplicate logic)
      // Pass null for selectedNode - we use the ref to avoid stale closures
      const canvasCenter = calculateCanvasCenter(
        reactFlowInstance.current,
        canvasDimensions,
        null // Position at center, not offset
      );

      // Create new node at center with SERIALIZABLE data
      // iconName is stored instead of JSX for proper serialization/persistence
      const newNode: Node = {
        id: `${block.id}-${Date.now()}`,
        type: blockDefinition.nodeType || "base",
        position: canvasCenter,
        data: {
          ...blockDefinition.defaultData,
          blockId: block.id,
          iconName: blockDefinition.iconName, // Serializable - resolved at render
        },
      };

      setNodes((nds) => nds.concat(newNode));

      // Close mobile menu after adding
      setMobileMenuOpen(false);
    },
    [nodes, setNodes, canvasDimensions] // Removed selectedNode - use ref instead
  );

  // React Flow's built-in node deletion handler
  // Uses shared deleteNodes utility for consistency
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const deletedIds = deleted.map((node) => node.id);
      // Use shared utility (edges cleanup and selection clear handled there)
      deleteNodes(deletedIds);
    },
    [deleteNodes]
  );

  const onConnect = useCallback(
    (connection: Parameters<typeof addEdge>[0]) => {
      setEdges((eds) => {
        // Create the new edge with proper typing
        const baseEdge = {
          ...connection,
          type: "smoothstep",
          animated: true,
        };

        // Get the source node for conditional handling
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
            // Color mapping for switch cases
            const caseColors = [
              { stroke: "#3b82f6", fill: "#1e40af" }, // blue
              { stroke: "#22c55e", fill: "#166534" }, // green
              { stroke: "#eab308", fill: "#854d0e" }, // yellow
              { stroke: "#a855f7", fill: "#6b21a8" }, // purple
            ];

            const caseIndex = cases
              .filter((c) => !c.isDefault)
              .findIndex((c) => c.id === matchedCase.id);
            const isDefault = matchedCase.isDefault;

            const color = isDefault
              ? { stroke: "#6b7280", fill: "#374151" } // gray for default
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
      if (!blockData || !reactFlowInstance.current) {
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

        // Get position relative to canvas
        const reactFlowBounds = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Create new node with SERIALIZABLE data
        // iconName is stored instead of JSX for proper serialization/persistence
        const newNode: Node = {
          id: `${block.id}-${Date.now()}`,
          type: blockDefinition.nodeType || "base",
          position,
          data: {
            ...blockDefinition.defaultData,
            blockId: block.id, // Store block ID for right sidebar
            iconName: blockDefinition.iconName, // Serializable - resolved at render
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

      // Relay is disabled for both networks
      if (blockId === "relay") {
        return true;
      }

      // 1inch is only available on mainnet (disabled on Sepolia)
      if (blockId === "oneinch") {
        return !isMainnet; // Disabled if not mainnet (including when chainId is null)
      }

      // Uniswap is available on both networks
      if (blockId === "uniswap") {
        return false; // Always enabled
      }

      // For non-swap blocks, not disabled by network
      return false;
    },
    [chainId]
  );

  // Check if block is disabled (wallet already on canvas or network restrictions)
  const isBlockDisabled = useCallback(
    (blockId: string) => {
      // Check if wallet block is already on canvas
      if (blockId === "wallet") {
        return nodes.some((n) => n.type === "wallet-node");
      }

      // Check network availability for swap blocks
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
  // Uses ref pattern for stable callback that doesn't recreate on selectedNode changes
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

        // If the edited node is selected, also update selectedNode state
        // We do this inside setNodes to ensure we have the latest data
        if (selectedNodeIdRef.current === nodeId) {
          const updatedNode = updatedNodes.find((n) => n.id === nodeId);
          if (updatedNode) {
            // Clear any pending timeout to prevent stale updates
            if (pendingUpdateTimeoutRef.current) {
              clearTimeout(pendingUpdateTimeoutRef.current);
            }
            // Queue the selectedNode update for after this render (with cleanup)
            pendingUpdateTimeoutRef.current = setTimeout(() => {
              setSelectedNode(updatedNode);
              pendingUpdateTimeoutRef.current = null;
            }, 0);
          }
        }

        return updatedNodes;
      });
    },
    [setNodes] // Stable! No selectedNode in deps
  );

  // Sync selectedNode with nodes array when nodes change
  // Uses ref pattern to prevent infinite loops
  useEffect(() => {
    const currentSelectedId = selectedNodeIdRef.current;
    const previousSelectedNode = selectedNodeRef.current;
    if (!currentSelectedId) return;

    const nodeInArray = nodes.find((n) => n.id === currentSelectedId);

    if (!nodeInArray) {
      // Node was deleted
      queueMicrotask(() => setSelectedNode(null));
      selectedNodeRef.current = null;
    } else if (nodeInArray !== previousSelectedNode) {
      // Node data changed - sync it
      // Only update if the reference actually changed to prevent loops
      queueMicrotask(() => setSelectedNode(nodeInArray));
      selectedNodeRef.current = nodeInArray;
    }
  }, [nodes]); // Only depend on nodes, not selectedNode

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

  return (
    <div className="h-screen flex flex-col">
      <TooltipProvider>
        <WorkflowLayout
          categories={categories}
          defaultCategory="all"
          selectedNode={selectedNode}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuOpenChange={setMobileMenuOpen}
          onMobileConfigClose={() => setSelectedNode(null)}
          sidebar={(activeCategory) => (
            <WorkflowSidebar
              activeCategory={activeCategory}
              onBlockDragStart={handleBlockDragStart}
              onBlockClick={handleBlockClick}
              isBlockDisabled={isBlockDisabled}
            />
          )}
          rightSidebar={(node) => (
            <WorkflowRightSidebar
              selectedNode={node}
              onNodeDataChange={handleNodeDataChange}
              onNodeDelete={(nodeId) => {
                setNodes((nds) => nds.filter((n) => n.id !== nodeId));
                setEdges((eds) =>
                  eds.filter(
                    (edge) => edge.source !== nodeId && edge.target !== nodeId
                  )
                );
                if (selectedNode?.id === nodeId) {
                  setSelectedNode(null);
                }
              }}
              onClose={() => setSelectedNode(null)}
            />
          )}
        >
          <div className="h-full bg-background relative">
            {/* Floating Toolbar */}
            <WorkflowToolbar
              workflowName="Untitled Workflow"
              nodeCount={nodes.length}
              canRun={nodes.length > 0}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
              onSave={handleSave}
              onRun={handleRun}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
            />

            {/* Workflow Canvas - Full Height */}
            <div
              className="h-full w-full"
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={(e) => {
                e.stopPropagation();
              }}
              role="application"
              aria-label="Workflow canvas - drag blocks here to build your workflow"
            >
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodesDelete={onNodesDelete}
                nodeTypes={nodeTypes}
                showBackground
                className="h-full"
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                onInit={handleReactFlowInit}
              />
            </div>

            {/* Status Bar */}
            <WorkflowStatusBar
              lastSaved={lastSaved}
              edgeCount={edges.length}
              nodeCount={nodes.length}
            />
          </div>
        </WorkflowLayout>
      </TooltipProvider>
    </div>
  );
}

// Wrap with ErrorBoundary for production error handling
export default function WorkflowPage() {
  return (
    <ErrorBoundary>
      <WorkflowPageInner />
    </ErrorBoundary>
  );
}
