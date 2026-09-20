---
sidebar_position: 1
description: "Every built-in component, grouped by what it is and what the host spends on it."
---
# Components

Built-in JSX components, grouped by what they are and what the host spends on them.

## Roots

A screen's root names its [host](../guides/hosts.md), and there is no default: a tree that starts with anything else is refused with the list of roots.

- [`<Screen>`](./Screen.md) — an action form: presses, decoration, lists and scrolls, shown with `render()`
- [`<Form>`](./Form.md) — a native modal form, shown with `render()`
- [`<Container>`](./Container.md) — a container screen an entity or a block owns, served with `createContainerScreen()`

A root is **only** a host. None of them has members: every control below is a top-level component, and which hosts it works on is its own capability.

## Layout

Boxes and flow. Each draws on all three hosts and asks for nothing.

- [`<Panel>`](./Panel.md) — a box with an optional background and flexbox layout, or a stack that reflows hidden children
- [`<Scroll>`](./Scroll.md) — an independent vertical scroll region
- [`<Fragment>`](./Fragment.md) — group children without a wrapper node (`<>…</>`)

## Content

What a screen shows. Also free on every host.

- [`<Text>`](./Text.md) — a label, literal or localized, baked or live with `maxLength`
- [`<Trans>`](./Trans.md) — a translated text whose tags are presses and styles, drawn where their text falls in every language
- [`<Image>`](./Image.md) — a texture from a resource pack, baked or carried with `live`
- [`<Background>`](./Background.md) — a full-screen texture drawn behind the screen

## Controls

Each of these works on more than one host, and draws differently on each — a `<Toggle>` is a native field on a modal, a press that flips on a screen, and a cell on a container.

- [`<Button>`](./Button.md) — a press: a handler, the form's `'submit'`, or the way `'exit'`
- [`<Link>`](./Link.md) — a press whose destination is data, so the build can read where it leads
- [`<Toggle>`](./Toggle.md) — a boolean
- [`<Select>`](./Select.md) — one choice out of several, every option visible
- [`<Option>`](./Option.md) — one entry for a `<Select>` or a `<Dropdown>`

## Compiled

What only exists because the screen is compiled. The two switches are client-side state — no press, no re-present, no payload — and are compiled-only.

- [`<Tabs>`](./Tabs.md) — several panes on one screen, switched by a header row
- [`<Disclosure>`](./Disclosure.md) — a header that folds the rows under it and reflows what is below
- [`<List>`](./List.md) — `max` compiled rows and a carried count, for a variable row count on a frozen shape

## Container cells

Only on a container screen. See [Container screens](../guides/container-screens.md).

- [`<Slot>`](./Slot.md) — a real container cell, with a role and handlers for what moves through it
- [`<SlotGrid>`](./SlotGrid.md) — a grid over a collection the engine already publishes
- [`<PlayerInventory>`](./PlayerInventory.md) — the player's 9 × 3 inventory grid
- [`<Hotbar>`](./Hotbar.md) — the player's hotbar

## Modal fields

The three the engine only draws inside a [`<Form>`](./Form.md). Anywhere else they are refused at build, by name.

- [`<Input>`](./Input.md) — a single-line text field
- [`<Slider>`](./Slider.md) — a number within a range
- [`<Dropdown>`](./Dropdown.md) — one option from a popup

## Cross-pack

- [`<Expect>`](./Expect.md) — states which screen a fragment is written for, and fails the build when it lands elsewhere
- [`<Embed>`](./Embed.md) — a screen one pack draws into an area another pack's screen reserves

## Shared props

- [Control props](./control-props.md) — the flexbox properties, `position={'absolute'}` placement, `visible`, `enabled` and `background`, on every component, plus how a conditional becomes a carried `visible`
- [Handler events](../guides/handler-events.md) — the one event object every handler takes

## Next steps

- [Hosts](../guides/hosts.md) — what each component becomes on each screen
- [Hooks](../hooks/hooks.md) — add state and effects to your components
- [API](../api/api.md) — `render()`, contexts and the compiled-screen registry
