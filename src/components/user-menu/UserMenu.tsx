"use client";

import * as React from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { arbitrumSepolia, arbitrum } from "viem/chains";
import { usePrivyEmbeddedWallet } from "@/hooks/usePrivyEmbeddedWallet";
import { Avatar } from "@/components/user-menu/Avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/user-menu/Switch";
import { LogOut, Network, LayoutGrid } from "lucide-react";
import { Typography } from "@/components/ui/Typography";

export interface UserMenuProps {
  size?: "sm" | "md" | "lg";
}

export function UserMenu({ size = "md" }: UserMenuProps) {
  const { user, logout } = usePrivy();
  const { embeddedWallet, chainId } = usePrivyEmbeddedWallet();
  const [open, setOpen] = React.useState(false);

  // Use chain ID from Privy embedded wallet (nullable until ready)
  const currentChainId = chainId;

  // Derive testnet mode from current chain (null-safe)
  const isTestnetMode = currentChainId === arbitrumSepolia.id;

  const handleTestnetToggle = async (checked: boolean) => {
    try {
      const targetChainId = checked ? arbitrumSepolia.id : arbitrum.id;

      if (!embeddedWallet) {
        throw new Error("Embedded wallet not found");
      }

      // Switch chain using Privy's native API
      await embeddedWallet.switchChain(targetChainId);
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  if (!user?.email) {
    return null;
  }

  const email = user.email.address;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full transition-transform hover:scale-105 active:scale-95">
          <Avatar email={email} size={size} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="space-y-1">
          {/* User Info Section */}
          <div className="px-4 pt-4 pb-3 bg-card/80 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Avatar email={email} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Typography
                    variant="bodySmall"
                    className="font-semibold text-foreground truncate"
                  >
                    Account
                  </Typography>
                </div>
                <Typography
                  variant="bodySmall"
                  className="text-muted-foreground truncate text-xs"
                >
                  {email}
                </Typography>
              </div>
            </div>
          </div>

          {/* Network Settings Section */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-md bg-secondary/50 group-hover:bg-secondary transition-colors">
                  <Network className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <Typography
                    variant="bodySmall"
                    className="font-medium text-foreground mb-0.5"
                  >
                    Network
                  </Typography>
                  <div className="flex items-center gap-1.5">
                    <Typography
                      variant="bodySmall"
                      className="text-xs text-muted-foreground"
                    >
                      {isTestnetMode ? "Arbitrum Sepolia" : "Arbitrum"}
                    </Typography>
                  </div>
                </div>
              </div>
              <Switch
                checked={isTestnetMode}
                onCheckedChange={handleTestnetToggle}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Navigation Links */}
          <div className="p-2">
            <Link
              href="/workflows"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors"
            >
              <LayoutGrid className="w-4 h-4 text-primary" />
              <Typography variant="bodySmall" className="font-medium text-foreground">
                My Workflows
              </Typography>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Actions Section */}
          <div className="p-2">
            <Button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
