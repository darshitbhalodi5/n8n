"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Node } from "reactflow";
import { Tooltip, TooltipContent, TooltipTrigger, Button } from "@/components/ui";
import { X, Menu } from "lucide-react";

interface WorkflowLayoutProps {
  children: React.ReactNode;
  sidebar: (activeCategory: string) => React.ReactNode;
  rightSidebar?: (selectedNode: Node | null) => React.ReactNode;
  selectedNode?: Node | null;
  categories?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  defaultCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  mobileMenuOpen?: boolean;
  onMobileMenuOpenChange?: (open: boolean) => void;
  onMobileConfigClose?: () => void;
}

export function WorkflowLayout({
  children,
  sidebar,
  rightSidebar,
  selectedNode,
  categories = [],
  defaultCategory = "all",
  onCategoryChange,
  mobileMenuOpen = false,
  onMobileMenuOpenChange,
  onMobileConfigClose,
}: WorkflowLayoutProps) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  const handleMobileMenuClose = () => {
    if (onMobileMenuOpenChange) {
      onMobileMenuOpenChange(false);
    }
  };

  const showRightSidebar = selectedNode !== null && selectedNode !== undefined;

  return (
    <div className="flex flex-1 overflow-hidden bg-background relative">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={handleMobileMenuClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer - Slides in from left (below navbar) */}
      <div
        className={cn(
          "md:hidden fixed top-16 left-0 bottom-0 z-50",
          "w-[280px] max-w-[80vw]",
          "bg-card border-r border-border",
          "transform transition-transform duration-300 ease-in-out",
          "flex overflow-hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Category Strip */}
        <div className="w-14 border-r border-border bg-card/80 flex flex-col">
          {/* Close Button */}
          <div className="h-14 flex items-center justify-center border-b border-border">
            <button
              onClick={handleMobileMenuClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories */}
          <div className="flex-1 flex flex-col items-center gap-1 py-3 overflow-y-auto scrollbar-thin">
            {categories.map((category) => (
              <Tooltip key={category.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleCategoryChange(category.id)}
                    className={cn(
                      "relative w-10 h-10 rounded-lg flex items-center justify-center",
                      "transition-all duration-200",
                      activeCategory === category.id
                        ? "bg-primary/15 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {category.icon}
                    {activeCategory === category.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <p className="font-medium">{category.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Mobile Blocks Panel */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {sidebar(activeCategory)}
        </div>
      </div>

      {/* Desktop: Vertical Category Strip - Ubuntu Style */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-border bg-card/80 backdrop-blur-sm",
        "md:w-12 lg:w-14"
      )}>
        <div className="flex-1 flex flex-col items-center gap-1 py-3">
          {categories.map((category) => (
            <Tooltip key={category.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "relative rounded-lg flex items-center justify-center",
                    "transition-all duration-200 group",
                    "w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10",
                    activeCategory === category.id
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <div className="md:scale-90 lg:scale-100">
                    {category.icon}
                  </div>
                  {activeCategory === category.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <p className="font-medium">{category.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </aside>

      {/* Desktop: Blocks Panel */}
      <aside className={cn(
        "hidden md:block border-r border-border bg-card overflow-y-auto scrollbar-thin",
        "md:w-[140px] lg:w-[160px] xl:w-[170px]"
      )}>
        {sidebar(activeCategory)}
      </aside>

      {/* Canvas area */}
      <main className={cn(
        "flex-1 overflow-auto",
        "max-w-[2400px] mx-auto w-full"
      )}>
        {children}
      </main>

      {/* Mobile: Right Sidebar Overlay (Config Panel) */}
      {rightSidebar && showRightSidebar && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => {
              if (onMobileConfigClose) {
                onMobileConfigClose();
              }
            }}
            aria-hidden="true"
          />
          
          {/* Mobile Config Drawer - Slides from right (below navbar) */}
          <aside
            className={cn(
              "md:hidden fixed top-16 right-0 bottom-0 z-50",
              "w-[320px] max-w-[85vw]",
              "bg-card border-l border-border",
              "overflow-y-auto scrollbar-thin",
              "transform transition-transform duration-300 ease-in-out",
              "translate-x-0" // Always visible when showRightSidebar is true on mobile
            )}
          >
            {rightSidebar(selectedNode)}
          </aside>
        </>
      )}

      {/* Desktop: Right Sidebar - Configuration Panel */}
      {rightSidebar && (
        <aside
          className={cn(
            "hidden border-l border-border bg-card overflow-y-auto scrollbar-thin transition-all duration-200",
            showRightSidebar ? "md:block" : "hidden",
            "md:w-[280px] lg:w-[300px] xl:w-[320px]"
          )}
        >
          {showRightSidebar && rightSidebar(selectedNode)}
        </aside>
      )}
    </div>
  );
}
