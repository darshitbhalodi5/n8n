"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface WorkflowLayoutProps {
  children: React.ReactNode;
  sidebar: (activeCategory: string) => React.ReactNode;
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
        {/* Left Sidebar - 255px */}
        <aside className="w-[255px] border-r border-border bg-card overflow-y-auto">
          {sidebar(activeCategory)}
        </aside>

        {/* Canvas area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
