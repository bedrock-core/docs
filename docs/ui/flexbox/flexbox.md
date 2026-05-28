---
sidebar_position: 1
---

# flexbox

`@bedrock-core/flexbox` is a pure-TypeScript CSS-compatible flexbox layout engine for Minecraft Bedrock UI. It computes absolute pixel (texel) positions and sizes for a tree of nodes — with no dependencies and no build step.

:::warning For library/tool developers only
This package is a **low-level engine** intended for developers building on top of `@bedrock-core`. If you are building a Bedrock UI with `@bedrock-core/ui`, you do not need this package — layout is handled automatically by `ui-runtime`. Only reach for `@bedrock-core/flexbox` directly if you are implementing a custom renderer, a code-generation tool, or another layer of the framework.
:::

## Install

```bash
npm install @bedrock-core/flexbox
```

## Quick Start

```ts
import { createNode, computeLayout } from '@bedrock-core/flexbox';

// Build a tree of nodes
const root = createNode(
  { flexDirection: 'column', gap: 8, padding: 10 },
  [
    createNode({ height: 40 }),   // header
    createNode({ flex: 1 }),      // body — fills remaining space
    createNode({ height: 30 }),   // footer
  ],
);

// Run the layout pass (mutates node.layout in-place)
computeLayout(root);

// Inspect results
const { x, y, width, height } = root.layout;
// { x: 0, y: 0, width: 320, height: 210 }

const header = root.children[0].layout;
// { x: 10, y: 10, width: 300, height: 40 }
```

## Screen Constants

Bedrock UI targets two canonical screen sizes. The layout engine defaults to `SCREEN.POCKET` as the root viewport.

```ts
import { SCREEN, CANONICAL_SCREEN } from '@bedrock-core/flexbox';

SCREEN.POCKET   // { width: 320, height: 210 }  — smallest target
SCREEN.DESKTOP  // { width: 376, height: 250 }

CANONICAL_SCREEN // === SCREEN.POCKET
```

Pass `refWidth` / `refHeight` as optional arguments to [`computeLayout`](./computeLayout.md) to target a different viewport.

## In This Section

| Page | Description |
|---|---|
| [createNode](./createNode.md) | Create a `LayoutNode` and the full `FlexStyle` property reference |
| [computeLayout](./computeLayout.md) | Run the layout engine and understand the computed output |
