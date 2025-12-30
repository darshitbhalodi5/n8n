"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  ReactFlowProvider,
  BackgroundVariant,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { cn } from "@/lib/utils";

export interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  nodeTypes?: NodeTypes;
  className?: string;
  showBackground?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  backgroundVariant?: BackgroundVariant;
  fitView?: boolean;
}

function WorkflowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  className,
  showBackground = true,
  showControls = true,
  showMiniMap = false,
  backgroundVariant = BackgroundVariant.Dots,
  fitView = true,
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
        nodeTypes={nodeTypes}
        fitView={fitView}
        connectionMode={ConnectionMode.Loose}
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
        {showControls && (
          <Controls
            className="bg-card! border-border! text-foreground!"
            showInteractive={false}
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
 * - Optional Background, Controls, and MiniMap
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
 *   showControls
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

