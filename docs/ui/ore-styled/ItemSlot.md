---
sidebar_position: 8
---
# ItemSlot

A single inventory slot that renders an item icon or optional overlay texture.

## Import

```tsx
import { ItemSlot } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
function HotBar({ player }: { player: Player }) {
  useSetScreen(Screen.Fixed);
  const inventory = player.getComponent('inventory')?.container;

  return (
    <Panel flexDirection="row" gap={2}>
      {Array.from({ length: 9 }, (_, i) => (
        <ItemSlot slot={inventory?.getSlot(i)} />
      ))}
    </Panel>
  );
}
```

Default size is 18 × 18 px (from `theme.components.itemSlot.size`). Pass explicit `width`/`height` to override.

## Props

### Component-Specific Props

#### `slot`
- Type: `ContainerSlot`
- Default: `undefined`
- Description: The container slot to display. If the slot holds an item it renders via `ItemRenderer`; if empty the slot background is shown.

#### `overlay`
- Type: `string`
- Default: `undefined`
- Description: Texture path shown when the slot is empty (e.g. an equipment silhouette). Ignored if the slot has an item.

### Control Props

`ItemSlot` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Requirements

Requires the [item-aux Regolith filter](https://github.com/bedrock-core/regolith-filters/tree/main/item-aux) to be installed — the runtime seeds the aux map automatically.

## Examples

### Hotbar row

```tsx
function HotBar({ player }: { player: Player }) {
  useSetScreen(Screen.Fixed);
  const container = player.getComponent('inventory')?.container;

  return (
    <Panel flexDirection="row" gap={2}>
      {Array.from({ length: 9 }, (_, i) => (
        <ItemSlot slot={container?.getSlot(i)} />
      ))}
    </Panel>
  );
}
```

### Empty slot with silhouette overlay

```tsx
<ItemSlot overlay="textures/ui/slots/helmet" />
```

## See Also

- [`ItemContainer`](./ItemContainer.md) — renders a grid of `ItemSlot` components automatically
- [`EquipmentSlots`](./EquipmentSlots.md) — renders equipment slots with silhouette overlays
- [`ItemRenderer`](../ui-runtime/components/ItemRenderer.md) — lower-level item icon primitive
