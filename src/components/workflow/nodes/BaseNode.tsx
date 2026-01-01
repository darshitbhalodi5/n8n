"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
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
 * - Icon/logo support
 * - Token-based styling
 * - Minimal design (delete handled in right sidebar)
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
export function BaseNode({
  data,
  selected,
  showHandles = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: BaseNodeProps) {

  return (
    <div className="relative group">
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
          "w-16 h-16 transition-all relative",
          "border border-foreground/20 bg-card",
          "rounded-lg",
          selected && "ring-2 ring-primary/50 shadow-lg border-primary/30"
        )}
      >
        {/* Simple icon/logo only */}
        <div className="flex items-center justify-center p-2 w-full h-full">
          {data.icon ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-background">
              {data.icon}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-muted/20" />
          )}
        </div>
      </Card>
    </div>
  );
}
