---
sidebar_position: 16
---
# Form.InlineSelect

Select field with every option visible inline (no popup), for use inside a [`Form`](./Form.md). Same selection model as [`Form.Dropdown`](./FormDropdown.md) — same underlying native `ModalFormData.dropdown` control — only the rendering differs: options render in-flow instead of behind a popup.

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.log(v.team)}>
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

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the selected index appears at `values[name]` in the form's `onSubmit`.

#### `defaultValue`
- Type: `string`
- Default: the first option
- Description: Initial selection, matched against a [`Form.Option`](./FormOption.md)'s `value`.

#### `children`
- Type: `JSX.Node`
- Description: The selectable options, authored as [`Form.Option`](./FormOption.md) elements. Unlike `Form.Dropdown`'s popup rows, each option here is laid out by the normal flex engine — position it with ordinary layout props (`flex`, `gap`, `width`, …).

#### `optionBackground` / `optionHover` / `optionSelected`
- Type: `string`
- Description: Group-level default row textures for idle/hover/selected states. Any `Form.Option` can override its own.

#### `bullet` / `bulletSelected`
- Type: `string`
- Description: Unselected/selected bullet glyph texture (e.g. a radio dot). Leave both empty for a segmented, bullet-less look.

#### `bulletHover` / `bulletSelectedHover`
- Type: `string`
- Default: falls back to `bullet` / `bulletSelected`
- Description: Bullet glyph shown on hover.

#### `bulletWidth` / `bulletHeight`
- Type: `number`
- Default: `12`
- Description: Bullet glyph size (px).

#### `optionFont` / `optionScale` / `optionAlign`
- Type: `LabelFont` / `number` / `'left' | 'center' | 'right'`
- Description: Group-level default label styling for option rows. Any `Form.Option` can override its own.

### Control Props

`Form.InlineSelect` inherits all standard [control props](./control-props.md).

## Examples

### Radio-style inline select

```tsx
<Form.InlineSelect name={'team'} defaultValue={'red'} bullet={'textures/ui/radio_off'} bulletSelected={'textures/ui/radio_on'}>
  <Form.Option value={'red'} label={'Red'} />
  <Form.Option value={'blue'} label={'Blue'} />
  <Form.Option value={'green'} label={'Green'} />
</Form.InlineSelect>
```

## Best Practices

- Prefer `Form.InlineSelect` over `Form.Dropdown` when the option count is small and you want everything visible without an extra tap.
- Keep `Form.Option` children order stable across renders — the result is an index-based, like `Form.Dropdown`.
- This is the primitive that [`@bedrock-core/ore-styled`](../../ore-styled/Form.md)'s `Form.Radio` and `Form.ToggleButton` are built on — for themed screens, reach for those instead of styling this primitive by hand.
