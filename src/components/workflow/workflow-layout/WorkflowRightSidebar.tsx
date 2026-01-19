"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";
import { usePrivy } from "@privy-io/react-auth";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { getBlockById, getBlockByNodeType } from "@/components/blocks";
import type { BlockDefinition } from "@/components/blocks";
import {
  Trash2,
  X,
} from "lucide-react";
import { HiPlay } from "react-icons/hi2";
import { SlackNodeConfiguration } from "./slack";
import { TelegramNodeConfiguration } from "./telegram";
import { EmailNodeConfiguration } from "./email";
import { IfNodeConfiguration } from "./if";
import { SwitchNodeConfiguration } from "./switch";
import { SwapNodeConfiguration } from "./swap";
import { WalletNodeConfiguration } from "./wallet";

export function WorkflowRightSidebar() {
  const {
    selectedNode,
    handleNodeDataChange,
    deleteNodes,
    setSelectedNode,
  } = useWorkflow();
  const { authenticated, login } = usePrivy();
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
    if (selectedNode?.id) {
      handleNodeDataChange(selectedNode.id, {
        ...nodeData,
        [key]: value,
      });
    }
  };

  // Batched data change handler (for Slack - prevents UI flicker)
  const handleBatchDataChange = (updates: Record<string, unknown>) => {
    if (selectedNode?.id) {
      handleNodeDataChange(selectedNode.id, {
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

  // Check if this is a Telegram node
  const isTelegramNode = nodeType === "telegram" || blockId === "telegram";

  // Check if this is an If node
  const isIfNode = nodeType === "if" || blockId === "if";

  // Check if this is a Switch node
  const isSwitchNode = nodeType === "switch" || blockId === "switch";

  // Check if this is the Start node (cannot be deleted)
  const isStartNode = nodeType === "start" || blockId === "start";

  // Check if this is a Swap/DEX node (Uniswap, Relay, or 1inch)
  const isSwapNode =
    nodeType === "swap" || blockId === "swap" ||
    nodeType === "uniswap" || blockId === "uniswap" ||
    nodeType === "relay" || blockId === "relay" ||
    nodeType === "oneinch" || blockId === "oneinch";

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedNode?.id) {
      deleteNodes([selectedNode.id]);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="h-full overflow-y-auto p-4 space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/60 flex items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1">
            <Typography
              variant="h3"
            >
              {blockDefinition?.label || "Block Settings"}
            </Typography>
            <Typography
              variant="caption"
            >
              {blockDefinition?.description ||
                "Configure parameters for the selected block"}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Close Button - Next to Delete */}
            <Button
              onClick={() => setSelectedNode(null)}
              className="md:hidden w-9 h-9 p-0 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm hover:shadow"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </Button>
            {/* Delete Button - Hidden for Start node */}
            {!isStartNode && (
              <Button
                onClick={handleDeleteClick}
                className="w-9 h-9 p-0 rounded-full"
                aria-label="Delete block"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Start Node - Simple info display */}
        {isStartNode ? (
          <Card className="p-6 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-amber-600/40 rounded-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                <HiPlay className="w-7 h-7 text-white ml-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <Typography
                  variant="bodySmall"
                  className="font-semibold text-foreground mb-1"
                >
                  Start Node
                </Typography>
                <Typography
                  variant="caption"
                  className="text-muted-foreground"
                >
                  Connect blocks to begin your workflow
                </Typography>
              </div>
            </div>
          </Card>
        ) : isWalletNode ? (
          /* Wallet Node Configuration */
          <WalletNodeConfiguration
            authenticated={authenticated}
            login={login}
          />
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
        ) : isTelegramNode ? (
          /* Telegram Node Configuration */
          <TelegramNodeConfiguration
            nodeData={nodeData}
            handleDataChange={handleBatchDataChange}
            authenticated={authenticated}
            login={login}
          />
        ) : isIfNode ? (
          /* If Node Configuration */
          <IfNodeConfiguration
            nodeData={nodeData}
            handleDataChange={handleBatchDataChange}
          />
        ) : isSwitchNode ? (
          /* Switch Node Configuration */
          <SwitchNodeConfiguration
            nodeData={nodeData}
            handleDataChange={handleBatchDataChange}
          />
        ) : isSwapNode ? (
          /* Swap Node Configuration */
          <SwapNodeConfiguration
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
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
