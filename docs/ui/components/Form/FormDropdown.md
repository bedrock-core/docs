---
sidebar_position: 5
description: "Select field with a popup, for use inside a Form."
---
# Form.Dropdown

Select field with a popup, for use inside a [`Form`](./Form.md). Pressing it opens a scrollable list of [`Form.Option`](./FormOption.md) children to choose from.

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.log(v.mode)}>
  <Form.Dropdown name={'mode'} defaultValue={'Normal'}>
    <Form.Option value={'Easy'} label={'Easy'} />
    <Form.Option value={'Normal'} label={'Normal'} />
    <Form.Option value={'Hard'} label={'Hard'} />
  </Form.Dropdown>
  <Form.Button type={'submit'} />
</Form>
```

:::caution Result is an index, not a value
`Form.Dropdown` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string — this is the native modal dropdown's behavior. If you need the string back, map the index into your own options array yourself. This is different from the legacy [`Dropdown`](../deprecated/Dropdown.md), which resolves the index back to a value string for you.
:::

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` | — | Result key — the selected index appears at `values[name]` in the form's `onSubmit` |
| `defaultValue` | `string` | the first option | Initial selection, matched against a [`Form.Option`](./FormOption.md)'s `value` |
| `children` | `JSX.Node` | — | The selectable options, authored as [`Form.Option`](./FormOption.md) elements. Popup rows flow at a fixed row height, so an option's own layout props are ignored here — only its `value`/`label`/style are read |
| `popupBackground` | `string` | the unstyled placeholder texture | Background texture for the popup surface behind the option list |
| `optionBackground` / `optionHover` / `optionSelected` | `string` | — | Group-level default row textures for idle/hover/selected states. Any `Form.Option` can override its own |
| `optionFont` | `LabelFont` / `number` / `'left' \| 'center' \| 'right'` | `'mojangles'` / `1.0` / `'left'` | Group-level default label styling for option rows. Any `Form.Option` can override its own |
| `currentColor` | `string` | `''` | Color code prefix (e.g. `'§0'`) applied to the closed-box current-value text |
| `currentFont` / `currentScale` | `LabelFont` / `number` | `'mojangles'` / `1.0` | Font and scale for the closed-box current-value label |
| `currentInsetX` / `currentInsetY` | `number` | `8` / vertically centered | Position offset (px) of the current-value label from the closed box's left-middle frame |

The closed box uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](../Button.md).

### Control props

`Form.Dropdown` inherits all standard [control props](../control-props.md).

## Examples

### Basic dropdown

```tsx
<Form.Dropdown name={'mode'} defaultValue={'Normal'}>
  <Form.Option value={'Easy'} label={'Easy'} />
  <Form.Option value={'Normal'} label={'Normal'} />
  <Form.Option value={'Hard'} label={'Hard'} />
</Form.Dropdown>
```

### Per-option alignment override

The group sets a default alignment for all options; any option can override its own.

```tsx
<Form.Dropdown name={'m_dd1'} defaultValue={'Two'} optionAlign={'center'}>
  <Form.Option value={'One'} label={'One'} />
  <Form.Option value={'Two'} label={'Two'} />
  <Form.Option value={'Three'} label={'Three'} align={'right'} />
</Form.Dropdown>
```

### Reading the result

```tsx
const options = ['Easy', 'Normal', 'Hard'];

<Form onSubmit={v => {
  const selected = options[v.mode as number];
  console.log(selected);
}}>
  <Form.Dropdown name={'mode'} defaultValue={'Normal'}>
    {options.map(o => <Form.Option key={o} value={o} label={o} />)}
  </Form.Dropdown>
  <Form.Button type={'submit'} />
</Form>
```

## Notes

- Keep `Form.Option` children order stable across renders — the result is an index, so reordering shifts what a saved index means.
- Read `values[name]` as an index and map it back to your own array if you need the string; don't assume it's the `value` you passed in.
- Prefer [`Form.InlineSelect`](./FormInlineSelect.md) instead when you want every option visible without an extra tap (e.g. a short radio-style choice).
- For themed screens, prefer [`@bedrock-core/ore-styled`](/docs/ore-styled/Form/FormDropdown)'s `Form.Dropdown` over styling this primitive by hand.
