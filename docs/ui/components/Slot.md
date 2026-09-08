---
sidebar_position: 11
description: "A real container cell inside a container screen: the player moves items through it, and the screen sees what arrives."
---
# Slot

A real container cell inside a [container screen](../guides/container-screens.md): the player moves items through it, and the screen sees what arrives.

## Import

```tsx
import { Slot } from '@bedrock-core/ui';
```

## Usage

```tsx
<Slot
  role={'input'}
  onInsert={({ player, stack }) => player.sendMessage(`§7${stack.typeId} went in`)}
/>
```

A `Slot` is a fixed 18 × 18 flex child — the engine's item cell is fixed, so the slot is too. Lay slots out with a `Panel` (`flexDirection={'row'}`, `gap`) like any other element.

Handlers are props, like everywhere else in this library. They are matched to the cell by its position in the tree, which is stable because a compiled screen cannot change shape — nothing is named and nothing is registered.

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `role` | `'both' \| 'input' \| 'output'` | `'both'` | What an interactive slot lets the player do |
  - `both` — ordinary storage. Anything in, anything out.
  - `input` — items go in and do not come back out. A furnace's fuel slot.
  - `output` — items may be taken and nothing put in. A furnace's result.

  A role is enforced **server-side, by the runtime**, never by the engine: a container gives no way to veto a move, so a forbidden one is undone a tick later rather than prevented. An **output** slot with no result holds the runtime's marker item, so it is never empty — a shift-click can only auto-place into an empty (or matching) slot, so bulk-dumping into an output slot is blocked outright, with no flicker. Its compiled cell swaps to an empty fake while the marker sits there, so the marker is never rendered, hovered or takeable; a real result swaps the interactive cell back in.

  A role is ignored on a foreign or locked slot. (Q **drops nothing** from any container slot — dropping happens outside a container — so an input slot needs no special handling for the one take the undo could not reach.)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `interactive` | `boolean` | `true` | Whether the player can move items through the slot at all. `false` draws an inert cell — the item shows, but no take, place or drop reaches it, and `role` does not apply. Use it for a slot the player must never touch; use `role` for one that moves in a single direction |
| `onInsert` | `(event: SlotEvent) => void` | — | Runs after an item arrives. `event.stack` is what landed, `event.player` who put it there, `event.host` the entity that owns the screen |
| `onRemove` | `(event: SlotEvent) => void` | — | Runs after the slot empties. `event.stack` is what left, `event.player` who took it, `event.host` the entity that owns the screen |
| `collection` | `string` | — | A JSON UI collection to read instead of the screen's own — `inventory_items`, `hotbar_items`, or any collection the engine exposes. Given one, the slot is **foreign**: it draws `collection[index]`, takes no slot of the screen's own container, and the runtime never polls it. See [Own versus foreign](#own-versus-foreign) below |
| `index` | `number` | — | The cell within `collection` to draw. Required, and only legal, alongside `collection`; an integer `>= 0` |

### Own versus foreign

An **own** slot (no `collection`) is a cell of the screen's own container: it is allocated a container index, the runtime polls it, and `role` enforces `input` / `output` a tick later by undoing a forbidden move. A **foreign** slot (`collection` + `index`) reads some other collection at an author-given index; it is never allocated and never polled, so `role` has no meaning there and combining the two throws.

`interactive` applies to both. Because a container slot's take and place are one combined engine action, a slot can never be take-only or place-only at the client — only fully interactive (with `role` governing the runtime undo) or, with `interactive={false}`, fully inert.

For a whole collection at once — the player's inventory, a sub-range, another container — use [`SlotGrid`](./SlotGrid.md).

### Control props

Slot inherits all standard [control props](./control-props.md). Leave `width` and `height` alone — the cell is 18 × 18 whatever the layout asks for — and use margins and `alignSelf` to place it.

## Examples

### A furnace

```tsx
function Furnace() {
  const [held, setHeld] = useState('nothing');

  return (
    <Container entity={'core:furnace'} padding={8} gap={6}>
      <Text maxLength={24}>{`holding ${held}`}</Text>

      <Panel flexDirection={'row'} gap={4}>
        {/* Items go in and never come back out. */}
        <Slot role={'input'} onInsert={({ stack }) => setHeld(stack.typeId)} />

        {/* Items may be taken and nothing put in. */}
        <Slot role={'output'} onRemove={({ stack }) => setHeld(`took ${stack.typeId}`)} />

        {/* Ordinary storage. */}
        <Slot />
      </Panel>
    </Container>
  );
}
```

### A row of storage

```tsx
<Panel flexDirection={'row'} gap={0}>
  {Array.from({ length: 9 }, (_, index) => <Slot key={index} />)}
</Panel>
```

Every slot costs one index in the entity's inventory; the build sizes the container to fit them all.

### A peek at the player's hotbar

```tsx
{/* Display-only: draws the player's first hotbar item, and nothing more.
    Costs no container slot, because it reads a foreign collection. */}
<Slot collection={'hotbar_items'} index={0} interactive={false} />
```
