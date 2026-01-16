"use client";

import React, { useState, useCallback } from "react";
import { Loader2, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { SlackNotificationBanner } from "./SlackNotificationBanner";
import type { SlackNotification, SlackLoadingState } from "@/types/slack";

interface SlackMessageTemplateProps {
    /** Current message template value */
    messageTemplate: string;
    /** Connection display name */
    connectionName: string;
    /** Connection type (webhook or oauth) */
    connectionType: "webhook" | "oauth";
    /** Channel name for OAuth connections */
    channelName?: string;
    /** Channel ID for OAuth connections */
    channelId?: string;
    /** Loading state */
    loading: SlackLoadingState;
    /** Notification to display */
    notification: SlackNotification | null;
    /** Called when message template changes */
    onMessageChange: (message: string) => void;
    /** Called to send a preview message */
    onSendPreview: () => Promise<void>;
}

/**
 * Message Template Card for Slack workflow configuration
 * 
 * This component allows users to configure the message that will be sent
 * when the workflow executes. It appears after a connection is selected.
 * 
 * Features:
 * - Message template input with placeholder support
 * - Connection summary display
 * - Preview/test functionality
 * - Character count hint
 */
export const SlackMessageTemplate = React.memo(function SlackMessageTemplate({
    messageTemplate,
    connectionName,
    connectionType,
    channelName,
    channelId,
    loading,
    notification,
    onMessageChange,
    onSendPreview,
}: SlackMessageTemplateProps) {
    const [isSending, setIsSending] = useState(false);

    const isOAuthWithoutChannel = connectionType === "oauth" && !channelId;
    const canSend = messageTemplate.trim() && !loading.processing && !isSending && !isOAuthWithoutChannel;
    const messageLength = messageTemplate.length;

    // Remove redundant "OAuth" suffix from connection name (we show it in the badge)
    const displayName = connectionName?.replace(/\s*OAuth\s*$/i, "").trim() || connectionName;

    const handleSendPreview = useCallback(async () => {
        if (!canSend) return;
        setIsSending(true);
        try {
            await onSendPreview();
        } finally {
            setIsSending(false);
        }
    }, [canSend, onSendPreview]);

    return (
        <Card className="p-4 space-y-4">
            {/* Header with connection summary */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <Typography variant="bodySmall" className="font-semibold text-foreground">
                        Message Configuration
                    </Typography>
                </div>

                {/* Connection Summary */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <Typography variant="caption" className="text-foreground font-medium truncate block">
                            {displayName}
                        </Typography>
                        <Typography variant="caption" className="text-muted-foreground">
                            {connectionType === "oauth" && channelName ? (
                                <>#{channelName}</>
                            ) : connectionType === "oauth" ? (
                                <span className="text-warning">⚠️ No channel selected</span>
                            ) : null}
                        </Typography>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${connectionType === "oauth"
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-secondary-foreground"
                        }`}>
                        {connectionType === "oauth" ? "OAuth" : "Webhook"}
                    </span>
                </div>
            </div>

            {/* OAuth without channel warning */}
            {isOAuthWithoutChannel && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                    <Typography variant="caption" className="text-warning">
                        Please select a channel.
                    </Typography>
                </div>
            )}

            {/* Message Template Input */}
            <div className="space-y-2">
                <label className="block">
                    <div className="flex items-center justify-between mb-1">
                        <Typography variant="caption" className="text-muted-foreground">
                            Message to Send
                        </Typography>
                        <Typography variant="caption" className="text-muted-foreground">
                            {messageLength > 0 && `${messageLength} chars`}
                        </Typography>
                    </div>
                    <textarea
                        value={messageTemplate}
                        onChange={(e) => onMessageChange(e.target.value)}
                        disabled={isOAuthWithoutChannel}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter the message you want to send when this workflow runs..."
                        rows={4}
                        aria-label="Slack message template"
                    />
                </label>
            </div>

            {/* Send Preview Button */}
            <div className="space-y-2">
                <Button
                    type="button"
                    onClick={handleSendPreview}
                    disabled={!canSend}
                    className="w-full gap-2"
                >
                    {isSending || loading.processing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending Preview...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Send Preview Message
                        </>
                    )}
                </Button>
            </div>

            {/* Notification Banner */}
            <SlackNotificationBanner notification={notification} />
        </Card>
    );
});
