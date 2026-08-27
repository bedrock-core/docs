---
sidebar_position: 1
---

# Container screens

A **container screen** is a custom entity's chest screen, written in JSX with the same components as a form. The [ui-compile Regolith filter](./regolith-filter.md) compiles it into static JSON UI at build time; at runtime `createContainerScreen` serves it to every player who opens the entity, and everything alive in it — text, buttons, entities, the items in its slots — travels through the container's own slots.

It is the second backend of `@bedrock-core/ui`. A form is serialized per player when it is shown. A container screen cannot be: the chest screen has no string channel wide enough to carry a layout, so the layout is baked once and only state moves at runtime. What you get in exchange is what a form cannot give — real item slots the player drags into, a screen that stays open while its values change, and state that belongs to a thing in the world.

## A screen

```tsx title="packs/BP/scripts/screens/furnace.screen.tsx"
/** @jsxImportSource @bedrock-core/ui */
import { Button, Card } from '@bedrock-core/ore-styled';
import { Background, Container, Hotbar, Panel, PlayerInventory, Slot, Text, useState } from '@bedrock-core/ui';
import { Progress } from './Progress';

export default function Furnace() {
  const [charge, setCharge] = useState(0);
  const [held, setHeld] = useState('nothing');

  return (
    <Container entity={'core:furnace'} padding={8} gap={6}>
      <Background texture={'textures/ui/dialog_background_opaque'} />

      <Card>
        <Text>{'§fBEDROCK CORE'}</Text>
        <Progress value={charge} />
        <Text maxLength={24}>{`holding ${held}`}</Text>

        <Panel flexDirection={'row'} gap={4}>
          <Button enabled={charge < 1} onPress={() => setCharge(value => Math.min(1, value + 0.25))}>{'+'}</Button>
          <Button enabled={charge > 0} onPress={() => setCharge(value => Math.max(0, value - 0.25))}>{'-'}</Button>
          <Slot role={'input'} onInsert={({ stack }) => setHeld(stack.typeId)} />
          <Slot role={'output'} onRemove={({ stack }) => setHeld(`took ${stack.typeId}`)} />
        </Panel>
      </Card>

      <Panel flexGrow={1} />
      <PlayerInventory alignSelf={'center'} />
      <Hotbar alignSelf={'center'} marginTop={4} />
    </Container>
  );
}
```

Three things make it a container screen: the file name ends in `.screen.tsx` (that is how the filter finds it), the module default-exports the component, and the root is a [`<Container>`](../ui-runtime/components/Container.md) naming the entity it opens from. Everything else is the component set you already know.

The build runs the component once to decide the **shape**; the runtime runs it again, per viewer, to decide the **values**. The two walks line up position for position because a compiled screen cannot change shape — so nothing is named, nothing is registered, and there is no second file describing the same screen.

