"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";
import { getWorkflowExecutions } from "@/utils/workflow-api";
import { getStatusColor, getStatusIcon, formatDuration } from "@/utils/workflow-utils";
import type { WorkflowExecution } from "@/types/workflow";
import {
    ChevronDown,
    ChevronUp,
    Loader2,
    RefreshCw,
    Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ExecutionHistoryPanel() {
    const { currentWorkflowId } = useWorkflow();
    const { getPrivyAccessToken, authenticated } = usePrivyWallet();

    const [isExpanded, setIsExpanded] = useState(false);
    const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchExecutions = useCallback(async () => {
        if (!currentWorkflowId || !authenticated) return;

        setIsLoading(true);
        setError(null);

        try {
            const accessToken = await getPrivyAccessToken();
            if (!accessToken) {
                setError("Unable to authenticate");
                return;
            }

            const result = await getWorkflowExecutions({
                workflowId: currentWorkflowId,
                accessToken,
                limit: 20,
            });

            if (result.success) {
                setExecutions(result.data || []);
            } else {
                setError(result.error?.message || "Failed to load executions");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkflowId, authenticated, getPrivyAccessToken]);

    useEffect(() => {
        if (isExpanded && currentWorkflowId) {
            fetchExecutions();
        }
    }, [isExpanded, currentWorkflowId, fetchExecutions]);

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return "Unknown";
        }
    };

    // Don't show if no workflow is loaded
    if (!currentWorkflowId) return null;

    return (
        <div className="absolute bottom-4 left-4 right-4 z-10">
            <div
                className={cn(
                    "bg-card/95 backdrop-blur-md rounded-xl border border-border/50 shadow-xl",
                    "transition-all duration-300 ease-in-out overflow-hidden",
                    isExpanded ? "max-h-80" : "max-h-12"
                )}
            >
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Play className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">
                            Execution History
                            {executions.length > 0 && (
                                <span className="ml-2 text-muted-foreground">
                                    ({executions.length})
                                </span>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fetchExecutions();
                                }}
                                disabled={isLoading}
                                className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-50"
                                title="Refresh"
                            >
                                <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
                            </button>
                        )}
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        )}
                    </div>
                </button>

                {/* Content */}
                {isExpanded && (
                    <div className="px-4 pb-4 max-h-64 overflow-y-auto">
                        {isLoading && executions.length === 0 && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-destructive py-4 text-center">
                                {error}
                            </div>
                        )}

                        {!isLoading && executions.length === 0 && !error && (
                            <div className="text-sm text-muted-foreground py-8 text-center">
                                No executions yet. Run the workflow to see history.
                            </div>
                        )}

                        {executions.length > 0 && (
                            <div className="space-y-2">
                                {executions.map((execution, index) => (
                                    <div
                                        key={execution.id}
                                        className={cn(
                                            "flex items-center justify-between gap-4 p-3 rounded-lg",
                                            "bg-secondary/20 hover:bg-secondary/30 transition-colors",
                                            "cursor-pointer"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={cn(
                                                    "flex items-center gap-1.5",
                                                    getStatusColor(execution.status)
                                                )}
                                            >
                                                {getStatusIcon(execution.status)}
                                            </span>
                                            <div>
                                                <div className="text-sm font-medium">
                                                    #{executions.length - index}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatTime(execution.started_at)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm">
                                            <span className={getStatusColor(execution.status)}>
                                                {execution.status}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                {formatDuration(execution.started_at, execution.completed_at)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
