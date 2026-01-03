"use client";

import React, { useCallback, useRef, useMemo, useState } from "react";
import { CheckSquare, LogIn } from "lucide-react";
import {
  WorkflowLayout,
  WorkflowSidebar,
  WorkflowRightSidebar,
} from "@/components/workflow-layout";
import { TooltipProvider, Button } from "@/components/ui";
import { UserMenu } from "@/components/user-menu";
import { Navbar } from "@/components/layout";
import { WorkflowCanvas, BaseNode, WalletNode } from "@/components/workflow";
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  ReactFlowInstance,
} from "reactflow";
import type { NodeProps } from "reactflow";
import { usePrivy } from "@privy-io/react-auth";

// Define handler types for React Flow events
type OnNodeClick = (event: React.MouseEvent, node: Node) => void;
type OnPaneClick = (event: React.MouseEvent) => void;
import {
  getBlockById,
  iconRegistry,
  blockCategories,
  type BlockDefinition,
} from "@/components/blocks";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Node type registry - React Flow handles deletion automatically
const nodeTypes = {
  base: (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
  telegram: (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
  mail: (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
  "send-message": (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
  "wallet-node": (props: NodeProps) => (
    <WalletNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
};

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Privy hooks for authentication and wallet access
  const { ready, authenticated, login } = usePrivy();

  // React Flow's built-in node deletion handler
  // This automatically handles Delete/Backspace keys and cleans up edges
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      // Get IDs of deleted nodes
      const deletedIds = deleted.map((node) => node.id);

      // Delete connected edges
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !deletedIds.includes(edge.source) &&
            !deletedIds.includes(edge.target)
        )
      );
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Parameters<typeof addEdge>[0]) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
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

        // Get icon/logo component for the node
        const IconComponent = blockDefinition.iconName
          ? iconRegistry[blockDefinition.iconName]
          : null;

        // Create new node
        const newNode: Node = {
          id: `${block.id}-${Date.now()}`,
          type: blockDefinition.nodeType || "base",
          position,
          data: {
            ...blockDefinition.defaultData,
            blockId: block.id, // Store block ID for right sidebar
            icon: IconComponent ? <IconComponent className="w-8 h-8" /> : null,
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

  // Check if wallet block is disabled (already on canvas)
  const isBlockDisabled = useCallback(
    (blockId: string) => {
      if (blockId === "wallet") {
        return nodes.some((n) => n.type === "wallet-node");
      }
      return false;
    },
    [nodes]
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
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              }
            : node
        )
      );
      // Update selected node if it's the one being edited
      if (selectedNode?.id === nodeId) {
        setSelectedNode({
          ...selectedNode,
          data: {
            ...selectedNode.data,
            ...data,
          },
        });
      }
    },
    [selectedNode, setNodes]
  );

  // Update selected node when nodes change (in case selected node was deleted)
  React.useEffect(() => {
    if (selectedNode) {
      const nodeExists = nodes.find((n) => n.id === selectedNode.id);
      if (!nodeExists) {
        setSelectedNode(null);
      } else {
        // Update selected node with latest data
        setSelectedNode(nodeExists);
      }
    }
  }, [nodes, selectedNode]);

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
    <>
      <Navbar />
      <TooltipProvider>
        <WorkflowLayout
        categories={categories}
        defaultCategory="all"
        selectedNode={selectedNode}
        sidebar={(activeCategory) => (
          <WorkflowSidebar
            activeCategory={activeCategory}
            onBlockDragStart={handleBlockDragStart}
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
          />
        )}
      >
        <div className="h-full bg-background p-6">
          <div className="h-full flex flex-col gap-4">
            {/* Canvas Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Workflow Canvas
                </h2>
                <p className="text-sm text-muted-foreground">
                  Drag blocks from sidebar and connect them to create your
                  workflow
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {nodes.length === 0
                    ? "No workflows found"
                    : `${nodes.length} node${nodes.length > 1 ? "s" : ""}`}
                </div>
                {/* Privy Login/Logout Button */}
                {ready && (
                  <div className="flex items-center gap-2">
                    {authenticated ? (
                      <UserMenu size="sm" />
                    ) : (
                      <Button
                        size="sm"
                        onClick={login}
                        className="gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Login / Sign Up
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Canvas */}
            <div
              className="flex-1 rounded-lg border border-border overflow-hidden bg-card"
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={(e) => {
                // Clicking on canvas background should cancel any delete modes
                // This is handled by the node's click-outside handler
                e.stopPropagation();
              }}
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
                onInit={(instance) => {
                  reactFlowInstance.current = instance;
                }}
              />
            </div>
          </div>
        </div>
      </WorkflowLayout>
    </TooltipProvider>
    </>
  );
}
