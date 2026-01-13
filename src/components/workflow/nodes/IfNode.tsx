"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { iconRegistry } from "@/components/blocks";

export interface IfNodeData {
  label: string;
  description?: string;
  /** Icon name from iconRegistry - serializable */
  iconName?: string;
  status?: "idle" | "running" | "success" | "error";
  blockId?: string;
  // Condition configuration
  leftPath?: string;
  operator?: string;
  rightValue?: string;
  [key: string]: unknown;
}

export interface IfNodeProps extends NodeProps<IfNodeData> {
  showHandles?: boolean;
  sourcePosition?: Position;
  targetPosition?: Position;
}

/**
 * IfNode - Conditional branching node for workflow canvas
 *
 * Features:
 * - Card-based surface design (diamond shape via CSS)
 * - 1 input handle (target)
 * - 2 output handles (true/false sources)
 * - Icon support via iconName (serializable)
 * - Token-based styling
 * - Memoized for performance
 */
export const IfNode = React.memo(function IfNode({
  data,
  selected,
  showHandles = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: IfNodeProps) {
  // Resolve icon: prefer iconName (serializable)
  const IconComponent = data.iconName ? iconRegistry[data.iconName] : null;
  const renderedIcon = IconComponent ? (
    <IconComponent className="w-6 h-6" />
  ) : null;

  return (
    <div className="relative group">
      {showHandles && (
        <>
          {/* Input handle (left) */}
          <Handle
            type="target"
            position={targetPosition}
            className="react-flow-handle"
            isConnectable={true}
            style={{
              left: targetPosition === Position.Left ? "-8px" : undefined,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          
          {/* True output handle (top-right) */}
          <Handle
            type="source"
            position={sourcePosition}
            id="true"
            className="react-flow-handle bg-green-500!"
            isConnectable={true}
            style={{
              right: sourcePosition === Position.Right ? "-8px" : undefined,
              top: "25%",
              transform: "translateY(-50%)",
            }}
          />
          
          {/* False output handle (bottom-right) */}
          <Handle
            type="source"
            position={sourcePosition}
            id="false"
            className="react-flow-handle bg-red-500!"
            isConnectable={true}
            style={{
              right: sourcePosition === Position.Right ? "-8px" : undefined,
              top: "75%",
              transform: "translateY(-50%)",
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
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-muted/20">
              <span className="text-xs font-bold text-muted-foreground">IF</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
});

export default IfNode;

