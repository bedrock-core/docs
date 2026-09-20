---
description: "The root of a container screen: names the entity or block the screen opens from, and is the screen's own panel."
---
# Container

The root of a [container screen](../guides/container-screens.md): names the entity or the block the screen opens from, and is the screen's own panel.

## Import

```tsx
import { Container } from '@bedrock-core/ui';
```

## Usage

```tsx
export default function Furnace() {
  return (
    <Container entity={'core:furnace'} padding={8} gap={6}>
      <Text>{'§fFurnace'}</Text>
      <Slot role={'input'} />
      <PlayerInventory alignSelf={'center'} />
      <Hotbar alignSelf={'center'} />
    </Container>
  );
}
```

Its presence decides the backend, the way [`<Form>`](./Form.md) makes a screen a native modal: a tree rooted in a `Container` is laid out once at build time by the [ui-compiler filter](/docs/filters/ui-compiler), baked into JSON UI, and served by `createContainerScreen` to every player who opens the host it names. `render()` rejects it — a container screen is compiled ahead of time, not serialized per player.

:::caution Experimental: block containers
A block-hosted screen uses its block's `minecraft:block_entity` container, and block containers are an experimental game feature. Expect rough edges, and expect this to change when the game's feature does. Entity-hosted screens are not affected.
:::

A screen names **exactly one** of `entity` and `block`. Naming both, or neither, fails the build: a screen opens from one host, and which one decides what the build stamps and which vanilla screen the layout is routed onto. Nothing else about the screen changes — the same components, the same cells, the same handlers.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entity` | `string` | — | Type of the entity the screen opens from, e.g. `'core:furnace'`. The build sizes that entity's `minecraft:inventory` and stamps it with the screen's layout key; the runtime serves the screen when a player interacts with it. The entity must exist in the behavior pack, or the build fails. Exactly one of this and `block` |
| `block` | `string` | — | **Experimental.** Type of the block the screen opens from, e.g. `'core:workbench'`. The build gives that block a `minecraft:block_entity` container sized to the layout, turns its dynamic properties on and stamps the layout key as a block state; a player opens the screen by interacting with a placed one. The block must exist in the behavior pack, or the build fails |
| `onOpen` | `(event: ContainerEvent) => void` | `undefined` | Ran when a player opens the screen, and again for every further viewer. `event.player` is who opened it, `event.host` the entity or block it opened and `event.container` that host's own cells. One layout serves everyone looking, so this is where a screen learns who is there — keep what it needs in state |
| `onClose` | `(event: ContainerEvent) => void` | `undefined` | Ran when a player closes the screen, or leaves the world with it open. `event.player` is who left, `event.host` the entity or block it belonged to, `event.container` its own cells |
| `children` | `JSX.Node` | — | The screen. Anything a form can hold except the [form-only components](../guides/container-screens.md#not-supported), plus [`Slot`](./Slot.md), [`PlayerInventory`](./PlayerInventory.md) and [`Hotbar`](./Hotbar.md) |

Inherits [control props](./control-props.md). It is the screen's root panel, so `background` draws the frame and `padding` / `gap` / `flexDirection` lay the children out — the same way they would on a `Panel`.

`event.container` is the screen's own cells as the engine's own [`Container`](https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/container) — the drawn [`<Slot>`](./Slot.md)s in document order, by index or by the `name` each declared, with the routing key, the buttons and the live-value bank invisible. The same cells are reachable from outside the component through `screen.container(host)`; see [Reaching the cells](../guides/container-screens.md#reaching-the-cells).

## Rules

The build enforces these, with a message naming the fix:

- **Exactly one, at the root.** Providers and fragments above it are looked through; anything else beside it is rejected, and a screen with no root at all is refused with the list of roots.
- **Exactly one host.** `entity` or `block`, never both and never neither.
- **No nesting.** One host opens one screen, and no root sits inside another — compose the inner part as a component instead.
- **The content fits the canvas.** A container screen is laid out on the same 320 × 210 canvas as a form, but it cannot scroll: content past the canvas fails the build rather than clipping.
- **A block holds 54 slots.** That is the whole allocation — the routing key, every cell and the live-value bank — so a block-hosted screen that needs more fails the build. An entity's inventory has no such cap.

## Examples

### A framed screen

```tsx
<Container entity={'core:vault'} background={'textures/ui/dialog_background_opaque'} padding={10} gap={8}>
  <Text>{'§lVault'}</Text>
  <Panel flexDirection={'row'} gap={2}>
    <Slot />
    <Slot />
    <Slot />
  </Panel>
  <Panel flexGrow={1} />
  <PlayerInventory alignSelf={'center'} />
  <Hotbar alignSelf={'center'} marginTop={4} />
</Container>
```

`PlayerInventory` and `Hotbar` are not free: a container screen owns the whole vanilla screen, so leave them out and the player's own grids are gone.

### The same screen on either host

Nothing above the root differs, so a screen written once serves both:

```tsx
// crafting.tsx — the screen, named by neither host
export function Crafting({ entity, block }: { entity?: string; block?: string }) {
  return (
    <Container entity={entity} block={block} padding={8} gap={6}>
      <Text>{'§fCrafting'}</Text>
      <Slot name={'output'} role={'output'} />
    </Container>
  );
}

// crafting_table.screen.tsx
export default () => <Crafting entity={'core:crafting_table'} />;

// crafting_block.screen.tsx
export default () => <Crafting block={'core:crafting_block'} />;
```

Each screen file is compiled separately and gets its own layout key, so the two hosts open their own copies of the same layout.
