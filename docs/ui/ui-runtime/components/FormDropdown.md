---
sidebar_position: 14
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
`Form.Dropdown` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string — this is the native modal dropdown's behavior. If you need the string back, map the index into your own options array yourself. This is different from the legacy [`Dropdown`](./Dropdown.md), which resolves the index back to a value string for you.
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
- Description: The selectable options, authored as [`Form.Option`](./FormOption.md) elements. Popup rows flow at a fixed row height, so an option's own layout props are ignored here — only its `value`/`label`/style are read.

#### `popupBackground`
- Type: `string`
- Default: the unstyled placeholder texture
- Description: Background texture for the popup surface behind the option list.

#### `optionBackground` / `optionHover` / `optionSelected`
- Type: `string`
- Description: Group-level default row textures for idle/hover/selected states. Any `Form.Option` can override its own.

#### `optionFont` / `optionScale` / `optionAlign`
- Type: `LabelFont` / `number` / `'left' | 'center' | 'right'`
- Default: `'mojangles'` / `1.0` / `'left'`
- Description: Group-level default label styling for option rows. Any `Form.Option` can override its own.

#### `currentColor`
- Type: `string`
- Default: `''`
- Description: Color code prefix (e.g. `'§0'`) applied to the closed-box current-value text.

#### `currentFont` / `currentScale`
- Type: `LabelFont` / `number`
- Default: `'mojangles'` / `1.0`
- Description: Font and scale for the closed-box current-value label.

#### `currentInsetX` / `currentInsetY`
- Type: `number`
- Default: `8` / vertically centered
- Description: Position offset (px) of the current-value label from the closed box's left-middle frame.

The closed box uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](./Button.md).

### Control Props

`Form.Dropdown` inherits all standard [control props](./control-props.md).

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

## Best Practices

- Keep `Form.Option` children order stable across renders — the result is an index, so reordering shifts what a saved index means.
- Read `values[name]` as an index and map it back to your own array if you need the string; don't assume it's the `value` you passed in.
- Prefer [`Form.InlineSelect`](./FormInlineSelect.md) instead when you want every option visible without an extra tap (e.g. a short radio-style choice).
- For themed screens, prefer [`@bedrock-core/ore-styled`](../../ore-styled/FormDropdown.md)'s `Form.Dropdown` over styling this primitive by hand.
