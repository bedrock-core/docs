---
sidebar_position: 13
---
# ItemContainer

:::danger Experimental — Multi-Addon Worlds Not Supported
**This API is experimental and may change or be removed.**

In worlds with multiple addons installed, custom item aux IDs are assigned based on pack stack order at world load time. This order is non-deterministic and cannot be predicted at build time or recovered at runtime. **There is no automatic way to derive correct aux IDs for multi-addon worlds.** Using `ItemContainer` in a multi-addon world will render wrong items unless you construct and supply a precisely calibrated `ItemAuxMap` yourself.

You must wrap your component tree with `<ItemAuxContext value={myMap}>` and provide the correct map. No automatic seeding occurs. See [`ItemRenderer`](../ui-runtime/components/ItemRenderer.md) for details on building the map.
:::

Renders a grid of [`ItemSlot`](./ItemSlot.md) components covering a `Container`'s slots.

## Import

```tsx
import { ItemContainer } from '@bedrock-core/ore-styled';
import { ItemAuxContext, type ItemAuxMap } from '@bedrock-core/ui';
```

## Usage

```tsx
const myMap: ItemAuxMap = { 'minecraft:stone': 65536, /* ... */ };

function InventoryScreen({ player }: { player: Player }) {
  const container = player.getComponent('inventory')?.container;

  if (!container) return null;

  return (
    <ItemAuxContext value={myMap}>
      <ItemContainer container={container} />
    </ItemAuxContext>
  );
}
```

Total width is calculated automatically as `columns × theme.components.itemSlot.size`. Individual slot size comes from `theme.components.itemSlot.size`.

## Props

### Component-Specific Props

#### `container`
- Type: `Container`
- Required: Yes
- Description: The Minecraft `Container` to read slots from.

#### `columns`
- Type: `number`
- Default: `9`
- Description: Number of columns in the grid.

#### `start`
- Type: `number`
- Default: `0`
- Description: First slot index to include (0-based).

#### `count`
- Type: `number`
- Default: `container.size - start`
- Description: Number of slots to show.

### Control Props

`ItemContainer` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Requirements

Requires an `ItemAuxContext` wrapping the component tree — no automatic seeding occurs. See [`ItemRenderer`](../ui-runtime/components/ItemRenderer.md#requirements) for how to build and provide the map.

## Examples

### Full inventory grid

```tsx
function InventoryScreen({ player }: { player: Player }) {
  const container = player.getComponent('inventory')?.container;

  if (!container) return null;

  return (
    <ItemAuxContext value={myMap}>
      <ItemContainer container={container} />
    </ItemAuxContext>
  );
}
```

### Hotbar only (first 9 slots, 3 columns)

```tsx
<ItemContainer container={container} columns={3} count={9} />
```

### Second row only

```tsx
<ItemContainer container={container} start={9} count={9} />
```

## See Also

- [`ItemSlot`](./ItemSlot.md) — individual slot component
- [`EquipmentSlots`](./EquipmentSlots.md) — equipment-slot layout
