"use client";

import { Typography } from "@/components/ui";
import { DraggableBlock } from "./DraggableBlock";
import {
  getBlocksByCategory,
  getAllBlocks,
} from "@/components/blocks";
import { useWorkflow } from "@/contexts/WorkflowContext";

interface WorkflowBlockListProps {
  activeCategory: string;
}

export function WorkflowBlockList({
  activeCategory,
}: WorkflowBlockListProps) {
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
    <div className="w-[95%] mx-auto h-[80vh] overflow-y-auto scrollbar-hide mt-5">
      {/* Blocks Section - Dynamic based on category */}
      {blocks.length > 0 && (
        <div className="space-y-3">
          {/* Responsive Grid: 2 cols on desktop */}
          <div className="grid grid-cols-2 gap-2.5">
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
