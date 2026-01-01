"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Node } from "reactflow";

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
}

export function WorkflowLayout({
  children,
  sidebar,
  rightSidebar,
  selectedNode,
  categories = [],
  defaultCategory = "all",
  onCategoryChange,
}: WorkflowLayoutProps) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  const showRightSidebar = selectedNode !== null && selectedNode !== undefined;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header with horizontal tabs */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center h-14 px-6">
          <nav className="flex gap-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeCategory === category.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <div className="flex items-center gap-2">
                  {category.icon}
                  {category.label}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - 20% width on desktop, hidden on mobile */}
        <aside className="hidden md:block w-[20%] border-r border-border bg-card overflow-y-auto">
          {sidebar(activeCategory)}
        </aside>

        {/* Canvas area - responsive width */}
        <main
          className={cn(
            "overflow-auto transition-all duration-200",
            // Mobile: full width
            "w-full md:w-[80%]",
            // Desktop: 60% when right sidebar visible, 80% when not
            showRightSidebar && "md:w-[60%]"
          )}
        >
          {children}
        </main>

        {/* Right Sidebar - 20% width, conditionally visible on desktop */}
        {rightSidebar && (
          <aside
            className={cn(
              "hidden md:block border-l border-border bg-card overflow-y-auto transition-all duration-200",
              showRightSidebar ? "w-[20%]" : "w-0 hidden"
            )}
          >
            {showRightSidebar && rightSidebar(selectedNode)}
          </aside>
        )}
      </div>
    </div>
  );
}
