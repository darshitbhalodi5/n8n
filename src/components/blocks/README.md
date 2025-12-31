# Blocks System

Modular block definitions for the workflow builder. Each block represents a draggable node that can be added to the canvas.

## Structure

```
blocks/
├── index.ts          # Main export (categories, utilities, icon registry)
├── types.ts          # TypeScript interfaces
└── social/           # Category directory
    ├── index.ts      # Exports all social blocks
    └── *.ts          # Individual block definitions
```

## Adding a Block

1. Create block file: `social/new-block.ts`
```ts
import type { BlockDefinition } from "../types";

export const newBlock: BlockDefinition = {
  id: "new-block",
  label: "New Block",
  iconName: "IconName",
  category: "social",
  nodeType: "new-block",
  defaultData: { label: "New Block", status: "idle" },
};
```

2. Export in category `index.ts`:
```ts
export { newBlock } from "./new-block";
// Add to socialBlocks array
```

3. Register icon in main `index.ts`:
```ts
import { IconName } from "lucide-react";
export const iconRegistry = { IconName, ... };
```

## API

- `getBlocksByCategory(id)` - Get blocks for a category
- `getAllBlocks()` - Get all blocks
- `getBlockById(id)` - Get block by ID
- `blockCategories` - All categories array
- `iconRegistry` - Icon name to component mapping

