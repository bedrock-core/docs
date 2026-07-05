---
sidebar_position: 14
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
```

Built on top of the runtime [`Form.Toggle`](../ui-runtime/components/FormToggle.md) primitive and the [theme](./theme.md) token map, skinned with checkbox textures instead of a switch.

## Relationship to Form.Toggle

`Form.Checkbox` is **the same underlying control as [`Form.Toggle`](./FormToggle.md)** — both render to the native `modal-toggle` slot and both report a `boolean`. Only the skin and reading order differ: `Form.Checkbox` draws the box on the **left** and the caption on the **right** (checkbox reading order), the opposite of `Form.Toggle`'s label-left/switch-right settings row. Pick whichever reading order fits the row — they're not different data types.

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the value appears at `values[name]` in the form's `onSubmit`.

#### `defaultValue`
- Type: `boolean`
- Default: `false`
- Description: Initial checked state.

#### `label`
- Type: `string`
- Description: Caption rendered to the right of the box. Omit for a bare box.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the control is interactive. When `false`, renders the disabled face and the caption in the theme's disabled color.

### Control Props

`Form.Checkbox` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Examples

### Terms acceptance

```tsx
<Form.Checkbox label={'I agree to the terms'} name={'agree'} defaultValue={false} />
<Form.Checkbox label={'Subscribe to news'} name={'news'} defaultValue={true} />
<Form.Checkbox label={'Locked checkbox'} name={'cb_locked'} enabled={false} />
```

## Best Practices

- Use `Form.Checkbox` for terms-acceptance / opt-in style copy where box-left reads more naturally; use [`Form.Toggle`](./FormToggle.md) for settings rows.
- Since both render the same `modal-toggle` control, `values[name]` is always a `boolean` for either — there's no behavioral difference to account for when reading results.
