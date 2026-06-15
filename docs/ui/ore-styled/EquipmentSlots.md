---
sidebar_position: 14
---
# EquipmentSlots

:::danger Experimental — Multi-Addon Worlds Not Supported
**This API is experimental and may change or be removed.**

In worlds with multiple addons installed, custom item aux IDs are assigned based on pack stack order at world load time. This order is non-deterministic and cannot be predicted at build time or recovered at runtime. **There is no automatic way to derive correct aux IDs for multi-addon worlds.** Using `EquipmentSlots` in a multi-addon world will render wrong items unless you construct and supply a precisely calibrated `ItemAuxMap` yourself.

You must wrap your component tree with `<ItemAuxContext value={myMap}>` and provide the correct map. No automatic seeding occurs. See [`ItemRenderer`](../ui-runtime/components/ItemRenderer.md) for details on building the map.
:::

Renders a vertical column of equipment slots (helmet, chestplate, leggings, boots, offhand) with silhouette overlay textures for empty slots.

## Import

```tsx
import { EquipmentSlots } from '@bedrock-core/ore-styled';
import { ItemAuxContext, type ItemAuxMap } from '@bedrock-core/ui';
```

## Usage

```tsx
const myMap: ItemAuxMap = { 'minecraft:diamond_helmet': 327680, /* ... */ };

function ArmorDisplay({ player }: { player: Player }) {
  const equippable = player.getComponent('equippable');

  if (!equippable) return null;

  return (
    <ItemAuxContext value={myMap}>
      <EquipmentSlots equippable={equippable} />
    </ItemAuxContext>
  );
}
```

Renders five [`ItemSlot`](./ItemSlot.md) components stacked vertically: **Head → Chest → Legs → Feet → Offhand**. Each slot shows the equipped item if present, or the matching silhouette texture from `theme.components.itemSlot.textures.equipment` when empty.

## Props

### Component-Specific Props

#### `equippable`
- Type: `EntityEquippableComponent`
- Required: Yes
- Description: The entity's equippable component. Obtain it via `entity.getComponent('equippable')`.

### Control Props

`EquipmentSlots` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Requirements

Requires an `ItemAuxContext` wrapping the component tree — no automatic seeding occurs. See [`ItemRenderer`](../ui-runtime/components/ItemRenderer.md#requirements) for how to build and provide the map.

## Examples

### Armor column next to player name

```tsx
function ArmorDisplay({ player }: { player: Player }) {
  const equippable = player.getComponent('equippable');

  if (!equippable) return null;

  return (
    <ItemAuxContext value={myMap}>
      <Panel flexDirection="row" padding={8} gap={8}>
        <EquipmentSlots equippable={equippable} />
        <Text>{player.name}</Text>
      </Panel>
    </ItemAuxContext>
  );
}
```

## See Also

- [`ItemSlot`](./ItemSlot.md) — individual slot component
- [`ItemContainer`](./ItemContainer.md) — container grid layout
