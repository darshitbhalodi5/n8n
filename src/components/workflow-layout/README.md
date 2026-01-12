# Workflow Layout

Layout components for the workflow builder page (`/automation-builder`).

## Components

- **WorkflowLayout** - Main layout with horizontal category tabs and sidebar
- **WorkflowSidebar** - Left sidebar showing blocks for active category
- **DraggableBlock** - Individual draggable block item

## Structure

```
┌─────────────────────────────────────┐
│  [All] [Social]  (Category Tabs)   │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │      Canvas Area         │
│ (255px)  │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

## Features

- Category-based block filtering
- Drag blocks from sidebar to canvas
- Responsive layout
- Category switching via tabs

## Usage

```tsx
<WorkflowLayout
  categories={categories}
  defaultCategory="all"
  sidebar={(activeCategory) => (
    <WorkflowSidebar activeCategory={activeCategory} />
  )}
>
  {/* Canvas content */}
</WorkflowLayout>
```

