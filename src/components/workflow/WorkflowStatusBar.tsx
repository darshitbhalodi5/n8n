"use client";

import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/contexts/WorkflowContext";

interface WorkflowStatusBarProps {
  /** Additional class name */
  className?: string;
}

/**
 * WorkflowStatusBar - Status bar showing save status and connection count
 *
 * Features:
 * - Memoized date formatting
 * - Responsive design
 * - Accessibility with aria-live
 */
export const WorkflowStatusBar = React.memo(function WorkflowStatusBar({
  className,
}: WorkflowStatusBarProps) {
  const { lastSaved, edges, nodes } = useWorkflow();
  
  const edgeCount = edges.length;
  const nodeCount = nodes.length;
  // Memoize date formatting to prevent recalculation on every render
  const formattedTime = useMemo(() => {
    if (!lastSaved) return null;
    return lastSaved.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [lastSaved]);

  const savedStatusText = useMemo(() => {
    if (formattedTime) {
      return `Saved ${formattedTime}`;
    }
    return "Not saved";
  }, [formattedTime]);

  const savedStatusTextMobile = useMemo(() => {
    return lastSaved ? "Saved" : "Unsaved";
  }, [lastSaved]);

  return (
    <div
      className={cn(
        "absolute bottom-2 md:bottom-3 left-2 md:left-3 z-10",
        className
      )}
    >
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 md:px-4 py-1.5 md:py-2 shadow-lg">
        <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
          {/* Save Status */}
          <div
            className="flex items-center gap-1 md:gap-1.5"
            aria-live="polite"
            aria-atomic="true"
          >
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{savedStatusText}</span>
            <span className="sm:hidden">{savedStatusTextMobile}</span>
          </div>

          {/* Connections Count */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-3 bg-border" aria-hidden="true" />
            <span>
              {edgeCount} {edgeCount === 1 ? "connection" : "connections"}
            </span>
          </div>

          {/* Helper Text */}
          {nodeCount === 0 && (
            <>
              <div
                className="hidden md:block w-px h-3 bg-border"
                aria-hidden="true"
              />
              <span className="hidden md:inline text-muted-foreground/70">
                Drag blocks from sidebar to get started
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
