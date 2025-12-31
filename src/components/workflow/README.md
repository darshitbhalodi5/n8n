# Workflow Canvas

React Flow-based canvas for building visual workflows.

## Components

- **WorkflowCanvas** - Main canvas wrapper with React Flow integration
- **BaseNode** - Generic node component for all blocks

## Features

- Drag & drop blocks from sidebar
- Connect nodes with edges
- Mouse wheel zoom, drag to pan
- Delete nodes (Delete/Backspace keys or button)
- Automatic edge cleanup on node deletion

## Usage

```tsx
<WorkflowCanvas
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onNodesDelete={onNodesDelete}
  nodeTypes={nodeTypes}
  showBackground
/>
```

## Node Types

Register node types in `nodeTypes` object. All blocks use `BaseNode` component with different configurations.

