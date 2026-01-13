"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { iconRegistry } from "@/components/blocks";

export interface StartNodeData {
  label: string;
  blockId?: string;
  iconName?: string;
  [key: string]: unknown;
}

export interface StartNodeProps extends NodeProps<StartNodeData> {
  sourcePosition?: Position;
}

/**
 * StartNode - Special workflow start point node
 *
 * Features:
 * - Same square box design as other blocks
 * - Only has source handle (right side) - no input
 * - Cannot be deleted
 * - Simple icon-centered design
 */
export const StartNode = React.memo(function StartNode({
  data,
  selected,
  sourcePosition = Position.Right,
}: StartNodeProps) {
  // Get icon from registry
  const IconComponent = data.iconName ? iconRegistry[data.iconName] : null;

  return (
    <div className="relative group">
      {/* Only source handle - workflow starts here, no inputs */}
      <Handle
        type="source"
        position={sourcePosition}
        className="react-flow-handle"
        isConnectable={true}
        style={{
          right: sourcePosition === Position.Right ? "-8px" : undefined,
        }}
      />

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
          {IconComponent ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-background">
              <IconComponent className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-muted/20" />
          )}
        </div>
      </Card>
    </div>
  );
});

export default StartNode;
