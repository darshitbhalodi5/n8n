"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnMove,
  ReactFlowProvider,
  BackgroundVariant,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { nodeTypes as importedNodeTypes } from "../nodeTypes";

export interface WorkflowCanvasProps {
  className?: string;
  showBackground?: boolean;
  showMiniMap?: boolean;
  backgroundVariant?: BackgroundVariant;
  fitView?: boolean;
}

function WorkflowCanvasInner({
  className,
  showBackground = true,
  showMiniMap = false,
  backgroundVariant = BackgroundVariant.Dots,
  fitView = true,
}: WorkflowCanvasProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    handleNodeClick,
    handlePaneClick,
    handleReactFlowInit,
    setZoomLevel,
  } = useWorkflow();

  const nodeTypes = importedNodeTypes;

  const handleNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback<OnEdgesChange>(
    (changes) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  const handleConnect = useCallback<OnConnect>(
    (connection) => {
      onConnect(connection);
    },
    [onConnect]
  );

  const handleMove = useCallback<OnMove>(
    (_event, viewport) => {
      setZoomLevel(Math.round(viewport.zoom * 100));
    },
    [setZoomLevel]
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
        onInit={handleReactFlowInit}
        onMove={handleMove}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
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
