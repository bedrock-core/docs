---
sidebar_position: 7
description: "Themed select field with a chevron, for use inside an ore-styled Form."
---
# Form.Dropdown

Themed select field with a chevron, for use inside an ore-styled [`Form`](./Form.md). Pressing it opens a themed popup listing the fixed set of options.

![FormDropdown](/img/ore-styled/FormDropdown.png)
![FormDropdownPopup](/img/ore-styled/FormDropdownPopup.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.Dropdown
  label={'Mode'}
  name={'mode'}
  options={['Easy', 'Normal', 'Hard']}
  defaultValue={'Normal'}
/>
```

Wraps the runtime [`Form.Dropdown`](/docs/ui/components/Form/FormDropdown) primitive with the [theme](../theme.md)'s textures. This layer takes `options: string[]` rather than the primitive's `Form.Option` children, and does not accept `children`.

:::caution Result is an index, not a value
`Form.Dropdown` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. Map the index back into your own `options` array if you need the string — this differs from the non-`Form` [`Dropdown`](../Dropdown.md), which resolves back to a value string for you.
:::

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the selected index appears at `values[name]` in the form's `onSubmit` |
| `options`<Req /> | `string[]` | — | The selectable options. The closed box shows the current one; the popup lists them all |
| `defaultValue` | `string` | the first option | Initial selection |
| `label` | `string` | — | Caption rendered above the closed box |
| `enabled` | `boolean` | `true` | Whether the field is interactive. When `false`, renders the disabled face and a dimmed chevron |
| `currentInsetX` / `currentInsetY` | `number` | `8` / vertically centered | Position offset (px) of the closed-box current-value text from the box's left-middle frame. Useful for nudging the value text clear of a neighboring dropdown or an overlapping decoration. The theme has no default for these — an unset inset falls through to the primitive |

### Control props

`Form.Dropdown` inherits the layout and visibility [control props](/docs/ui/components/control-props) — sizing, spacing, flex, `visible`, `enabled` — plus texture props: `background` and its state variants for the closed box, `popupBackground` for the open popup card, `optionBackground` / `optionHover` / `optionSelected` for the option rows, and the text styles `optionFont` / `optionScale` / `optionAlign` (popup rows) and `currentColor` / `currentFont` / `currentScale` (closed-box value). The theme fills in anything you leave out. A `backgroundHover` of your own also becomes the pressed face unless you set `backgroundPressed` too.

## Examples

### Offsetting the current-value text

Two dropdowns side by side, where the second's closed-box value text is nudged clear of the default inset:

```tsx
<Form.Dropdown label={'Mode'} name={'mode'} options={['Easy', 'Normal', 'Hard']} defaultValue={'Normal'} />
<Form.Dropdown
  label={'Difficulty'}
  name={'difficulty'}
  options={['Easy', 'Normal', 'Hard', 'Expert', 'Insane', 'Nightmare', 'Ultra', 'Custom']}
  defaultValue={'Normal'}
  currentInsetX={48}
/>
```

## Notes

- Keep `options` order stable across renders — the result is an index.
- Read `values[name]` as an index and map it back to your own `options` array if you need the string.
- Only reach for `currentInsetX`/`currentInsetY` when the default 8px inset visibly collides with something else in your layout.
