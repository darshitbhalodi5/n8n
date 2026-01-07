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
  X,
} from "lucide-react";
import { SlackNodeConfiguration } from "./slack";
import { EmailNodeConfiguration } from "./email";

interface WorkflowRightSidebarProps {
  selectedNode: Node | null;
  onNodeDataChange?: (nodeId: string, data: Record<string, unknown>) => void;
  onNodeDelete?: (nodeId: string) => void;
  onClose?: () => void;
}

export function WorkflowRightSidebar({
  selectedNode,
  onNodeDataChange,
  onNodeDelete,
  onClose,
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

  // Single-key data change handler (for general node types)
  const handleDataChange = (key: string, value: unknown) => {
    if (onNodeDataChange && selectedNode.id) {
      onNodeDataChange(selectedNode.id, {
        ...nodeData,
        [key]: value,
      });
    }
  };

  // Batched data change handler (for Slack - prevents UI flicker)
  const handleBatchDataChange = (updates: Record<string, unknown>) => {
    if (onNodeDataChange && selectedNode.id) {
      onNodeDataChange(selectedNode.id, {
        ...nodeData,
        ...updates,
      });
    }
  };

  // Check if this is a wallet node
  const isWalletNode = nodeType === "wallet-node" || blockId === "wallet";

  // Check if this is a Slack node
  const isSlackNode = nodeType === "slack" || blockId === "slack";

  // Check if this is an Email node
  const isEmailNode = nodeType === "mail" || blockId === "mail";

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
                {blockDefinition?.description ||
                  "Configure parameters for the selected block"}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              {/* Mobile Close Button - Next to Delete */}
              {onClose && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="md:hidden text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              {/* Delete Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Delete block"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Wallet Node Configuration */}
        {isWalletNode ? (
          <div className="space-y-4">
            {/* Section A: Login */}
            <Card className="p-4 space-y-3">
              <Typography
                variant="bodySmall"
                className="font-semibold text-foreground"
              >
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
                <Typography
                  variant="bodySmall"
                  className="font-semibold text-foreground"
                >
                  2. Select or Create Safe Wallet
                </Typography>

                {/* Loading state */}
                {selection.isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading safes...
                    </span>
                  </div>
                )}

                {/* Error state */}
                {selection.error && (
                  <div className="text-sm text-destructive">
                    {selection.error}
                  </div>
                )}

                {/* Safe list */}
                {!selection.isLoading && !selection.error && (
                  <>
                    {selection.safeWallets.length > 0 ? (
                      <div className="space-y-2">
                        <select
                          value={selection.selectedSafe || ""}
                          onChange={(e) =>
                            selection.selectSafe(e.target.value || null)
                          }
                          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label="Select Safe wallet"
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
                <Typography
                  variant="bodySmall"
                  className="font-semibold text-foreground"
                >
                  3. TriggerX Module Status
                </Typography>

                {selection.checkingModule ? (
                  <div className="flex items-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
                    <span className="text-sm text-muted-foreground">
                      Checking module status...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Status display */}
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30">
                      <span className="text-sm font-medium">
                        Module Status:
                      </span>
                      <div className="flex items-center gap-2">
                        {selection.moduleEnabled === true && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            <span className="text-sm text-success font-medium">
                              Enabled
                            </span>
                          </>
                        )}
                        {selection.moduleEnabled === false && (
                          <>
                            <XCircle className="w-4 h-4 text-destructive" />
                            <span className="text-sm text-destructive font-medium">
                              Disabled
                            </span>
                          </>
                        )}
                        {selection.moduleEnabled === null && (
                          <span className="text-sm text-muted-foreground">
                            Unknown
                          </span>
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
                <Typography
                  variant="bodySmall"
                  className="font-semibold text-foreground"
                >
                  Creating Safe Wallet...
                </Typography>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {creation.createStep === "pending" && (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    )}
                    {creation.createStep === "success" && (
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    )}
                    {creation.createStep === "error" && (
                      <XCircle className="w-3 h-3 text-destructive" />
                    )}
                    <span className="text-xs text-foreground">
                      Creating Safe contract
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {creation.signStep === "pending" && (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    )}
                    {creation.signStep === "success" && (
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    )}
                    {creation.signStep === "error" && (
                      <XCircle className="w-3 h-3 text-destructive" />
                    )}
                    <span className="text-xs text-foreground">
                      Signing module enable
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {creation.enableStep === "pending" && (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    )}
                    {creation.enableStep === "success" && (
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    )}
                    {creation.enableStep === "error" && (
                      <XCircle className="w-3 h-3 text-destructive" />
                    )}
                    <span className="text-xs text-foreground">
                      Enabling module
                    </span>
                  </div>
                </div>

                {(creation.createError ||
                  creation.signError ||
                  creation.enableError) && (
                    <div className="text-xs text-destructive mt-2">
                      {creation.createError ||
                        creation.signError ||
                        creation.enableError}
                    </div>
                  )}
              </Card>
            )}
          </div>
        ) : isEmailNode ? (
          /* Email Node Configuration */
          <EmailNodeConfiguration
            nodeData={nodeData}
            handleDataChange={handleBatchDataChange}
            authenticated={authenticated}
            login={login}
          />
        ) : isSlackNode ? (
          /* Slack Node Configuration - Using refactored component with batched updates */
          <SlackNodeConfiguration
            nodeData={nodeData}
            handleDataChange={handleBatchDataChange}
            authenticated={authenticated}
            login={login}
          />
        ) : (
          /* Other Node Types - Basic Configuration */
          <>
            {/* Node Data - Editable Fields */}
            <Card className="p-4 space-y-4">
              <Typography
                variant="bodySmall"
                className="font-semibold text-foreground"
              >
                Parameters
              </Typography>

              {/* Label */}
              <div className="space-y-2">
                <label className="block">
                  <Typography
                    variant="caption"
                    className="text-muted-foreground mb-1"
                  >
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
                  <Typography
                    variant="caption"
                    className="text-muted-foreground mb-1"
                  >
                    Description
                  </Typography>
                  <textarea
                    value={(nodeData.description as string) || ""}
                    onChange={(e) =>
                      handleDataChange("description", e.target.value)
                    }
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
                    <Typography
                      variant="caption"
                      className="text-muted-foreground mb-1"
                    >
                      Status
                    </Typography>
                    <select
                      value={(nodeData.status as string) || "idle"}
                      onChange={(e) =>
                        handleDataChange("status", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Block status"
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
              Are you sure you want to delete this block? This action cannot be
              undone.
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
