---
sidebar_position: 1
---
# ore-styled

`@bedrock-core/ore-styled` is a themed component layer built on top of the [`@bedrock-core/ui`](../ui-runtime/components/components.md) primitives. Every component renders with authentic Minecraft textures shipped in the [render pack](../ui-runtime/render-pack.md), so your UI matches the vanilla look out of the box.

## Install

```bash
yarn add @bedrock-core/ore-styled
```

No extra resource pack: the theme's textures live in the same [render pack](../ui-runtime/render-pack.md) the framework already requires.

## Import

```tsx
import { Button, Card, Header, MenuRow, Checkbox, Toggle, RadioGroup, Radio, ToggleButtonGroup, ToggleButtonItem, Divider, Input, Dropdown, Slider, Form } from '@bedrock-core/ore-styled';
```

## Components

- [**`<Button>`**](./Button.md) — styled button with seven variants (`hero`, `primary`, `secondary`, `contrast`, `danger`, `realm`, `transparent`).
- [**`<Card>`**](./Card.md) — container with the standard panel background, padding, and gap, in six variants.
- [**`<Header>`**](./Header.md) — screen header bar: back button, breadcrumb trail, and close button.
- [**`<MenuRow>`**](./MenuRow.md) — browse-list row: thumbnail, title, subtitle, and trailing chevron.
- [**`<Checkbox>`**](./Checkbox.md) — labelled checkbox, controlled or uncontrolled.
- [**`<Toggle>`**](./Toggle.md) — on/off switch.
- [**`<RadioGroup>` / `<Radio>`**](./Radio.md) — single-choice radio set.
- [**`<ToggleButtonGroup>` / `<ToggleButtonItem>`**](./ToggleButton.md) — segmented button group with single selection.
- [**`<Divider>`**](./Divider.md) — horizontal or vertical divider line in three variants.
- [**`<Input>`**](./Input.md) — single-line text field; pressing it opens the native modal text field. **Deprecated**, see [`Form.Input`](./Form/FormInput.md).
- [**`<Dropdown>`**](./Dropdown.md) — select field with a chevron; pressing it opens the native modal dropdown. **Deprecated**, see [`Form.Dropdown`](./Form/FormDropdown.md).
- [**`<Slider>`**](./Slider.md) — field drawn as a track + thumb; pressing it opens the native modal slider. **Deprecated**, see [`Form.Slider`](./Form/FormSlider.md).

## Form

Atomic modal form — one native `ModalFormData` for the whole screen, all values arriving together on submit. See the [`Form`](./Form/Form.md) page for the full namespace.

- [**`<Form>`**](./Form/Form.md) — the root component, plus its themed field members: `Form.Toggle`, `Form.Checkbox`, `Form.Radio`, `Form.ToggleButton`, `Form.Slider`, `Form.Dropdown`, `Form.Input`, `Form.Button`.

## Experimental Components

:::caution
These components are experimental and may change or be removed. They have known limitations in multi-addon worlds — each requires a manually supplied `ItemAuxMap` via `ItemAuxContext`. Read each component's page before use.
:::

```tsx
import { ItemSlot, ItemContainer, EquipmentSlots } from '@bedrock-core/ore-styled';
import { ItemAuxContext, type ItemAuxMap } from '@bedrock-core/ui';
```

- [**`<ItemSlot>`**](./ItemSlot.md) — single inventory slot with item or overlay texture.
- [**`<ItemContainer>`**](./ItemContainer.md) — grid of `ItemSlot`s covering a `Container`'s slots.
- [**`<EquipmentSlots>`**](./EquipmentSlots.md) — helmet → boots + offhand column with silhouette overlays.

## Theme

All visual tokens (spacing, font colors, component textures) live in a single `theme` object you can read and reuse. See the [theme](./theme.md) page for the full token map.
