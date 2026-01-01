"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";

export interface WalletNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  status?: "idle" | "running" | "success" | "error";
}

export interface WalletNodeProps extends NodeProps<WalletNodeData> {
  showHandles?: boolean;
  sourcePosition?: Position;
  targetPosition?: Position;
}

export function WalletNode({
  data,
  selected,
  id,
  showHandles = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: WalletNodeProps) {

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
            }}
          />
          <Handle
            type="source"
            position={sourcePosition}
            className="react-flow-handle"
            style={{
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
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="w-8 h-8" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

