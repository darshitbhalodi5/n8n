"use client";

import { Typography } from "@/components/ui";
import { DraggableBlock } from "./DraggableBlock";
import {
  getBlocksByCategory,
  getAllBlocks,
  type BlockDefinition,
} from "@/components/blocks";

interface WorkflowSidebarProps {
  activeCategory: string;
  onBlockDragStart?: (block: BlockDefinition) => void;
}

export function WorkflowSidebar({
  activeCategory,
  onBlockDragStart,
}: WorkflowSidebarProps) {
  // Get blocks for the active category
  const blocks =
    activeCategory === "all"
      ? getAllBlocks()
      : getBlocksByCategory(activeCategory);

  return (
    <div className="p-4 space-y-6">
      {/* Blocks Section - Dynamic based on category */}
      {blocks.length > 0 && (
        <>
          <div className="space-y-2">
            <Typography
              variant="caption"
              className="px-4 text-muted-foreground uppercase tracking-wider"
            >
              {activeCategory === "all" ? "All Blocks" : "Blocks"}
            </Typography>
            <div className="space-y-2">
              {blocks.map((block) => (
                <DraggableBlock
                  key={block.id}
                  block={block}
                  onDragStart={onBlockDragStart}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
