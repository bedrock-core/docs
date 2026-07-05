---
sidebar_position: 17
---
# Form.Slider

Themed numeric slider for use inside an ore-styled [`Form`](./Form.md).

![FormSlider](/img/ore-styled/FormSlider.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.Slider label={'Volume'} name={'volume'} min={0} max={10} defaultValue={5} />
```

Built on top of the runtime [`Form.Slider`](../ui-runtime/components/FormSlider.md) primitive and the [theme](./theme.md) token map — track, progress fill, and thumb textures/geometry all come from the theme; there's no dedicated disabled-progress texture, so the locked face reuses the track/thumb disabled textures.

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the value appears at `values[name]` in the form's `onSubmit`.

#### `min` (required)
- Type: `number`
- Description: Minimum selectable value.

#### `max` (required)
- Type: `number`
- Description: Maximum selectable value.

#### `step`
- Type: `number`
- Default: `1`
- Description: Increment between selectable values.

#### `defaultValue`
- Type: `number`
- Default: `min`
- Description: Initial value.

#### `label`
- Type: `string`
- Description: Caption rendered above the slider.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the control is interactive.

### Control Props

`Form.Slider` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Examples

### Two labeled sliders side by side

```tsx
<Panel flexDirection={'row'} gap={4} alignItems={'flex-start'}>
  <Form.Slider label={'Low'} name={'m_sld1'} min={0} max={10} defaultValue={3} flex={1} />
  <Form.Slider label={'High'} name={'m_sld2'} min={0} max={100} defaultValue={50} flex={1} />
</Panel>
```

## Best Practices

- Keep `step` a clean divisor of `max - min`, same guidance as the runtime [`Form.Slider`](../ui-runtime/components/FormSlider.md) and the non-`Form` [`Slider`](./Slider.md).
- Give it a `label` on settings-style screens — the primitive itself has no caption.
