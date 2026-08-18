---
sidebar_position: 6
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

Wraps the runtime [`Form.Slider`](../../ui-runtime/components/Form/FormSlider.md) primitive with the [theme](../theme.md)'s track, progress-fill and thumb textures.

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

`Form.Slider` inherits the layout and visibility [control props](../../ui-runtime/components/control-props.md) — sizing, spacing, flex, `visible`, `enabled` — plus texture props: `background` and its state variants for the track, `progress` / `progressHover` for the fill, `thumb` / `thumbHover` / `thumbPressed` / `thumbLocked` for the handle, and the geometry that sizes them (`trackHeight`, `thumbWidth`, `thumbHeight`). The theme fills in anything you leave out. A `thumbHover` of your own also becomes the dragged face unless you set `thumbPressed` too.

## Best Practices

- Keep `step` a clean divisor of `max - min`, same guidance as the runtime [`Form.Slider`](../../ui-runtime/components/Form/FormSlider.md) and the non-`Form` [`Slider`](../Slider.md).
- Give it a `label` on settings-style screens — the primitive itself has no caption.
