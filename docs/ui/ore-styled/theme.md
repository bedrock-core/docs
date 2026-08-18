---
sidebar_position: 16
---
# Theme

`ore-styled` ships a single `theme` object that holds every visual token it uses — spacing scale, font colors, and per-component texture paths plus sizing. Read from it when you want a custom screen to match the rest of the system.

## Import

```tsx
import { theme } from '@bedrock-core/ore-styled';
```

## Top-level shape

```ts
theme = {
  tokens: {
    spacing: { xs, sm, md, lg, xl },
    fontColor: { default, muted, danger, success, disabled },
  },
  components: {
    button, card, checkbox, divider, header, menuRow, radio, tabs, toggle,
    toggleButton, itemSlot, field, dropdown, form, slider,
  },
}
```

## Tokens

### `tokens.spacing`

| Key  | Value |
|------|-------|
| `xs` | `2`   |
| `sm` | `4`   |
| `md` | `8`   |
| `lg` | `12`  |
| `xl` | `16`  |

Use these when setting `gap`, `padding`, or `margin` on custom panels so your layouts breathe at the same rhythm as the built-in components.

### `tokens.fontColor`

| Key        | Value (Minecraft format code) |
|------------|-------------------------------|
| `default`  | `§f` (white)                  |
| `muted`    | `§7` (light gray)             |
| `danger`   | `§c` (red)                    |
| `success`  | `§a` (green)                  |
| `disabled` | `§8` (dark gray)              |

Prefix raw `Text` children with these for color consistency:

```tsx
<Text>{`${theme.tokens.fontColor.muted}Subtitle copy`}</Text>
```

## Components

Each entry under `theme.components` holds the textures, sizing, padding, and (where applicable) text styling for a single ore-styled component. The component reads from here directly, but you can read the same values to extend or reuse them.

### `button`
- `padding: { x, y }`
- `variants`: one entry per [`Button`](./Button.md) variant. Each variant has `textures` (`default`, `hover`, `pressed`, `disabled`) and a `textStyle` (`font`, `scale`, `color`, `disabledColor`).

### `card`
- `padding`, `gap`
- `variants`: one entry per [`Card`](./Card.md) variant, each holding `textures.background`.

### `checkbox`
- `size`, `gap`, and a full set of `textures` (unchecked/checked × default/hover/disabled).

### `divider`
- `textures.horizontal.{default,light,dark}` and `textures.vertical.{default,light,dark}`.

### `header`
- `padding`, `gap`, `iconSize` — edge of the square back/close controls (px).
- `textStyle`: `font`, `scale`, `color`, and `separator` — the color code for the `>` drawn between breadcrumb segments.
- `textures`: `background`, plus `back`/`backHover`/`backPressed` and `close`/`closeHover`/`closePressed` — used by [`Header`](./Header.md).

### `menuRow`
- `padding`, `gap`, `iconSize` — edge of the row's leading thumbnail (px).
- `textStyle`: `font`, `scale`, and color codes for `color`/`disabledColor` (title) and `muted`/`mutedDisabled` (subtitle).
- `textures`: `background`/`backgroundHover`/`backgroundPressed`/`backgroundSelected` — the dropdown-option face reused by [`MenuRow`](./MenuRow.md).

### `radio`
- `size`, `gap`, and a full set of `textures` (unselected/selected × default/hover/disabled).

[`Form.Radio`](./Form/FormRadio.md) reuses this same section — there's no separate Form-specific radio theme.

### `tabs`
- `height`, `padding.{x,y}`, `textures` (`active`, `inactive`, `inactiveHover`, `bar`).

Tokens only — `ore-styled` exports no `Tabs` component yet. Read them if you're building your own tabbed strip and want it to match the rest of the set.

### `toggle`
- `width`, `height`, full `textures` set (off/on × default/hover/disabled).

### `toggleButton`
- `height`, `paddingX`, `textures` (`normal`, `hover`, `pressed`, `disabled`, `disabledPressed`), and `textStyle.{selected,unselected}`.

[`Form.ToggleButton`](./Form/FormToggleButton.md) reuses this same section — there's no separate Form-specific toggle-button theme.

### `itemSlot`
- `size`, and `textures`: `slot`/`slotHover`/`slotDisabled` for a single [`ItemSlot`](./ItemSlot.md), plus `equipment.{helmet,chestplate,leggings,boots,shield}` — the empty-slot silhouette textures used by [`EquipmentSlots`](./EquipmentSlots.md).

### `field`
- `padding: { top, bottom, x }`, `gap`.
- `textStyle`: `font`, `scale`, and color codes for `value`/`placeholder`/`disabled` text.
- `textures.{background,backgroundHover,backgroundDisabled}` — the [`Input`](./Input.md) / [`Form.Input`](./Form/FormInput.md) field box.

### `dropdown`
- `padding: { top, bottom, x }`, `arrow: { width, height }`.
- `textStyle`: `font`, `scale`, and color codes for `value`/`disabled` text.
- `textures`: `background`/`backgroundHover`/`backgroundDisabled` (closed box), `arrow`/`arrowDisabled`, and `popup`/`option`/`optionHover`/`optionSelected` — used by [`Dropdown`](./Dropdown.md) / [`Form.Dropdown`](./Form/FormDropdown.md).

### `form`
- `labelGap` — vertical gap (px) between a field's label and its control.
- `labelStyle`: `font`, `scale`, `color`, `disabledColor` — the caption style every [`Form.*`](./Form/Form.md) field composes its `label` with.

### `slider`
- `height`, `trackHeight`, `thumb: { width, height }`.
- `textStyle`: `font`, `scale`, and color codes for `value`/`disabled` text.
- `textures`: `track`/`trackDisabled`, `progress`/`progressDisabled`, `thumb`/`thumbHover`/`thumbDisabled` — used by [`Slider`](./Slider.md) / [`Form.Slider`](./Form/FormSlider.md).

## Types

```ts
import type { OreTheme, ButtonTextStyle } from '@bedrock-core/ore-styled';
```

- `OreTheme` — the full theme shape.
- `ButtonTextStyle` — `{ font, scale, color, disabledColor }`, the same shape used inside button and toggle-button variants.

## Example: reusing the spacing scale

```tsx
import { theme } from '@bedrock-core/ore-styled';

<Panel padding={theme.tokens.spacing.md} gap={theme.tokens.spacing.sm}>
  <Text>{`${theme.tokens.fontColor.default}Title`}</Text>
  <Text>{`${theme.tokens.fontColor.muted}Subtitle`}</Text>
</Panel>
```
