"use client";

import React, { useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { BlockDefinition } from "@/components/blocks";
import { iconRegistry } from "@/components/blocks";

interface DraggableBlockProps {
  block: BlockDefinition;
  onDragStart?: (block: BlockDefinition, event: React.DragEvent) => void;
  onClick?: (block: BlockDefinition) => void;
  disabled?: boolean;
}

export const DraggableBlock = React.memo(function DraggableBlock({
  block,
  onDragStart,
  onClick,
  disabled = false,
}: DraggableBlockProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const IconComponent = block.iconName ? iconRegistry[block.iconName] : null;

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    setIsDragging(true);

    // Set drag data
    e.dataTransfer.setData("application/reactflow", JSON.stringify(block));
    e.dataTransfer.effectAllowed = "move";

    // Visual feedback
    if (dragRef.current) {
      dragRef.current.style.opacity = "0.5";
    }

    // Call custom handler if provided
    if (onDragStart) {
      onDragStart(block, e);
    }
  };

  const handleDragEnd = () => {
    // Reset visual feedback
    if (dragRef.current) {
      dragRef.current.style.opacity = "1";
    }
    // Reset dragging state after a small delay
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleClick = () => {
    // Don't trigger click if user was dragging or block is disabled
    if (isDragging || disabled) {
      return;
    }

    // Call click handler (for mobile tap-to-add)
    if (onClick) {
      onClick(block);
    }
  };

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div
          ref={dragRef}
          draggable={!disabled}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          className={cn(
            "relative group",
            "w-full aspect-square",
            "flex items-center justify-center",
            "bg-card/50 border border-border/50 rounded-md",
            "transition-all duration-200",
            "select-none",
            // Better touch targets on mobile
            "touch-manipulation",
            disabled
              ? "opacity-40 cursor-not-allowed"
              : "cursor-grab active:cursor-grabbing hover:border-primary/70 hover:bg-primary/8 hover:shadow-sm hover:scale-[1.03] active:scale-95"
          )}
        >
          {/* Icon - Responsive sizing for mobile */}
          <div
            className={cn(
              "flex items-center justify-center transition-colors",
              disabled
                ? "text-muted-foreground"
                : "text-foreground/80 group-hover:text-primary"
            )}
          >
            {IconComponent && (
              <IconComponent className="w-5 h-5 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5" />
            )}
          </div>

          {/* Disabled indicator - Small dot */}
          {disabled && (
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={16}
        className="max-w-[220px] md:max-w-[220px]"
      >
        <div className="space-y-1">
          <p className="font-semibold text-sm">{block.label}</p>
          {block.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {block.description}
            </p>
          )}
          {disabled && (
            <p className="text-xs text-warning mt-2">✓ Already on canvas</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
});
