---
sidebar_position: 1
description: "The three screens the library draws on, what each can carry, and why a root names one."
---
# Hosts

A host is one Minecraft screen the library draws on, plus the transport that screen offers. The root element of a screen names its host, and there is no default.

| Root | Host | Owner | Served by | What an interaction is |
| --- | --- | --- | --- | --- |
| [`<Screen>`](../components/Screen.md) | `form-action` | the player | `render(Screen, player)` | a form entry the engine reports back by index |
| [`<Form>`](../components/Form.md) | `form-modal` | the player | `render(Form, player)` | a native field the engine owns, returned in one answer on submit |
| [`<Container entity\|block>`](../components/Container.md) | `chest` | the entity or block | `createContainerScreen(Screen)` | an item moving through a slot of the host's own container |

All three lay out against the same 320 × 210 canvas. A tree that starts with anything else throws `ScreenRootError` listing the roots.

## What each host can carry

A host declares what every kind of component *becomes* on it. A kind the table does not name has nothing to be there, so it is refused at build with that host's own wording rather than drawn inert.

| Component | `form-action` | `form-modal` | `chest` |
| --- | --- | --- | --- |
| [`Button`](../components/Button.md) | a press | its `'submit'` and `'exit'` only | an item taken and put back |
| [`Toggle`](../components/Toggle.md) | a press that flips and re-presents | a native field | a cell of the host's container |
| [`Select`](../components/Select.md), [`Option`](../components/Option.md) | a press per option | a native field | a cell per option |
| [`Slider`](../components/Slider.md), [`Dropdown`](../components/Dropdown.md), [`Input`](../components/Input.md) | ❌ | a native field | ❌ |
| [`Slot`](../components/Slot.md) | ❌ | ❌ | a cell the player fills |
| [`SlotGrid`](../components/SlotGrid.md) | ❌ | ❌ | a collection the engine already publishes |

Components absent from the table — `Panel`, `Text`, `Image`, `Background`, `Fragment`, `Scroll` — draw on every host and ask for nothing.

## A root has no members

This table is why fields are top-level components rather than members of `Form`. A root names a host, and `Form.Button` is its one member: every field is a top-level component, and the row above is what decides where it can be written.

So `<Toggle>` is one component with three mechanisms — on `<Screen>` a press that flips its state and renders the screen again, on `<Form>` a field the engine owns until submit, on `<Container>` a cell whose press is an item taken and put straight back. The same source moves between all three:

```tsx
import { Toggle } from '@bedrock-core/ui';

<Toggle name={'music'} defaultValue={true} on={music} onChange={setMusic} />
```

Each host uses the props it can — `name` is what a modal reports under, `on` and `onChange` are what the two press hosts give back — and ignores the rest.

`<Input>`, `<Slider>` and `<Dropdown>` are the other shape: one host each, because the engine draws no text field, slider or popup outside a modal. Writing one elsewhere is a build error naming the fix, not a control drawn inert.

Live values travel on carriers: `bool`, `int`, `enum` and `text` on both form hosts, and `bool`, `int` and `text` on the chest. A container publishes no text of its own, so a string crosses one character per slot.

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

## Forms cannot change while open

Both form hosts are serialized for one player when the screen is shown, and `@minecraft/server-ui` forms cannot be mutated while open. So a state change never repaints a form on its own: the component logic keeps running, and the player sees a new snapshot when they press.

A container screen has no such limit. A handler renders and the slots settle in the same tick, because everything alive in it travels through the host's container rather than through a form payload.

## Next steps

- [Navigation](./navigation.md) — opening another screen by key, and what a press can be described as
- [State](./state.md) — where a screen's hook state lives, and how long it lasts
- [Container screens](./container-screens.md) — serving a screen an entity or a block owns
- [Compiler](../compiler/index.md) — how the screen in the pack was produced
