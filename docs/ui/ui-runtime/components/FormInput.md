---
sidebar_position: 13
---
# Form.Input

Single-line text field, for use inside a [`Form`](./Form.md).

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.log(v.nickname)}>
  <Form.Input name={'nickname'} placeholder={'§7type here'} />
  <Form.Button type={'submit'} />
</Form>
```

## How it works

`Form.Input` is a pure field declaration — no `onChange` / controlled value. It renders to the native `ModalFormData.textField` control; the result (`string`) arrives at `values[name]` in the form's `onSubmit`, once, on submit.

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the value appears at `values[name]` in the form's `onSubmit`.

#### `placeholder`
- Type: `string`
- Description: Text shown inside the native field when empty.

#### `defaultValue`
- Type: `string`
- Default: `''`
- Description: Initial text.

#### `font`
- Type: `LabelFont`
- Default: `'mojangles'`
- Description: Font family for the typed value and placeholder.

#### `scale`
- Type: `number`
- Default: `1.0`
- Description: Scale multiplier relative to the standard glyph size.

#### `textOffsetX` / `textOffsetY`
- Type: `number`
- Default: `8` / vertically centered
- Description: Typed-value position offset (px) from the box's left-middle frame.

#### `placeholderOffsetX` / `placeholderOffsetY`
- Type: `number`
- Default: `8` / vertically centered
- Description: Placeholder position offset (px), same frame as the typed value.

The box uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](./Button.md); `backgroundPressed` doubles as the focused-field state.

### Control Props

`Form.Input` inherits all standard [control props](./control-props.md).

## Examples

### Basic input

```tsx
<Form.Input name={'nickname'} placeholder={'§7type here'} />
```

### Two inputs side by side

```tsx
<Panel flexDirection={'row'} gap={4}>
  <Form.Input name={'first'} placeholder={'§7first'} flex={1} />
  <Form.Input name={'second'} placeholder={'§7second'} flex={1} />
</Panel>
```

## Best Practices

- Always provide a `placeholder` — it's the only hint the player gets about what to type.
- Keep `name` stable across renders; it's the only key you get back on submit.
- For themed screens, prefer [`@bedrock-core/ore-styled`](../../ore-styled/FormInput.md)'s `Form.Input` over styling this primitive by hand.
