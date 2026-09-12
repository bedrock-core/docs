---
sidebar_position: 1
description: "Every built-in component, grouped by what it is for."
---
# Components

Built-in JSX components for layout, text, interaction and the two switches a compiled screen owns.

## Roots

A screen's root names its [host](../guides/hosts.md), and there is no default: a tree that starts with anything else is refused with the list of roots.

- [`<Screen>`](./Screen.md) — an action form: buttons, decoration, lists and scrolls, shown with `render()`
- [`<Form>`](./Form/Form.md) — a native modal form, shown with `render()`
- [`<Container>`](./Container.md) — a container screen an entity owns, served with `createContainerScreen()`

## Layout and decoration

Every one of these draws on all three hosts and asks for nothing.

- [`<Panel>`](./Panel.md) — a box with an optional background and flexbox layout, or a stack that reflows hidden children
- [`<Text>`](./Text.md) — a label, literal or localized, baked or live
- [`<Image>`](./Image.md) — a texture from a resource pack
- [`<Background>`](./Background.md) — a full-screen texture drawn behind the screen
- [`<Scroll>`](./Scroll.md) — an independent vertical scroll region
- [`<Fragment>`](./Fragment.md) — group children without a wrapper node (`<>…</>`)

## Interaction

- [`<Button>`](./Button.md) — a press, with an `onPress` handler
- [`<Link>`](./Link.md) — a press whose destination is data, so the build can read where it leads

## Compiled switches

Client-side state: no press, no re-present, no payload. Both are compiled-only.

- [`<Tabs>`](./Tabs.md) — several panes on one screen, switched by a header row
- [`<Disclosure>`](./Disclosure.md) — a header that folds the rows under it and reflows what is below

## Variable content

A compiled screen's shape is frozen, so anything that varies declares its capacity.

- [`<List>`](./List.md) — `max` compiled rows and a carried count
- [`<Text maxLength>`](./Text.md) — a string that changes, and the width it reserves
- [`<Image live>`](./Image.md) — a texture path carried at runtime

## Modal fields

`<Form>` renders one native `ModalFormData`: every field is shown at once, and every value arrives together, keyed by `name`, on submit.

- [`<Form>`](./Form/Form.md) — the root; wraps the whole modal
- [`<Form.Toggle>`](./Form/FormToggle.md) — a boolean field
- [`<Form.Slider>`](./Form/FormSlider.md) — a number within a range
- [`<Form.Dropdown>`](./Form/FormDropdown.md) — one option from a popup
- [`<Form.InlineSelect>`](./Form/FormInlineSelect.md) — the same selection model, drawn inline with no popup
- [`<Form.Option>`](./Form/FormOption.md) — one entry for `Form.Dropdown` or `Form.InlineSelect`
- [`<Form.Input>`](./Form/FormInput.md) — a single-line text field
- [`<Form.Button>`](./Form/FormButton.md) — the form's submit and exit actions

## Container cells

Only on a container screen. See [Container screens](../guides/container-screens.md).

- [`<Slot>`](./Slot.md) — a real container cell, with a role and handlers for what moves through it
- [`<SlotGrid>`](./SlotGrid.md) — a grid over a collection the engine already publishes
- [`<PlayerInventory>`](./PlayerInventory.md) — the player's 9 × 3 inventory grid
- [`<Hotbar>`](./Hotbar.md) — the player's hotbar

## Cross-pack

- [`<Expect>`](./Expect.md) — states which screen a fragment is written for, and fails the build when it lands elsewhere
- [`<Embed>`](./Embed.md) — a screen one pack draws into an area another pack's screen reserves

## Deprecated

[`Input`](./deprecated/Input.md), [`Dropdown`](./deprecated/Dropdown.md) and [`Slider`](./deprecated/Slider.md) are one-modal-per-field components kept until the code removes them; new screens use [`<Form>`](./Form/Form.md).

## Shared props

- [Control props](./control-props.md) — the flexbox properties, `position={'absolute'}` placement, `visible`, `enabled` and `background`, on every component
- [Handler events](../guides/handler-events.md) — the one event object every handler takes

## Next steps

- [Hosts](../guides/hosts.md) — what each component becomes on each screen
- [Hooks](../hooks/hooks.md) — add state and effects to your components
- [API](../api/api.md) — `render()`, contexts and the compiled-screen registry
