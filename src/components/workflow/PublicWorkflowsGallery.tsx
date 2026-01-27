"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Grid, List, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { listPublicWorkflows } from "@/utils/workflow-api";
import type { PublicWorkflowSummary } from "@/types/workflow";

export function PublicWorkflowsGallery() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<PublicWorkflowSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch workflows
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await listPublicWorkflows({
          q: searchQuery || undefined,
          tag: selectedTag || undefined,
        });

        if (result.success) {
          setWorkflows(result.data || []);
        } else {
          setError(result.error?.message || "Failed to load public workflows");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflows();
  }, [searchQuery, selectedTag]);

  // Extract unique tags from all workflows
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    workflows.forEach((workflow) => {
      if (workflow.tags && Array.isArray(workflow.tags)) {
        workflow.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [workflows]);

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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
            className="px-3 py-1.5 h-auto text-sm rounded-full"
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className="px-3 py-1.5 h-auto text-sm rounded-full"
            >
              {tag}
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && workflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || selectedTag
                ? "No workflows found matching your criteria"
                : "No public workflows available yet"}
            </p>
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
