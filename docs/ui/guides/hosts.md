---
sidebar_position: 1
description: "The supported screen hosts, their transports and the experimental Ore presentation."
---
# Hosts

A host is one Minecraft screen the library draws on, plus the transport that screen offers. The root element of a screen names its host, and there is no default.

| Root | Host | Owner | Served by | What an interaction is |
| --- | --- | --- | --- | --- |
| [`<Screen>`](../components/Screen.md) | `form-action` | the player | `render(Screen, player)` | a form entry the engine reports back by index |
| [`<Form>`](../components/Form.md) | `form-modal` | the player | `render(Form, player)` | a native field the engine owns, returned in one answer on submit |
| [`<Container entity\|block>`](../components/Container.md) | `chest` | the entity or block | `createContainerScreen(Screen)` | an item moving through a slot of the host's own container |
| [`<Experimental_OreUI>`](../components/Experimental_OreUI.md) | `experimental-ore-ui` | the player | `render(Screen, player)` | a live control callback through a persistent DDUI form |

The hosts lay out against the same 320 × 210 canvas. A tree that starts with anything else throws `ScreenRootError` listing the roots. [Experimental Ore screens](./experimental-ore.md) require matching Windows client resources and have their own supported-control limits.

## What each host can carry

A host declares what every kind of component *becomes* on it. A kind the table does not name has nothing to be there, so it is refused at build with that host's own wording rather than drawn inert.

| Component | `form-action` | `form-modal` | `chest` | `experimental-ore-ui` |
| --- | --- | --- | --- | --- |
| [`Button`](../components/Button.md) | a press | its `'submit'` and `'exit'` only | an item taken and put back | a live press callback |
| [`Toggle`](../components/Toggle.md) | a press that flips and re-presents | a native field | a cell of the host's container | a live boolean change |
| [`Select`](../components/Select.md), [`Option`](../components/Option.md) | a press per option | a native field | a cell per option | selected option values |
| [`Slider`](../components/Slider.md), [`Dropdown`](../components/Dropdown.md), [`Input`](../components/Input.md) | ❌ | a native field | ❌ | a live value change |
| [`Slot`](../components/Slot.md) | ❌ | ❌ | a cell the player fills | ❌ |
| [`SlotGrid`](../components/SlotGrid.md) | ❌ | ❌ | a collection the engine already publishes | ❌ |

Components absent from the table — `Panel`, `Text`, `Image`, `Background`, `Fragment`, `Scroll` — draw on every host and ask for nothing.

## A root has no members

This table is why fields are top-level components rather than members of `Form`. A root names a host, and `Form.Button` is its one member: every field is a top-level component, and the row above is what decides where it can be written.

`<Toggle>` uses a press on `<Screen>`, a submitted field on `<Form>`, a container cell on `<Container>` and a live change callback on `<Experimental_OreUI>`:

```tsx
import { Toggle } from '@bedrock-core/ui';

<Toggle name={'music'} defaultValue={true} on={music} onChange={setMusic} />
```

`name` identifies a modal result. `on` and `onChange` control the value on press-based and live hosts.

`<Input>`, `<Slider>` and `<Dropdown>` work on `<Form>` and `<Experimental_OreUI>`. Modal results arrive on submit; Ore edits use `value` and `onChange`. Action forms and container screens refuse these fields at build time.

Live values travel on carriers: `bool`, `int`, `enum` and `text` on form and Ore hosts, and `bool`, `int` and `text` on the chest. Each detected dynamic container text value uses one slot's item name and carries at most 128 UTF-16 code units.

## One component set

[`useMechanism`](../hooks/useMechanism.md) is the seam: a component asks what its kind becomes here and draws that, so a toggle is a native field on a modal and a pressed button on a screen of buttons without knowing which screen it is on. What differs between hosts is the mechanism, never the component.

That is also what makes the refusals precise. The same `<Slider>` is "put it inside a `<Form>`" on an action form and "a container has no native form" on a container screen, because the fix is different and the host is the one that knows it.

## Writing a fragment for a host you do not own

A root names the host, so anything under it already knows what it becomes. [`<Expect host>`](../components/Expect.md) is for the other case: a component library that renders *into* a screen it does not own — a set of fields meant for a modal, exported as a fragment for an addon to place.

```tsx
import { Expect, Form } from '@bedrock-core/ui';

export const AccountFields = (): JSX.Element => (
  <Expect host={'form-modal'}>
    <Input name={'nickname'} />
    <Toggle name={'notify'} />
  </Expect>
);
```

An addon that drops that fragment on the wrong screen is told where, once, instead of being told about each field in turn.

## Update behavior

The action and modal form hosts serialize their controls when shown. Their component logic keeps running, and a new presentation supplies another snapshot. Modal field results arrive together on submit.

A container screen has no such limit. A handler renders and the slots settle in the same tick, because everything alive in it travels through the host's container rather than through a form payload.

The experimental Ore host uses DDUI observables to update an existing backing form. Its compiled node structure stays fixed while values and supported geometry change.

## Next steps

- [Navigation](/docs/navigation/guides/getting-started) — opening another screen by key, and what a press can be described as
- [State](./state.md) — where a screen's hook state lives, and how long it lasts
- [Container screens](./container-screens.md) — serving a screen an entity or a block owns
- [Experimental Ore screens](./experimental-ore.md) — live player-owned controls and version-matched resources
- [Compiler](../compiler/index.md) — how the screen in the pack was produced
