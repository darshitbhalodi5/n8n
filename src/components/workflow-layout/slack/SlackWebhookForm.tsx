"use client";

import React from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import type { SlackLoadingState } from "@/types/slack";

/**
 * Validates Slack webhook URL format
 * Expected format: https://hooks.slack.com/services/T.../B.../...
 */
const isValidSlackWebhookUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (not filled yet)
    return /^https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[a-zA-Z0-9]+$/i.test(url.trim());
};

interface SlackWebhookFormProps {
    webhookUrl: string;
    connectionName: string;
    testMessage: string;
    isTestSuccessful: boolean;
    loading: SlackLoadingState;
    onWebhookUrlChange: (url: string) => void;
    onConnectionNameChange: (name: string) => void;
    onTestMessageChange: (message: string) => void;
    onTest: () => void;
    onSave: () => void;
    onResetTestState: () => void;
}

/**
 * Webhook creation form with test-before-save workflow
 * Includes URL format validation for better UX
 */
export const SlackWebhookForm = React.memo(function SlackWebhookForm({
    webhookUrl,
    connectionName,
    testMessage,
    isTestSuccessful,
    loading,
    onWebhookUrlChange,
    onConnectionNameChange,
    onTestMessageChange,
    onTest,
    onSave,
    onResetTestState,
}: SlackWebhookFormProps) {
    const isProcessing = loading.testing || loading.saving;
    const isValidUrl = isValidSlackWebhookUrl(webhookUrl);
    const hasUrl = webhookUrl.trim().length > 0;
    const canTest = hasUrl && isValidUrl && testMessage.trim() && !isProcessing;
    const canSave = hasUrl && isValidUrl && isTestSuccessful && !isProcessing;

    return (
        <>
            <div className="flex items-start justify-between">
                <Typography variant="caption" className="text-muted-foreground">
                    Create a new Slack webhook connection
                </Typography>
                {!isTestSuccessful && (
                    <Typography variant="caption" className="text-warning">
                        Test required before save
                    </Typography>
                )}
            </div>

            {/* Connection Name */}
            <div className="space-y-2">
                <label className="block">
                    <Typography variant="caption" className="text-muted-foreground mb-1">
                        Connection Name (Optional)
                    </Typography>
                    <input
                        type="text"
                        value={connectionName}
                        onChange={(e) => onConnectionNameChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="My Slack Workspace"
                    />
                </label>
            </div>

            {/* Webhook URL */}
            <div className="space-y-2">
                <label className="block">
                    <Typography variant="caption" className="text-muted-foreground mb-1">
                        Webhook URL
                    </Typography>
                    <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => {
                            onWebhookUrlChange(e.target.value);
                            onResetTestState();
                        }}
                        className={`w-full px-3 py-2 text-xs border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono ${hasUrl && !isValidUrl ? "border-destructive" : "border-border"
                            }`}
                        placeholder="https://hooks.slack.com/services/..."
                        aria-invalid={hasUrl && !isValidUrl}
                        aria-describedby={hasUrl && !isValidUrl ? "webhook-url-error" : undefined}
                    />
                </label>
                {/* Validation Error */}
                {hasUrl && !isValidUrl && (
                    <Typography
                        id="webhook-url-error"
                        variant="caption"
                        className="text-destructive"
                        role="alert"
                    >
                        ⚠️ Invalid Slack webhook URL format. Expected: https://hooks.slack.com/services/T.../B.../...
                    </Typography>
                )}
            </div>

            {/* Test Message */}
            <div className="space-y-2">
                <label className="block">
                    <Typography variant="caption" className="text-muted-foreground mb-1">
                        Test Message
                    </Typography>
                    <textarea
                        value={testMessage}
                        onChange={(e) => onTestMessageChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Hello from FlowForge! 🚀"
                        rows={2}
                    />
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    onClick={onTest}
                    disabled={!canTest}
                    variant="outline"
                    className="flex-1 gap-2"
                    size="sm"
                >
                    {loading.testing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Testing...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Test
                        </>
                    )}
                </Button>
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={!canSave}
                    className="flex-1 gap-2"
                    size="sm"
                    title={!isTestSuccessful ? "Please test the webhook first" : ""}
                >
                    {loading.saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            Save
                        </>
                    )}
                </Button>
            </div>

            {/* Help Text */}
            {!isTestSuccessful && !isProcessing && (
                <Typography variant="caption" className="text-muted-foreground">
                    💡 Click &quot;Test&quot; to verify your webhook works before saving
                </Typography>
            )}
        </>
    );
});
