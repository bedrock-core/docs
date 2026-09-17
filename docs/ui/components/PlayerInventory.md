---
description: "The player's own inventory — the 9 × 3 grid every container screen shows under its content — inside a container screen."
---
# PlayerInventory

The player's own inventory — the 9 × 3 grid every container screen shows under its content — inside a [container screen](../guides/container-screens.md).

## Import

```tsx
import { PlayerInventory } from '@bedrock-core/ui';
```

## Usage

```tsx
<Container entity={'core:furnace'} padding={8} gap={6}>
  <Text>{'§fFurnace'}</Text>
  <Panel flexGrow={1} />
  <PlayerInventory alignSelf={'center'} />
  <Hotbar alignSelf={'center'} marginTop={4} />
</Container>
```

`PlayerInventory` binds to the player's inventory rather than to the container, which is why it exists as a component of its own: nothing in a form has anything like it. It is a thin [`SlotGrid`](./SlotGrid.md) wrapper — `<SlotGrid collection={'inventory_items'} columns={9} rows={3} hideOwned />` — placed by the layout engine like any other node, at its natural size of 162 × 54 (nine 18-texel cells by three). Reach for `SlotGrid` directly for any other shape or collection.

A container screen owns the whole chest screen, so the grid is **not free**: leave it out and the player has no inventory on screen. Pair it with [`Hotbar`](./Hotbar.md) for the full vanilla bottom half.

## Props

Inherits [control props](./control-props.md). Its size is fixed by the engine's cell; use `alignSelf`, margins and the surrounding panel to place it.

## Notes

- Drawn the way vanilla draws it, with one difference: a button's transport item — auto-placed in the player's inventory for the tick it takes the runtime to reclaim it — draws as nothing, so a press never flashes a stray item.
- Items in the grid are the player's own. Moves into the container's [`Slot`](./Slot.md)s are what the screen observes.
