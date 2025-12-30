"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Typography,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui";
import { Container, Stack, Grid, Section } from "@/components/layout";
import { WorkflowCanvas, BaseNode } from "@/components/workflow";
import { Node, Edge, useNodesState, useEdgesState, addEdge, Position } from "reactflow";
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
      status: "idle" as const
    },
  },
  {
    id: "2",
    type: "base",
    position: { x: 400, y: 100 },
    data: { 
      label: "Process Node", 
      description: "Processing data",
      status: "running" as const
    },
  },
  {
    id: "3",
    type: "base",
    position: { x: 700, y: 100 },
    data: { 
      label: "End Node",
      status: "success" as const
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

export default function DemoPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const onConnect = (connection: Parameters<typeof addEdge>[0]) => setEdges((eds) => addEdge(connection, eds));

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !value.includes("@")) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Container maxWidth="2xl">
          {/* Header */}
          <Section padding="lg">
            <Stack direction="column" spacing="md" align="center">
              <Typography variant="h1">Design System Demo</Typography>
              <Typography variant="lead">
                A showcase of the generic UI primitives and workflow canvas
              </Typography>
            </Stack>
          </Section>

          {/* Buttons */}
          <Section padding="md">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button variants and sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack direction="column" spacing="lg">
                  <Stack direction="row" spacing="sm" wrap="wrap">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </Stack>
                  <Stack direction="row" spacing="sm" wrap="wrap">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Section>

          {/* Form Inputs */}
          <Section padding="md">
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Input fields with validation</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack direction="column" spacing="md">
                  <div className="space-y-2">
                    <Label htmlFor="email" required>
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      error={emailError}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Section>

          {/* Dialog and Tooltip */}
          <Section padding="md">
            <Card>
              <CardHeader>
                <CardTitle>Overlays</CardTitle>
                <CardDescription>Dialogs and tooltips</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack direction="row" spacing="md" wrap="wrap">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to proceed? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover for Tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a helpful tooltip!</p>
                    </TooltipContent>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          </Section>

          {/* Grid Layout */}
          <Section padding="md">
            <Card>
              <CardHeader>
                <CardTitle>Grid Layout</CardTitle>
                <CardDescription>Responsive grid system</CardDescription>
              </CardHeader>
              <CardContent>
                <Grid columns={3} gap="md">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} variant="outline">
                      <CardContent className="py-8">
                        <Typography variant="h4" className="text-center">
                          Grid Item {i}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Section>

          {/* Workflow Canvas */}
          <Section padding="md">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Canvas</CardTitle>
                <CardDescription>
                  React Flow-based workflow visualization (drag nodes, connect them)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <WorkflowCanvas
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    showBackground
                    showControls
                  />
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* Typography Scale */}
          <Section padding="lg">
            <Card>
              <CardHeader>
                <CardTitle>Typography Scale</CardTitle>
                <CardDescription>Consistent text hierarchy</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack direction="column" spacing="md">
                  <Typography variant="h1">Heading 1</Typography>
                  <Typography variant="h2">Heading 2</Typography>
                  <Typography variant="h3">Heading 3</Typography>
                  <Typography variant="h4">Heading 4</Typography>
                  <Typography variant="body">
                    Body text with proper line height and spacing for readability.
                    This is how regular paragraph text looks in the design system.
                  </Typography>
                  <Typography variant="bodySmall">
                    Smaller body text for secondary information.
                  </Typography>
                  <Typography variant="caption">
                    Caption text for labels and metadata
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Section>
        </Container>
      </div>
    </TooltipProvider>
  );
}

