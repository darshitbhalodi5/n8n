"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";
import { iconRegistry } from "@/components/blocks";

export interface WalletNodeData {
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

export interface WalletNodeProps extends NodeProps<WalletNodeData> {
    showHandles?: boolean;
    sourcePosition?: Position;
    targetPosition?: Position;
}

/**
 * WalletNode - Specialized node for wallet/account blocks
 * 
 * Features:
 * - Same structure as BaseNode but with wallet-specific defaults
 * - Primary-colored fallback icon if no icon specified
 * - Serializable via iconName property
 */
export const WalletNode = React.memo(function WalletNode({
    data,
    selected,
    showHandles = true,
    sourcePosition = Position.Right,
    targetPosition = Position.Left,
}: WalletNodeProps) {
    // Resolve icon: prefer iconName (serializable), fallback to legacy icon prop
    const IconComponent = data.iconName ? iconRegistry[data.iconName] : null;
    const renderedIcon = IconComponent ? (
        <IconComponent className="w-8 h-8" />
    ) : (
        // Legacy support: direct icon JSX
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
                {/* Icon container */}
                <div className="flex items-center justify-center p-2 w-full h-full">
                    {renderedIcon ? (
                        <div className="w-full h-full flex items-center justify-center rounded-lg bg-background">
                            {renderedIcon}
                        </div>
                    ) : (
                        // Wallet-specific fallback with primary color
                        <div className="w-full h-full flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Wallet className="w-8 h-8" />
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
});
