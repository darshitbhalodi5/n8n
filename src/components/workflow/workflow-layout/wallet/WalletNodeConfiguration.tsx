"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useWallets } from "@privy-io/react-auth";
import { useSafeWalletContext } from "@/contexts/SafeWalletContext";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  LogIn,
} from "lucide-react";
import { HiWallet, HiShieldCheck, HiCog } from "react-icons/hi2";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface WalletNodeConfigurationProps {
  authenticated: boolean;
  login: () => void;
}

function WalletNodeConfigurationInner({
  authenticated: authenticatedProp,
  login,
}: WalletNodeConfigurationProps) {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
  const isConnected = authenticatedProp && embeddedWallet !== undefined;
  const address = embeddedWallet?.address;
  const { selection, creation } = useSafeWalletContext();

  return (
    <div className="space-y-4">
      {/* Section A: Authentication Status */}
      <Card className="p-5 bg-white/5 border border-white/20">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <HiWallet className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <Typography
              variant="bodySmall"
              className="font-semibold text-foreground mb-1"
            >
              Wallet Connection
            </Typography>
            <Typography
              variant="caption"
              className="text-muted-foreground"
            >
              Connect your wallet to manage Safe wallets and execute transactions
            </Typography>
          </div>
        </div>
        {!authenticatedProp || !embeddedWallet ? (
          <Button onClick={login} className="w-full gap-2">
            <LogIn className="w-4 h-4" />
            Login / Sign Up
          </Button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/50 border border-border">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <div className="flex-1 min-w-0">
              <Typography variant="caption" className="font-medium text-foreground">
                Connected
              </Typography>
              <Typography variant="caption" className="text-muted-foreground text-xs block truncate">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Wallet connected"}
              </Typography>
            </div>
          </div>
        )}
      </Card>

      {/* Section B: Safe Wallet Info (shown after connect) */}
      {isConnected && address && (
        <Card className="p-5 bg-white/5 border border-white/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
              <HiShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <Typography
                variant="bodySmall"
                className="font-semibold text-foreground mb-1"
              >
                Safe Wallet
              </Typography>
              <Typography
                variant="caption"
                className="text-muted-foreground"
              >
                Multi-signature wallet for secure transaction execution
              </Typography>
            </div>
          </div>

          {/* Loading state */}
          {selection.isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading safes...
              </span>
            </div>
          )}

          {/* Error state */}
          {selection.error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <Typography variant="caption" className="text-destructive">
                {selection.error}
              </Typography>
            </div>
          )}

          {/* Safe wallet info */}
          {!selection.isLoading && !selection.error && (
            <div className="space-y-3">
              {selection.safeWallets.length > 0 ? (
                <>
                  <div>
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
                  {selection.selectedSafe && (
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <Typography variant="caption" className="text-muted-foreground text-xs mb-1">
                        Selected Safe
                      </Typography>
                      <Typography variant="caption" className="text-foreground font-mono text-xs break-all">
                        {selection.selectedSafe}
                      </Typography>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border">
                    <Typography variant="caption" className="text-muted-foreground text-xs">
                      {selection.safeWallets.length} Safe wallet{selection.safeWallets.length !== 1 ? "s" : ""} available
                    </Typography>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-lg bg-secondary/20 border border-border text-center">
                  <Typography variant="caption" className="text-muted-foreground">
                    No Safe wallets found. Use the toolbar to create a new Safe wallet.
                  </Typography>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Section C: Module Status (when a Safe selected) */}
      {isConnected && selection.selectedSafe && (
        <Card className="p-5 bg-white/5 border border-white/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <HiCog className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <Typography
                variant="bodySmall"
                className="font-semibold text-foreground mb-1"
              >
                TriggerX Module
              </Typography>
              <Typography
                variant="caption"
                className="text-muted-foreground"
              >
                Module status for automated transaction execution
              </Typography>
            </div>
          </div>

          {selection.checkingModule ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
              <span className="text-sm text-muted-foreground">
                Checking module status...
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Status display */}
              <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border">
                <span className="text-sm font-medium text-foreground">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  {selection.moduleEnabled === true && (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-sm text-success font-semibold">
                        Enabled
                      </span>
                    </>
                  )}
                  {selection.moduleEnabled === false && (
                    <>
                      <XCircle className="w-5 h-5 text-destructive" />
                      <span className="text-sm text-destructive font-semibold">
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

              {selection.moduleEnabled === false && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Typography variant="caption" className="text-amber-500 text-xs">
                    Module is disabled. Use the toolbar to enable it.
                  </Typography>
                </div>
              )}

              {selection.moduleEnabled === true && (
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <Typography variant="caption" className="text-success text-xs">
                    Module is enabled and ready for automated transactions.
                  </Typography>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Creation flow status */}
      {creation.showCreateFlow && (
        <Card className="p-5 bg-white/5 border border-white/20">
          <Typography
            variant="bodySmall"
            className="font-semibold text-foreground mb-4"
          >
            Creating Safe Wallet...
          </Typography>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {creation.createStep === "pending" && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
              {creation.createStep === "success" && (
                <CheckCircle2 className="w-4 h-4 text-success" />
              )}
              {creation.createStep === "error" && (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
              <Typography variant="caption" className="text-foreground">
                Creating Safe contract
              </Typography>
            </div>

            <div className="flex items-center gap-3">
              {creation.signStep === "pending" && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
              {creation.signStep === "success" && (
                <CheckCircle2 className="w-4 h-4 text-success" />
              )}
              {creation.signStep === "error" && (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
              <Typography variant="caption" className="text-foreground">
                Signing module enable
              </Typography>
            </div>

            <div className="flex items-center gap-3">
              {creation.enableStep === "pending" && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
              {creation.enableStep === "success" && (
                <CheckCircle2 className="w-4 h-4 text-success" />
              )}
              {creation.enableStep === "error" && (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
              <Typography variant="caption" className="text-foreground">
                Enabling module
              </Typography>
            </div>
          </div>

          {(creation.createError ||
            creation.signError ||
            creation.enableError) && (
              <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <Typography variant="caption" className="text-destructive text-xs">
                  {creation.createError ||
                    creation.signError ||
                    creation.enableError}
                </Typography>
              </div>
            )}
        </Card>
      )}
    </div>
  );
}

/**
 * Wrapped with ErrorBoundary for isolated error handling
 */
export function WalletNodeConfiguration(props: WalletNodeConfigurationProps) {
  return (
    <ErrorBoundary>
      <WalletNodeConfigurationInner {...props} />
    </ErrorBoundary>
  );
}
