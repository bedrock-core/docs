---
sidebar_position: 16
---
# Form.Option

One selectable entry, used as a child of [`Form.Dropdown`](./FormDropdown.md) or [`Form.InlineSelect`](./FormInlineSelect.md).

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form.Dropdown name={'mode'} defaultValue={'Normal'}>
  <Form.Option value={'Easy'} label={'Easy'} />
  <Form.Option value={'Normal'} label={'Normal'} />
  <Form.Option value={'Hard'} label={'Hard'} />
</Form.Dropdown>
```

## How it works

`Form.Option` is layout-only — it is not itself a native control. Its parent (`Form.Dropdown` or `Form.InlineSelect`) reads each option's data and (for `Form.InlineSelect`) its computed layout geometry, and packs them into the parent's single native `dropdown()` call. Under `Form.InlineSelect` each option is genuinely flex-laid-out like any other component; under `Form.Dropdown` the popup rows flow at a fixed height, so an option's own layout props are ignored there.

## Props

### Component-Specific Props

#### `value` (required)
- Type: `string`
- Description: The option's stable identifier — what a parent's `defaultValue` is matched against. The parent reports the SELECTED option's index on submit, not this value.

#### `label` (required)
- Type: `string`
- Description: Option text rendered in the row.

#### `font` / `scale` / `align`
- Type: `LabelFont` / `number` / `'left' | 'center' | 'right'`
- Default: falls back to the parent's `optionFont` / `optionScale` / `optionAlign`
- Description: Per-option label style override.

#### `background` / `backgroundHover` / `backgroundSelected`
- Type: `string`
- Default: falls back to the parent's `optionBackground` / `optionHover` / `optionSelected`
- Description: Per-option row background override.

#### `bullet` / `bulletSelected` / `bulletHover` / `bulletSelectedHover`
- Type: `string`
- Default: falls back to the parent's matching group prop
- Description: Per-option bullet glyph override (only meaningful under `Form.InlineSelect`).

#### `bulletWidth` / `bulletHeight`
- Type: `number`
- Default: falls back to the parent's `bulletWidth` / `bulletHeight`
- Description: Per-option bullet size override.

### Control Props

Under `Form.InlineSelect`, `Form.Option` inherits all standard [control props](./control-props.md) for real flex layout. Under `Form.Dropdown`, layout props are accepted but ignored — popup rows flow at a fixed height.

## Examples

### Per-option override

```tsx
<Form.Dropdown name={'m_dd1'} defaultValue={'Two'} optionAlign={'center'}>
  <Form.Option value={'One'} label={'One'} />
  <Form.Option value={'Two'} label={'Two'} />
  {/* Overrides the group's center alignment for just this row. */}
  <Form.Option value={'Three'} label={'Three'} align={'right'} />
</Form.Dropdown>
```

## Best Practices

- Keep `value` unique within a group — it's what `defaultValue` matches against.
- A per-option override always wins over the group-level style prop of the same name.
- Generate options from a data array (`options.map(o => <Form.Option key={o} value={o} label={o} />)`) rather than hand-writing each one, so the list stays easy to keep in sync with your options data.
