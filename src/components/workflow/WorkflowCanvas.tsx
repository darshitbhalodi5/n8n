"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnNodesDelete,
  NodeTypes,
  ReactFlowProvider,
  BackgroundVariant,
  ConnectionMode,
  ReactFlowInstance,
} from "reactflow";

// Define handler types for React Flow events
type OnNodeClick = (event: React.MouseEvent, node: Node) => void;
type OnPaneClick = (event: React.MouseEvent) => void;
import "reactflow/dist/style.css";
import { cn } from "@/lib/utils";

export interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  onNodesDelete?: OnNodesDelete;
  nodeTypes?: NodeTypes;
  className?: string;
  showBackground?: boolean;
  showMiniMap?: boolean;
  backgroundVariant?: BackgroundVariant;
  fitView?: boolean;
  onInit?: (instance: ReactFlowInstance) => void;
  onNodeClick?: OnNodeClick;
  onPaneClick?: OnPaneClick;
}

function WorkflowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodesDelete,
  nodeTypes,
  className,
  showBackground = true,
  showMiniMap = false,
  backgroundVariant = BackgroundVariant.Dots,
  fitView = true,
  onInit,
  onNodeClick,
  onPaneClick,
}: WorkflowCanvasProps) {
  const handleNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      if (onNodesChange) {
        onNodesChange(changes);
      }
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback<OnEdgesChange>(
    (changes) => {
      if (onEdgesChange) {
        onEdgesChange(changes);
      }
    },
    [onEdgesChange]
  );

  const handleConnect = useCallback<OnConnect>(
    (connection) => {
      if (onConnect) {
        onConnect(connection);
      }
    },
    [onConnect]
  );

  return (
    <div
      className={cn(
        "w-full h-full min-h-[500px] rounded-lg border border-border bg-background",
        className
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView={fitView}
        connectionMode={ConnectionMode.Loose}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        nodesFocusable={true}
        deleteKeyCode={["Delete", "Backspace"]}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag={true}
        preventScrolling={false}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: {
            stroke: "hsl(var(--primary))",
            strokeWidth: 2,
          },
        }}
        className="workflow-canvas"
      >
        {showBackground && (
          <Background
            variant={backgroundVariant}
            gap={16}
            size={1}
            color="hsl(var(--muted-foreground) / 0.2)"
          />
        )}
        {showMiniMap && (
          <MiniMap
            className="bg-card! border-border!"
            nodeColor="hsl(var(--primary))"
            maskColor="hsl(var(--background) / 0.8)"
          />
        )}
      </ReactFlow>
    </div>
  );
}

/**
 * WorkflowCanvas - A generic React Flow canvas component
 *
 * Features:
 * - Token-based styling using CSS variables
 * - Optional Background and MiniMap
 * - Mouse-based zoom (scroll wheel)
 * - Pan on drag
 * - Fully controlled component pattern
 * - No business logic, pure presentation
 *
 * @example
 * ```tsx
 * <WorkflowCanvas
 *   nodes={nodes}
 *   edges={edges}
 *   onNodesChange={handleNodesChange}
 *   onEdgesChange={handleEdgesChange}
 *   onConnect={handleConnect}
 *   nodeTypes={customNodeTypes}
 *   showBackground
 * />
 * ```
 */
export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
