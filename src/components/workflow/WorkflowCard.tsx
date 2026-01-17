"use client";

import React, { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import type { WorkflowSummary } from "@/types/workflow";
import {
    Play,
    Edit3,
    Trash2,
    Loader2,
    MoreVertical,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusIcon } from "@/utils/workflow-utils";

interface WorkflowCardProps {
    workflow: WorkflowSummary;
    viewMode: "grid" | "list";
    isDeleting: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onRun: () => void;
}

export const WorkflowCard = React.memo(function WorkflowCard({
    workflow,
    viewMode,
    isDeleting,
    onEdit,
    onDelete,
    onRun,
}: WorkflowCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return "Unknown";
        }
    };

    if (viewMode === "list") {
        return (
            <div
                className={cn(
                    "group flex items-center gap-4 p-4 rounded-lg",
                    "bg-card/50 border border-border/50",
                    "hover:border-amber-500/30 hover:bg-card/80",
                    "transition-all duration-200",
                    isDeleting && "opacity-50 pointer-events-none"
                )}
            >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-amber-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                        {workflow.description || "No description"}
                    </p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <span className={getStatusColor(workflow.last_execution_status)}>
                            {getStatusIcon(workflow.last_execution_status)}
                        </span>
                        <span>{workflow.execution_count} runs</span>
                    </div>
                    <div className="text-xs">
                        Updated {formatDate(workflow.updated_at)}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onRun}
                        className="p-2 rounded-lg hover:bg-green-500/10 text-green-400 transition-colors"
                        title="Run workflow"
                    >
                        <Play className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-500 transition-colors"
                        title="Edit workflow"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                        title="Delete workflow"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div
            className={cn(
                "group relative rounded-xl overflow-hidden",
                "bg-gradient-to-br from-card/80 to-card/40",
                "border border-border/50",
                "hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5",
                "transition-all duration-300",
                isDeleting && "opacity-50 pointer-events-none"
            )}
        >
            {/* Gradient overlay on hover - pointer-events-none so it doesn't block clicks */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Content */}
            <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-amber-500" />
                    </div>

                    {/* Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-36 py-1 rounded-lg bg-popover border border-border shadow-xl z-10">
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onEdit();
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onRun();
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 transition-colors"
                                >
                                    <Play className="w-4 h-4" />
                                    Run
                                </button>
                                <hr className="my-1 border-border" />
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onDelete();
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-semibold text-lg mb-1 truncate">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                    {workflow.description || "No description"}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className={getStatusColor(workflow.last_execution_status)}>
                            {getStatusIcon(workflow.last_execution_status)}
                        </span>
                        <span>{workflow.execution_count} runs</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        {formatDate(workflow.updated_at)}
                    </div>
                </div>

                {/* Success/Fail Stats - Always show for consistent card height */}
                <div className="mt-3 flex gap-3 text-xs min-h-[1rem]">
                    {workflow.execution_count > 0 ? (
                        <>
                            <span className="text-green-400">
                                ✓ {workflow.success_count}
                            </span>
                            <span className="text-red-400">
                                ✗ {workflow.failed_count}
                            </span>
                        </>
                    ) : (
                        <span className="text-muted-foreground/50">No executions yet</span>
                    )}
                </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-border/50 p-3 flex gap-2 bg-black/20">
                <button
                    onClick={onEdit}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors text-sm font-medium"
                >
                    <Edit3 className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={onRun}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-sm font-medium"
                >
                    <Play className="w-4 h-4" />
                    Run
                </button>
            </div>
        </div>
    );
});
