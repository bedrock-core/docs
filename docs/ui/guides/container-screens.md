---
sidebar_position: 4
description: "A container screen is a custom entity's or custom block's container screen, written in JSX with the same components as a form."
---

# Container screens

A **container screen** is the screen a custom entity or a custom block opens, written in JSX with the same components as a form. The [ui-compiler Regolith filter](/docs/filters/ui-compiler) compiles it into static JSON UI at build time; at runtime `createContainerScreen` serves it to every player who opens that host, and everything alive in it — text, buttons, entities, the items in its slots — travels through the container's own slots.

It is the second backend of `@bedrock-core/ui`. A form is serialized per player when it is shown. A container screen cannot be: the vanilla container screen has no string channel wide enough to carry a layout, so the layout is baked once and only state moves at runtime. What you get in exchange is what a form cannot give — real item slots the player drags into, a screen that stays open while its values change, and state that belongs to a thing in the world.

## The two hosts

A screen names exactly one of them on its [`<Container>`](../components/Container.md) root, and nothing above the root differs between the two:

| Host | Written | Its container | Where its state lives | Vanilla screen it opens |
| --- | --- | --- | --- | --- |
| A custom entity | `<Container entity={'core:furnace'}>` | `minecraft:inventory`, sized by the build | a dynamic property on the entity | the chest |
| A custom block | `<Container block={'core:workbench'}>` | `minecraft:block_entity.container`, sized by the build | the block entity's own dynamic properties | the data-driven container |

:::caution Experimental: block containers
A block-hosted screen uses its block's `minecraft:block_entity` container, and block containers are an experimental game feature. Expect rough edges, and expect this to change when the game's feature does. Entity-hosted screens are not affected.
:::

An entity goes where you put it and can be spawned, moved and removed from script; a block is placed, broken and mined like any other, and its screen goes with the block entity. The practical difference is capacity: a **block container holds 54 slots**, which is the whole allocation below, and an entity's inventory has no such cap.

The build reads the root and stamps the host it names — the container's size and the screen's layout key — so nothing is kept in step by hand. A screen naming a host that is not in the behavior pack fails the build, and so does a block-hosted screen that needs more than 54 slots.

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

Three things make it a container screen: the file name ends in `.screen.tsx` (that is how the filter finds it), the module default-exports the component, and the root is a [`<Container>`](../components/Container.md) naming the entity or block it opens from. Everything else is the component set you already know.

A screen written once can serve both hosts: put everything above the root in a shared component, and let each `.screen.tsx` name nothing but its host.

```tsx title="packs/BP/scripts/screens/crafting_block.screen.tsx"
import { Crafting } from './crafting';

export default function CraftingBlock() {
  return <Crafting block={'core:crafting_block'} />;
}
```

Each screen file is compiled separately and gets its own layout key, so the two hosts open their own copies of the same layout.

The build runs the component once to decide the **shape**; the runtime runs it again, per viewer, to decide the **values**. The two walks line up position for position because a compiled screen cannot change shape — so nothing is named, nothing is registered, and there is no second file describing the same screen.

