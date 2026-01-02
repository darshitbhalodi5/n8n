"use client";

import * as React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Avatar } from "./Avatar";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Button } from "./Button";
import { LogOut, Mail } from "lucide-react";
import { Typography } from "./Typography";

export interface UserMenuProps {
  size?: "sm" | "md" | "lg";
}

export function UserMenu({ size = "md" }: UserMenuProps) {
  const { user, logout } = usePrivy();
  const [open, setOpen] = React.useState(false);

  if (!user?.email) {
    return null;
  }

  const email = user.email.address;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full">
          <Avatar email={email} size={size} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="space-y-4">
          {/* User Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar email={email} size="md" />
              <div className="flex-1 min-w-0">
                <Typography variant="bodySmall" className="font-semibold text-foreground truncate">
                  {email}
                </Typography>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

