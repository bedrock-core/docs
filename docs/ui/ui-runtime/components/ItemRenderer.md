---
sidebar_position: 10
---
# ItemRenderer

:::danger Experimental — Multi-Addon Worlds Not Supported
**This API is experimental and may change or be removed.**

In worlds with multiple addons installed, custom item aux IDs are assigned based on pack stack order at world load time. This order is non-deterministic and cannot be predicted at build time or recovered at runtime. **There is no automatic way to derive correct aux IDs for multi-addon worlds.** Using `ItemRenderer` in a multi-addon world will render wrong items unless you construct and supply a precisely calibrated `ItemAuxMap` yourself.

You must wrap your component tree with `<ItemAuxContext value={myMap}>` and provide the correct map. No automatic seeding occurs. See [ItemAuxContext](#requirements) below.
:::

Render an item icon inside a UI layout.

## Import

```tsx
import { ItemRenderer, ItemAuxContext, type ItemAuxMap } from '@bedrock-core/ui';
```

## Usage

```tsx
const myMap: ItemAuxMap = { 'minecraft:stone': 65536, /* ... */ };

function MyScreen(): JSX.Element {
  return (
    <ItemAuxContext value={myMap}>
      <ItemCard item={someItem} />
    </ItemAuxContext>
  );
}

function ItemCard({ item }: { item: ItemStack }) {
  return (
    <Panel padding={4} gap={4} flexDirection="row">
      <ItemRenderer item={item} width={24} height={24} />
      <Text>{item.typeId}</Text>
    </Panel>
  );
}
```

## Props

### Component-Specific Props

#### `item`
- Type: `ItemStack`
- Required: Yes
- Description: The item to render.

### Control Props

`ItemRenderer` defaults to 16 × 16 pixels (`width={16} height={16}`). Inherits all standard [control props](./control-props.md).

## Requirements

You **must** wrap any component tree containing `ItemRenderer` with `ItemAuxContext` and supply your own `ItemAuxMap`. If no provider is present, `ItemAuxError` is thrown at render time.

```tsx
import { ItemAuxContext, type ItemAuxMap } from '@bedrock-core/ui';

const myMap: ItemAuxMap = {
  'minecraft:apple': 262144,   // raw_id 4 << 16
  'minecraft:stone': 65536,    // raw_id 1 << 16
  // ... build this map for your specific world / addon setup
};

render(player, (
  <ItemAuxContext value={myMap}>
    <MyScreen />
  </ItemAuxContext>
));
```

## Examples

### Basic item display

```tsx
function HeldItem({ player }: { player: Player }) {
  const item = player.getComponent('inventory')?.container?.getItem(player.selectedSlotIndex);

  if (!item) return null;

  return <ItemRenderer item={item} width={32} height={32} />;
}
```

### Item with label

```tsx
function ItemCard({ item }: { item: ItemStack }) {
  return (
    <Panel padding={4} gap={4} flexDirection="row">
      <ItemRenderer item={item} width={24} height={24} />
      <Text>{item.typeId}</Text>
    </Panel>
  );
}
```

## How It Works

`ItemRenderer` reads the Aux ID for the given `ItemStack` from `ItemAuxContext` and serializes it as a native `item-id-aux` JSON UI binding. The Resource Pack resolves the aux value to the correct item texture. The aux value is computed as `raw_id << 16` (plus 32768 for enchanted items).

## See Also

- [`render`](../api/render.md) — display a component tree to a player
- [Scroll](./Scroll.md) — multi-scroll layouts with `<Scroll>`
