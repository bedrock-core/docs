---
sidebar_position: 2
description: "Themed on/off switch for use inside an ore-styled Form."
---
# Form.Toggle

Themed on/off switch for use inside an ore-styled [`Form`](./Form.md).

![FormToggle](/img/ore-styled/FormToggle.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.Toggle label={'Music'} name={'music'} defaultValue={true} />
<Form.Toggle label={'Show hints'} name={'hints'} defaultValue={false} />
<Form.Toggle label={'Locked option'} name={'locked'} enabled={false} />
```

Wraps the runtime [`Form.Toggle`](/docs/ui/components/Form/FormToggle) primitive with the [theme](../theme.md)'s textures. With a `label` it renders as a settings row — caption on the left, switch pinned to the right; without one, a bare switch.

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` | — | Result key — the value appears at `values[name]` in the form's `onSubmit` |
| `defaultValue` | `boolean` | `false` | Initial on/off state |
| `label` | `string` | — | Caption rendered to the left of the switch. Omit for a bare switch with no row |
| `enabled` | `boolean` | `true` | Whether the control is interactive. When `false`, renders the disabled face and the caption in the theme's disabled color |

### Control props

`Form.Toggle` inherits the layout and visibility [control props](/docs/ui/components/control-props) — sizing, spacing, flex, `visible`, `enabled` — plus texture props: `background` / `backgroundHover` / `backgroundPressed` / `backgroundLocked` skin the **off** switch and `checkedBackground` / `checkedHover` / `checkedLocked` the **on** one. The theme fills in every state you leave out.

## Examples

### Bare switch beside decorative text

```tsx
<Panel flexDirection={'row'} gap={4} alignItems={'center'}>
  <Text>{'§7Mute'}</Text>
  <Form.Toggle name={'mute'} defaultValue={false} />
</Panel>
```

## Notes

- Use `Form.Toggle` for settings-style rows (label left, switch right); use [`Form.Checkbox`](./FormCheckbox.md) instead when you want the box on the left, checkbox-reading-order style (e.g. terms acceptance).
- Omit `label` only when the surrounding layout already supplies context (like the "Mute" example above).
