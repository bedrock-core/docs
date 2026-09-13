---
sidebar_position: 5
description: "One selectable entry, used as a child of Dropdown or Select."
---
# Option

One selectable entry, written as a child of [`<Select>`](./Select.md) or [`<Dropdown>`](../fields/Dropdown.md).

It follows its parent onto whichever host that parent can be drawn on — a native field's row on a modal, a press on a screen, a cell on a container.

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Dropdown name={'mode'} defaultValue={'Normal'}>
  <Option value={'Easy'} label={'Easy'} />
  <Option value={'Normal'} label={'Normal'} />
  <Option value={'Hard'} label={'Hard'} />
</Dropdown>
```

## How it works

`Option` is layout-only — it is not itself a native control, and the whole group submits as its parent's single value. Under `Select` each option is genuinely flex-laid-out like any other component; under `Dropdown` the popup rows flow at a fixed height, so an option's own layout props are ignored there.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value`<Req /> | `string` | — | The option's stable identifier — what a parent's `defaultValue` is matched against. The parent reports the SELECTED option's index on submit, not this value |
| `label`<Req /> | `string` | — | Option text rendered in the row |
| `font` / `scale` / `align` | `LabelFont` / `number` / `'left' \| 'center' \| 'right'` | falls back to the parent's `optionFont` / `optionScale` / `optionAlign` | Per-option label style override |
| `background` / `backgroundHover` / `backgroundSelected` | `string` | falls back to the parent's `optionBackground` / `optionHover` / `optionSelected` | Per-option row background override |
| `bullet` / `bulletSelected` / `bulletHover` / `bulletSelectedHover` | `string` | falls back to the parent's matching group prop | Per-option bullet glyph override (only meaningful under `Select`) |
| `bulletWidth` / `bulletHeight` | `number` | falls back to the parent's `bulletWidth` / `bulletHeight` | Per-option bullet size override |

Inherits [control props](../control-props.md), which lay out real flex rows under `Select`. Under `Dropdown`, layout props are accepted but ignored — popup rows flow at a fixed height.

## Examples

### Per-option override

```tsx
<Dropdown name={'m_dd1'} defaultValue={'Two'} optionAlign={'center'}>
  <Option value={'One'} label={'One'} />
  <Option value={'Two'} label={'Two'} />
  {/* Overrides the group's center alignment for just this row. */}
  <Option value={'Three'} label={'Three'} align={'right'} />
</Dropdown>
```

## Notes

- Keep `value` unique within a group — it's what `defaultValue` matches against.
- A per-option override always wins over the group-level style prop of the same name.
- Generate options from a data array (`options.map(o => <Option key={o} value={o} label={o} />)`) rather than hand-writing each one, so the list stays easy to keep in sync with your options data.
