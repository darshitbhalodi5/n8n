"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { X, Trash2 } from "lucide-react";
import type { BlockDefinition } from "@/components/blocks";

interface SidebarHeaderProps {
  blockDefinition: BlockDefinition | null;
  onClose?: () => void;
  onDelete: () => void;
  showCloseButton?: boolean;
}

/**
 * Header component for the right sidebar
 * Shows block title, description, and action buttons
 */
export function SidebarHeader({
  blockDefinition,
  onClose,
  onDelete,
  showCloseButton = true,
}: SidebarHeaderProps) {
  return (
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
          {showCloseButton && onClose && (
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
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
