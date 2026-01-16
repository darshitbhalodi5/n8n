"use client";

import { WorkflowLayout } from "@/components/workflow/WorkflowLayout";
import { TooltipProvider } from "@/components/ui";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Wrap with ErrorBoundary for production error handling
export default function WorkflowPageClient() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <TooltipProvider>
          <WorkflowLayout />
        </TooltipProvider>
      </div>
    </ErrorBoundary>
  );
}
