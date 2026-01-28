"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Grid, List, FileQuestion, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WorkflowCardSkeleton } from "@/components/workflow/WorkflowCardSkeleton";
import { useWorkflowSearch } from "@/hooks/useWorkflowSearch";
import { extractUniqueTags } from "@/utils/workflow-tags";
import { WORKFLOW_CONSTANTS } from "@/constants/workflow";

export function PublicWorkflowsGallery() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Use custom search hook with built-in debouncing
  const {
    workflows,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    isPending,
  } = useWorkflowSearch();

  // Extract unique tags from all workflows
  const allTags = useMemo(() => extractUniqueTags(workflows), [workflows]);

  // Keyboard shortcut for search focus (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePreview = (workflowId: string) => {
    router.push(`/public-workflows/${workflowId}`);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Public Workflows
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover and use workflows created by the community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search workflows... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search workflows"
          />
          {isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary/50"
              )}
              title="Grid view"
              aria-label="Switch to grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary/50"
              )}
              title="List view"
              aria-label="Switch to list view"
              aria-pressed={viewMode === "list"}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            onClick={() => setSelectedTag(null)}
            className={cn(
              "px-3 py-1.5 h-auto text-sm rounded-full transition-all",
              selectedTag === null
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-secondary/30 hover:bg-secondary/50"
            )}
          >
            All
            {selectedTag === null && <Check className="w-3 h-3 ml-1" />}
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "px-3 py-1.5 h-auto text-sm rounded-full transition-all",
                selectedTag === tag
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              {tag}
              {selectedTag === tag && <Check className="w-3 h-3 ml-1" />}
            </Button>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-destructive/20 bg-destructive/10">
          <CardContent className="p-4 text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Loading State with Skeletons */}
      {isLoading && (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}
        >
          {Array.from({ length: WORKFLOW_CONSTANTS.SKELETON_CARDS_COUNT }).map((_, i) => (
            <WorkflowCardSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && workflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <FileQuestion className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">No workflows found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedTag
                  ? "Try adjusting your filters or search terms"
                  : "Be the first to share a workflow with the community!"}
              </p>
            </div>
            {!searchQuery && !selectedTag && (
              <Button
                onClick={() => router.push('/automation-builder')}
                className="mt-4"
              >
                Create First Public Workflow
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Workflows Grid/List */}
      {!isLoading && workflows.length > 0 && (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}
        >
          {workflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg group"
              onClick={() => handlePreview(workflow.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {workflow.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {workflow.description || "No description"}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                {workflow.tags && workflow.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {workflow.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="text-xs text-muted-foreground border-t border-border/50 pt-3">
                <span className="flex-1">
                  {workflow.usage_count || 0} use{workflow.usage_count !== 1 ? "s" : ""}
                </span>
                <span>
                  {workflow.published_at
                    ? new Date(workflow.published_at).toLocaleDateString()
                    : "Recently published"}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
