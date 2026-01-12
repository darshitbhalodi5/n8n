# Workflow App - Design System

A modern Next.js application with a complete, production-ready design system featuring:
- 🎨 Dark-only theme with token-based styling
- 🧩 Generic, reusable UI primitives
- 📐 Responsive layout system
- ♿ Accessibility-first components
- 🔄 React Flow workflow canvas
- 📝 Full TypeScript support

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables (see Configuration section below)
cp .env.example .env.local
# Edit .env.local with your contract addresses

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.  
Visit [http://localhost:3000/automation-builder](http://localhost:3000/automation-builder) to see the workflow builder with wallet integration.

## ⚙️ Configuration

### Required Environment Variables

The Wallet block requires the following environment variables to function:

```env
# Safe Wallet Factory Address (TriggerXSafeFactory contract)
NEXT_PUBLIC_SAFE_WALLET_FACTORY_ADDRESS=0x...

# Safe Module Address (TriggerX module for Safe wallets)
NEXT_PUBLIC_SAFE_MODULE_ADDRESS=0x...
```

### Optional Environment Variables

For improved performance and mainnet support:

```env
# Mainnet-specific addresses (if different from testnet)
NEXT_PUBLIC_MAINNET_SAFE_WALLET_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_SAFE_MODULE_ADDRESS=0x...

# Safe Transaction Service API endpoints (for faster Safe wallet fetching)
NEXT_PUBLIC_ARBITRUM_MAINNET_SAFE_ACCOUNTS_BASE_URL=https://...

# Safe API Key (to avoid rate limits)
NEXT_PUBLIC_SAFE_API_KEY=your_api_key

# Additional contract addresses
NEXT_PUBLIC_SAFE_MULTISEND_CALL_ONLY_ADDRESS=0x...
```

### Supported Networks

The wallet block supports the following networks out of the box:
- **Arbitrum Sepolia** (chainId: 421614)
- **Arbitrum Mainnet** (chainId: 42161)

To add support for additional networks, update `src/web3/utils/contractAddresses.ts`.

## 📚 Documentation

- **[THEME.md](./THEME.md)** - Color palette and typography guide

## 🎨 Design System Features

### UI Primitives (`@/components/ui`)
- **Button** - Multiple variants (default, outline, ghost, destructive)
- **Input/Textarea** - Form fields with error states
- **Card** - Content containers with header/footer
- **Dialog** - Accessible modal dialogs
- **Tooltip** - Hover tooltips
- **Typography** - Semantic text components
- **Label** - Form labels
- **Skeleton** - Loading placeholders

### Layout Primitives (`@/components/layout`)
- **Container** - Max-width containers with responsive padding
- **Stack** - Flexbox layouts with direction/spacing controls
- **Grid** - CSS Grid with column/gap system
- **Section** - Semantic sections with padding variants

### Workflow Components (`@/components/workflow`)
- **WorkflowCanvas** - React Flow-based workflow editor
- **BaseNode** - Generic workflow node component
- **WalletNode** - Web3 wallet connection and Safe wallet management

### Web3 Integration (`@/web3`)
- **Hooks** - Safe wallet creation, fetching, and module management
- **Utils** - Contract addresses, Safe chain info, local storage
- **Types** - TypeScript definitions for Safe operations
- **Artifacts** - Contract ABIs for Safe and TriggerX contracts

### Utilities
- `cn()` - Class name merging utility (clsx + tailwind-merge)
- `useMediaQuery()` - Responsive breakpoint hooks

## 🎯 Usage Examples

### Basic Component Usage

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Container, Stack } from "@/components/layout";

