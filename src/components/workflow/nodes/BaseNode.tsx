"use client";

import React, { useState, useEffect, useRef } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export interface BaseNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  status?: "idle" | "running" | "success" | "error";
}

export interface BaseNodeProps extends NodeProps<BaseNodeData> {
  showHandles?: boolean;
  sourcePosition?: Position;
  targetPosition?: Position;
}

/**
 * BaseNode - Generic node component for workflow canvas
 *
 * Features:
 * - Card-based surface design
 * - Configurable handles (connection points)
 * - Status indicator
 * - Icon support
 * - Token-based styling
 *
 * @example
 * ```tsx
 * const nodeTypes = {
 *   custom: (props: NodeProps) => (
 *     <BaseNode {...props} showHandles sourcePosition={Position.Right} />
 *   ),
 * };
 * ```
 */
// Global state to track which node is in delete mode (only one at a time)
const deleteModeListeners = new Set<(nodeId: string | null) => void>();

function setNodeInDeleteMode(nodeId: string | null) {
  deleteModeListeners.forEach((listener) => listener(nodeId));
}

export function BaseNode({
  data,
  selected,
  id,
  showHandles = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: BaseNodeProps) {
  const { deleteElements } = useReactFlow();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  // Listen for global delete mode changes (when another node enters delete mode)
  useEffect(() => {
    const listener = (activeNodeId: string | null) => {
      if (activeNodeId !== id && isDeleteMode) {
        setIsDeleteMode(false);
      }
    };

    deleteModeListeners.add(listener);
    return () => {
      deleteModeListeners.delete(listener);
    };
  }, [id, isDeleteMode]);

  // Cancel delete mode when clicking outside, on other nodes, or pressing Escape
  useEffect(() => {
    if (!isDeleteMode) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is outside this node
      if (nodeRef.current && !nodeRef.current.contains(target)) {
        // Check if clicking on another node or canvas
        const isReactFlowNode = target.closest('.react-flow__node');
        const isReactFlowPane = target.closest('.react-flow__pane');
        const isReactFlowBackground = target.closest('.react-flow__background');
        
        // If clicking on another node, canvas, or background, cancel delete mode
        if (isReactFlowNode || isReactFlowPane || isReactFlowBackground) {
          setIsDeleteMode(false);
          setNodeInDeleteMode(null);
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDeleteMode(false);
        setNodeInDeleteMode(null);
      }
    };

    // Use both mousedown and click to catch all interactions
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDeleteMode, id]);

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleteMode(true);
    setNodeInDeleteMode(id || null);
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (id) {
      setNodeInDeleteMode(null);
      deleteElements({ nodes: [{ id }] });
    }
  };

  return (
    <div className="relative group" ref={nodeRef}>
      {showHandles && (
        <>
          <Handle
            type="target"
            position={targetPosition}
            className="react-flow-handle"
            style={{
              left: targetPosition === Position.Left ? "-8px" : undefined,
              right: targetPosition === Position.Right ? undefined : undefined,
            }}
          />
          <Handle
            type="source"
            position={sourcePosition}
            className="react-flow-handle"
            style={{
              left: sourcePosition === Position.Left ? "-8px" : undefined,
              right: sourcePosition === Position.Right ? "-8px" : undefined,
            }}
          />
        </>
      )}

      <Card
        className={cn(
          "min-w-[240px] max-w-[320px] transition-all relative",
          "border border-foreground/20 bg-card",
          "rounded-lg",
          selected &&
            !isDeleteMode &&
            "ring-2 ring-primary/50 shadow-lg border-primary/30",
          isDeleteMode && "border-destructive bg-destructive/5"
        )}
      >
        {isDeleteMode ? (
          // Delete confirmation state - entire block becomes delete button
          <button
            onClick={handleDeleteConfirm}
            onMouseDown={(e) => e.stopPropagation()}
            type="button"
            className={cn(
              "w-full h-full min-h-[72px] px-6",
              "flex items-center justify-center gap-3",
              "bg-destructive hover:bg-destructive/90",
              "text-destructive-foreground",
              "rounded-lg transition-all",
              "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
              "cursor-pointer font-medium"
            )}
            style={{ pointerEvents: "auto" }}
            aria-label="Confirm delete"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-base font-semibold">Delete</span>
          </button>
        ) : (
          // Normal block state - horizontal layout
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Icon */}
            {data.icon && (
              <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                {data.icon}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground leading-tight truncate">
                {data.label}
              </div>
              {data.description && (
                <div className="text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-1">
                  {data.description}
                </div>
              )}
            </div>

            {/* Trash icon - rounded square background */}
            {id && (
              <button
                onClick={handleTrashClick}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
                className={cn(
                  "shrink-0 w-8 h-8 rounded-md",
                  "bg-muted/50 border border-border/50",
                  "flex items-center justify-center",
                  "transition-all",
                  "hover:bg-destructive/10 hover:border-destructive/50",
                  "hover:text-destructive",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "cursor-pointer"
                )}
                style={{ pointerEvents: "auto" }}
                aria-label="Delete node"
                title="Click to delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
