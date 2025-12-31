"use client";

import React, { useCallback, useRef } from "react";
import { CheckSquare, Share2 } from "lucide-react";
import { WorkflowLayout, WorkflowSidebar } from "@/components/workflow-layout";
import { TooltipProvider } from "@/components/ui";
import { WorkflowCanvas, BaseNode } from "@/components/workflow";
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
import {
  getBlockById,
  iconRegistry,
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
};

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

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

        // Get position relative to canvas
        const reactFlowBounds = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Get icon component for the node
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
            icon: IconComponent ? <IconComponent className="w-4 h-4" /> : null,
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error("Error dropping block:", error);
      }
    },
    [setNodes]
  );

  const handleBlockDragStart = useCallback(() => {
    // Optional: Add visual feedback or tracking
  }, []);

  // React Flow handles keyboard deletion automatically via deleteKeyCode prop

  // Build categories with icons from blockCategories
  const categories = [
    { id: "all", label: "All", icon: <CheckSquare className="w-4 h-4" /> },
    {
      id: "social",
      label: "Social",
      icon: <Share2 className="w-4 h-4" />,
    },
  ];

  return (
    <TooltipProvider>
      <WorkflowLayout
        categories={categories}
        defaultCategory="all"
        sidebar={(activeCategory) => (
          <WorkflowSidebar
            activeCategory={activeCategory}
            onBlockDragStart={handleBlockDragStart}
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
              <div className="text-sm text-muted-foreground">
                {nodes.length === 0
                  ? "No workflows found"
                  : `${nodes.length} node${nodes.length > 1 ? "s" : ""}`}
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
                onInit={(instance) => {
                  reactFlowInstance.current = instance;
                }}
              />
            </div>
          </div>
        </div>
      </WorkflowLayout>
    </TooltipProvider>
  );
}
