"use client";

import { useRef } from "react";
import { Typography } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { BlockDefinition } from "@/components/blocks";
import { iconRegistry } from "@/components/blocks";

interface DraggableBlockProps {
  block: BlockDefinition;
  onDragStart?: (block: BlockDefinition, event: React.DragEvent) => void;
}

export function DraggableBlock({ block, onDragStart }: DraggableBlockProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const IconComponent = block.iconName ? iconRegistry[block.iconName] : null;

  const handleDragStart = (e: React.DragEvent) => {
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
  };

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3",
        "bg-card border border-border rounded-lg",
        "cursor-grab active:cursor-grabbing",
        "hover:border-primary/50 hover:bg-secondary/30",
        "transition-all duration-200",
        "select-none"
      )}
    >
      <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-primary/10 text-primary">
        {IconComponent && <IconComponent className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <Typography variant="bodySmall" className="font-medium text-foreground">
          {block.label}
        </Typography>
        {block.description && (
          <Typography
            variant="caption"
            className="text-muted-foreground line-clamp-1"
          >
            {block.description}
          </Typography>
        )}
      </div>
    </div>
  );
}

