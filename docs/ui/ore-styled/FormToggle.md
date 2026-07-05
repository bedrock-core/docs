---
sidebar_position: 13
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
```

Built on top of the runtime [`Form.Toggle`](../ui-runtime/components/FormToggle.md) primitive and the [theme](./theme.md) token map. Renders as a settings row — caption on the left, switch pinned to the right — when `label` is given; a bare switch otherwise.

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the value appears at `values[name]` in the form's `onSubmit`.

#### `defaultValue`
- Type: `boolean`
- Default: `false`
- Description: Initial on/off state.

#### `label`
- Type: `string`
- Description: Caption rendered to the left of the switch. Omit for a bare switch with no row.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the control is interactive. When `false`, renders the disabled face and the caption in the theme's disabled color.

### Control Props

`Form.Toggle` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Examples

### Settings row

```tsx
<Form.Toggle label={'Music'} name={'music'} defaultValue={true} />
<Form.Toggle label={'Show hints'} name={'hints'} defaultValue={false} />
<Form.Toggle label={'Locked option'} name={'locked'} enabled={false} />
```

### Bare switch beside decorative text

```tsx
<Panel flexDirection={'row'} gap={4} alignItems={'center'}>
  <Text>{'§7Mute'}</Text>
  <Form.Toggle name={'mute'} defaultValue={false} />
</Panel>
```

## Best Practices

- Use `Form.Toggle` for settings-style rows (label left, switch right); use [`Form.Checkbox`](./FormCheckbox.md) instead when you want the box on the left, checkbox-reading-order style (e.g. terms acceptance).
- Omit `label` only when the surrounding layout already supplies context (like the "Mute" example above).
