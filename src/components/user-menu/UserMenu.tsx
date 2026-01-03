"use client";

import * as React from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useChainId } from "wagmi";
import { arbitrumSepolia, arbitrum } from "wagmi/chains";
import { Avatar } from "@/components/user-menu/Avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/user-menu/Switch";
import { LogOut, Network } from "lucide-react";
import { Typography } from "@/components/ui/Typography";

export interface UserMenuProps {
  size?: "sm" | "md" | "lg";
}

export function UserMenu({ size = "md" }: UserMenuProps) {
  const { user, logout } = usePrivy();
  const { wallets } = useWallets();
  const chainId = useChainId();
  const [open, setOpen] = React.useState(false);
  const [walletChainId, setWalletChainId] = React.useState<number | null>(null);

  // Get the embedded wallet
  const embeddedWallet = React.useMemo(
    () => wallets.find((w) => w.walletClientType === "privy"),
    [wallets]
  );

  // Get chain ID from wallet provider to ensure accurate state
  React.useEffect(() => {
    const getWalletChainId = async () => {
      if (!embeddedWallet) return;

      try {
        const provider = await embeddedWallet.getEthereumProvider();
        if (provider) {
          const chainIdHex = await provider.request({ method: "eth_chainId" });
          const chainIdNum = parseInt(chainIdHex as string, 16);
          setWalletChainId(chainIdNum);
        }
      } catch {
        // Fallback to wagmi chainId if wallet provider fails
        setWalletChainId(chainId);
      }
    };

    getWalletChainId();
  }, [embeddedWallet, chainId]);

  // Use wallet chain ID if available, otherwise fallback to wagmi chainId
  const currentChainId = walletChainId ?? chainId;

  // Derive testnet mode from current chain
  const isTestnetMode = currentChainId === arbitrumSepolia.id;

  const handleTestnetToggle = async (checked: boolean) => {
    try {
      const targetChainId = checked ? arbitrumSepolia.id : arbitrum.id;

      if (!embeddedWallet) {
        throw new Error("Embedded wallet not found");
      }

      // Switch chain using Privy's native API
      await embeddedWallet.switchChain(targetChainId);

      // Update wallet chain ID immediately
      setWalletChainId(targetChainId);
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

          {/* Actions Section */}
          <div className="p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full justify-center gap-2 bg-destructive! !text-destructive-foreground hover:!bg-destructive/90"
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
