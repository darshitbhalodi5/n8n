"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Copy } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";
import {
  getPublicWorkflow,
  clonePublicWorkflow,
  transformWorkflowToCanvas,
} from "@/utils/workflow-api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "../workflow/nodeTypes";
import type { PublicWorkflowDetail } from "@/types/workflow";

interface PublicWorkflowPreviewProps {
  workflowId: string;
}

function PublicWorkflowPreviewInner({ workflowId }: PublicWorkflowPreviewProps) {
  const router = useRouter();
  const { login } = usePrivy();
  const { getPrivyAccessToken, authenticated } = usePrivyWallet();
  const [workflow, setWorkflow] = useState<PublicWorkflowDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch workflow
  useEffect(() => {
    const fetchWorkflow = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getPublicWorkflow({ workflowId });

        if (result.success && result.data) {
          setWorkflow(result.data);
        } else {
          setError(result.error?.message || "Failed to load workflow");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflow();
  }, [workflowId]);

  const handleUseWorkflow = async () => {
    if (!authenticated) {
      // Prompt user to log in
      login();
      return;
    }

    setIsCloning(true);

    try {
      const accessToken = await getPrivyAccessToken();
      if (!accessToken) {
        alert("Unable to authenticate. Please try logging in again.");
        setIsCloning(false);
        return;
      }

      const result = await clonePublicWorkflow({
        workflowId,
        accessToken,
      });

      if (result.success && result.newWorkflowId) {
        // Navigate to the builder with the new workflow
        router.push(`/automation-builder?workflowId=${result.newWorkflowId}`);
      } else {
        alert(
          `Failed to clone workflow: ${result.error?.message || "Unknown error"}`
        );
        setIsCloning(false);
      }
    } catch (error) {
      console.error("Error cloning workflow:", error);
      alert(
        `Error cloning workflow: ${error instanceof Error ? error.message : String(error)}`
      );
      setIsCloning(false);
    }
  };

  const handleBack = () => {
    router.push("/public-workflows");
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error State
  if (error || !workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center space-y-4">
            <p className="text-destructive text-lg font-medium">
              {error || "Workflow not found"}
            </p>
            <Button onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Transform nodes and edges for display
  const { nodes, edges } = transformWorkflowToCanvas(workflow);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Button onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {workflow.name}
                </h1>
              </div>
              <Button
                onClick={handleUseWorkflow}
                disabled={isCloning}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 gap-2"
              >
                {isCloning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cloning...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Use This Workflow
                  </>
                )}
              </Button>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              {workflow.description && (
                <p className="text-muted-foreground">{workflow.description}</p>
              )}
              {workflow.tags && workflow.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {workflow.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1.5 bg-primary/20 text-primary rounded-full font-medium border border-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 m-4">
          <div className="w-full h-full rounded-xl border border-border bg-card overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              nodesFocusable={false}
              edgesFocusable={false}
              zoomOnScroll={true}
              zoomOnPinch={true}
              panOnScroll={false}
              panOnDrag={true}
              defaultEdgeOptions={{
                type: "smoothstep",
                animated: true,
                style: {
                  stroke: "#ffffff",
                  strokeWidth: 1,
                },
              }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={2}
                color="rgba(255, 255, 255, 0.08)"
              />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicWorkflowPreview(props: PublicWorkflowPreviewProps) {
  return (
    <ReactFlowProvider>
      <PublicWorkflowPreviewInner {...props} />
    </ReactFlowProvider>
  );
}
