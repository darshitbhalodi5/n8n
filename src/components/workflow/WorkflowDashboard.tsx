"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";
import { WorkflowCard } from "./WorkflowCard";
import { WorkflowCardSkeleton } from "./WorkflowCardSkeleton";
import { listWorkflows, deleteWorkflow } from "@/utils/workflow-api";
import type { WorkflowSummary } from "@/types/workflow";
import { Plus, Search, LayoutGrid, List, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkflowDashboard() {
    const router = useRouter();
    const { getPrivyAccessToken, authenticated, ready } = usePrivyWallet();

    const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const fetchWorkflows = useCallback(async () => {
        if (!authenticated) return;

        setIsLoading(true);
        setError(null);

        try {
            const accessToken = await getPrivyAccessToken();
            if (!accessToken) {
                setError("Unable to authenticate. Please log in again.");
                setIsLoading(false);
                return;
            }

            const result = await listWorkflows({ accessToken });

            if (result.success) {
                setWorkflows(result.data || []);
            } else {
                setError(result.error?.message || "Failed to load workflows");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [authenticated, getPrivyAccessToken]);

    useEffect(() => {
        if (ready && authenticated) {
            fetchWorkflows();
        } else if (ready && !authenticated) {
            setIsLoading(false);
        }
    }, [ready, authenticated, fetchWorkflows]);

    const handleCreateNew = () => {
        router.push("/automation-builder");
    };

    const handleEdit = (workflowId: string) => {
        router.push(`/automation-builder?workflowId=${workflowId}`);
    };

    const handleDelete = async (workflowId: string) => {
        if (!confirm("Are you sure you want to delete this workflow? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(workflowId);

        try {
            const accessToken = await getPrivyAccessToken();
            if (!accessToken) {
                alert("Unable to authenticate. Please log in again.");
                return;
            }

            const result = await deleteWorkflow({ workflowId, accessToken });

            if (result.success) {
                setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
            } else {
                alert(result.error?.message || "Failed to delete workflow");
            }
        } catch (err) {
            alert("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleRun = (workflowId: string) => {
        // Navigate to the workflow and trigger execution
        router.push(`/automation-builder?workflowId=${workflowId}&autoRun=true`);
    };

    const filteredWorkflows = workflows.filter((workflow) =>
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Show login prompt if not authenticated
    if (ready && !authenticated) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <LayoutGrid className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Sign in to view your workflows</h2>
                    <p className="text-muted-foreground max-w-md">
                        Connect your wallet to access your saved workflows and create new automations.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-12 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        My Workflows
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {workflows.length} workflow{workflows.length !== 1 ? "s" : ""} total
                    </p>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
                >
                    <Plus className="w-5 h-5" />
                    New Workflow
                </button>
            </div>

            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search workflows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchWorkflows}
                        disabled={isLoading}
                        className="p-2.5 rounded-lg border border-border hover:bg-secondary/50 transition-colors disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </button>

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
                            <LayoutGrid className="w-4 h-4" />
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

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className={cn(
                    viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-3"
                )}>
                    {[...Array(6)].map((_, i) => (
                        <WorkflowCardSkeleton key={i} viewMode={viewMode} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredWorkflows.length === 0 && (
                <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <Plus className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">
                            {searchQuery ? "No workflows found" : "No workflows yet"}
                        </h3>
                        <p className="text-muted-foreground max-w-sm">
                            {searchQuery
                                ? "Try a different search term"
                                : "Create your first workflow to automate tasks and connect services."}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleCreateNew}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Workflow
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Workflow Grid/List */}
            {!isLoading && filteredWorkflows.length > 0 && (
                <div className={cn(
                    viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-3"
                )}>
                    {filteredWorkflows.map((workflow) => (
                        <WorkflowCard
                            key={workflow.id}
                            workflow={workflow}
                            viewMode={viewMode}
                            isDeleting={isDeleting === workflow.id}
                            onEdit={() => handleEdit(workflow.id)}
                            onDelete={() => handleDelete(workflow.id)}
                            onRun={() => handleRun(workflow.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
