"use client";

import { Typography } from "@/components/ui";
import { DraggableBlock } from "./DraggableBlock";
import {
  getBlocksByCategory,
  getAllBlocks,
} from "@/components/blocks";
import { useWorkflow } from "@/contexts/WorkflowContext";

interface WorkflowSidebarProps {
  activeCategory: string;
}

export function WorkflowSidebar({
  activeCategory,
}: WorkflowSidebarProps) {
  const {
    handleBlockDragStart,
    handleBlockClick,
    isBlockDisabled,
  } = useWorkflow();
  // Get blocks for the active category
  const blocks =
    activeCategory === "all"
      ? getAllBlocks()
      : getBlocksByCategory(activeCategory);

  return (
    <div className="p-2 md:p-2 space-y-3">
      {/* Blocks Section - Dynamic based on category */}
      {blocks.length > 0 && (
        <div className="space-y-2 md:space-y-2">
          <Typography
            variant="caption"
            className="px-1 text-muted-foreground uppercase tracking-wider text-[10px] md:text-[9px] font-semibold"
          >
            {activeCategory === "all" ? "Blocks" : activeCategory}
          </Typography>
          {/* Responsive Grid: 3 cols on mobile (wider drawer), 2 cols on desktop */}
          <div className="grid grid-cols-3 md:grid-cols-2 gap-2 md:gap-1 lg:gap-1.5">
            {blocks.map((block) => {
              // Check if block should be disabled
              const disabled = isBlockDisabled(block.id);
              
              return (
                <DraggableBlock
                  key={block.id}
                  block={block}
                  onDragStart={handleBlockDragStart}
                  onClick={handleBlockClick}
                  disabled={disabled}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-2 text-center">
          <Typography
            variant="caption"
            className="text-muted-foreground text-xs"
          >
            No blocks
          </Typography>
        </div>
      )}
    </div>
  );
}
