---
sidebar_position: 10
---
# EquipmentSlots

Renders a vertical column of equipment slots (helmet, chestplate, leggings, boots, offhand) with silhouette overlay textures for empty slots.

## Import

```tsx
import { EquipmentSlots } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
function ArmorDisplay({ player }: { player: Player }) {
  useSetScreen(Screen.Fixed);
  const equippable = player.getComponent('equippable');

  if (!equippable) return null;

  return <EquipmentSlots equippable={equippable} />;
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

Requires a `Screen.Fixed` screen (via [`useSetScreen`](../ui-runtime/hooks/useSetScreen.md) or passed to `render()`) and the [item-aux Regolith filter](https://github.com/bedrock-core/regolith-filters/tree/main/item-aux) to be installed — the runtime seeds the aux map automatically.

## Examples

### Armor column next to player name

```tsx
function ArmorDisplay({ player }: { player: Player }) {
  useSetScreen(Screen.Fixed);
  const equippable = player.getComponent('equippable');

  if (!equippable) return null;

  return (
    <Panel flexDirection="row" padding={8} gap={8}>
      <EquipmentSlots equippable={equippable} />
      <Text>{player.name}</Text>
    </Panel>
  );
}
```

## See Also

- [`ItemSlot`](./ItemSlot.md) — individual slot component
- [`ItemContainer`](./ItemContainer.md) — container grid layout
