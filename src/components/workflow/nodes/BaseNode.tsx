"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

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

const statusColors = {
  idle: "bg-muted",
  running: "bg-primary animate-pulse",
  success: "bg-success",
  error: "bg-destructive",
};

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
export function BaseNode({
  data,
  selected,
  showHandles = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: BaseNodeProps) {
  const status = data.status || "idle";

  return (
    <div className="relative">
      {showHandles && (
        <>
          <Handle
            type="target"
            position={targetPosition}
            className={cn(
              "w-3! h-3! bg-primary! border-2! border-background!",
              "hover:bg-primary/80 transition-colors"
            )}
          />
          <Handle
            type="source"
            position={sourcePosition}
            className={cn(
              "w-3! h-3! bg-primary! border-2! border-background!",
              "hover:bg-primary/80 transition-colors"
            )}
          />
        </>
      )}

      <Card
        className={cn(
          "min-w-[200px] max-w-[300px] transition-shadow",
          selected && "ring-2 ring-ring shadow-lg"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {data.icon && (
              <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary/10 text-primary">
                {data.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm truncate">{data.label}</CardTitle>
            </div>
            <div
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                statusColors[status]
              )}
              title={status}
            />
          </div>
        </CardHeader>
        {data.description && (
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {data.description}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

