"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { X } from "lucide-react";
import { useWorkflow } from "@/contexts/WorkflowContext";
import logo from "@/assets/logo.svg";
import {
  WorkflowCanvas,
  WorkflowToolbar,
  WorkflowStatusBar,
} from "@/components/workflow";
import { WorkflowSidebar } from "./workflow-layout/WorkflowSidebar";
import { WorkflowRightSidebar } from "./workflow-layout/WorkflowRightSidebar";
import { CategoryDropdown } from "./workflow-layout/CategoryDropdown";

interface WorkflowLayoutProps {
  onCategoryChange?: (categoryId: string) => void;
}

export function WorkflowLayout({ onCategoryChange }: WorkflowLayoutProps) {
  const {
    selectedNode,
    mobileMenuOpen,
    setMobileMenuOpen,
    setSelectedNode,
    categories,
    onDragOver,
    onDrop,
  } = useWorkflow();
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const showRightSidebar = selectedNode !== null && selectedNode !== undefined;

  return (
    <div className="flex overflow-hidden bg-background relative min-h-screen">
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
          <WorkflowSidebar activeCategory={activeCategory} />
        </div>
      </div>

      {/* Desktop: Single Sidebar with Logo, Dropdown, and Blocks */}
      <aside className="max-h-screen hidden md:flex flex-col overflow-auto md:w-[200px] lg:w-[220px] xl:w-[240px] p-4 gap-6 bg-background">
        {/* Logo Section */}
        <Link href="/">
        <div className="w-[120px] sm:w-[160px] h-max">
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            className="w-full h-auto"
          />
        </div>
      </Link>

        {/* Category Dropdown */}
        <CategoryDropdown
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Blocks Panel */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <WorkflowSidebar activeCategory={activeCategory} />
        </div>
      </aside>

      {/* Canvas area */}
      <main className="flex-1 overflow-auto max-w-[2400px] mx-auto w-full">
        <div className="h-full bg-background relative">
          {/* Floating Toolbar */}
          <WorkflowToolbar workflowName="Untitled Workflow" />

          {/* Workflow Canvas - Full Height */}
          <div
            className="h-full w-full"
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={(e) => {
              e.stopPropagation();
            }}
            role="application"
            aria-label="Workflow canvas - drag blocks here to build your workflow"
          >
            <WorkflowCanvas showBackground className="h-full" />
          </div>

          {/* Status Bar */}
          <WorkflowStatusBar />
        </div>
      </main>

      {/* Mobile: Right Sidebar Overlay (Config Panel) */}
      {showRightSidebar && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => {
              setSelectedNode(null);
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
              "translate-x-0"
            )}
          >
            <WorkflowRightSidebar />
          </aside>
        </>
      )}

      {/* Desktop: Right Sidebar - Configuration Panel */}
      <aside
        className={cn(
          "hidden border-l border-border bg-card overflow-y-auto scrollbar-thin transition-all duration-200",
          showRightSidebar ? "md:block" : "hidden",
          "md:w-[280px] lg:w-[300px] xl:w-[320px]"
        )}
      >
        {showRightSidebar && <WorkflowRightSidebar />}
      </aside>
    </div>
  );
}
