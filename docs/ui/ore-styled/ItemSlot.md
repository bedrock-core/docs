---
sidebar_position: 8
---
# ItemSlot

:::danger Experimental — Multi-Addon Worlds Not Supported
**This API is experimental and may change or be removed.**

In worlds with multiple addons installed, custom item aux IDs are assigned based on pack stack order at world load time. This order is non-deterministic and cannot be predicted at build time or recovered at runtime. **There is no automatic way to derive correct aux IDs for multi-addon worlds.** Using `ItemSlot` in a multi-addon world will render wrong items unless you construct and supply a precisely calibrated `ItemAuxMap` yourself.

You must wrap your component tree with `<ItemAuxContext value={myMap}>` and provide the correct map. No automatic seeding occurs. See [`ItemRenderer`](../ui-runtime/components/ItemRenderer.md) for details on building the map.
:::

A single inventory slot that renders an item icon or optional overlay texture.

## Import

```tsx
import { ItemSlot } from '@bedrock-core/ore-styled';
import { ItemAuxContext, type ItemAuxMap } from '@bedrock-core/ui';
```

## Usage

```tsx
const myMap: ItemAuxMap = { 'minecraft:stone': 65536, /* ... */ };

function HotBar({ player }: { player: Player }) {
  const inventory = player.getComponent('inventory')?.container;

  return (
    <ItemAuxContext value={myMap}>
      <Panel flexDirection="row" gap={2}>
        {Array.from({ length: 9 }, (_, i) => (
          <ItemSlot slot={inventory?.getSlot(i)} />
        ))}
      </Panel>
    </ItemAuxContext>
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

Requires an `ItemAuxContext` wrapping the component tree — no automatic seeding occurs. See [`ItemRenderer`](../ui-runtime/components/ItemRenderer.md#requirements) for how to build and provide the map.

## Examples

### Hotbar row

```tsx
function HotBar({ player }: { player: Player }) {
  const container = player.getComponent('inventory')?.container;

  return (
    <ItemAuxContext value={myMap}>
      <Panel flexDirection="row" gap={2}>
        {Array.from({ length: 9 }, (_, i) => (
          <ItemSlot slot={container?.getSlot(i)} />
        ))}
      </Panel>
    </ItemAuxContext>
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
