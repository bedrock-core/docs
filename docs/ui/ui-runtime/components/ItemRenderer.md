---
sidebar_position: 7
---
# ItemRenderer

Render an item icon inside a UI layout.

## Import

```tsx
import { ItemRenderer } from '@bedrock-core/ui';
```

## Usage

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

## Props

### Component-Specific Props

#### `item`
- Type: `ItemStack`
- Required: Yes
- Description: The item to render.

### Control Props

`ItemRenderer` defaults to 16 × 16 pixels (`width={16} height={16}`). Inherits all standard [control props](./control-props.md).

## Requirements

The item aux map is seeded automatically by the runtime from the [item-aux Regolith filter](https://github.com/bedrock-core/regolith-filters/tree/main/item-aux) — no wrapping needed. If the filter is not installed and the generated JSON is missing, an `ItemAuxError` is thrown.

:::note item-aux filter required
`ItemRenderer` requires the [item-aux Regolith filter](https://github.com/bedrock-core/regolith-filters/tree/main/item-aux). The easiest way to get started with it already configured is to scaffold your project with the **CLI**:
```bash
npx @bedrock-core/cli
```
:::

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

`ItemRenderer` reads the Aux ID for the given `ItemStack` from `ItemAuxContext` (populated by the `item-aux` Regolith filter at build time) and serializes it as a native `item-id-aux` JSON UI binding. The Resource Pack resolves the aux value to the correct item texture.

## See Also

- [`useSetScreen`](../hooks/useSetScreen.md) — override the screen layout per build
- [`useScreen`](../hooks/useScreen.md) — read the current screen descriptor
- [item-aux Regolith filter](https://github.com/bedrock-core/regolith-filters/tree/main/item-aux) — generates the aux ID map
- [`render`](../api/render.md) — where the screen baseline is set
