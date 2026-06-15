---
sidebar_position: 1
---
# ore-styled

`@bedrock-core/ore-styled` is a themed component layer built on top of the [`@bedrock-core/ui`](../ui-runtime/components/components.md) primitives. Every component renders with authentic Minecraft textures shipped through the `@bedrock-core/ore-styled` resource pack, so your UI matches the vanilla look out of the box.

## Install

```bash
yarn add @bedrock-core/ore-styled
```

You also need the matching `@bedrock-core/ore-styled` resource pack installed in your project — it provides the textures referenced by the theme.

## Import

```tsx
import { Button, Card, Checkbox, Toggle, RadioGroup, Radio, ToggleButtonGroup, ToggleButtonItem, Divider, Input, Dropdown, Slider } from '@bedrock-core/ore-styled';
```

## Components

- [**`<Button>`**](./Button.md) — styled button with six variants (`hero`, `primary`, `secondary`, `contrast`, `danger`, `realm`).
- [**`<Card>`**](./Card.md) — container with the standard panel background, padding, and gap.
- [**`<Checkbox>`**](./Checkbox.md) — labelled checkbox, controlled or uncontrolled.
- [**`<Toggle>`**](./Toggle.md) — on/off switch.
- [**`<RadioGroup>` / `<Radio>`**](./Radio.md) — single-choice radio set.
- [**`<ToggleButtonGroup>` / `<ToggleButtonItem>`**](./ToggleButton.md) — segmented button group with single selection.
- [**`<Divider>`**](./Divider.md) — horizontal or vertical divider line in three variants.
- [**`<Input>`**](./Input.md) — single-line text field; pressing it opens the native modal text field.
- [**`<Dropdown>`**](./Dropdown.md) — select field with a chevron; pressing it opens the native modal dropdown.
- [**`<Slider>`**](./Slider.md) — field drawn as a track + thumb; pressing it opens the native modal slider.

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
