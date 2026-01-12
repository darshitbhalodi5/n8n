# Components

Reusable UI components organized by functionality.

## Structure

- **blocks/** - Block definitions and categories
- **workflow/** - Canvas and node components
- **workflow-layout/** - Layout for workflow builder page
- **ui/** - Base UI primitives (Button, Card, etc.)
- **layout/** - Layout utilities (Container, Stack, etc.)

## Workflow Builder (`/automation-builder`)

The workflow builder consists of:

1. **WorkflowLayout** - Main container with tabs and sidebar
2. **WorkflowSidebar** - Displays draggable blocks
3. **WorkflowCanvas** - React Flow canvas for nodes
4. **BaseNode** - Visual representation of blocks

## Flow

1. User selects category → Sidebar shows blocks
2. User drags block → Block data transferred
3. Block dropped on canvas → Node created
4. Nodes connected → Edges created
5. Node deleted → Edges auto-cleaned

