"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Save, Share2, Menu, Pencil, LogIn, ChevronLeft, Loader2, Check } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui";
import { UserMenu } from "@/components/user-menu";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { formatDistanceToNow } from "date-fns";

interface WorkflowToolbarProps {
  onShare?: () => void;
  className?: string;
}

export const WorkflowToolbar = React.memo(function WorkflowToolbar({
  onShare,
  className,
}: WorkflowToolbarProps) {
  const router = useRouter();
  const {
    nodes,
    handleSave,
    handleRun,
    setMobileMenuOpen,
    workflowName,
    setWorkflowName,
    isSaving,
    lastSaved,
    currentWorkflowId,
  } = useWorkflow();

  const { ready, authenticated, login } = usePrivy();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(workflowName);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const canRun = nodes.length > 0;

  useEffect(() => {
    setEditedName(workflowName);
  }, [workflowName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Show saved indicator briefly after save
  useEffect(() => {
    if (lastSaved && !isSaving) {
      setShowSavedIndicator(true);
      const timer = setTimeout(() => setShowSavedIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved, isSaving]);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSaveName = () => {
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== workflowName) {
      setWorkflowName(trimmedName);
    } else {
      setEditedName(workflowName);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(workflowName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveName();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleGoBack = () => {
    router.push("/workflows");
  };

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    try {
      return formatDistanceToNow(lastSaved, { addSuffix: true });
    } catch {
      return null;
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 py-4 ${className || ""
        }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleGoBack}
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
          aria-label="Back to workflows"
          title="Back to workflows"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
          aria-label="Open blocks menu"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Workflow Title - Editable */}
        <div className="relative flex items-center justify-start rounded-full border border-white/20 px-4 h-[44px] group hover:border-white/30 transition-all duration-300 w-[300px]">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-sm font-semibold text-white placeholder:text-white/50 w-full"
              placeholder="Enter workflow name"
            />
          ) : (
            <h2 className="text-sm font-semibold text-white truncate min-w-0">
              {workflowName}
            </h2>
          )}

          <Button
            onClick={handleStartEdit}
            className="absolute right-0 p-0! w-[42px]! h-[42px]!"
            title="Edit workflow name"
            aria-label="Edit workflow name"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        {/* Save Status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-white/50">
          {isSaving && (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {showSavedIndicator && !isSaving && (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Saved</span>
            </>
          )}
          {lastSaved && !isSaving && !showSavedIndicator && (
            <span>Saved {formatLastSaved()}</span>
          )}
          {currentWorkflowId && !lastSaved && !isSaving && (
            <span className="text-amber-400">Unsaved changes</span>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-9 px-4 bg-black/50 border border-white/20 hover:bg-black/70 hover:border-white/30 text-white gap-2 transition-all disabled:opacity-50"
          title="Save (Ctrl + S)"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="w-4 h-4" aria-hidden="true" />
          )}
          <span className="hidden md:inline text-sm font-medium">
            {isSaving ? "Saving..." : "Save"}
          </span>
        </Button>

        {/* Share Button */}
        {onShare && (
          <Button
            onClick={onShare}
            className="hidden sm:flex h-9 px-4 bg-black/50 border border-white/20 hover:bg-black/70 hover:border-white/30 text-white gap-2 transition-all"
            title="Share"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden lg:inline text-sm font-medium">Share</span>
          </Button>
        )}

        {/* Run Button */}
        <Button
          onClick={handleRun}
          disabled={!canRun}
          className="h-9 px-5 bg-amber-600 hover:bg-amber-600/90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold gap-2 transition-all"
          title="Run Workflow (Ctrl + Enter)"
        >
          <Play className="w-4 h-4 fill-current" aria-hidden="true" />
          <span className="text-sm">Run</span>
        </Button>

        {/* Login/Auth Button - Synced with Navbar */}
        {ready && (
          <>
            {authenticated ? (
              <div className="ml-2">
                <UserMenu size="md" />
              </div>
            ) : (
              <Button
                onClick={login}
                className="h-9 px-4 bg-black/50 border border-white/20 hover:bg-black/70 hover:border-white/30 text-white gap-2 transition-all"
                title="Login / Sign Up"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline text-sm font-medium">Login / Sign Up</span>
                <span className="sm:hidden text-sm font-medium">Login</span>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
});

