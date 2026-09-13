---
sidebar_position: 12
description: "A themed single-line text field for a modal form."
---
# Input

A themed single-line text field.

![Input](/img/ore-styled/Input.png)

## Import

```tsx
import { Input } from '@bedrock-core/ore-styled';
```

## Usage

Render it inside a [`<Form>`](/docs/ui/components/Form). The value arrives in the form's `onSubmit`, keyed by `name`.

```tsx
<Form onSubmit={({ values }) => console.warn(values.nickname)}>
  <Input name={'nickname'} label={'Name'} placeholder={'type your name'} width={160} />
  <Form.Button type={'submit'} label={'Save'} />
</Form>
```

It is [`Form.Input`](/docs/ui/components/Form/FormInput) with the [theme](./theme.md)'s field textures and font applied, plus a caption above the box. The widget itself is the engine's — it is owned by the client while the form is open, and every field's value comes back at once on submit.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the value appears at `values[name]` in the form's `onSubmit` |
| `label` | `string` | — | Caption rendered above the field |
| `placeholder` | `string` | — | Text shown inside the field when it is empty |
| `defaultValue` | `string` | `''` | Initial text |

Inherits every prop of [`Form.Input`](/docs/ui/components/Form/FormInput) — the font, the scale, the text offsets and the per-state box textures — with the theme's values as defaults rather than a lock: pass one and yours wins. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### Two fields in one form

```tsx
<Form onSubmit={({ values }) => save(values.nickname, values.motto)}>
  <Input name={'nickname'} label={'Name'} placeholder={'type your name'} />
  <Input name={'motto'} label={'Motto'} defaultValue={'hello'} />
  <Form.Button type={'submit'} label={'Save'} />
</Form>
```

### Disabled

```tsx
<Input name={'locked'} label={'Name'} defaultValue={'Steve'} enabled={false} />
```

## Notes

Give the field a `width`, or let it stretch in a column, so the framed box reads as a field even when empty. A `placeholder` keeps an empty one reading as editable.

There is no `onChange`: a native modal is atomic, so nothing reaches script while the form is open. For a value the screen reacts to immediately, use a press — [`Checkbox`](./Checkbox.md) and [`Toggle`](./Toggle.md) do that on the hosts where a press reaches script.

## Limits

Modal-only. The engine draws no text field on an action form or a container screen, so [`useMechanism('Input')`](/docs/ui/hooks/useMechanism) refuses it there at build, naming the fix.
