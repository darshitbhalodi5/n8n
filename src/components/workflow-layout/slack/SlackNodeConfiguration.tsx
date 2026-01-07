"use client";

import React from "react";
import { Loader2, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useSlackConnection } from "@/hooks/useSlackConnection";
import { SlackAuthenticationCard } from "./SlackAuthenticationCard";
import { SlackConnectionTypeSelector } from "./SlackConnectionTypeSelector";
import { SlackWebhookForm } from "./SlackWebhookForm";
import { SlackOAuthForm } from "./SlackOAuthForm";
import { SlackConnectionItem } from "./SlackConnectionItem";
import { SlackMessageTemplate } from "./SlackMessageTemplate";
import { SlackDeleteConnectionDialog } from "./SlackDeleteConnectionDialog";
import { SlackNotificationBanner } from "./SlackNotificationBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface SlackNodeConfigurationProps {
    nodeData: Record<string, unknown>;
    /**
     * Batched data change handler - accepts multiple updates in a single object
     * to prevent UI flicker from multiple state updates
     */
    handleDataChange: (updates: Record<string, unknown>) => void;
    authenticated: boolean;
    login: () => void;
}

/**
 * Slack Node Configuration Component
 * Refactored to use custom hook and decomposed sub-components
 *
 * Flow:
 * 1. User creates webhook/OAuth connection (with testing during setup)
 * 2. User selects a connection for the node
 * 3. User configures the message that will be sent when workflow executes
 *
 * Features:
 * - Webhook and OAuth connection support
 * - Channel selection for OAuth connections
 * - Message template configuration for workflow execution
 * - Centralized notification handling
 */
function SlackNodeConfigurationInner({
    nodeData,
    handleDataChange,
    authenticated,
    login,
}: SlackNodeConfigurationProps) {
    const slack = useSlackConnection({
        nodeData,
        onDataChange: handleDataChange,
        authenticated,
    });

    const hasConnection = !!nodeData.slackConnectionId;
    const connectionType = (nodeData.slackConnectionType as "webhook" | "oauth") || "webhook";

    // Show auth card if not authenticated
    if (!authenticated) {
        return <SlackAuthenticationCard onLogin={login} />;
    }

    return (
        <div className="space-y-4">
            {/* Connections Management Card */}
            <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <Typography variant="bodySmall" className="font-semibold text-foreground">
                        Slack Connections
                    </Typography>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => slack.actions.setShowCreateForm(!slack.showCreateForm)}
                        className="gap-1"
                    >
                        <Plus className="w-3 h-3" />
                        {slack.showCreateForm ? "Cancel" : "New"}
                    </Button>
                </div>

                {/* Create New Connection Form */}
                {slack.showCreateForm && (
                    <div className="space-y-3 p-3 border border-border rounded-lg bg-secondary/20">
                        <Typography variant="caption" className="text-muted-foreground">
                            Choose connection method:
                        </Typography>

                        <SlackConnectionTypeSelector
                            connectionType={slack.connectionType}
                            onTypeChange={slack.actions.setConnectionType}
                        />

                        {/* Webhook Form */}
                        {slack.connectionType === "webhook" && (
                            <SlackWebhookForm
                                webhookUrl={slack.webhookUrl}
                                connectionName={slack.connectionName}
                                testMessage={slack.testMessage}
                                isTestSuccessful={slack.isTestSuccessful}
                                loading={slack.loading}
                                onWebhookUrlChange={slack.actions.setWebhookUrl}
                                onConnectionNameChange={slack.actions.setConnectionName}
                                onTestMessageChange={slack.actions.setTestMessage}
                                onTest={() => slack.actions.testWebhook(slack.webhookUrl, slack.testMessage)}
                                onSave={slack.actions.saveWebhook}
                                onResetTestState={slack.actions.resetTestState}
                            />
                        )}

                        {/* OAuth Form */}
                        {slack.connectionType === "oauth" && (
                            <SlackOAuthForm
                                loading={slack.loading}
                                onAuthorize={slack.actions.authorizeOAuth}
                            />
                        )}
                    </div>
                )}

                {/* Existing Connections List */}
                {slack.loading.connections ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="ml-2 text-sm text-muted-foreground">
                            Loading connections...
                        </span>
                    </div>
                ) : slack.connections.length > 0 ? (
                    <div className="space-y-2">
                        <Typography variant="caption" className="text-muted-foreground">
                            Select a connection for this block:
                        </Typography>
                        {slack.connections.map((connection) => (
                            <SlackConnectionItem
                                key={connection.id}
                                connection={connection}
                                isSelected={
                                    nodeData.slackConnectionId === connection.id ||
                                    slack.selectedConnectionId === connection.id
                                }
                                nodeData={nodeData}
                                channels={slack.channels}
                                selectedChannelId={slack.selectedChannelId}
                                loading={slack.loading}
                                notification={slack.notification}
                                onSelect={slack.actions.selectConnection}
                                onDelete={(id) => {
                                    slack.actions.setDeleteConnectionId(id);
                                    slack.actions.setShowDeleteDialog(true);
                                }}
                                onChannelChange={slack.actions.updateChannel}
                                onTestConnection={slack.actions.testOAuthConnection}
                                onReloadChannels={slack.actions.loadChannels}
                            />
                        ))}
                    </div>
                ) : !slack.showCreateForm ? (
                    <div className="text-center py-4">
                        <Typography variant="caption" className="text-muted-foreground">
                            No connections configured yet. Click &quot;New&quot; to add one.
                        </Typography>
                    </div>
                ) : null}

                {/* Centralized Notification Banner */}
                <SlackNotificationBanner notification={slack.notification} />
            </Card>

            {/* Message Configuration Card - Shown after connection is selected */}
            {hasConnection && (
                <SlackMessageTemplate
                    messageTemplate={slack.slackMessage}
                    connectionName={(nodeData.slackConnectionName as string) || "Unknown"}
                    connectionType={connectionType}
                    channelName={nodeData.slackChannelName as string}
                    channelId={nodeData.slackChannelId as string}
                    loading={slack.loading}
                    notification={slack.notification}
                    onMessageChange={slack.actions.updateSlackMessage}
                    onSendPreview={slack.actions.sendPreviewMessage}
                />
            )}

            {/* Delete Connection Confirmation Dialog */}
            <SlackDeleteConnectionDialog
                open={slack.showDeleteDialog}
                onOpenChange={slack.actions.setShowDeleteDialog}
                onConfirm={slack.actions.deleteConnection}
                onCancel={() => {
                    slack.actions.setShowDeleteDialog(false);
                    slack.actions.setDeleteConnectionId(null);
                }}
            />
        </div>
    );
}

/**
 * Wrapped with ErrorBoundary for isolated error handling
 * Prevents Slack configuration errors from crashing the entire sidebar
 */
export function SlackNodeConfiguration(props: SlackNodeConfigurationProps) {
    return (
        <ErrorBoundary
            fallback={(error, reset) => (
                <Card className="p-4 space-y-3">
                    <Typography variant="bodySmall" className="font-semibold text-foreground">
                        Slack Configuration Error
                    </Typography>
                    <Typography variant="caption" className="text-destructive">
                        {error.message}
                    </Typography>
                    <Button type="button" variant="outline" onClick={reset} className="w-full">
                        Try Again
                    </Button>
                </Card>
            )}
        >
            <SlackNodeConfigurationInner {...props} />
        </ErrorBoundary>
    );
}
