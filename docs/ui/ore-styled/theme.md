---
sidebar_position: 10
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
    button, card, checkbox, divider, radio, toggle, toggleButton,
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
- `textures.background`, `padding`, `gap`.

### `checkbox`
- `size`, `gap`, and a full set of `textures` (unchecked/checked × default/hover/disabled).

### `divider`
- `textures.horizontal.{default,light,dark}` and `textures.vertical.{default,light,dark}`.

### `radio`
- `size`, `gap`, and a full set of `textures` (unselected/selected × default/hover/disabled).

### `toggle`
- `width`, `height`, full `textures` set (off/on × default/hover/disabled).

### `toggleButton`
- `height`, `paddingX`, `textures` (`normal`, `hover`, `pressed`, `disabled`, `disabledPressed`), and `textStyle.{selected,unselected}`.

## Types

```ts
import type { OreTheme, ButtonTextStyle } from '@bedrock-core/ore-styled';
```

- `OreTheme` — the full theme shape, exported under this name to avoid colliding with React/TypeScript's `Theme`.
- `ButtonTextStyle` — `{ font, scale, color, disabledColor }`, the same shape used inside button and toggle-button variants.

## Example: reusing the spacing scale

```tsx
import { theme } from '@bedrock-core/ore-styled';

<Panel padding={theme.tokens.spacing.md} gap={theme.tokens.spacing.sm}>
  <Text>{`${theme.tokens.fontColor.default}Title`}</Text>
  <Text>{`${theme.tokens.fontColor.muted}Subtitle`}</Text>
</Panel>
```
