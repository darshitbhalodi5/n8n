"use client";

import React, { useCallback } from "react";
import { Typography } from "@/components/ui/Typography";
import type { ConnectionType } from "@/types/slack";

interface SlackConnectionTypeSelectorProps {
    connectionType: ConnectionType;
    onTypeChange: (type: ConnectionType) => void;
}

/**
 * Connection type selector (Webhook vs OAuth)
 * Accessible toggle buttons with proper ARIA attributes and keyboard navigation
 */
export const SlackConnectionTypeSelector = React.memo(function SlackConnectionTypeSelector({
    connectionType,
    onTypeChange,
}: SlackConnectionTypeSelectorProps) {
    /**
     * Handle keyboard navigation for radiogroup
     * Arrow Left/Right switches between options (ARIA best practice)
     */
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                // Toggle between the two options
                onTypeChange(connectionType === "webhook" ? "oauth" : "webhook");
            }
        },
        [connectionType, onTypeChange]
    );

    return (
        <div className="flex gap-2" role="radiogroup" aria-label="Connection type">
            <button
                type="button"
                role="radio"
                aria-checked={connectionType === "webhook"}
                onClick={() => onTypeChange("webhook")}
                onKeyDown={handleKeyDown}
                tabIndex={connectionType === "webhook" ? 0 : -1}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${connectionType === "webhook"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                    }`}
            >
                <Typography variant="bodySmall" className="font-medium">
                    Webhook
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                    Use webhook URL
                </Typography>
            </button>

            <button
                type="button"
                role="radio"
                aria-checked={connectionType === "oauth"}
                onClick={() => onTypeChange("oauth")}
                onKeyDown={handleKeyDown}
                tabIndex={connectionType === "oauth" ? 0 : -1}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${connectionType === "oauth"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                    }`}
            >
                <Typography variant="bodySmall" className="font-medium">
                    OAuth
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                    Select workspace &amp; channel
                </Typography>
            </button>
        </div>
    );
});
