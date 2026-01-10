"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { iconRegistry } from "@/components/blocks";
import type { SwitchCaseData } from "@/components/blocks";

export interface SwitchNodeData {
  label: string;
  description?: string;
  /** Icon name from iconRegistry - serializable */
  iconName?: string;
  status?: "idle" | "running" | "success" | "error";
  blockId?: string;
  // Switch configuration
  valuePath?: string;
  cases?: SwitchCaseData[];
  [key: string]: unknown;
}

export interface SwitchNodeProps extends NodeProps<SwitchNodeData> {
  showHandles?: boolean;
  sourcePosition?: Position;
  targetPosition?: Position;
}

/**
 * SwitchNode - Multi-branch routing node for workflow canvas
 *
 * Features:
 * - Card-based surface design
 * - 1 input handle (target)
 * - Dynamic output handles based on configured cases (max 5)
 * - Icon support via iconName (serializable)
 * - Token-based styling
 * - Memoized for performance
 */
export const SwitchNode = React.memo(function SwitchNode({
  data,
  selected,
  showHandles = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: SwitchNodeProps) {
  // Resolve icon: prefer iconName (serializable)
  const IconComponent = data.iconName ? iconRegistry[data.iconName] : null;
  const renderedIcon = IconComponent ? (
    <IconComponent className="w-6 h-6" />
  ) : null;

  // Get cases for rendering handles
  const cases = data.cases || [];
  const caseCount = cases.length || 1; // At least 1 for default

  // Calculate handle positions based on number of cases
  // Distribute handles evenly along the right side
  const getHandleTopPosition = (index: number, total: number): string => {
    if (total === 1) return "50%";
    const step = 100 / (total + 1);
    return `${step * (index + 1)}%`;
  };

  // Color coding for cases
  const getCaseColor = (isDefault: boolean, index: number): string => {
    if (isDefault) return "bg-gray-400"; // Default case - neutral
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="relative group">
      {showHandles && (
        <>
          {/* Input handle (left) */}
          <Handle
            type="target"
            position={targetPosition}
            className="react-flow-handle"
            style={{
              left: targetPosition === Position.Left ? "-8px" : undefined,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />

          {/* Dynamic output handles based on cases */}
          {cases.map((switchCase, index) => (
            <Handle
              key={switchCase.id}
              type="source"
              position={sourcePosition}
              id={switchCase.id}
              className={cn(
                "react-flow-handle",
                getCaseColor(!!switchCase.isDefault, index)
              )}
              style={{
                right: sourcePosition === Position.Right ? "-8px" : undefined,
                top: getHandleTopPosition(index, caseCount),
                transform: "translateY(-50%)",
                width: "10px",
                height: "10px",
              }}
            />
          ))}

          {/* If no cases, show a single default handle */}
          {cases.length === 0 && (
            <Handle
              type="source"
              position={sourcePosition}
              id="default"
              className="react-flow-handle bg-gray-400"
              style={{
                right: sourcePosition === Position.Right ? "-8px" : undefined,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </>
      )}

      <Card
        className={cn(
          "w-16 transition-all relative",
          "border border-foreground/20 bg-card",
          "rounded-lg",
          selected && "ring-2 ring-primary/50 shadow-lg border-primary/30"
        )}
        style={{
          // Dynamic height based on case count
          height: `${Math.max(64, Math.min(120, caseCount * 24 + 16))}px`,
        }}
      >
        {/* Icon container */}
        <div className="flex items-center justify-center p-2 w-full h-full">
          {renderedIcon ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-background">
              {renderedIcon}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center rounded-lg bg-muted/20">
              <span className="text-xs font-bold text-muted-foreground">
                SW
              </span>
              {caseCount > 1 && (
                <span className="text-[10px] text-muted-foreground/70">
                  {caseCount}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
});

export default SwitchNode;
