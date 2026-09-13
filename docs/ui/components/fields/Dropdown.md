---
sidebar_position: 3
description: "Select field with a popup, for use inside a Form."
---
# Dropdown

Select field with a popup, for use inside a [`Form`](../roots/Form.md). Pressing it opens a scrollable list of [`Option`](../controls/Option.md) children to choose from.

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.mode)}>
  <Dropdown name={'mode'} defaultValue={'Normal'}>
    <Option value={'Easy'} label={'Easy'} />
    <Option value={'Normal'} label={'Normal'} />
    <Option value={'Hard'} label={'Hard'} />
  </Dropdown>
  <Button action={'submit'}>{'Save'}</Button>
</Form>
```

:::caution Result is an index, not a value
`Dropdown` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string — this is the native modal dropdown's behavior. If you need the string back, map the index into your own options array yourself.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the selected index appears at `values[name]` in the form's `onSubmit` |
| `defaultValue` | `string` | the first option | Initial selection, matched against a [`Option`](../controls/Option.md)'s `value` |
| `children` | `JSX.Node` | — | The selectable options, authored as [`Option`](../controls/Option.md) elements. Popup rows flow at a fixed row height, so an option's own layout props are ignored here — only its `value`/`label`/style are read |
| `popupBackground` | `string` | the unstyled placeholder texture | Background texture for the popup surface behind the option list |
| `optionBackground` / `optionHover` / `optionSelected` | `string` | — | Group-level default row textures for idle/hover/selected states. Any `Option` can override its own |
| `optionFont` / `optionScale` / `optionAlign` | `LabelFont` / `number` / `'left' \| 'center' \| 'right'` | `'mojangles'` / `1.0` / `'left'` | Group-level default label styling for option rows. Any `Option` can override its own |
| `currentColor` | `string` | `''` | Color code prefix (e.g. `'§0'`) applied to the closed-box current-value text |
| `currentFont` / `currentScale` | `LabelFont` / `number` | `'mojangles'` / `1.0` | Font and scale for the closed-box current-value label |
| `currentInsetX` / `currentInsetY` | `number` | `8` / vertically centered | Position offset (px) of the current-value label from the closed box's left-middle frame |

The closed box uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](../controls/Button.md).

Inherits [control props](../control-props.md).

## Examples

### Basic dropdown

```tsx
<Dropdown name={'mode'} defaultValue={'Normal'}>
  <Option value={'Easy'} label={'Easy'} />
  <Option value={'Normal'} label={'Normal'} />
  <Option value={'Hard'} label={'Hard'} />
</Dropdown>
```

### Per-option alignment override

The group sets a default alignment for all options; any option can override its own.

```tsx
<Dropdown name={'m_dd1'} defaultValue={'Two'} optionAlign={'center'}>
  <Option value={'One'} label={'One'} />
  <Option value={'Two'} label={'Two'} />
  <Option value={'Three'} label={'Three'} align={'right'} />
</Dropdown>
```

### Reading the result

```tsx
const options = ['Easy', 'Normal', 'Hard'];

<Form onSubmit={v => {
  const selected = options[v.mode as number];
  console.warn(selected);
}}>
  <Dropdown name={'mode'} defaultValue={'Normal'}>
    {options.map(o => <Option key={o} value={o} label={o} />)}
  </Dropdown>
  <Button action={'submit'}>{'Save'}</Button>
</Form>
```

## Notes

- Keep `Option` children order stable across renders — the result is an index, so reordering shifts what a saved index means.
- Read `values[name]` as an index and map it back to your own array if you need the string; don't assume it's the `value` you passed in.
- Prefer [`Select`](../controls/Select.md) instead when you want every option visible without an extra tap (e.g. a short radio-style choice).
- For themed screens, prefer [`@bedrock-core/ore-styled`](/docs/ore-styled/Dropdown)'s `Dropdown` over styling this primitive by hand.

## Limits

Modal-only. The engine draws no popup on an action form or a container screen, so writing one there is a build error naming the fix rather than a control drawn inert. [`<Toggle>`](../controls/Toggle.md) and [`<Select>`](../controls/Select.md) are the controls that serve all three hosts.
