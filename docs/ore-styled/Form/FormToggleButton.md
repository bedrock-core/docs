---
sidebar_position: 5
description: "Themed single-select segmented group for use inside an ore-styled Form."
---
# Form.ToggleButton

Themed single-select segmented group for use inside an ore-styled [`Form`](./Form.md). Renders as side-by-side segments, matching the look of the ActionForm [`ToggleButtonGroup`](../ToggleButton.md).

![FormToggleButton](/img/ore-styled/FormToggleButton.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.ToggleButton
  label={'View'}
  name={'view'}
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'compact', label: 'Compact' },
  ]}
  defaultValue={'grid'}
/>
```

Like [`Form.Radio`](./FormRadio.md), `Form.ToggleButton` is a single composed component — not a group + item pair like the non-`Form` [`ToggleButtonGroup` / `ToggleButtonItem`](../ToggleButton.md). It builds its own segments from the `options` array and does not accept `children`. It draws on the same theme tokens as the non-`Form` [`ToggleButtonGroup`](../ToggleButton.md) (`theme.components.toggleButton`), and the selected segment uses the theme's pressed face.

:::caution Result is an index, not a value
`Form.ToggleButton` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. Map the index back into your own `options` array if you need the string.
:::

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the selected index appears at `values[name]` in the form's `onSubmit` |
| `options`<Req /> | `{ value: string; label: string }[]` | — | The segments, left to right |
| `defaultValue` | `string` | the first option | Initial selected value, matched to its index |
| `enabled` | `boolean` | `true` | Whether the group is interactive |
| `label` | `string` | — | Caption rendered above the group |
| `segmentHeight` | `number` | `theme.components.toggleButton.height` | Height (px) of each segment |
| `gap` | `Spacing` | `-1` | Gap (px) between **segments** — not the gap between the `label` and the group. The negative default overlaps adjacent borders by 1px so they read as one line |

### Control props

`Form.ToggleButton` inherits the layout and visibility [control props](/docs/ui/components/control-props) — sizing, spacing, flex, `visible`, `enabled` — plus texture props: `optionBackground` / `optionHover` / `optionSelected` for the segment faces, `background` for the group container, and `optionFont` / `optionScale` / `optionAlign` for the segment labels. The theme fills in anything you leave out. Segments carry no bullet glyph by default, but the bullet props (`bullet`, `bulletSelected`, `bulletHover`, `bulletSelectedHover`, `bulletWidth`, `bulletHeight`) are accepted — pass one and that segment gets a glyph.

## Notes

- Keep to 3–5 options, same guidance as the non-`Form` [`ToggleButtonGroup`](../ToggleButton.md) — segments get cramped with more.
- Keep `options` order stable across renders — the result is index-based.
- Choose between this and [`Form.Radio`](./FormRadio.md) by label length and hit-target size: short labels read well as segments; longer labels read better as a vertical radio list.
