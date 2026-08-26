---
sidebar_position: 17
---
# Hotbar

The player's hotbar — the 9 × 1 grid — inside a [container screen](../../container-screens/container-screens.md).

## Import

```tsx
import { Hotbar } from '@bedrock-core/ui';
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

The same redrawn grid as [`PlayerInventory`](./PlayerInventory.md), one row tall: 162 × 18 — a thin [`SlotGrid`](./SlotGrid.md) wrapper, `<SlotGrid collection={'hotbar_items'} columns={9} rows={1} hideOwned />`. Placed by the layout engine at its natural size, and — like the inventory — not drawn unless asked for, because a container screen owns the whole chest screen.

## Props

### Control Props

Hotbar inherits all standard [control props](./control-props.md). Its size is fixed by the engine's cell; use `alignSelf`, margins and the surrounding panel to place it.

## Notes

- A button's transport item draws as nothing here too, for the tick it takes the runtime to reclaim it.
- Vanilla stacks the hotbar four texels under the inventory; `marginTop={4}` reproduces that.
