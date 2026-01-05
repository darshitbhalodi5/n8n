"use client";

import React, { useState } from "react";
import { Node } from "reactflow";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSafeWalletContext } from "@/contexts/SafeWalletContext";
import { getBlockById, getBlockByNodeType } from "@/components/blocks";
import type { BlockDefinition } from "@/components/blocks";
import {
  RefreshCw,
  Plus,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  LogIn,
  Send,
} from "lucide-react";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";

interface WorkflowRightSidebarProps {
  selectedNode: Node | null;
  onNodeDataChange?: (nodeId: string, data: Record<string, unknown>) => void;
  onNodeDelete?: (nodeId: string) => void;
}

export function WorkflowRightSidebar({
  selectedNode,
  onNodeDataChange,
  onNodeDelete,
}: WorkflowRightSidebarProps) {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
  const isConnected = authenticated && embeddedWallet !== undefined;
  const address = embeddedWallet?.address;
  const { selection, creation, moduleControl } = useSafeWalletContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Typography variant="body" className="text-muted-foreground">
            No block selected
          </Typography>
          <Typography variant="caption" className="text-muted-foreground mt-2">
            Click on a block to view and edit its settings
          </Typography>
        </div>
      </div>
    );
  }

  // Get block definition from node data or node type
  const blockId = selectedNode.data?.blockId as string | undefined;
  const nodeType = selectedNode.type || "";
  
  // Try to get block by ID first, then by node type
  const blockDefinition: BlockDefinition | null =
    (blockId && getBlockById(blockId)) ||
    (nodeType && getBlockByNodeType(nodeType)) ||
    null;

  const nodeData = selectedNode.data || {};

  const handleDataChange = (key: string, value: unknown) => {
    if (onNodeDataChange && selectedNode.id) {
      onNodeDataChange(selectedNode.id, {
        ...nodeData,
        [key]: value,
      });
    }
  };

  // Check if this is a wallet node
  const isWalletNode = nodeType === "wallet-node" || blockId === "wallet";

  // Check if this is a Slack node
  const isSlackNode = nodeType === "slack" || blockId === "slack";

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedNode?.id && onNodeDelete) {
      onNodeDelete(selectedNode.id);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="h-full overflow-y-auto p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Typography variant="h3" className="text-foreground">
                {blockDefinition?.label || "Block Settings"}
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                {blockDefinition?.description || "Configure parameters for the selected block"}
              </Typography>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

      {/* Wallet Node Configuration */}
      {isWalletNode ? (
        <div className="space-y-4">
          {/* Section A: Login */}
          <Card className="p-4 space-y-3">
            <Typography variant="bodySmall" className="font-semibold text-foreground">
              1. Login / Sign Up
            </Typography>
            <div className="flex justify-center">
              {authenticated && embeddedWallet ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">
                  <span>✓ Connected</span>
                </div>
              ) : (
                <Button onClick={login} className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Login / Sign Up
                </Button>
              )}
            </div>
          </Card>

          {/* Section B: Safe Wallet (shown after connect) */}
          {isConnected && address && (
            <Card className="p-4 space-y-3">
              <Typography variant="bodySmall" className="font-semibold text-foreground">
                2. Select or Create Safe Wallet
              </Typography>
              
              {/* Loading state */}
              {selection.isLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading safes...</span>
                </div>
              )}

              {/* Error state */}
              {selection.error && (
                <div className="text-sm text-destructive">{selection.error}</div>
              )}

              {/* Safe list */}
              {!selection.isLoading && !selection.error && (
                <>
                  {selection.safeWallets.length > 0 ? (
                    <div className="space-y-2">
                      <select
                        value={selection.selectedSafe || ""}
                        onChange={(e) => selection.selectSafe(e.target.value || null)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a Safe wallet...</option>
                        {selection.safeWallets.map((safe) => (
                          <option key={safe} value={safe}>
                            {safe.slice(0, 6)}...{safe.slice(-4)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-2">
                      No Safe wallets found
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={selection.refreshSafeList}
                      className="flex-1"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh
                    </Button>
                    {selection.safeWallets.length === 0 && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={creation.handleCreateNewSafe}
                        disabled={creation.isCreating}
                        className="flex-1"
                      >
                        {creation.isCreating ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 mr-1" />
                            Create Safe
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </Card>
          )}

          {/* Section C: Module Status (when a Safe selected) */}
          {isConnected && selection.selectedSafe && (
            <Card className="p-4 space-y-3">
              <Typography variant="bodySmall" className="font-semibold text-foreground">
                3. TriggerX Module Status
              </Typography>

              {selection.checkingModule ? (
                <div className="flex items-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Checking module status...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Status display */}
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30">
                    <span className="text-sm font-medium">Module Status:</span>
                    <div className="flex items-center gap-2">
                      {selection.moduleEnabled === true && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="text-sm text-success font-medium">Enabled</span>
                        </>
                      )}
                      {selection.moduleEnabled === false && (
                        <>
                          <XCircle className="w-4 h-4 text-destructive" />
                          <span className="text-sm text-destructive font-medium">Disabled</span>
                        </>
                      )}
                      {selection.moduleEnabled === null && (
                        <span className="text-sm text-muted-foreground">Unknown</span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={moduleControl.handleManualModuleRefresh}
                      className="flex-1"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh Status
                    </Button>
                    {selection.moduleEnabled === false && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={moduleControl.handleEnableModule}
                        className="flex-1"
                      >
                        Enable Module
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Creation flow status */}
          {creation.showCreateFlow && (
            <Card className="p-4 space-y-2">
              <Typography variant="bodySmall" className="font-semibold text-foreground">
                Creating Safe Wallet...
              </Typography>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {creation.createStep === "pending" && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                  {creation.createStep === "success" && <CheckCircle2 className="w-3 h-3 text-success" />}
                  {creation.createStep === "error" && <XCircle className="w-3 h-3 text-destructive" />}
                  <span className="text-xs text-foreground">Creating Safe contract</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {creation.signStep === "pending" && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                  {creation.signStep === "success" && <CheckCircle2 className="w-3 h-3 text-success" />}
                  {creation.signStep === "error" && <XCircle className="w-3 h-3 text-destructive" />}
                  <span className="text-xs text-foreground">Signing module enable</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {creation.enableStep === "pending" && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                  {creation.enableStep === "success" && <CheckCircle2 className="w-3 h-3 text-success" />}
                  {creation.enableStep === "error" && <XCircle className="w-3 h-3 text-destructive" />}
                  <span className="text-xs text-foreground">Enabling module</span>
                </div>
              </div>

              {(creation.createError || creation.signError || creation.enableError) && (
                <div className="text-xs text-destructive mt-2">
                  {creation.createError || creation.signError || creation.enableError}
                </div>
              )}
            </Card>
          )}
        </div>
      ) : isSlackNode ? (
        /* Slack Node Configuration */
        <SlackNodeConfiguration
          nodeData={nodeData}
          handleDataChange={handleDataChange}
          authenticated={authenticated}
          login={login}
        />
      ) : (
        /* Other Node Types - Basic Configuration */
        <>
          {/* Node Data - Editable Fields */}
          <Card className="p-4 space-y-4">
            <Typography variant="bodySmall" className="font-semibold text-foreground">
              Parameters
            </Typography>

            {/* Label */}
            <div className="space-y-2">
              <label className="block">
                <Typography variant="caption" className="text-muted-foreground mb-1">
                  Label
                </Typography>
                <input
                  type="text"
                  value={(nodeData.label as string) || ""}
                  onChange={(e) => handleDataChange("label", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter block label"
                />
              </label>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block">
                <Typography variant="caption" className="text-muted-foreground mb-1">
                  Description
                </Typography>
                <textarea
                  value={(nodeData.description as string) || ""}
                  onChange={(e) => handleDataChange("description", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Enter block description"
                  rows={3}
                />
              </label>
            </div>

            {/* Status */}
            {nodeData.status !== undefined && (
              <div className="space-y-2">
                <label className="block">
                  <Typography variant="caption" className="text-muted-foreground mb-1">
                    Status
                  </Typography>
                  <select
                    value={(nodeData.status as string) || "idle"}
                    onChange={(e) => handleDataChange("status", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="idle">Idle</option>
                    <option value="running">Running</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </label>
              </div>
            )}

            {/* Node ID (read-only) */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Typography variant="caption" className="text-muted-foreground">
                Node ID
              </Typography>
              <Typography
                variant="caption"
                className="text-foreground font-mono text-xs break-all"
              >
                {selectedNode.id}
              </Typography>
            </div>
          </Card>
        </>
      )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Block</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this block? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Slack Node Configuration Component
 */
interface SlackNodeConfigurationProps {
  nodeData: Record<string, unknown>;
  handleDataChange: (key: string, value: unknown) => void;
  authenticated: boolean;
  login: () => void;
}

interface SlackConnection {
  id: string;
  name: string | null;
  createdAt: string;
}

function SlackNodeConfiguration({
  nodeData,
  handleDataChange,
  authenticated,
  login,
}: SlackNodeConfigurationProps) {
  const { getPrivyAccessToken } = usePrivyWallet();
  const [connections, setConnections] = useState<SlackConnection[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [webhookUrl, setWebhookUrl] = useState("");
  const [connectionName, setConnectionName] = useState("");
  const [testMessage, setTestMessage] = useState(
    (nodeData.testMessage as string) || "Hello from FlowForge! 🚀"
  );
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isTestSuccessful, setIsTestSuccessful] = useState(false);
  const [deleteConnectionId, setDeleteConnectionId] = useState<string | null>(null);
  const [showDeleteConnectionDialog, setShowDeleteConnectionDialog] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

  const hasConnection = !!nodeData.slackConnectionId;

  const loadConnections = React.useCallback(async () => {
    setIsLoadingConnections(true);
    try {
      const accessToken = await getPrivyAccessToken();
      if (!accessToken) return;

      const response = await fetch(`${API_BASE_URL}/integrations/slack/connections`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConnections(data.data.connections || []);
      }
    } catch (error) {
      console.error("Failed to load connections:", error);
    } finally {
      setIsLoadingConnections(false);
    }
  }, [getPrivyAccessToken, API_BASE_URL]);

  // Load existing connections
  React.useEffect(() => {
    if (authenticated) {
      loadConnections();
    }
  }, [authenticated, loadConnections]);

  const handleTestWebhook = async (webhookUrlToTest: string, messageToSend: string) => {
    if (!webhookUrlToTest.trim()) {
      setError("Webhook URL is required");
      return;
    }

    if (!messageToSend.trim()) {
      setError("Test message is required");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setIsTestSuccessful(false);
    setStatusMessage("Testing webhook...");

    try {
      const accessToken = await getPrivyAccessToken();
      if (!accessToken) {
        setError("Please log in to test webhook");
        return;
      }

      // Test webhook via backend (to avoid CORS issues)
      const testResponse = await fetch(`${API_BASE_URL}/integrations/slack/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          webhookUrl: webhookUrlToTest.trim(),
          text: messageToSend.trim(),
        }),
      });

      if (!testResponse.ok) {
        const errorData = await testResponse.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || "Failed to test webhook";
        
        // Special handling for rate limits
        if (testResponse.status === 429) {
          throw new Error(`⏱️ ${errorMessage}`);
        }
        
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setIsTestSuccessful(true);
      setStatusMessage("✅ Test successful! You can now save the webhook.");

      // Keep success message visible (don't auto-clear)
    } catch (error) {
      setIsTestSuccessful(false);
      setError(error instanceof Error ? error.message : "Failed to test webhook");
      setStatusMessage("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveWebhook = async () => {
    if (!webhookUrl.trim()) {
      setError("Webhook URL is required");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setStatusMessage("Saving webhook...");

    try {
      const accessToken = await getPrivyAccessToken();
      if (!accessToken) {
        setError("Please log in to save webhook");
        return;
      }

      // Save webhook to DB
      const saveResponse = await fetch(`${API_BASE_URL}/integrations/slack/webhooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          name: connectionName.trim() || undefined,
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to save webhook");
      }

      // const saveData = await saveResponse.json();

      setSuccess(true);
      setStatusMessage("Webhook saved successfully!");
      setWebhookUrl("");
      setConnectionName("");
      setIsTestSuccessful(false);
      setShowCreateForm(false);

      // Reload connections
      await loadConnections();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setStatusMessage("");
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save webhook");
      setStatusMessage("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestSelectedWebhook = async () => {
    if (!hasConnection) {
      setError("Please select a webhook first");
      return;
    }

    if (!testMessage.trim()) {
      setError("Message text is required");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setStatusMessage("Sending test message...");

    try {
      const accessToken = await getPrivyAccessToken();
      if (!accessToken) {
        setError("Please log in to send messages");
        return;
      }

      // Use the backend endpoint which fetches webhook URL from DB
      const response = await fetch(`${API_BASE_URL}/integrations/slack/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          connectionId: nodeData.slackConnectionId,
          text: testMessage.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || "Failed to send message";
        
        // Special handling for rate limits
        if (response.status === 429) {
          throw new Error(`⏱️ ${errorMessage}`);
        }
        
        throw new Error(errorMessage);
      }

      handleDataChange("testMessage", testMessage);

      setSuccess(true);
      setStatusMessage("✅ Test message sent successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setStatusMessage("");
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send message");
      setStatusMessage("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectConnection = (connectionId: string) => {
    const connection = connections.find((c) => c.id === connectionId);
    if (connection) {
      handleDataChange("slackConnectionId", connection.id);
      handleDataChange("slackConnectionName", connection.name || "Slack Webhook");
      setError(null);
    }
  };

  const handleDeleteConnectionClick = (connectionId: string) => {
    setDeleteConnectionId(connectionId);
    setShowDeleteConnectionDialog(true);
  };

  const handleDeleteConnectionConfirm = async () => {
    if (!deleteConnectionId) return;

    setIsProcessing(true);
    setError(null);
    setShowDeleteConnectionDialog(false);

    try {
      const accessToken = await getPrivyAccessToken();
      if (!accessToken) {
        setError("Please log in to delete connections");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/integrations/slack/connections/${deleteConnectionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to delete connection");
      }

      // If deleted connection was selected, clear it
      if (nodeData.slackConnectionId === deleteConnectionId) {
        handleDataChange("slackConnectionId", undefined);
        handleDataChange("slackConnectionName", undefined);
      }

      // Reload connections
      await loadConnections();

      setSuccess(true);
      setStatusMessage("Connection deleted successfully");
      setTimeout(() => {
        setSuccess(false);
        setStatusMessage("");
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete connection");
    } finally {
      setIsProcessing(false);
      setDeleteConnectionId(null);
    }
  };

  const handleDeleteConnectionCancel = () => {
    setShowDeleteConnectionDialog(false);
    setDeleteConnectionId(null);
  };

  return (
    <div className="space-y-4">
      {/* Authentication Check */}
      {!authenticated && (
        <Card className="p-4 space-y-3">
          <Typography variant="bodySmall" className="font-semibold text-foreground">
            Authentication Required
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            Please log in to configure Slack integration
          </Typography>
          <Button onClick={login} className="w-full gap-2">
            <LogIn className="w-4 h-4" />
            Login / Sign Up
          </Button>
        </Card>
      )}

      {/* Webhook Selection/Management */}
      {authenticated && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Typography variant="bodySmall" className="font-semibold text-foreground">
              Slack Webhooks
            </Typography>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-1"
            >
              <Plus className="w-3 h-3" />
              {showCreateForm ? "Cancel" : "New"}
            </Button>
          </div>

          {/* Create New Webhook Form */}
          {showCreateForm && (
            <div className="space-y-3 p-3 border border-border rounded-lg bg-secondary/20">
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
                    onChange={(e) => setConnectionName(e.target.value)}
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
                      setWebhookUrl(e.target.value);
                      // Reset test status when URL changes
                      setIsTestSuccessful(false);
                      setError(null);
                      setSuccess(false);
                      setStatusMessage("");
                    }}
                    className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </label>
              </div>

              {/* Test Message */}
              <div className="space-y-2">
                <label className="block">
                  <Typography variant="caption" className="text-muted-foreground mb-1">
                    Test Message
                  </Typography>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Hello from FlowForge! 🚀"
                    rows={2}
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleTestWebhook(webhookUrl, testMessage)}
                  disabled={isProcessing || !webhookUrl.trim() || !testMessage.trim()}
                  variant="outline"
                  className="flex-1 gap-2"
                  size="sm"
                >
                  {isProcessing && statusMessage?.includes("Testing") ? (
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
                  onClick={handleSaveWebhook}
                  disabled={isProcessing || !webhookUrl.trim() || !isTestSuccessful}
                  className="flex-1 gap-2"
                  size="sm"
                  title={!isTestSuccessful ? "Please test the webhook first" : ""}
                >
                  {isProcessing && statusMessage?.includes("Saving") ? (
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
            </div>
          )}

          {/* Existing Connections List */}
          {isLoadingConnections ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Loading webhooks...</span>
            </div>
          ) : connections.length > 0 ? (
            <div className="space-y-2">
              <Typography variant="caption" className="text-muted-foreground">
                Select a webhook for this block:
              </Typography>
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                    nodeData.slackConnectionId === conn.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <button
                    onClick={() => handleSelectConnection(conn.id)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      {nodeData.slackConnectionId === conn.id && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                      <div>
                        <Typography variant="bodySmall" className="text-foreground font-medium">
                          {conn.name || "Unnamed Webhook"}
                        </Typography>
                        <Typography variant="caption" className="text-muted-foreground">
                          Added {new Date(conn.createdAt).toLocaleDateString()}
                        </Typography>
                      </div>
                    </div>
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteConnectionClick(conn.id)}
                    disabled={isProcessing}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : !showCreateForm ? (
            <div className="text-center py-4">
              <Typography variant="caption" className="text-muted-foreground">
                No webhooks configured yet
              </Typography>
            </div>
          ) : null}

          {/* Status Messages */}
          {success && statusMessage && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <Typography variant="caption" className="text-success">
                {statusMessage}
              </Typography>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10">
              <XCircle className="w-4 h-4 text-destructive" />
              <Typography variant="caption" className="text-destructive">
                {error}
              </Typography>
            </div>
          )}
        </Card>
      )}

      {/* Send Another Test Message */}
      {authenticated && hasConnection && (
        <Card className="p-4 space-y-3">
          <Typography variant="bodySmall" className="font-semibold text-foreground">
            Send Another Test Message
          </Typography>
          
          <Typography variant="caption" className="text-muted-foreground">
            Using connection: {nodeData.slackConnectionName as string}
          </Typography>

          <div className="space-y-2">
            <label className="block">
              <Typography variant="caption" className="text-muted-foreground mb-1">
                Message
              </Typography>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Enter test message"
                rows={3}
              />
            </label>
          </div>

          <Button
            onClick={handleTestSelectedWebhook}
            disabled={isProcessing || !testMessage.trim()}
            className="w-full gap-2"
          >
            {isProcessing && statusMessage?.includes("Sending") ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Test
              </>
            )}
          </Button>

          {/* Status Messages */}
          {success && statusMessage && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <Typography variant="caption" className="text-success">
                {statusMessage}
              </Typography>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10">
              <XCircle className="w-4 h-4 text-destructive" />
              <Typography variant="caption" className="text-destructive">
                {error}
              </Typography>
            </div>
          )}
        </Card>
      )}

      {/* Delete Connection Confirmation Dialog */}
      <Dialog open={showDeleteConnectionDialog} onOpenChange={setShowDeleteConnectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Webhook Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this webhook connection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteConnectionCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConnectionConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

