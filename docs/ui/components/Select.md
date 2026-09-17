---
description: "Choices with every option visible inline (no popup): one, or any number with multiple."
---
# Select

Choices out of several, with every option visible: one, or any number with `multiple`.

`Select` works on all three hosts and draws differently on each: a native field inside a [`<Form>`](./Form.md), a press per option on a [`<Screen>`](./Screen.md), and a cell per option on a [`<Container>`](./Container.md). [`<Dropdown>`](./Dropdown.md) is the same selection model behind a popup, and only a modal can draw one.

## Import

```tsx
import { Form, Option, Select } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.team)}>
  <Select name={'team'} defaultValue={'red'}>
    <Option value={'red'} label={'Red'} />
    <Option value={'blue'} label={'Blue'} />
  </Select>
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

:::caution Result is an index, not a value
Just like [`Dropdown`](./Dropdown.md), `Select` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. With `multiple` it reports the **indices** that are on (a `number[]`, in option order, `[]` when none are). Map them back to your own options array if you need the strings.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the selected index, or the indices with `multiple`, appear at `values[name]` in the form's `onSubmit` |
| `multiple` | `boolean` | `false` | Any number of options may be on at once. On a modal each option is a native toggle of its own, all answering under `name` |
| `value` | `string`, or `string[]` with `multiple` | — | The chosen options' values, held by the caller instead of by the control. Only where a press reaches script |
| `onChange` | `(value: string) => void`, or `(values: string[]) => void` with `multiple` | — | Called with the chosen option's `value`, or every chosen value in option order, on the hosts where a press reaches script |
| `defaultValue` | `string`, or `string[]` with `multiple` | the first option, or none with `multiple` | Initial selection, matched against an [`Option`](./Option.md)'s `value` |
| `children` | `JSX.Node` | — | The selectable options, authored as [`Option`](./Option.md) elements. Unlike `Dropdown`'s popup rows, each option here is laid out by the normal flex engine — position it with ordinary layout props (`flex`, `gap`, `width`, …) |
| `optionBackground` / `optionHover` / `optionSelected` | `string` | — | Group-level default row textures for idle/hover/selected states. Any `Option` can override its own |
| `bullet` / `bulletSelected` | `string` | — | Unselected/selected bullet glyph texture (e.g. a radio dot). Leave both empty for a segmented, bullet-less look |
| `bulletHover` / `bulletSelectedHover` | `string` | falls back to `bullet` / `bulletSelected` | Bullet glyph shown on hover |
| `bulletWidth` / `bulletHeight` | `number` | `12` | Bullet glyph size (px) |
| `optionFont` / `optionScale` / `optionAlign` | `TextFont` / `number` / `'left' \| 'center' \| 'right'` | — | Group-level default label styling for option rows. Any `Option` can override its own |
| `optionColor` / `optionColorSelected` | `[number, number, number]` | the label's own; `optionColorSelected` falls back to `optionColor` | Group-level default label colour at rest and while selected, RGB in 0..1. Any `Option` can override its own |
| `optionDropSelected` | `number` | `0` | How far an option's label sits lower while selected, in px |

Inherits [control props](./control-props.md).

## Examples

### Radio-style inline select

```tsx
<Select name={'team'} defaultValue={'red'} bullet={'textures/ui/radio_off'} bulletSelected={'textures/ui/radio_on'}>
  <Option value={'red'} label={'Red'} />
  <Option value={'blue'} label={'Blue'} />
  <Option value={'green'} label={'Green'} />
</Select>
```

### Several at once

```tsx
<Form onSubmit={({ values }) => console.warn(values.notices)}>
  <Select multiple name={'notices'} defaultValue={['join']} optionSelected={'textures/ui/opt_on'} optionBackground={'textures/ui/opt_off'}>
    <Option value={'join'} label={'Join'} />
    <Option value={'leave'} label={'Leave'} />
    <Option value={'buy'} label={'Buy'} />
  </Select>
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

## Notes

- Prefer `Select` over `Dropdown` when the option count is small and you want everything visible without an extra tap.
- Keep `Option` children order stable across renders — the result is an index-based, like `Dropdown`.
- This is the primitive [`@bedrock-core/ore-styled`](/docs/ore-styled)'s [`Radio`](/docs/ore-styled/Radio) and [`ToggleButtons`](/docs/ore-styled/ToggleButtons) are built on — reach for those on a themed screen rather than styling this by hand.

## Limits

On a modal the answer is the chosen option's **index**, not its value — the native dropdown's behavior — and with `multiple` the indices that are on. Where a press reaches script instead, the values are what come back. See the [capability table](../guides/hosts.md#what-each-host-can-carry).
