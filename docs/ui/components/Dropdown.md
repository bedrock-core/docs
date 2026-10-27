---
description: "Popup selection with submitted modal indexes or live Ore option values."
---
# Dropdown

Select field with a popup inside a [`Form`](./Form.md) or [`Experimental_OreUI`](./Experimental_OreUI.md) screen. Pressing it opens a scrollable list of [`Option`](./Option.md) children.

## Import

```tsx
import { Dropdown, Form, Option } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.mode)}>
  <Dropdown name={'mode'} defaultValue={'Normal'}>
    <Option value={'Easy'} label={'Easy'} />
    <Option value={'Normal'} label={'Normal'} />
    <Option value={'Hard'} label={'Hard'} />
  </Dropdown>
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

:::caution Modal and live results
Inside `Form`, `Dropdown` reports the selected option's **index** at `values[name]` on submit. Inside `Experimental_OreUI`, `onChange` receives the selected option's **string value**.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Required result key inside `Form`; optional on an Ore screen |
| `value` | `string` | internal state | Controlled option value on an Ore screen |
| `onChange` | `(value: string, event: UiEvent) => void \| Promise<void>` | — | Receives the selected Ore option value and the owning player's event |
| `defaultValue` | `string` | the first option | Initial selection, matched against a [`Option`](./Option.md)'s `value` |
| `children` | `JSX.Node` | — | The selectable options, authored as [`Option`](./Option.md) elements. Popup rows flow at a fixed row height, so an option's own layout props are ignored here — only its `value`/`label`/style are read |
| `popupBackground` | `string` | the unstyled placeholder texture | Background texture for the popup surface behind the option list |
| `optionBackground` / `optionHover` / `optionSelected` | `string` | — | Group-level default row textures for idle/hover/selected states. Any `Option` can override its own |
| `optionFont` / `optionScale` / `optionAlign` | `TextFont` / `number` / `'left' \| 'center' \| 'right'` | `'mojangles'` / `1.0` / `'left'` | Group-level default label styling for option rows. Any `Option` can override its own |
| `currentColor` | `string` | `''` | Color code prefix (e.g. `'§0'`) applied to the closed-box current-value text |
| `currentFont` / `currentScale` | `TextFont` / `number` | `'mojangles'` / `1.0` | Font and scale for the closed-box current-value label |
| `currentInsetX` / `currentInsetY` | `number` | `8` / vertically centered | Position offset (px) of the current-value label from the closed box's left-middle frame |

The closed box uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](./Button.md).

Inherits [control props](./control-props.md).

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
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

## Notes

- Inside `Form`, keep `Option` children order stable across renders; the submitted result is an index.
- Read `Form`'s `values[name]` as an index and map it back to your own array when you need the option value. Ore's live `onChange` receives the option value directly.
- Prefer [`Select`](./Select.md) instead when you want every option visible without an extra tap (e.g. a short radio-style choice).
- For themed screens, prefer [`@bedrock-core/ore-styled`](/docs/ore-styled/Dropdown)'s `Dropdown` over styling this primitive by hand.

## Limits

Supported inside `Form` and `Experimental_OreUI`. Action forms and container screens refuse dropdown fields at build time. Keep option values and the compiled option structure stable on an Ore screen.
