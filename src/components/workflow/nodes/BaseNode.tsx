"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { iconRegistry } from "@/components/blocks";

export interface BaseNodeData {
  label: string;
  description?: string;
  /** Icon name from iconRegistry - serializable */
  iconName?: string;
  /** @deprecated Use iconName instead. JSX is not serializable. */
  icon?: React.ReactNode;
  status?: "idle" | "running" | "success" | "error";
  blockId?: string;
  [key: string]: unknown;
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
 * - Icon support via iconName (serializable) or legacy icon prop
 * - Token-based styling
 * - Memoized for performance
 */
export const BaseNode = React.memo(function BaseNode({
  data,
  selected,
  showHandles = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: BaseNodeProps) {
  // Resolve icon: prefer iconName (serializable), fallback to legacy icon prop
  const IconComponent = data.iconName ? iconRegistry[data.iconName] : null;
  const renderedIcon = IconComponent ? (
    <IconComponent className="w-8 h-8" />
  ) : (
    // Legacy support: direct icon JSX (will be removed in future)
    data.icon || null
  );

  return (
    <div className="relative group">
      {showHandles && (
        <>
          <Handle
            type="target"
            position={targetPosition}
            className="react-flow-handle"
            isConnectable={true}
            style={{
              left: targetPosition === Position.Left ? "-8px" : undefined,
              right: targetPosition === Position.Right ? "8px" : undefined,
            }}
          />
          <Handle
            type="source"
            position={sourcePosition}
            className="react-flow-handle"
            isConnectable={true}
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
        {/* Icon container */}
        <div className="flex items-center justify-center p-2 w-full h-full">
          {renderedIcon ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-background">
              {renderedIcon}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-muted/20" />
          )}
        </div>
      </Card>
    </div>
  );
});
