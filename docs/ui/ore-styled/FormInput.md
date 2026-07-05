---
sidebar_position: 19
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

Built on top of the runtime [`Form.Input`](../ui-runtime/components/FormInput.md) primitive and the [theme](./theme.md) token map. There is no dedicated focused-state texture, so the pressed/focused face reuses hover — same rule as the non-`Form` [`Input`](./Input.md).

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

`Form.Input` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Examples

### Two labeled inputs side by side

```tsx
<Panel flexDirection={'row'} gap={4} alignItems={'flex-start'}>
  <Form.Input label={'First'} name={'m_in1'} placeholder={'§7first'} flex={1} />
  <Form.Input label={'Second'} name={'m_in2'} placeholder={'§7second'} flex={1} />
</Panel>
```

## Best Practices

- Always provide a `placeholder` — same guidance as the runtime [`Form.Input`](../ui-runtime/components/FormInput.md).
- Give it a `label` on settings-style screens — the primitive itself has no caption.
