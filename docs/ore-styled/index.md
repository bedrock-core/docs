---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/ore-styled is a themed component layer over the @bedrock-core/ui primitives."
---
# ore-styled

`@bedrock-core/ore-styled` is a themed component layer over the [`@bedrock-core/ui`](/docs/ui/components) primitives.

:::caution Pre-1.0
`@bedrock-core/ore-styled` is under active development. Breaking changes can still land until `1.0.0` — pin exact versions and read the release notes before upgrading.
:::

## What is @bedrock-core/ore-styled?

Every component renders with authentic Minecraft textures shipped in the [render pack](/docs/ui/guides/render-pack), so a screen matches the vanilla look with no texture work. It is entirely optional: the primitives underneath are fine to style yourself.

The textures are **defaults, not a lock**. Every surface prop a primitive accepts is accepted here too, with the theme's value as the fallback — pass one and yours wins.

## Install

<Install pkg="@bedrock-core/ore-styled" />

No extra resource pack: the theme's textures live in the same [render pack](/docs/ui/guides/render-pack) the framework already requires.

## Import

```tsx
import { Button, Card, Checkbox, Divider, Dropdown, Header, Input, MenuRow, Radio, Slider, Toggle, ToggleButtonGroup, Trail } from '@bedrock-core/ore-styled';
```

## One component per host

A field here is written once and serves every screen it can be drawn on. [`Checkbox`](./Checkbox.md), [`Toggle`](./Toggle.md), [`Radio`](./Radio.md) and [`ToggleButtonGroup`](./ToggleButton.md) ask [`useMechanism`](/docs/ui/hooks/useMechanism) what they become: the engine's own field inside a [`<Form>`](/docs/ui/components/roots/Form), a press on a screen of buttons or a container screen. A screen that can draw neither refuses them at build, in that host's own words.

So there is no themed modal variant of each field, and no themed modal root: a submit is `<Button action={'submit'}>`. [Input](./Input.md), [Dropdown](./Dropdown.md) and [Slider](./Slider.md) are the exception: the engine draws no text field, popup or slider outside a modal, so those three are modal-only.

## Layout and chrome

- [**`<Button>`**](./Button.md) — a button in seven variants, or a themed [`<Link>`](/docs/ui/components/controls/Link) when given `to`
- [**`<Card>`**](./Card.md) — the standard panel background, padding and gap, in six variants
- [**`<Divider>`**](./Divider.md) — a horizontal or vertical rule in three variants
- [**`<Header>`**](./Header.md) — a screen header bar: back control, breadcrumb trail, close control
- [**`<Trail>`**](./Trail.md) — the breadcrumb trail on its own, with live segments that take no room when empty
- [**`<MenuRow>`**](./MenuRow.md) — a browse-list row: thumbnail, title, subtitle, trailing chevron

## Booleans

- [**`<Checkbox>`**](./Checkbox.md) — the box, then the caption
- [**`<Toggle>`**](./Toggle.md) — the caption, then a switch pinned right; the settings-row reading order

## One choice out of several

- [**`<Radio>`**](./Radio.md) — a bullet and a label per row
- [**`<ToggleButtonGroup>`**](./ToggleButton.md) — side-by-side segments with fused borders

## Modal fields

- [**`<Input>`**](./Input.md) — a single-line text field
- [**`<Dropdown>`**](./Dropdown.md) — the current selection with a chevron, and a popup
- [**`<Slider>`**](./Slider.md) — a track, a progress fill and a thumb

## Captions

The runtime's controls are deliberately label-free — a caption is composed in this layer, and every themed component above does it for you when you pass `label`. `fieldLabel` is that composition, exported for a control of your own:

```tsx
import { fieldLabel } from '@bedrock-core/ore-styled';

fieldLabel('Volume', true);   // the caption, in the theme's field-label style
```

It takes the label and whether the control is enabled. A literal string carries the state color as a `§` prefix; a string the active resolver knows as a `.lang` key passes through untouched, because a prefix in front of a key stops it resolving.

The modal root itself draws nothing, so it is not themed: import [`<Form>`](/docs/ui/components/roots/Form) from `@bedrock-core/ui` and put these components inside it.

## Theme

- [**`theme`**](./theme.md) — the token map every component reads, and what to change to restyle the set

## Next steps

- [`<Button>`](./Button.md) — the variants, and a form's two actions
- [Hosts](/docs/ui/guides/hosts) — what each screen can carry, and why a field refuses some of them
- [Control props](/docs/ui/components/control-props) — the layout props every component here accepts
