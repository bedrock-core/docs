---
sidebar_position: 1
description: "Every built-in component, grouped by what it is and what the host spends on it."
---
# Components

Built-in JSX components, in the groups the sidebar uses.

## Roots

A screen's root names its [host](../guides/hosts.md), and there is no default: a tree that starts with anything else is refused with the list of roots.

- [`<Screen>`](./roots/Screen.md) — an action form: presses, decoration, lists and scrolls, shown with `render()`
- [`<Form>`](./roots/Form.md) — a native modal form, shown with `render()`
- [`<Container>`](./roots/Container.md) — a container screen an entity owns, served with `createContainerScreen()`

A root is **only** a host. None of them has members: every control below is a top-level component, and which hosts it works on is its own capability.

## Layout

Boxes and flow. Each draws on all three hosts and asks for nothing.

- [`<Panel>`](./layout/Panel.md) — a box with an optional background and flexbox layout, or a stack that reflows hidden children
- [`<Scroll>`](./layout/Scroll.md) — an independent vertical scroll region
- [`<Fragment>`](./layout/Fragment.md) — group children without a wrapper node (`<>…</>`)

## Content

What a screen shows. Also free on every host.

- [`<Text>`](./content/Text.md) — a label, literal or localized, baked or live with `maxLength`
- [`<Image>`](./content/Image.md) — a texture from a resource pack, baked or carried with `live`
- [`<Background>`](./content/Background.md) — a full-screen texture drawn behind the screen

## Controls

Each of these works on more than one host, and draws differently on each — a `<Toggle>` is a native field on a modal, a press that flips on a screen, and a cell on a container.

- [`<Button>`](./controls/Button.md) — a press: a handler, the form's `'submit'`, or the way `'exit'`
- [`<Link>`](./controls/Link.md) — a press whose destination is data, so the build can read where it leads
- [`<Toggle>`](./controls/Toggle.md) — a boolean
- [`<Select>`](./controls/Select.md) — one choice out of several, every option visible
- [`<Option>`](./controls/Option.md) — one entry for a `<Select>` or a `<Dropdown>`

## Compiled

What only exists because the screen is compiled. The two switches are client-side state — no press, no re-present, no payload — and are compiled-only.

- [`<Tabs>`](./compiled/Tabs.md) — several panes on one screen, switched by a header row
- [`<Disclosure>`](./compiled/Disclosure.md) — a header that folds the rows under it and reflows what is below
- [`<List>`](./compiled/List.md) — `max` compiled rows and a carried count, for a variable row count on a frozen shape

## Container cells

Only on a container screen. See [Container screens](../guides/container-screens.md).

- [`<Slot>`](./cells/Slot.md) — a real container cell, with a role and handlers for what moves through it
- [`<SlotGrid>`](./cells/SlotGrid.md) — a grid over a collection the engine already publishes
- [`<PlayerInventory>`](./cells/PlayerInventory.md) — the player's 9 × 3 inventory grid
- [`<Hotbar>`](./cells/Hotbar.md) — the player's hotbar

## Modal fields

The three the engine only draws inside a [`<Form>`](./roots/Form.md). Anywhere else they are refused at build, by name.

- [`<Input>`](./fields/Input.md) — a single-line text field
- [`<Slider>`](./fields/Slider.md) — a number within a range
- [`<Dropdown>`](./fields/Dropdown.md) — one option from a popup

## Cross-pack

- [`<Expect>`](./cross-pack/Expect.md) — states which screen a fragment is written for, and fails the build when it lands elsewhere
- [`<Embed>`](./cross-pack/Embed.md) — a screen one pack draws into an area another pack's screen reserves

## Shared props

- [Control props](./control-props.md) — the flexbox properties, `position={'absolute'}` placement, `visible`, `enabled` and `background`, on every component, plus how a conditional becomes a carried `visible`
- [Handler events](../guides/handler-events.md) — the one event object every handler takes

## Next steps

- [Hosts](../guides/hosts.md) — what each component becomes on each screen
- [Hooks](../hooks/hooks.md) — add state and effects to your components
- [API](../api/api.md) — `render()`, contexts and the compiled-screen registry
