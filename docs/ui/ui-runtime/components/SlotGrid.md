---
sidebar_position: 15
---
# SlotGrid

A grid of cells over a JSON UI collection the screen does not own, inside a [container screen](../../container-screens/container-screens.md): the player's own inventory, another container's items, or any collection the engine exposes.

## Import

```tsx
import { SlotGrid } from '@bedrock-core/ui';
```

## Usage

```tsx
{/* The player's inventory, read-only, transport items hidden. */}
<SlotGrid collection={'inventory_items'} columns={9} rows={3} hideOwned interactive={false} />
```

Where a [`Slot`](./Slot.md) is one cell, a `SlotGrid` is a whole collection at once. It reads the collection straight — it is **not** part of the screen's own container, so it takes no slot of it and the runtime never polls it. An interactive grid is driven by the engine's own take and place on that collection; a display-only one is inert.

Its size is fixed by the cell: `columns × rows` cells of 18 texels each. Lay it out like any other node.

## Props

### Component-Specific Props

#### `collection` (required)
- Type: `string`
- Description: The JSON UI collection every cell reads, e.g. `inventory_items`, `hotbar_items`, or a custom one.

#### `columns` (required)
- Type: `number`
- Description: Columns of cells. At least one.

#### `rows` (required)
- Type: `number`
- Description: Rows of cells. At least one.

#### `interactive`
- Type: `boolean`
- Default: `true`
- Description: Whether the player can move items through the cells. `false` makes the grid inert — no take, no place, no drop.

  A container slot's take and place are one combined engine action, so there is no take-only or place-only grid; interactivity is all-or-nothing, and `false` is the way to make a grid purely a display.

#### `hideOwned`
- Type: `boolean`
- Default: `false`
- Description: Draw the cell that hides the runtime's transport item. Only relevant for the player's own inventory and hotbar, where a button's transport is auto-placed for the tick it takes the runtime to reclaim it — otherwise it would flash there.

### Control Props

SlotGrid inherits all standard [control props](./control-props.md). Its size is fixed by the cell; use `alignSelf`, margins and the surrounding panel to place it.

## PlayerInventory and Hotbar

[`PlayerInventory`](./PlayerInventory.md) and [`Hotbar`](./Hotbar.md) are thin `SlotGrid` wrappers:

```tsx
const PlayerInventory = props => <SlotGrid collection={'inventory_items'} columns={9} rows={3} hideOwned {...props} />;
const Hotbar = props => <SlotGrid collection={'hotbar_items'} columns={9} rows={1} hideOwned {...props} />;
```

Reach for `SlotGrid` directly when you want a different shape — a read-only mirror, a sub-range, or another entity's collection.

## Own slots versus foreign cells

| | Reads | Allocated a container slot | Polled by the runtime | Roles |
| --- | --- | --- | --- | --- |
| [`Slot`](./Slot.md) (own) | the screen's own `container_items` | yes | yes | `both` / `input` / `output` |
| `Slot collection` (foreign) | the named collection | no | no | none — use `interactive` |
| `SlotGrid` | the named collection | no | no | none — use `interactive` |

A grid is never polled by the runtime — the engine's own take and place drive it. What **is** baked into the JSON UI is inertness: a display-only grid withholds focus, so nothing in it can be taken, placed or dropped.