:::caution A screen must not touch the world at import time
The build evaluates the module once, on the build machine, with `@minecraft/server` replaced by a stub. Hooks are fine; module-scope code that reaches for the game (`world.afterEvents.*.subscribe`, `system.run`, a dynamic property read next to an `import`) is not. Keep that in the module that calls `createContainerScreen` — see [Import time](../compiler/screens.md#import-time).
:::

## Serving it

```ts title="packs/BP/scripts/container/furnace.ts"
import { createContainerScreen } from '@bedrock-core/ui/container';
import Furnace from '../screens/furnace.screen';

const screen = createContainerScreen(Furnace);
```

That is the whole behavior-pack side. `createContainerScreen` attaches the screen to every entity — or every placed block — of the type the `<Container>` names; a player opens it by interacting with that host, the way they open a chest, and the runtime drives the screen for as long as it is open. Nothing opens a container from script — a screen is bound to something in the world.

A block-hosted screen needs nothing bound to it: a placed block is already in the world. An entity-hosted one usually does — something has to spawn the entity.

```ts
function createContainerScreen<N extends string = string>(
  Screen: FunctionComponent,
  options?: { pollInterval?: number; debug?: boolean },
): {
  host: { kind: 'entity' | 'block'; type: string };
  container(host: Entity | Block): NamedContainer<N>;
  detach(): void;
}
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pollInterval` | `number` | `1` | How often, in ticks, the drawn slots are swept. A container reports no events, so the runtime polls the slots a player can reach and reacts to what moved. |
| `debug` | `boolean` | `false` | Log every action with where each item ended up — the only way to see a container bug from inside the game. |

| Member | Description |
| --- | --- |
| `host` | What the screen's `<Container>` names: `kind` is `'entity'` or `'block'`, `type` the identifier — for spawning entities or finding blocks. |
| `container(host)` | The screen's own cells on one entity or block — see [Reaching the cells](#reaching-the-cells). |
| `detach()` | Stop serving the screen. |

### Reaching the cells

The host's container is not the screen. Its first slots carry the routing key, every button rides a slot of its own, and the live values sit in a bank behind the drawn range — so a raw container index is a number only the allocator knows.

`container(host)` hands back the container as you **wrote** it: index `i` is the `i`-th own `<Slot>` in document order, `size` is how many of them there are, and a cell carries the [`name`](../components/Slot.md) its `<Slot>` declared. Nothing the runtime placed shows through it, so an `output` cell with no result reads empty rather than holding the marker.

It is the engine's own [`Container`](https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/container), member for member, with two additions: every slot parameter takes an index **or a name**, and `getSlot()` hands back the engine's [`ContainerSlot`](https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/containerslot) plus a `name`. There is nothing new to learn — `getItem`, `setItem`, `addItem`, `find`, `moveItem` and the rest mean what they mean everywhere else. (`weight` and `containerRules` are left off: a view over part of a container has no honest answer for either.)

```ts
import { ItemStack, system, world } from '@minecraft/server';

const screen = createContainerScreen<'output'>(Furnace);

// A machine ticking over its own entities. No session and no viewer: the cells
// are built from the layout the screen was constructed with, so a furnace
// smelts whether or not anyone is looking at it.
system.runInterval(() => {
  for (const host of world.getDimension('overworld').getEntities({ type: screen.host.type })) {
    const cells = screen.container(host);
    const coal = cells.find(new ItemStack('minecraft:coal', 1));

    if (coal !== undefined && cells.getItem('output') === undefined) {
      const fuel = cells.getSlot(coal);

      if (fuel.amount > 1) {
        fuel.amount -= 1;
      } else {
        fuel.setItem();
      }

      cells.setItem('output', new ItemStack('minecraft:iron_ingot', 1));
    }
  }
}, 20);
```

The type argument only names the slots: `createContainerScreen<'output'>` makes `getItem('output')` typed and a misspelling a compile error, and `names` maps each one to its index. Leave it off and a name is an ordinary string.

Four behaviors are the container screen's own:

- Anything the runtime placed reads as an **empty slot** through every reader — `getItem`, `hasItem`, `typeId`, `amount`, `getTags`, the lore, the dynamic properties. A marker is never the author's item.
- Emptying an `output` cell restores its marker in the same call, so the cell is never empty and nothing can be shift-clicked over a result.
- `addItem()` fills the cells in view order but **skips `output` cells**: an output cell is the result the screen published for the player to take, not storage, so a bulk add must not write one.
- `clearAll()` empties the screen's own cells and nothing else — the routing key, the buttons and the bank are not reachable through the view at all.

A host with no container — an entity that has died, a block that was broken or whose chunk is not loaded — reads as a container of size 0 whose writes do nothing; `isValid` is where that shows. Nothing throws, and nothing is remembered: a block whose chunk comes back serves its screen again.

## The components

The same set as a form, with four additions and a few container-specific behaviors:

| Component | In a container screen |
| --- | --- |
| [`Container`](../components/Container.md) | The root. Names the entity or the block, and is the screen's own panel: `padding`, `gap` and `background` apply. |
| [`Slot`](../components/Slot.md) | A container cell of the screen's own container. `role` is `both` (storage), `input` (in only) or `output` (out only), enforced server-side; `interactive={false}` locks it inert. `name` is what addon logic calls the cell — see [Reaching the cells](#reaching-the-cells). `onInsert(event)` and `onRemove(event)` fire after a move, with `event.stack`, `event.player`, `event.host` and `event.container`. Given a `collection`, it instead reads a foreign cell — see [Rendering other containers](#rendering-other-containers). |
| [`SlotGrid`](../components/SlotGrid.md) | A grid of cells over a foreign collection — any collection the engine exposes. Not part of the screen's own container. |
| [`PlayerInventory`](../components/PlayerInventory.md), [`Hotbar`](../components/Hotbar.md) | The player's own grids — thin `SlotGrid` wrappers over `inventory_items` / `hotbar_items`. Placed by the layout engine. Not free: a screen owns the whole vanilla screen, so leave them out and they are gone. |
| [`Text`](../components/Text.md) | Baked, unless it has `maxLength` — see [Live text](#live-text). |
| [`Image`](../components/Image.md) | A texture, baked into the layout. |
| [`Scroll`](../components/Scroll.md) | A region laid out at its own height that the client scrolls. Not inside another scroll. |
| [`Button`](../components/Button.md) | A container slot with the item hidden: a press drops that item, which is how it reaches script and names the player who pressed, and the face is ordinary JSON UI. `enabled={false}` draws `backgroundLocked` and ignores presses. Its children are baked into the face, so they are static text or images — including their color, which is why an [ore-styled](/docs/ore-styled) button's caption keeps its enabled color while its background swaps to the disabled one. |
| [`Background`](../components/Background.md) | A full-screen texture behind everything, as in a form. |
| `Panel`, `Fragment`, contexts | Exactly as in a form. |

[ore-styled](/docs/ore-styled) components compose the same way: the `Button` above is ore-styled's, with `enabled` driving its disabled look.

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
<SlotGrid collection={'inventory_items'} columns={9} rows={3} interactive={false} />  {/* a whole collection */}
```

The difference between an **own** slot and a **foreign** one is where the value lives and who drives it:

- An **own** `Slot` (no `collection`) is a cell of the screen's own container. It is allocated a container index, the runtime polls it every sweep, and its `role` — `input` / `output` — is enforced a tick later by undoing a move the engine already made. A container reports no events and offers no veto, so a role is a server-side runtime thing, never a baked one.
- A **foreign** `Slot collection` / `SlotGrid` reads another collection at an author-given index. It costs no index in the screen's own container and the runtime never touches it: the engine's own take and place drive it directly. `role` has no meaning here (nothing polls it) and is refused.

What *is* baked into the JSON UI is inertness. A container slot's take and place are a single combined engine action, so there is no take-only or place-only cell to express a one-directional `role` on the client — the runtime undoes the wrong direction a tick later. (Two things are baked: **no slot drops** — Q is not a route on any `Slot` cell, since a dropped item lands out of the runtime's reach (a `Button` is the exception: dropping its hidden item is its press); and an output slot with no result holds the runtime's marker item while its compiled cell swaps to an empty fake — the slot is never empty, so shift-click auto-placement is blocked, and the marker is never rendered, hovered or takeable, because no real cell exists while it sits there.) A cell can also be made fully inert with `interactive={false}` — it withholds focus, so it can neither be taken from, placed into, nor dropped. A drawn-but-untouchable mirror of the player's inventory is exactly that.

## State and handlers

State is **host-owned**. Hook state lives on the entity or the block the screen is attached to — a dynamic property on the entity, the block entity's own dynamic properties on the block — and persists on its own: close the screen and reopen it, leave and come back, restart the world, and the furnace is still at the charge it was left at. Nothing has to be saved or restored, but it does mean state must be JSON-serializable: numbers, strings, booleans, plain objects and arrays.

A block's state goes where the block entity goes: break the block and it is gone with the container, which is what a player expects of a machine.

There is no single viewer, so **the player reaches a screen through its handlers** rather than a hook: `Slot` and `Button` handlers receive an event carrying the player who moved the item, and the `Container` itself has `onOpen` / `onClose` carrying the player who came or went — keep what the screen needs (a name, a count of viewers) in state. `event.host` is the entity or the block the screen belongs to, whichever it was written for.

Every one of those events also carries `event.container`: the screen's own cells, exactly as [`container(host)`](#reaching-the-cells) gives them. A handler is written inside the component and cannot reach the screen object, so the cells come to it instead:

```tsx
<Slot name={'output'} role={'output'} />

<Button onPress={({ container }) => {
  const planks = container?.find(new ItemStack('minecraft:oak_planks', 1));

  if (planks !== undefined && container?.getItem('output') === undefined) {
    container.getSlot(planks).amount -= 1;
    container.setItem('output', new ItemStack('minecraft:crafting_table', 1));
  }
}}>{'craft'}</Button>
```

Names on the event are plain strings — typed names live on the screen object, where the type argument is. A write through the view is the screen moving an item rather than a player, so it is never reported back to the cell's own `onInsert` / `onRemove`. [`usePlayer`](../hooks/usePlayer.md) is unavailable, because a container screen has no player of its own. [`useExit`](../hooks/useExit.md) hands back a press rather than a closer: nothing closes a container from script, but a `<Button onPress={useExit()}>` becomes the screen's **close button** — the client closes the screen, as vanilla's own X does, and the button takes no container slot. Left unstyled it draws the same `textures/ui/unstyled` placeholder as any other control; give it `background={'textures/ui/close_button_default'}`, `backgroundHover={'textures/ui/close_button_hover'}` and `backgroundPressed={'textures/ui/close_button_pressed'}` to match vanilla's own X. [`useEffect`](../hooks/useEffect.md) works, and effects run while someone is viewing the screen; a timer in an effect is how a bar sweeps on its own.

The shape is frozen: the build sees the tree once, with initial state, and every later render must produce the same elements in the same order. Never add or drop a `Slot` or a `Button` from one render to the next — change what they show instead: `enabled` on a button, or live text.

## The canvas

The same 320 × 210 canvas a form is laid out on, and the same flexbox — and the canvas is fixed: the build measures the laid-out root and fails with the size it found when it is past the canvas. What does not fit goes in a `Scroll`, which is laid out at its own height and scrolls on the client. `Slot`, `PlayerInventory` and `Hotbar` have fixed sizes (18 × 18, 162 × 54, 162 × 18); everything else is yours to arrange.

## Costs

Every slot index on the host's container has to be paid for, and the build sizes that container to the total:

| Element | Container slots |
| --- | --- |
| `Slot` (own) | 1 |
| `Button` | 1 |
| `Text maxLength={n}` | `n` |
| `Slot collection`, `SlotGrid`, `PlayerInventory`, `Hotbar` | 0 — reads a foreign collection |

Plus two for the marker slots the router reads. A screen with three slots, two buttons and a 24-character label is a 31-slot container — within a block's 54, which an entity has no limit on.

## Not supported

- [`<Form>`](../components/Form.md) and every `Form.*` field: a container has no native form. The build rejects them by name.
- A [`<Scroll>`](../components/Scroll.md) inside a `<Scroll>`: a region is laid out as one flat box. Sibling scrolls are fine, and there is no limit on how many.
- A `<Container>` inside a `<Container>`. One host opens one screen.
- A `<Container>` naming both `entity` and `block`, or neither.
- More than 54 container slots on a block-hosted screen.
- Live `Text` inside a `Button`.
- `usePlayer`. (`useExit` works, as the close button — see above.)

## Next steps

- [`<Container>`](../components/Container.md) — the root, its host and its viewer handlers
- [`<Slot>`](../components/Slot.md) — a cell, its role, and what a foreign collection changes
- [Hosts](./hosts.md) — what a container screen can carry that a form cannot, and the reverse
- [Writing a screen](../compiler/screens.md) — how a screen is discovered, and what compiling it asks of the source
- [What the build writes](../compiler/output.md) — how a container screen is routed, and what the build stamps onto its entity or block
