"use client";

import { Typography } from "@/components/ui";
import { DraggableBlock } from "./DraggableBlock";
import { ComingSoonSection } from "./ComingSoonSection";
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
      : activeCategory === "coming-soon"
        ? [] // Coming soon has its own rendering
        : getBlocksByCategory(activeCategory);

  // Handle Coming Soon category
  if (activeCategory === "coming-soon") {
    return (
      <div
        className="w-[95%] mx-auto h-[80vh] overflow-y-auto scrollbar-hide mt-5"
        data-lenis-prevent
      >
        <ComingSoonSection />
      </div>
    );
  }

  return (
    <div
      className="w-[95%] mx-auto h-[80vh] overflow-y-auto scrollbar-hide mt-5"
      data-lenis-prevent
    >
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

      {/* Divider */}
      <div className="my-6 border-t border-white/10" />

      {/* Coming Soon Section - Always show at bottom */}
      <ComingSoonSection />
    </div>
  );
}
