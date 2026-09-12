---
sidebar_position: 6
description: "Select field with every option visible inline (no popup), for use inside a Form."
---
# Form.InlineSelect

Select field with every option visible inline (no popup), for use inside a [`Form`](./Form.md). Same selection model as [`Form.Dropdown`](./FormDropdown.md) — same underlying native `ModalFormData.dropdown` control — only the rendering differs: options render in-flow instead of behind a popup.

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.team)}>
  <Form.InlineSelect name={'team'} defaultValue={'red'}>
    <Form.Option value={'red'} label={'Red'} />
    <Form.Option value={'blue'} label={'Blue'} />
  </Form.InlineSelect>
  <Form.Button type={'submit'} />
</Form>
```

:::caution Result is an index, not a value
Just like [`Form.Dropdown`](./FormDropdown.md), `Form.InlineSelect` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. Map the index back to your own options array if you need the string.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the selected index appears at `values[name]` in the form's `onSubmit` |
| `defaultValue` | `string` | the first option | Initial selection, matched against a [`Form.Option`](./FormOption.md)'s `value` |
| `children` | `JSX.Node` | — | The selectable options, authored as [`Form.Option`](./FormOption.md) elements. Unlike `Form.Dropdown`'s popup rows, each option here is laid out by the normal flex engine — position it with ordinary layout props (`flex`, `gap`, `width`, …) |
| `optionBackground` / `optionHover` / `optionSelected` | `string` | — | Group-level default row textures for idle/hover/selected states. Any `Form.Option` can override its own |
| `bullet` / `bulletSelected` | `string` | — | Unselected/selected bullet glyph texture (e.g. a radio dot). Leave both empty for a segmented, bullet-less look |
| `bulletHover` / `bulletSelectedHover` | `string` | falls back to `bullet` / `bulletSelected` | Bullet glyph shown on hover |
| `bulletWidth` / `bulletHeight` | `number` | `12` | Bullet glyph size (px) |
| `optionFont` / `optionScale` / `optionAlign` | `LabelFont` / `number` / `'left' \| 'center' \| 'right'` | — | Group-level default label styling for option rows. Any `Form.Option` can override its own |

Inherits [control props](../control-props.md).

## Examples

### Radio-style inline select

```tsx
<Form.InlineSelect name={'team'} defaultValue={'red'} bullet={'textures/ui/radio_off'} bulletSelected={'textures/ui/radio_on'}>
  <Form.Option value={'red'} label={'Red'} />
  <Form.Option value={'blue'} label={'Blue'} />
  <Form.Option value={'green'} label={'Green'} />
</Form.InlineSelect>
```

## Notes

- Prefer `Form.InlineSelect` over `Form.Dropdown` when the option count is small and you want everything visible without an extra tap.
- Keep `Form.Option` children order stable across renders — the result is an index-based, like `Form.Dropdown`.
- This is the primitive that [`@bedrock-core/ore-styled`](/docs/ore-styled/Form)'s `Form.Radio` and `Form.ToggleButton` are built on — for themed screens, reach for those instead of styling this primitive by hand.
