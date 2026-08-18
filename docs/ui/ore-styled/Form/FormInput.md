---
sidebar_position: 8
---
# Form.Input

Themed single-line text field for use inside an ore-styled [`Form`](./Form.md).

![FormInput](/img/ore-styled/FormInput.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.Input label={'Nickname'} name={'nickname'} placeholder={'§7type here'} />
```

Wraps the runtime [`Form.Input`](../../ui-runtime/components/Form/FormInput.md) primitive with the [theme](../theme.md)'s textures. The focused face reuses the hover texture — same rule as the non-`Form` [`Input`](../Input.md).

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the value appears at `values[name]` in the form's `onSubmit`.

#### `placeholder`
- Type: `string`
- Description: Text shown inside the field when empty.

#### `defaultValue`
- Type: `string`
- Default: `''`
- Description: Initial text.

#### `label`
- Type: `string`
- Description: Caption rendered above the field.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the field is interactive.

### Control Props

`Form.Input` inherits the layout and visibility [control props](../../ui-runtime/components/control-props.md) — sizing, spacing, flex, `visible`, `enabled` — plus texture props: `background`, `backgroundHover`, `backgroundPressed` and `backgroundLocked` for the field box, `font` / `scale` for its text. The theme fills in anything you leave out. A `backgroundHover` of your own also becomes the focused face unless you set `backgroundPressed` too.

## Examples

### Two labeled inputs side by side

```tsx
<Panel flexDirection={'row'} gap={4} alignItems={'flex-start'}>
  <Form.Input label={'First'} name={'m_in1'} placeholder={'§7first'} flex={1} />
  <Form.Input label={'Second'} name={'m_in2'} placeholder={'§7second'} flex={1} />
</Panel>
```

## Best Practices

- Always provide a `placeholder` — same guidance as the runtime [`Form.Input`](../../ui-runtime/components/Form/FormInput.md).
- Give it a `label` on settings-style screens — the primitive itself has no caption.
