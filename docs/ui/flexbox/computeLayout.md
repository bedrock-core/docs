---
sidebar_position: 3
---

# computeLayout

Run the flexbox layout engine on a node tree. Mutates every node's `layout` field in-place.

## Import

```ts
import { computeLayout } from '@bedrock-core/flexbox';
```

## Signature

```ts
function computeLayout(
  root: LayoutNode,
  refWidth?: number,   // default: 320  (CANONICAL_SCREEN.width)
  refHeight?: number,  // default: 210  (CANONICAL_SCREEN.height)
): void
```

### Parameters

#### `root`
- Type: `LayoutNode`
- Description: The root of the node tree built with [`createNode`](./createNode.md). The root node's `x` and `y` are always `0, 0`.

#### `refWidth`
- Type: `number`
- Default: `320` (`CANONICAL_SCREEN.width` — Pocket screen)
- Description: Viewport width used as the root's width when no explicit `width` is set on the root node, and as the reference for percentage resolution at the root level.

#### `refHeight`
- Type: `number`
- Default: `210` (`CANONICAL_SCREEN.height` — Pocket screen)
- Description: Minimum height for the root node. The root grows beyond this when its content is taller, but never collapses below it.

### Returns

`void`. All layout values are written directly onto each `node.layout`.

## Root Node Behavior

- `x` and `y` are always `0, 0`.
- If no `width` is set → uses `refWidth`.
- If no `height` is set → derived from content, but floored at `refHeight` (never smaller than the viewport).

## Examples

### Column layout (default)

```ts
import { createNode, computeLayout } from '@bedrock-core/flexbox';

const root = createNode(
  { padding: 10, gap: 8 },
  [
    createNode({ height: 40 }),
    createNode({ height: 60 }),
  ],
);

computeLayout(root);

root.children[0].layout // { x: 10, y: 10, width: 300, height: 40 }
root.children[1].layout // { x: 10, y: 58, width: 300, height: 60 }
//                                      ↑ 10 (padding) + 40 (first child) + 8 (gap)
```

### Row layout with flex grow

```ts
const root = createNode(
  { flexDirection: 'row', padding: 10, gap: 8 },
  [
    createNode({ flex: 1 }),
    createNode({ flex: 2 }),
  ],
);

computeLayout(root);

// Available width: 320 - 10 - 10 (padding) - 8 (gap) = 292
// flex:1 gets 292/3 ≈ 97,  flex:2 gets 292*2/3 ≈ 195
root.children[0].layout // { x: 10, ..., width: 97 }
root.children[1].layout // { x: 115, ..., width: 195 }
```

### Justify content

```ts
const root = createNode(
  { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
  [
    createNode({ width: 60 }),
    createNode({ width: 60 }),
    createNode({ width: 60 }),
  ],
);

computeLayout(root);

root.children[0].layout.x // 10
root.children[1].layout.x // 140  (centered)
root.children[2].layout.x // 250  (right edge — 320 - 10 - 60)
```

### Absolute positioning

```ts
const root = createNode(
  {},
  [
    createNode({ flex: 1 }),                             // fills flow
    createNode({ position: 'absolute', top: 4, right: 4, width: 20, height: 20 }), // overlay
  ],
);

computeLayout(root);

// Absolute child is excluded from flex flow.
// top: 4, right: 4  →  x = 320 - 4 - 20 = 296, y = 4
root.children[1].layout // { x: 296, y: 4, width: 20, height: 20 }
```

### Targeting Desktop screen

```ts
import { createNode, computeLayout, SCREEN } from '@bedrock-core/flexbox';

const root = createNode({ padding: 16 });
computeLayout(root, SCREEN.DESKTOP.width, SCREEN.DESKTOP.height);

root.layout // { x: 0, y: 0, width: 376, height: 250 }
```

### Wrapping children

```ts
const root = createNode(
  { flexDirection: 'row', wrap: 'wrap', width: 200, gap: 8 },
  [
    createNode({ width: 90, height: 40 }),
    createNode({ width: 90, height: 40 }),
    createNode({ width: 90, height: 40 }), // wraps to second line
  ],
);

computeLayout(root);

root.children[0].layout // { x: 0, y: 0,  ... }
root.children[1].layout // { x: 98, y: 0, ... }
root.children[2].layout // { x: 0, y: 48, ... }  (second line)
```

---

## Utility Exports

Two lower-level helpers are also exported for consumers that integrate the engine with other systems (such as `ui-runtime`).

### `isPercent`

```ts
import { isPercent } from '@bedrock-core/flexbox';

isPercent('50%')  // true
isPercent(100)    // false
```

Type guard that returns `true` when a value is a `Percent` string (ends with `%`).

### `resolveSize`

```ts
import { resolveSize } from '@bedrock-core/flexbox';

resolveSize('50%', 320) // 160
resolveSize(100,   320) // 100
resolveSize(undefined, 320) // undefined
```

Resolves a `FlexSize | 'auto' | undefined` to an absolute texel number:
- `number` → returned as-is
- `Percent` → `(n / 100) * parentSize`
- `undefined` / `'auto'` → `undefined`
