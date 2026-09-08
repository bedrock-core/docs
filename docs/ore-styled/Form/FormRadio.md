---
sidebar_position: 4
description: "Themed single-select radio group for use inside an ore-styled Form."
---
# Form.Radio

Themed single-select radio group for use inside an ore-styled [`Form`](./Form.md). Renders as a bullet + label per option, stacked vertically, matching the look of the ActionForm [`Radio`](../Radio.md).

![FormRadio](/img/ore-styled/FormRadio.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.Radio
  label={'Team'}
  name={'team'}
  options={[
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
  ]}
  defaultValue={'blue'}
/>
```

`Form.Radio` is a single composed component — not a group + item pair like the non-`Form` [`RadioGroup` / `Radio`](../Radio.md). It builds its own options from the `options` array and does not accept `children`. It draws on the same theme tokens as the non-`Form` [`Radio`](../Radio.md) (`theme.components.radio`).

:::caution Result is an index, not a value
`Form.Radio` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. Map the index back into your own `options` array if you need the string.
:::

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the selected index appears at `values[name]` in the form's `onSubmit` |
| `options`<Req /> | `{ value: string; label: string }[]` | — | The options, top to bottom |
| `defaultValue` | `string` | the first option | Initial selected value, matched to its index |
| `enabled` | `boolean` | `true` | Whether the group is interactive |
| `label` | `string` | — | Caption rendered above the group |
| `rowHeight` | `number` | `17` | Height (px) of each option row |
| `gap` | `Spacing` | `2` | Vertical gap (px) between option **rows** — not the gap between the `label` and the group |

### Control props

`Form.Radio` inherits the layout and visibility [control props](/docs/ui/components/control-props) — sizing, spacing, flex, `visible`, `enabled` — plus texture props: `bullet`, `bulletSelected`, `bulletHover` and `bulletSelectedHover` for the glyph (sized by `bulletWidth` / `bulletHeight`), `optionBackground` / `optionHover` / `optionSelected` for the row behind it, `background` for the group container, and `optionFont` / `optionScale` / `optionAlign` for the option labels. The theme fills in anything you leave out. The row faces are themed empty — the bullet carries the visual — so set them if you want the rows themselves to paint.

## Examples

### Side-by-side with Form.ToggleButton

```tsx
<Panel flexDirection={'row'} gap={8} alignItems={'flex-start'}>
  <Form.Radio
    label={'Team'}
    name={'team'}
    options={[{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }, { value: 'green', label: 'Green' }]}
    defaultValue={'blue'}
    flex={1}
  />
  <Form.ToggleButton
    label={'View'}
    name={'view'}
    options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'compact', label: 'Compact' }]}
    defaultValue={'grid'}
    flex={1}
  />
</Panel>
```

## Notes

- Keep `options` order stable across renders — the result is index-based, so reordering shifts what a saved index means.
- Use `flex`/`width` to size the group within a row, as in the side-by-side example above.
- Prefer [`Form.ToggleButton`](./FormToggleButton.md) instead when the options read better as short segmented labels than a vertical list.
