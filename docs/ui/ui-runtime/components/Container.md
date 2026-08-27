---
sidebar_position: 13
---
# Container

The root of a [container screen](../../container-screens/container-screens.md): names the entity the screen opens from, and is the screen's own panel.

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

Its presence decides the backend, the way [`<Form>`](./Form/Form.md) makes a screen a native modal: a tree rooted in a `Container` is laid out once at build time by the [ui-compile filter](../../container-screens/regolith-filter.md), baked into JSON UI, and served by `createContainerScreen` to every player who opens the entity it names. `render()` rejects it — a container screen is compiled ahead of time, not serialized per player.

## Props

### Component-Specific Props

#### `entity`
- Type: `string`
- Required: yes
- Description: Type of the entity the screen opens from, e.g. `'core:furnace'`. The build sizes that entity's `minecraft:inventory` and stamps it with the screen's layout key; the runtime serves the screen when a player interacts with it. The entity must exist in the behavior pack, or the build fails.

#### `onOpen`
- Type: `(event: ContainerEvent) => void`
- Default: `undefined`
- Description: Ran when a player opens the screen, and again for every further viewer. `event.player` is who opened it and `event.host` the entity it opened. One layout serves everyone looking, so this is where a screen learns who is there — keep what it needs in state.

#### `onClose`
- Type: `(event: ContainerEvent) => void`
- Default: `undefined`
- Description: Ran when a player closes the screen, or leaves the world with it open. `event.player` is who left, `event.host` the entity it belonged to.

#### `children`
- Type: `JSX.Node`
- Description: The screen. Anything a form can hold except the [form-only components](../../container-screens/container-screens.md#not-supported), plus [`Slot`](./Slot.md), [`PlayerInventory`](./PlayerInventory.md) and [`Hotbar`](./Hotbar.md).

### Control Props

Container inherits all standard [control props](./control-props.md). It is the screen's root panel, so `background` draws the frame and `padding` / `gap` / `flexDirection` lay the children out — the same way they would on a `Panel`.

## Rules

The build enforces these, with a message naming the fix:

- **Exactly one, at the root.** Providers and fragments above it are looked through; anything else beside it, or a screen without one, is rejected.
- **No nesting.** One entity opens one screen — compose the inner part as a component instead.
- **The content fits the canvas.** A container screen is laid out on the same 320 × 210 canvas as a form, but it cannot scroll: content past the canvas fails the build rather than clipping.

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

`PlayerInventory` and `Hotbar` are not free: a container screen owns the whole chest screen, so leave them out and the player's own grids are gone.
