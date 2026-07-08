---
sidebar_position: 12
---
# Form.Toggle

Boolean on/off field for use inside a [`Form`](./Form.md).

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.log(v.sound)}>
  <Form.Toggle name={'sound'} defaultValue={true} />
  <Form.Button type={'submit'} />
</Form>
```

## How it works

`Form.Toggle` is a pure field declaration — no `onChange` / controlled value. It renders to the native `ModalFormData.toggle` control; the result (`boolean`) arrives at `values[name]` in the form's `onSubmit`, once, on submit.

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the value appears at `values[name]` in the form's `onSubmit`.

#### `defaultValue`
- Type: `boolean`
- Default: `false`
- Description: Initial on/off state.

#### `checkedBackground`
- Type: `string`
- Default: the resolved unchecked base texture
- Description: Checked (on) base texture.

#### `checkedHover`
- Type: `string`
- Default: the resolved checked base texture
- Description: Checked hover texture.

#### `checkedLocked`
- Type: `string`
- Default: the resolved checked base texture
- Description: Checked texture when `enabled={false}`.

The unchecked (off) side uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](./Button.md) (the toggle RP has no pressed state to show `backgroundPressed`, but the prop is still accepted).

### Control Props

`Form.Toggle` inherits all standard [control props](./control-props.md) for layout and visibility — geometry is computed by the layout phase like any other component.

## Examples

### Basic toggle

```tsx
<Form.Toggle name={'mute'} defaultValue={false} />
```

### Custom checked textures

```tsx
<Form.Toggle
  name={'sound'}
  defaultValue={true}
  checkedBackground={'textures/ui/my_toggle_on'}
  checkedHover={'textures/ui/my_toggle_on_hover'}
/>
```

## Best Practices

- Pick clear, unambiguous boolean `name`s (`sound`, not `s`) — it's the only thing you get back on submit.
- Only override `checkedBackground`/`checkedHover`/`checkedLocked` when the default on/off face doesn't match your theme; otherwise a single `background` styles both states.
- For themed screens, prefer [`@bedrock-core/ore-styled`](../../ore-styled/FormToggle.md)'s `Form.Toggle` (or `Form.Checkbox` for checkbox-style rows) over styling this primitive by hand.
