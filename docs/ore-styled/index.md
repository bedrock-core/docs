---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/ore-styled is a themed component layer built on top of the @bedrock-core/ui primitives."
---
# ore-styled

`@bedrock-core/ore-styled` is a themed component layer built on top of the [`@bedrock-core/ui`](/docs/ui/components) primitives. Every component renders with authentic Minecraft textures shipped in the [render pack](/docs/ui/guides/render-pack), so your UI matches the vanilla look out of the box.

## Install

<Install pkg="@bedrock-core/ore-styled" />

No extra resource pack: the theme's textures live in the same [render pack](/docs/ui/guides/render-pack) the framework already requires.

## Import

```tsx
import { Button, Card, Header, MenuRow, Checkbox, Toggle, RadioGroup, Radio, ToggleButtonGroup, ToggleButtonItem, Divider, Input, Dropdown, Slider, Form } from '@bedrock-core/ore-styled';
```

## Components

- [**`<Button>`**](./Button.md) — styled button with seven variants (`hero`, `primary`, `secondary`, `contrast`, `danger`, `realm`, `transparent`).
- [**`<Card>`**](./Card.md) — container with the standard panel background, padding, and gap, in six variants.
- [**`<Header>`**](./Header.md) — screen header bar: back button, breadcrumb trail, and close button.
- [**`<MenuRow>`**](./MenuRow.md) — browse-list row: thumbnail, title, subtitle, and trailing chevron.
- [**`<Checkbox>`**](./Checkbox.md) — labeled boolean: a native field on a modal, a press everywhere else.
- [**`<Toggle>`**](./Toggle.md) — the same boolean with the switch faces and the caption on the left.
- [**`<RadioGroup>` / `<Radio>`**](./Radio.md) — single-choice radio set.
- [**`<ToggleButtonGroup>` / `<ToggleButtonItem>`**](./ToggleButton.md) — segmented button group with single selection.
- [**`<Divider>`**](./Divider.md) — horizontal or vertical divider line in three variants.
- [**`<Input>`**](./Input.md) — themed single-line text field, for use inside a `<Form>`.
- [**`<Dropdown>`**](./Dropdown.md) — themed select field with a chevron and a popup, for use inside a `<Form>`.
- [**`<Slider>`**](./Slider.md) — themed numeric slider, for use inside a `<Form>`.

## Form

Atomic modal form — one native `ModalFormData` for the whole screen, all values arriving together on submit. See the [`Form`](./Form/Form.md) page for the full namespace.

- [**`<Form>`**](./Form/Form.md) — the themed root, plus [**`Form.Button`**](./Form/FormButton.md) for its submit and exit actions. The fields themselves are the components above: each asks what it becomes on the screen it is drawn on, so there is no separate themed modal variant.

## Theme

:::caution Pre-1.0
`@bedrock-core/ore-styled` is under active development. Breaking changes can still land until `1.0.0` — pin exact versions and read the release notes before upgrading.
:::

All visual tokens (spacing, font colors, component textures) live in a single `theme` object you can read and reuse. See the [theme](./theme.md) page for the full token map.
