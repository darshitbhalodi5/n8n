"use client";

import React, { useCallback, useRef, useMemo, useState } from "react";
import { 
  CheckSquare, 
  LogIn, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Play,
  Save,
  Share2,
  Clock,
  Menu
} from "lucide-react";
import {
  WorkflowLayout,
  WorkflowSidebar,
  WorkflowRightSidebar,
} from "@/components/workflow-layout";
import { TooltipProvider, Button } from "@/components/ui";
import { UserMenu } from "@/components/user-menu";
import { Navbar } from "@/components/layout";
import { cn } from "@/lib/utils";
import { WorkflowCanvas, BaseNode, WalletNode } from "@/components/workflow";
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  ReactFlowInstance,
} from "reactflow";
import type { NodeProps } from "reactflow";
import { usePrivy } from "@privy-io/react-auth";

// Define handler types for React Flow events
type OnNodeClick = (event: React.MouseEvent, node: Node) => void;
type OnPaneClick = (event: React.MouseEvent) => void;
import {
  getBlockById,
  iconRegistry,
  blockCategories,
  type BlockDefinition,
} from "@/components/blocks";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Node type registry - React Flow handles deletion automatically
const nodeTypes = {
  base: (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
  telegram: (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
  mail: (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
  slack: (props: NodeProps) => (
    <BaseNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
  "wallet-node": (props: NodeProps) => (
    <WalletNode
      {...props}
      showHandles
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  ),
};

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Privy hooks for authentication and wallet access
  const { ready, authenticated, login } = usePrivy();

  // Canvas control handlers
  const handleZoomIn = useCallback(() => {
    reactFlowInstance.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.current?.zoomOut();
  }, []);

  const handleFitView = useCallback(() => {
    reactFlowInstance.current?.fitView({ padding: 0.2 });
  }, []);

  const handleSave = useCallback(() => {
    setLastSaved(new Date());
    // TODO: Implement actual save logic
    console.log("Saving workflow...", { nodes, edges });
  }, [nodes, edges]);

  const handleRun = useCallback(() => {
    // TODO: Implement workflow execution
    console.log("Running workflow...");
  }, []);

  // Handle block click to add (mobile tap-to-add)
  const handleBlockClick = useCallback(
    (block: BlockDefinition) => {
      if (!reactFlowInstance.current) {
        return;
      }

      const blockDefinition = getBlockById(block.id);
      if (!blockDefinition) {
        return;
      }

      // Guard: prevent duplicate wallet blocks
      if (blockDefinition.nodeType === "wallet-node") {
        const walletNodeExists = nodes.some((n) => n.type === "wallet-node");
        if (walletNodeExists) {
          console.warn("Wallet block already exists on canvas");
          return;
        }
      }

      // Calculate actual canvas dimensions (excluding sidebars)
      const isMobile = window.innerWidth < 768;
      const navbarHeight = 64; // Navbar height
      
      let canvasLeft = 0;
      let canvasWidth = window.innerWidth;
      const canvasTop = navbarHeight;
      const canvasHeight = window.innerHeight - navbarHeight;

      if (!isMobile) {
        // Desktop: account for sidebars
        const categoryStripWidth = window.innerWidth >= 1024 ? 56 : 48;
        const blocksWidth = window.innerWidth >= 1280 ? 170 : (window.innerWidth >= 1024 ? 160 : 140);
        const configWidth = selectedNode ? (window.innerWidth >= 1280 ? 320 : (window.innerWidth >= 1024 ? 300 : 280)) : 0;
        
        canvasLeft = categoryStripWidth + blocksWidth;
        canvasWidth = window.innerWidth - categoryStripWidth - blocksWidth - configWidth;
      }

      // Calculate center of actual canvas area
      const canvasCenter = reactFlowInstance.current.screenToFlowPosition({
        x: canvasLeft + (canvasWidth / 2),
        y: canvasTop + (canvasHeight / 2),
      });

      // Get icon/logo component for the node
      const IconComponent = blockDefinition.iconName
        ? iconRegistry[blockDefinition.iconName]
        : null;

      // Create new node at center
      const newNode: Node = {
        id: `${block.id}-${Date.now()}`,
        type: blockDefinition.nodeType || "base",
        position: canvasCenter,
        data: {
          ...blockDefinition.defaultData,
          blockId: block.id,
          icon: IconComponent ? <IconComponent className="w-8 h-8" /> : null,
        },
      };

      setNodes((nds) => nds.concat(newNode));

      // Close mobile menu after adding
      setMobileMenuOpen(false);
    },
    [nodes, setNodes, setMobileMenuOpen, selectedNode]
  );

  // React Flow's built-in node deletion handler
  // This automatically handles Delete/Backspace keys and cleans up edges
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      // Get IDs of deleted nodes
      const deletedIds = deleted.map((node) => node.id);

      // Delete connected edges
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !deletedIds.includes(edge.source) &&
            !deletedIds.includes(edge.target)
        )
      );
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Parameters<typeof addEdge>[0]) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Handle block drag and drop to canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const blockData = event.dataTransfer.getData("application/reactflow");
      if (!blockData || !reactFlowInstance.current) {
        return;
      }

      try {
        const block: BlockDefinition = JSON.parse(blockData);
        const blockDefinition = getBlockById(block.id);

        if (!blockDefinition) {
          return;
        }

        // Guard: prevent duplicate wallet blocks
        if (blockDefinition.nodeType === "wallet-node") {
          const walletNodeExists = nodes.some((n) => n.type === "wallet-node");
          if (walletNodeExists) {
            console.warn("Wallet block already exists on canvas");
            return;
          }
        }

        // Get position relative to canvas
        const reactFlowBounds = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Get icon/logo component for the node
        const IconComponent = blockDefinition.iconName
          ? iconRegistry[blockDefinition.iconName]
          : null;

        // Create new node
        const newNode: Node = {
          id: `${block.id}-${Date.now()}`,
          type: blockDefinition.nodeType || "base",
          position,
          data: {
            ...blockDefinition.defaultData,
            blockId: block.id, // Store block ID for right sidebar
            icon: IconComponent ? <IconComponent className="w-8 h-8" /> : null,
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error("Error dropping block:", error);
      }
    },
    [nodes, setNodes]
  );

  const handleBlockDragStart = useCallback(() => {
    // Optional: Add visual feedback or tracking
  }, []);

  // Check if wallet block is disabled (already on canvas)
  const isBlockDisabled = useCallback(
    (blockId: string) => {
      if (blockId === "wallet") {
        return nodes.some((n) => n.type === "wallet-node");
      }
      return false;
    },
    [nodes]
  );

  // Handle node click - select node
  const handleNodeClick: OnNodeClick = useCallback((_event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle pane click - deselect node
  const handlePaneClick: OnPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle node data change from right sidebar
  const handleNodeDataChange = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              }
            : node
        )
      );
      // Update selected node if it's the one being edited
      if (selectedNode?.id === nodeId) {
        setSelectedNode({
          ...selectedNode,
          data: {
            ...selectedNode.data,
            ...data,
          },
        });
      }
    },
    [selectedNode, setNodes]
  );

  // Update selected node when nodes change (in case selected node was deleted)
  React.useEffect(() => {
    if (selectedNode) {
      const nodeExists = nodes.find((n) => n.id === selectedNode.id);
      if (!nodeExists) {
        setSelectedNode(null);
      } else {
        // Update selected node with latest data
        setSelectedNode(nodeExists);
      }
    }
  }, [nodes, selectedNode]);

  // Build categories dynamically from blockCategories
  const categories = useMemo(() => {
    const allCategory = {
      id: "all",
      label: "All",
      icon: <CheckSquare className="w-4 h-4" />,
    };

    const dynamicCategories = blockCategories.map((cat) => {
      const IconComponent = cat.iconName ? iconRegistry[cat.iconName] : null;
      return {
        id: cat.id,
        label: cat.label,
        icon: IconComponent ? <IconComponent className="w-4 h-4" /> : null,
      };
    });

    return [allCategory, ...dynamicCategories];
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <TooltipProvider>
        <WorkflowLayout
        categories={categories}
        defaultCategory="all"
        selectedNode={selectedNode}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuOpenChange={setMobileMenuOpen}
        onMobileConfigClose={() => setSelectedNode(null)}
        sidebar={(activeCategory) => (
          <WorkflowSidebar
            activeCategory={activeCategory}
            onBlockDragStart={handleBlockDragStart}
            onBlockClick={handleBlockClick}
            isBlockDisabled={isBlockDisabled}
          />
        )}
        rightSidebar={(node) => (
          <WorkflowRightSidebar
            selectedNode={node}
            onNodeDataChange={handleNodeDataChange}
            onNodeDelete={(nodeId) => {
              setNodes((nds) => nds.filter((n) => n.id !== nodeId));
              setEdges((eds) =>
                eds.filter(
                  (edge) => edge.source !== nodeId && edge.target !== nodeId
                )
              );
              if (selectedNode?.id === nodeId) {
                setSelectedNode(null);
              }
            }}
            onClose={() => setSelectedNode(null)}
          />
        )}
      >
        <div className="h-full bg-background relative">
          {/* Responsive Floating Toolbar */}
          <div className="absolute top-2 md:top-3 left-2 md:left-3 right-2 md:right-3 z-10 flex items-center justify-between gap-2">
            {/* Left Section */}
            <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
              {/* Mobile Menu Button - Integrated in toolbar */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  "md:hidden",
                  "bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg",
                  "w-8 h-8 flex items-center justify-center",
                  "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  "transition-colors duration-200"
                )}
                aria-label="Open blocks menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Workflow Title - Responsive */}
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 md:px-4 py-1.5 md:py-2 shadow-lg min-w-0 shrink">
                <h2 className="text-xs md:text-sm font-semibold text-foreground truncate">
                  Untitled Workflow
                </h2>
              </div>
              
              {/* Node Counter Badge - Hide on mobile */}
              <div className="hidden sm:flex bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 md:px-3 py-1.5 md:py-2 shadow-lg">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {nodes.length} {nodes.length === 1 ? "node" : "nodes"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Actions - Responsive */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Canvas Controls - Hide zoom on small mobile */}
              <div className="hidden xs:flex bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg items-center divide-x divide-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="rounded-none rounded-l-lg h-7 md:h-9 px-2 md:px-3 hover:bg-muted"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="rounded-none h-7 md:h-9 px-2 md:px-3 hover:bg-muted"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFitView}
                  className="rounded-none rounded-r-lg h-7 md:h-9 px-2 md:px-3 hover:bg-muted"
                  title="Fit View"
                >
                  <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </div>

              {/* Workflow Actions - Responsive */}
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg flex items-center gap-0.5 md:gap-1 px-0.5 md:px-1 py-0.5 md:py-1">
                {/* Save - Icon only on mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="h-7 md:h-8 px-2 md:px-3 hover:bg-muted gap-1.5"
                  title="Save"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden md:inline text-xs font-medium">Save</span>
                </Button>
                {/* Share - Hide on small screens */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex h-7 md:h-8 px-2 md:px-3 hover:bg-muted gap-1.5"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-xs font-medium">Share</span>
                </Button>
                <div className="hidden sm:block w-px h-4 bg-border" />
                {/* Run Button - Always visible, compact on mobile */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRun}
                  disabled={nodes.length === 0}
                  className="h-7 md:h-8 px-3 md:px-4 gap-1 md:gap-1.5 bg-primary hover:bg-primary/90"
                  title="Run Workflow"
                >
                  <Play className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
                  <span className="text-[10px] md:text-xs font-semibold">Run</span>
                </Button>
              </div>

              {/* User Menu / Auth - Compact on mobile */}
              {ready && (
                <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg px-0.5 md:px-1 py-0.5 md:py-1">
                  {authenticated ? (
                    <div className="scale-90 md:scale-100 origin-right">
                      <UserMenu size="sm" />
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={login}
                      className="h-7 md:h-8 px-2 md:px-3 gap-1 md:gap-1.5 bg-accent hover:bg-accent/90"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-xs font-semibold">Sign In</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Workflow Canvas - Full Height */}
          <div
            className="h-full w-full"
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodesDelete={onNodesDelete}
              nodeTypes={nodeTypes}
              showBackground
              className="h-full"
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              onInit={(instance) => {
                reactFlowInstance.current = instance;
              }}
            />
          </div>

          {/* Responsive Status Bar */}
          <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 z-10">
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 md:px-4 py-1.5 md:py-2 shadow-lg">
              <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
                {/* Save Status */}
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="hidden xs:inline">
                    {lastSaved 
                      ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : "Not saved"
                    }
                  </span>
                  <span className="xs:hidden">
                    {lastSaved ? "Saved" : "Unsaved"}
                  </span>
                </div>
                
                {/* Connections - Hide on very small screens */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-px h-3 bg-border" />
                  <span>{edges.length} {edges.length === 1 ? "connection" : "connections"}</span>
                </div>
                
                {/* Helper Text - Hide on mobile */}
                {nodes.length === 0 && (
                  <>
                    <div className="hidden md:block w-px h-3 bg-border" />
                    <span className="hidden md:inline text-muted-foreground/70">
                      Drag blocks from sidebar to get started
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </WorkflowLayout>
    </TooltipProvider>
    </div>
  );
}
