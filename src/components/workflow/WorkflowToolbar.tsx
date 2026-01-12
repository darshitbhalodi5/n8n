"use client";

import React from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Save,
  Share2,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface WorkflowToolbarProps {
  /** Workflow name to display */
  workflowName: string;
  /** Number of nodes on canvas */
  nodeCount: number;
  /** Whether the run button should be disabled */
  canRun: boolean;
  /** Called when zoom in is clicked */
  onZoomIn: () => void;
  /** Called when zoom out is clicked */
  onZoomOut: () => void;
  /** Called when fit view is clicked */
  onFitView: () => void;
  /** Called when save is clicked */
  onSave: () => void;
  /** Called when run is clicked */
  onRun: () => void;
  /** Called when share is clicked */
  onShare?: () => void;
  /** Called when mobile menu button is clicked */
  onOpenMobileMenu: () => void;
  /** Additional class name */
  className?: string;
}

/**
 * WorkflowToolbar - Floating toolbar for workflow canvas controls
 *
 * Features:
 * - Responsive design (mobile/desktop)
 * - Zoom controls
 * - Save/Share/Run actions
 * - Node counter
 * - Mobile menu trigger
 */
export const WorkflowToolbar = React.memo(function WorkflowToolbar({
  workflowName,
  nodeCount,
  canRun,
  onZoomIn,
  onZoomOut,
  onFitView,
  onSave,
  onRun,
  onShare,
  onOpenMobileMenu,
  className,
}: WorkflowToolbarProps) {
  return (
    <div
      className={cn(
        "absolute top-2 md:top-3 left-2 md:left-3 right-2 md:right-3 z-10",
        "flex items-center justify-between gap-2",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className={cn(
            "md:hidden",
            "bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg",
            "w-8 h-8 flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          aria-label="Open blocks menu"
        >
          <Menu className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Workflow Title */}
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 md:px-4 py-1.5 md:py-2 shadow-lg min-w-0 shrink">
          <h2 className="text-xs md:text-sm font-semibold text-foreground truncate">
            {workflowName}
          </h2>
        </div>

        {/* Node Counter Badge */}
        <div
          className="hidden sm:flex bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 md:px-3 py-1.5 md:py-2 shadow-lg"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-success animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[10px] md:text-xs font-medium text-muted-foreground whitespace-nowrap">
              {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Canvas Controls */}
        <div className="hidden sm:flex bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg items-center divide-x divide-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="rounded-none rounded-l-lg h-7 md:h-9 px-2 md:px-3 hover:bg-muted"
            title="Zoom Out (Ctrl + -)"
            aria-label="Zoom out canvas"
          >
            <ZoomOut className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="rounded-none h-7 md:h-9 px-2 md:px-3 hover:bg-muted"
            title="Zoom In (Ctrl + +)"
            aria-label="Zoom in canvas"
          >
            <ZoomIn className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onFitView}
            className="rounded-none rounded-r-lg h-7 md:h-9 px-2 md:px-3 hover:bg-muted"
            title="Fit View"
            aria-label="Fit all nodes into view"
          >
            <Maximize2
              className="w-3.5 h-3.5 md:w-4 md:h-4"
              aria-hidden="true"
            />
          </Button>
        </div>

        {/* Workflow Actions */}
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg flex items-center gap-0.5 md:gap-1 px-0.5 md:px-1 py-0.5 md:py-1">
          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="h-7 md:h-8 px-2 md:px-3 hover:bg-muted gap-1.5"
            title="Save (Ctrl + S)"
          >
            <Save className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden md:inline text-xs font-medium">Save</span>
          </Button>

          {/* Share Button */}
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="hidden sm:flex h-7 md:h-8 px-2 md:px-3 hover:bg-muted gap-1.5"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden lg:inline text-xs font-medium">
                Share
              </span>
            </Button>
          )}

          <div
            className="hidden sm:block w-px h-4 bg-border"
            aria-hidden="true"
          />

          {/* Run Button */}
          <Button
            variant="default"
            size="sm"
            onClick={onRun}
            disabled={!canRun}
            className="h-7 md:h-8 px-3 md:px-4 gap-1 md:gap-1.5 bg-primary hover:bg-primary/90"
            title="Run Workflow (Ctrl + Enter)"
          >
            <Play
              className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current"
              aria-hidden="true"
            />
            <span className="text-[10px] md:text-xs font-semibold">Run</span>
          </Button>
        </div>
      </div>
    </div>
  );
});
