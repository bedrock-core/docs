---
sidebar_position: 1
description: "Single-line text field, for use inside a Form."
---
# Input

Single-line text field, for use inside a [`Form`](../roots/Form.md).

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.nickname)}>
  <Input name={'nickname'} placeholder={'§7type here'} />
  <Button action={'submit'}>{'Save'}</Button>
</Form>
```

## How it works

`Input` is a pure field declaration — no `onChange` / controlled value. It renders to the native `ModalFormData.textField` control; the result (`string`) arrives at `values[name]` in the form's `onSubmit`, once, on submit.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the value appears at `values[name]` in the form's `onSubmit` |
| `placeholder` | `string` | — | Text shown inside the native field when empty |
| `defaultValue` | `string` | `''` | Initial text |
| `font` | `LabelFont` | `'mojangles'` | Font family for the typed value and placeholder |
| `scale` | `number` | `1.0` | Scale multiplier relative to the standard glyph size |
| `textOffsetX` / `textOffsetY` | `number` | `8` / vertically centered | Typed-value position offset (px) from the box's left-middle frame |
| `placeholderOffsetX` / `placeholderOffsetY` | `number` | `8` / vertically centered | Placeholder position offset (px), same frame as the typed value |

The box uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](../controls/Button.md); `backgroundPressed` doubles as the focused-field state.

Inherits [control props](../control-props.md).

## Examples

### Basic input

```tsx
<Input name={'nickname'} placeholder={'§7type here'} />
```

### Two inputs side by side

```tsx
<Panel flexDirection={'row'} gap={4}>
  <Input name={'first'} placeholder={'§7first'} flex={1} />
  <Input name={'second'} placeholder={'§7second'} flex={1} />
</Panel>
```

## Notes

- Always provide a `placeholder` — it's the only hint the player gets about what to type.
- Keep `name` stable across renders; it's the only key you get back on submit.
- For themed screens, prefer [`@bedrock-core/ore-styled`](/docs/ore-styled/Input)'s `Input` over styling this primitive by hand.

## Limits

Modal-only. The engine draws no text field on an action form or a container screen, so writing one there is a build error naming the fix rather than a control drawn inert. [`<Toggle>`](../controls/Toggle.md) and [`<Select>`](../controls/Select.md) are the controls that serve all three hosts.
