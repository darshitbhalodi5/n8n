"use client";

import React from "react";
import {
  Play,
  Workflow as WorkflowIcon,
  MessageSquare,
  Bot,
  Sparkles,
  CheckSquare,
} from "lucide-react";
import { WorkflowLayout, WorkflowSidebar } from "@/components/workflow-layout";
import { TooltipProvider } from "@/components/ui";
import { WorkflowCanvas, BaseNode } from "@/components/workflow";
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
} from "reactflow";
import type { NodeProps } from "reactflow";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "base",
    position: { x: 100, y: 100 },
    data: {
      label: "Start Node",
      description: "This is the entry point",
      icon: <Play className="w-4 h-4" />,
      status: "idle" as const,
    },
  },
  {
    id: "2",
    type: "base",
    position: { x: 400, y: 100 },
    data: {
      label: "Process Node",
      description: "Processing data",
      status: "running" as const,
    },
  },
  {
    id: "3",
    type: "base",
    position: { x: 700, y: 100 },
    data: {
      label: "End Node",
      status: "success" as const,
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

const nodeTypes = {
  base: (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
};

export default function WorkflowPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Parameters<typeof addEdge>[0]) =>
    setEdges((eds) => addEdge(connection, eds));

  const categories = [
    { id: "all", label: "All", icon: <CheckSquare className="w-4 h-4" /> },
    {
      id: "workflow",
      label: "Workflow",
      icon: <WorkflowIcon className="w-4 h-4" />,
    },
    {
      id: "chatflow",
      label: "Chatflow",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    { id: "chatbot", label: "Chatbot", icon: <Bot className="w-4 h-4" /> },
    { id: "agent", label: "Agent", icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <TooltipProvider>
      <WorkflowLayout
        categories={categories}
        defaultCategory="workflow"
        sidebar={<WorkflowSidebar />}
      >
        <div className="h-full bg-background p-6">
          <div className="h-full flex flex-col gap-4">
            {/* Canvas Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Workflow Canvas
                </h2>
                <p className="text-sm text-muted-foreground">
                  Drag nodes and connect them to create your workflow
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                No workflows found
              </div>
            </div>

            {/* Workflow Canvas */}
            <div className="flex-1 rounded-lg border border-border overflow-hidden bg-card">
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                showBackground
                showControls
                className="h-full"
              />
            </div>
          </div>
        </div>
      </WorkflowLayout>
    </TooltipProvider>
  );
}
