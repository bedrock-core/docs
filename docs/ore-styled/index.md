---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/ore-styled is a themed component layer over the @bedrock-core/ui primitives."
---
# ore-styled

`@bedrock-core/ore-styled` is a themed component layer over the [`@bedrock-core/ui`](/docs/ui/components) primitives.

:::caution Beta
`@bedrock-core/ore-styled` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## What is @bedrock-core/ore-styled?

Every component renders with authentic Minecraft textures shipped in the [render pack](/docs/ui/guides/render-pack), so a screen matches the vanilla look with no texture work. It is entirely optional: the primitives underneath are fine to style yourself.

The textures are **defaults, not a lock**. Every surface prop a primitive accepts is accepted here too, with the theme's value as the fallback — pass one and yours wins.

## Install

<Install pkg="@bedrock-core/ore-styled" />

No extra resource pack: the theme's textures live in the same [render pack](/docs/ui/guides/render-pack) the framework already requires.

## Import

```tsx
import { Button, Card, Checkbox, Divider, Dropdown, Header, Input, MenuRow, Radio, Slider, Tabs, Toggle, ToggleButtons, Trail } from '@bedrock-core/ore-styled';
```

## Layout and chrome

- [**`<Button>`**](./Button.md) — a button in seven variants, or a themed [`<Link>`](/docs/ui/components/Link) when given `to`
- [**`<Card>`**](./Card.md) — the standard panel background, padding and gap, in six variants
- [**`<Divider>`**](./Divider.md) — a horizontal or vertical rule in three variants
- [**`<Header>`**](./Header.md) — a screen header bar: back control, breadcrumb trail, close control
- [**`<Trail>`**](./Trail.md) — the breadcrumb trail on its own, with live segments that take no room when empty
- [**`<MenuRow>`**](./MenuRow.md) — a browse-list row: thumbnail, title, subtitle, trailing chevron
- [**`<Tabs>`**](./Tabs.md) — panes switched on the client, each header a label on the theme's faces
- **`FRAME`, `PADDING`, `PADDING_BOTTOM`, `HEADER_HEIGHT`, `HEADER_GAP`, `BODY`** — the canvas every bedrock-core screen is baked at and the card inside it, so two packs that meet in one frame agree on its geometry without asking each other

## Booleans

- [**`<Checkbox>`**](./Checkbox.md) — the box, then the caption
- [**`<Toggle>`**](./Toggle.md) — the caption, then a switch pinned right; the settings-row reading order

## One choice out of several

- [**`<Radio>`**](./Radio.md) — a bullet and a label per row
- [**`<ToggleButtons>`**](./ToggleButtons.md) — side-by-side segments with fused borders, one choice or several

## Modal fields

- [**`<Input>`**](./Input.md) — a single-line text field
- [**`<Dropdown>`**](./Dropdown.md) — the current selection with a chevron, and a popup
- [**`<Slider>`**](./Slider.md) — a track, a progress fill and a thumb

## Captions

The runtime's controls are deliberately label-free — a caption is composed in this layer, and every themed component above does it for you when you pass `label`. [`fieldLabel`](./fieldLabel.md) is that composition, exported for a control of your own:

```tsx
import { fieldLabel } from '@bedrock-core/ore-styled';

fieldLabel('Volume', true);   // the caption, in the theme's field-label style
```

It takes the label and whether the control is enabled. A literal string carries the state color as a `§` prefix; a string the active resolver knows as a `.lang` key passes through untouched, because a prefix in front of a key stops it resolving.

The modal root itself draws nothing, so it is not themed: import [`<Form>`](/docs/ui/components/Form) from `@bedrock-core/ui` and put these components inside it.

## Theme

- [**`theme`**](./theme.md) — the token map every component reads, and what to change to restyle the set

## Next steps

- [`<Button>`](./Button.md) — the variants, and a form's two actions
- [Hosts](/docs/ui/guides/hosts) — what each screen can carry, and why a field refuses some of them
- [Control props](/docs/ui/components/control-props) — the layout props every component here accepts