export default function MyPage() {
  return (
    <Container maxWidth="lg">
      <Stack direction="column" spacing="lg">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="default" size="lg">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
```

### Workflow Canvas

```tsx
"use client";

import { WorkflowCanvas, BaseNode } from "@/components/workflow";
import { useNodesState, useEdgesState, addEdge } from "reactflow";

const nodeTypes = {
  base: (props) => <BaseNode {...props} showHandles />
};

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '1', type: 'base', position: { x: 0, y: 0 }, data: { label: 'Start' } }
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = (connection) => setEdges((eds) => addEdge(connection, eds));

  return (
    <div className="h-screen">
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
  );
}
```

## 🎨 Theme - Warm Earthy Design

**Fonts**: Hubot Sans + IBM Plex Mono

**Color Palette**:
- Background: #12161B (Deep Charcoal)
- Primary CTA: #9B8B7E (Warm Sage-Taupe)
- Accent: #B8956A (Muted Gold)
- Success: #8CC084 (Calm Green)
- Warning: #C67C6F (Muted Rust)
- Error: #D9534F (Rust Red)
- Text: #E5E1DB (Warm Off-White)

See [THEME.md](./THEME.md) for complete color guide and customization.

## 🏗️ Architecture

This design system's **architecture** was adapted from a production application while implementing an entirely new visual design:

### What Was Adapted (Architecture)
✅ Tailwind + CSS variable theming pattern  
✅ Component structure and variant systems  
✅ Breakpoint strategy and responsive utilities  
✅ Accessibility patterns (focus states, ARIA)  
✅ Typography scale approach  
✅ Layout primitive patterns  

### What Is New (Design)
🎨 Completely new dark-only color palette  
🎨 Different font pairing (Inter + JetBrains Mono)  
🎨 React Flow workflow canvas (instead of Blockly)  
🎨 Modern, clean design language  
🎨 No brand-specific styling or assets  

## 📦 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI primitives
- **Variants**: Class Variance Authority (CVA)
- **Workflow**: React Flow
- **Icons**: Lucide React
- **Language**: TypeScript
- **Web3**: Privy (embedded wallets) + viem + ethers
- **Safe Integration**: @safe-global/protocol-kit + api-kit

## 🛠️ Development

### Project Structure

```
src/
├── app/              # Next.js app router
│   ├── globals.css   # Theme tokens & base styles
│   ├── layout.tsx    # Root layout with fonts
│   ├── providers.tsx # Web3 providers (Privy, Safe)
│   └── demo/         # Workflow builder demo
├── components/
│   ├── ui/           # UI primitives
│   ├── layout/       # Layout components
│   ├── workflow/     # Workflow canvas & nodes
│   └── blocks/       # Block definitions (Social, Wallet)
├── contexts/         # React contexts (SafeWalletContext)
├── web3/             # Web3 integration
│   ├── hooks/        # Safe wallet hooks
│   ├── utils/        # Contract utilities
│   ├── types/        # TypeScript types
│   └── artifacts/    # Contract ABIs
├── hooks/            # React hooks (Privy wallet hooks)
└── lib/              # Utilities
```

### Adding New Components

1. Create component in appropriate directory
2. Use `cn()` for class merging
3. Use CSS variable tokens (never hardcoded colors)
4. Add TypeScript interfaces
5. Export from directory's `index.ts`

### Extending Variants

Components use CVA for variant systems:

```tsx
import { cva } from "class-variance-authority";

const myVariants = cva("base-classes", {
  variants: {
    color: {
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
  },
});
```

## ✅ Quality Assurance

- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Build**: Production build passes
- ✅ **Linting**: Zero linting errors
- ✅ **Accessibility**: WCAG AA compliant
- ✅ **Responsive**: Mobile-first design
- ✅ **Performance**: Optimized fonts and assets

## 📄 License

This project demonstrates a generic, reusable design system with no proprietary code or assets.

## 🤝 Contributing

When adding new components:
1. Follow existing patterns (CVA variants, token-based styling)
2. Include TypeScript types
3. Add accessibility features (ARIA, focus states)
4. Document in DESIGN_SYSTEM.md
5. Test responsiveness

---

**Built with ❤️ using Next.js and Tailwind CSS**
