---
sidebar_position: 4
description: "Select field with every option visible inline (no popup), for use inside a Form."
---
# Select

One choice out of several, with every option visible.

`Select` works on all three hosts and draws differently on each: a native field inside a [`<Form>`](../roots/Form.md), a press per option on a [`<Screen>`](../roots/Screen.md), and a cell per option on a [`<Container>`](../roots/Container.md). [`<Dropdown>`](../fields/Dropdown.md) is the same selection model behind a popup, and only a modal can draw one.

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.team)}>
  <Select name={'team'} defaultValue={'red'}>
    <Option value={'red'} label={'Red'} />
    <Option value={'blue'} label={'Blue'} />
  </Select>
  <Button action={'submit'}>{'Save'}</Button>
</Form>
```

:::caution Result is an index, not a value
Just like [`Dropdown`](../fields/Dropdown.md), `Select` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. Map the index back to your own options array if you need the string.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the selected index appears at `values[name]` in the form's `onSubmit` |
| `defaultValue` | `string` | the first option | Initial selection, matched against a [`Option`](./Option.md)'s `value` |
| `children` | `JSX.Node` | — | The selectable options, authored as [`Option`](./Option.md) elements. Unlike `Dropdown`'s popup rows, each option here is laid out by the normal flex engine — position it with ordinary layout props (`flex`, `gap`, `width`, …) |
| `optionBackground` / `optionHover` / `optionSelected` | `string` | — | Group-level default row textures for idle/hover/selected states. Any `Option` can override its own |
| `bullet` / `bulletSelected` | `string` | — | Unselected/selected bullet glyph texture (e.g. a radio dot). Leave both empty for a segmented, bullet-less look |
| `bulletHover` / `bulletSelectedHover` | `string` | falls back to `bullet` / `bulletSelected` | Bullet glyph shown on hover |
| `bulletWidth` / `bulletHeight` | `number` | `12` | Bullet glyph size (px) |
| `optionFont` / `optionScale` / `optionAlign` | `LabelFont` / `number` / `'left' \| 'center' \| 'right'` | — | Group-level default label styling for option rows. Any `Option` can override its own |

Inherits [control props](../control-props.md).

## Examples

### Radio-style inline select

```tsx
<Select name={'team'} defaultValue={'red'} bullet={'textures/ui/radio_off'} bulletSelected={'textures/ui/radio_on'}>
  <Option value={'red'} label={'Red'} />
  <Option value={'blue'} label={'Blue'} />
  <Option value={'green'} label={'Green'} />
</Select>
```

## Notes

- Prefer `Select` over `Dropdown` when the option count is small and you want everything visible without an extra tap.
- Keep `Option` children order stable across renders — the result is an index-based, like `Dropdown`.
- This is the primitive [`@bedrock-core/ore-styled`](/docs/ore-styled)'s [`Radio`](/docs/ore-styled/Radio) and [`ToggleButtonGroup`](/docs/ore-styled/ToggleButton) are built on — reach for those on a themed screen rather than styling this by hand.

## Limits

On a modal the answer is the chosen option's **index**, not its value — the native dropdown's behavior. Where a press reaches script instead, the value is what comes back. See the [capability table](../../guides/hosts.md#what-each-host-can-carry).
