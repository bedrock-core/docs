---
sidebar_position: 9
---
# ItemContainer

Renders a grid of [`ItemSlot`](./ItemSlot.md) components covering a `Container`'s slots.

## Import

```tsx
import { ItemContainer } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
function InventoryScreen({ player }: { player: Player }) {
  useSetScreen(Screen.Fixed);
  const container = player.getComponent('inventory')?.container;

  if (!container) return null;

  return <ItemContainer container={container} />;
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

Requires the [item-aux Regolith filter](https://github.com/bedrock-core/regolith-filters/tree/main/item-aux) to be installed — the runtime seeds the aux map automatically.

## Examples

### Full inventory grid

```tsx
function InventoryScreen({ player }: { player: Player }) {
  useSetScreen(Screen.Fixed);
  const container = player.getComponent('inventory')?.container;

  if (!container) return null;

  return <ItemContainer container={container} />;
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
