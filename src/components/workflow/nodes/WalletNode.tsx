"use client";

import React, { useState, useEffect, useRef } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from "wagmi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { useSafeWalletContext } from "@/contexts/SafeWalletContext";
import { cn } from "@/lib/utils";
import { Wallet, RefreshCw, Plus, Download, CheckCircle2, XCircle, Loader2, Trash2 } from "lucide-react";
import { addExtraSafe } from "@/web3/utils/safeWalletLocal";
import { ethers } from "ethers";

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

// Global state to track which node is in delete mode (only one at a time)
const deleteModeListeners = new Set<(nodeId: string | null) => void>();

function setNodeInDeleteMode(nodeId: string | null) {
  deleteModeListeners.forEach((listener) => listener(nodeId));
}

export function WalletNode({
  data,
  selected,
  id,
  showHandles = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: WalletNodeProps) {
  const { deleteElements } = useReactFlow();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { selection, creation, moduleControl } = useSafeWalletContext();
  
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [importAddress, setImportAddress] = useState("");
  const [importError, setImportError] = useState("");
  const nodeRef = useRef<HTMLDivElement>(null);

  // Listen for global delete mode changes (when another node enters delete mode)
  useEffect(() => {
    const listener = (activeNodeId: string | null) => {
      if (activeNodeId !== id && isDeleteMode) {
        setIsDeleteMode(false);
      }
    };

    deleteModeListeners.add(listener);
    return () => {
      deleteModeListeners.delete(listener);
    };
  }, [id, isDeleteMode]);

  // Cancel delete mode when clicking outside, on other nodes, or pressing Escape
  useEffect(() => {
    if (!isDeleteMode) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is outside this node
      if (nodeRef.current && !nodeRef.current.contains(target)) {
        // Check if clicking on another node or canvas
        const isReactFlowNode = target.closest('.react-flow__node');
        const isReactFlowPane = target.closest('.react-flow__pane');
        const isReactFlowBackground = target.closest('.react-flow__background');
        
        // If clicking on another node, canvas, or background, cancel delete mode
        if (isReactFlowNode || isReactFlowPane || isReactFlowBackground) {
          setIsDeleteMode(false);
          setNodeInDeleteMode(null);
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDeleteMode(false);
        setNodeInDeleteMode(null);
      }
    };

    // Use both mousedown and click to catch all interactions
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDeleteMode, id]);

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleteMode(true);
    setNodeInDeleteMode(id || null);
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (id) {
      setNodeInDeleteMode(null);
      deleteElements({ nodes: [{ id }] });
    }
  };

  const handleImportSafe = async () => {
    setImportError("");
    
    if (!importAddress) {
      setImportError("Please enter a Safe address");
      return;
    }

    try {
      // Validate address
      const checksummed = ethers.getAddress(importAddress);
      
      // Add to local storage
      addExtraSafe(chainId, checksummed);
      
      // Refresh the list
      await selection.refreshSafeList();
      
      // Clear input
      setImportAddress("");
    } catch {
      setImportError("Invalid address format");
    }
  };

  return (
    <div className="relative group" ref={nodeRef}>
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
          "min-w-[400px] max-w-[500px] transition-all relative",
          "border border-foreground/20 bg-card",
          "rounded-lg",
          selected &&
            !isDeleteMode &&
            "ring-2 ring-primary/50 shadow-lg border-primary/30",
          isDeleteMode && "border-destructive bg-destructive/5"
        )}
      >
        {isDeleteMode ? (
          // Delete confirmation state - entire block becomes delete button
          <button
            onClick={handleDeleteConfirm}
            onMouseDown={(e) => e.stopPropagation()}
            type="button"
            className={cn(
              "w-full h-full min-h-[200px] px-6",
              "flex items-center justify-center gap-3",
              "bg-destructive hover:bg-destructive/90",
              "text-destructive-foreground",
              "rounded-lg transition-all",
              "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
              "cursor-pointer font-medium"
            )}
            style={{ pointerEvents: "auto" }}
            aria-label="Confirm delete"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-base font-semibold">Delete</span>
          </button>
        ) : (
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <Typography variant="bodySmall" className="font-semibold text-foreground">
                  {data.label}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  {data.description}
                </Typography>
              </div>
              {/* Trash icon - rounded square background */}
              {id && (
                <button
                  onClick={handleTrashClick}
                  onMouseDown={(e) => e.stopPropagation()}
                  type="button"
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-md",
                    "bg-muted/50 border border-border/50",
                    "flex items-center justify-center",
                    "transition-all",
                    "hover:bg-destructive/10 hover:border-destructive/50",
                    "hover:text-destructive",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "cursor-pointer"
                  )}
                  style={{ pointerEvents: "auto" }}
                  aria-label="Delete node"
                  title="Click to delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Section A: Connect Wallet */}
            <div className="space-y-2">
              <Typography variant="caption" className="text-muted-foreground font-medium">
                1. Connect Wallet
              </Typography>
              <div className="flex justify-center">
                <ConnectButton chainStatus="icon" accountStatus="address" />
              </div>
            </div>

            {/* Section B: Safe Wallet (shown after connect) */}
            {isConnected && address && (
              <div className="space-y-3 pt-2 border-t border-border">
                <Typography variant="caption" className="text-muted-foreground font-medium">
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
                    </div>

                    {/* Import Safe */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <Typography variant="caption" className="text-muted-foreground">
                        Import existing Safe:
                      </Typography>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="0x..."
                          value={importAddress}
                          onChange={(e) => {
                            setImportAddress(e.target.value);
                            setImportError("");
                          }}
                          className="flex-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleImportSafe}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Import
                        </Button>
                      </div>
                      {importError && (
                        <div className="text-xs text-destructive">{importError}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Section C: Module Status (when a Safe selected) */}
            {isConnected && selection.selectedSafe && (
              <div className="space-y-3 pt-2 border-t border-border">
                <Typography variant="caption" className="text-muted-foreground font-medium">
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
                      {selection.moduleEnabled === true && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={moduleControl.handleDisableModule}
                          className="flex-1"
                        >
                          Disable Module
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Creation flow status */}
            {creation.showCreateFlow && (
              <div className="space-y-2 pt-2 border-t border-border">
                <Typography variant="caption" className="text-muted-foreground font-medium">
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
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

