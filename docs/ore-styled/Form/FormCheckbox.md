---
sidebar_position: 3
description: "Themed checkbox for use inside an ore-styled Form."
---
# Form.Checkbox

Themed checkbox for use inside an ore-styled [`Form`](./Form.md).

![FormCheckbox](/img/ore-styled/FormCheckbox.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.Checkbox label={'I agree to the terms'} name={'agree'} defaultValue={false} />
<Form.Checkbox label={'Subscribe to news'} name={'news'} defaultValue={true} />
<Form.Checkbox label={'Locked checkbox'} name={'cb_locked'} enabled={false} />
```

Wraps the runtime [`Form.Toggle`](/docs/ui/components/Form/FormToggle) primitive with the [theme](../theme.md)'s checkbox textures: box on the **left**, caption on the right.

`Form.Checkbox` is the same underlying control as [`Form.Toggle`](./FormToggle.md) — only the skin and the reading order differ, and either reports a `boolean` at `values[name]`.

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` | — | Result key — the value appears at `values[name]` in the form's `onSubmit` |
| `defaultValue` | `boolean` | `false` | Initial checked state |
| `label` | `string` | — | Caption rendered to the right of the box. Omit for a bare box |
| `enabled` | `boolean` | `true` | Whether the control is interactive. When `false`, renders the disabled face and the caption in the theme's disabled color |

### Control props

`Form.Checkbox` inherits the layout and visibility [control props](/docs/ui/components/control-props) — sizing, spacing, flex, `visible`, `enabled` — plus texture props: `background` / `backgroundHover` / `backgroundPressed` / `backgroundLocked` skin the **unchecked** box and `checkedBackground` / `checkedHover` / `checkedLocked` the **checked** one. The theme fills in every state you leave out.

## Notes

- Use `Form.Checkbox` for terms-acceptance / opt-in style copy where box-left reads more naturally; use [`Form.Toggle`](./FormToggle.md) for settings rows.