:::caution A screen must not touch the world at import time
The build evaluates the module once, on the build machine, with `@minecraft/server` replaced by a stub. Hooks are fine; module-scope code that reaches for the game (`world.afterEvents.*.subscribe`, `system.run`, a dynamic property read next to an `import`) is not. Keep that in the module that calls `createContainerScreen` — see [the filter page](./regolith-filter.md#the-one-rule).
:::

## Serving it

```ts title="packs/BP/scripts/container/furnace.ts"
import { createContainerScreen } from '@bedrock-core/ui/container';
import Furnace from '../screens/furnace.screen';

const screen = createContainerScreen(Furnace);
```

That is the whole behavior-pack side. `createContainerScreen` attaches the screen to every entity of the type the `<Container>` names; a player opens it by interacting with the entity, the way they open a chest, and the runtime drives the screen for as long as it is open. Nothing opens a container from script — a screen is bound to something in the world.

```ts
function createContainerScreen(
  Screen: FunctionComponent,
  options?: { pollInterval?: number; debug?: boolean },
): { entity: string; detach(): void }
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pollInterval` | `number` | `1` | How often, in ticks, the drawn slots are swept. A container reports no events, so the runtime polls the slots a player can reach and reacts to what moved. |
| `debug` | `boolean` | `false` | Log every action with where each item ended up — the only way to see a container bug from inside the game. |

| Member | Description |
| --- | --- |
| `entity` | The entity type the screen names, for spawning or finding hosts. |
| `detach()` | Stop serving the screen. |

## The components

The same set as a form, with four additions and a few container-specific behaviours:

| Component | In a container screen |
| --- | --- |
| [`Container`](../ui-runtime/components/Container.md) | The root. Names the entity, and is the screen's own panel: `padding`, `gap` and `background` apply. |
| [`Slot`](../ui-runtime/components/Slot.md) | A container cell of the screen's own container. `role` is `both` (storage), `input` (in only) or `output` (out only), enforced server-side; `interactive={false}` locks it inert. `onInsert(event)` and `onRemove(event)` fire after a move, with `event.stack`, `event.player` and `event.host`. Given a `collection`, it instead reads a foreign cell — see [Rendering other containers](#rendering-other-containers). |
| [`SlotGrid`](../ui-runtime/components/SlotGrid.md) | A grid of cells over a foreign collection — any collection the engine exposes. Not part of the screen's own container. |
| [`PlayerInventory`](../ui-runtime/components/PlayerInventory.md), [`Hotbar`](../ui-runtime/components/Hotbar.md) | The player's own grids — thin `SlotGrid` wrappers over `inventory_items` / `hotbar_items`. Placed by the layout engine. Not free: a screen owns the whole chest screen, so leave them out and they are gone. |
| [`Text`](../ui-runtime/components/Text.md) | Baked, unless it has `maxLength` — see [Live text](#live-text). |
| [`Image`](../ui-runtime/components/Image.md) | A texture, baked into the layout. |
| [`Scroll`](../ui-runtime/components/Scroll.md) | A region laid out at its own height that the client scrolls. Not inside another scroll. |
| [`Button`](../ui-runtime/components/Button.md) | A container slot with the item hidden: a press reaches script only as an item move, and the face is ordinary JSON UI. `enabled={false}` draws `backgroundLocked` and ignores presses. Its children are baked into the face, so they are static text or images — including their colour, which is why an [ore-styled](../ore-styled/ore-styled.md) button's caption keeps its enabled colour while its background swaps to the disabled one. |
| [`Background`](../ui-runtime/components/Background.md) | A full-screen texture behind everything, as in a form. |
| `Panel`, `Fragment`, contexts | Exactly as in a form. |

[ore-styled](../ore-styled/ore-styled.md) components compose the same way: the `Button` above is ore-styled's, with `enabled` driving its disabled look.

### Live text

A container slot publishes numbers, not strings, so text that changes at runtime has to reserve its cells before the build knows what it will say:

```tsx
<Text>{'§fBEDROCK CORE'}</Text>                  {/* baked: any character, any formatting code */}
<Text maxLength={24}>{`holding ${held}`}</Text>  {/* live: 24 cells, one container slot each */}
```

`maxLength` is what makes a `Text` live. Each cell is one container slot whose stack size is a character code, decoded through a 64-glyph table the filter writes into your `.lang` files: space, `A–Z`, `a–z`, `0–9` and `.`. Anything outside that table — formatting codes included — draws as a blank, and a string longer than `maxLength` is cut. Text without `maxLength` is baked into the layout and may say anything at all.

A live `Text` cannot sit inside a `Button` — a button's children are its face. Put it beside the button.

### Rendering other containers

A `Slot` and a `SlotGrid` can read a collection the screen does **not** own — the player's own inventory, another container's items, any JSON UI collection — by naming it:

```tsx
<Slot collection={'hotbar_items'} index={0} />                                  {/* one foreign cell */}
<SlotGrid collection={'inventory_items'} columns={9} rows={3} hideOwned interactive={false} />  {/* a whole collection */}
```

The difference between an **own** slot and a **foreign** one is where the value lives and who drives it:

- An **own** `Slot` (no `collection`) is a cell of the screen's own container. It is allocated a container index, the runtime polls it every sweep, and its `role` — `input` / `output` — is enforced a tick later by undoing a move the engine already made. A container reports no events and offers no veto, so a role is a server-side runtime thing, never a baked one.
- A **foreign** `Slot collection` / `SlotGrid` reads another collection at an author-given index. It costs no index in the screen's own container and the runtime never touches it: the engine's own take and place drive it directly. `role` has no meaning here (nothing polls it) and is refused.

What *is* baked into the JSON UI is inertness. A container slot's take and place are a single combined engine action, so there is no take-only or place-only cell to express a one-directional `role` on the client — the runtime undoes the wrong direction a tick later. (Two things are baked: **no slot drops** — Q is not a route on any container cell, since dropping belongs outside a container and a dropped item lands out of the runtime's reach; and an output slot with no result holds the runtime's marker item while its compiled cell swaps to an empty fake — the slot is never empty, so shift-click auto-placement is blocked, and the marker is never rendered, hovered or takeable, because no real cell exists while it sits there.) A cell can also be made fully inert with `interactive={false}` — it withholds focus, so it can neither be taken from, placed into, nor dropped. A drawn-but-untouchable mirror of the player's inventory is exactly that.

## State and handlers

State is **entity-owned**. Hook state lives on the entity the screen is attached to, in a dynamic property, and persists on its own: close the screen and reopen it, leave and come back, restart the world — the furnace is still at the charge it was left at. Nothing has to be saved or restored, but it does mean state must be JSON-serializable: numbers, strings, booleans, plain objects and arrays.

There is no single viewer, so **the player reaches a screen through its handlers** rather than a hook: `Slot` and `Button` handlers receive an event carrying the player who moved the item, and the `Container` itself has `onOpen` / `onClose` carrying the player who came or went — keep what the screen needs (a name, a count of viewers) in state. [`usePlayer`](../ui-runtime/hooks/usePlayer.md) is unavailable, because a container screen has no player of its own. [`useExit`](../ui-runtime/hooks/useExit.md) hands back a press rather than a closer: nothing closes a container from script, but a `<Button onPress={useExit()}>` becomes the screen's **close button** — the client closes the screen, as vanilla's own X does, and the button takes no container slot. Vanilla's textures are `textures/ui/close_button_default`, `_hover` and `_pressed`, and they are the default look when the button is unstyled. [`useEffect`](../ui-runtime/hooks/useEffect.md) works, and effects run while someone is viewing the screen; a timer in an effect is how a bar sweeps on its own.

The shape is frozen: the build sees the tree once, with initial state, and every later render must produce the same elements in the same order. Never add or drop a `Slot` or a `Button` from one render to the next — change what they show instead: `enabled` on a button, or live text.

## The canvas

The same 320 × 210 canvas a form is laid out on, and the same flexbox — and the canvas is fixed: the build measures the laid-out root and fails with the size it found when it is past the canvas. What does not fit goes in a `Scroll`, which is laid out at its own height and scrolls on the client. `Slot`, `PlayerInventory` and `Hotbar` have fixed sizes (18 × 18, 162 × 54, 162 × 18); everything else is yours to arrange.

## Costs

Every slot index on the entity's container has to be paid for, and the build sizes the entity's inventory to the total:

| Element | Container slots |
| --- | --- |
| `Slot` (own) | 1 |
| `Button` | 1 |
| `Text maxLength={n}` | `n` |
| `Slot collection`, `SlotGrid`, `PlayerInventory`, `Hotbar` | 0 — reads a foreign collection |

Plus one for the marker slot the router reads. A screen with three slots, two buttons and a 24-character label is a 30-slot container.

## Not supported

- [`<Form>`](../ui-runtime/components/Form/Form.md) and every `Form.*` field: a container has no native form. The build rejects them by name.
- A [`<Scroll>`](../ui-runtime/components/Scroll.md) inside a `<Scroll>`: a region is laid out as one flat box. Sibling scrolls are fine, and there is no limit on how many.
- A `<Container>` inside a `<Container>`. One entity opens one screen.
- Live `Text` inside a `Button`.
- `usePlayer`. (`useExit` works, as the close button — see above.)

## In this section

| Page | Description |
| --- | --- |
| [ui-compile Regolith filter](./regolith-filter.md) | How a screen is discovered, what the build generates and where, the entity it stamps, the one authoring rule, settings |
| [JSON UI and container facts](./findings.md) | The measured rules behind the design — collection addressing, binding types, what the Script API does and does not allow, which official schemas are worth validating against |
