---
sidebar_position: 6
description: "Themed numeric slider for use inside an ore-styled Form."
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

Wraps the runtime [`Form.Slider`](/docs/ui/components/Form/FormSlider) primitive with the [theme](../theme.md)'s track, progress-fill and thumb textures.

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` | — | Result key — the value appears at `values[name]` in the form's `onSubmit` |
| `min` (required) | `number` | — | Minimum selectable value |
| `max` (required) | `number` | — | Maximum selectable value |
| `step` | `number` | `1` | Increment between selectable values |
| `defaultValue` | `number` | `min` | Initial value |
| `label` | `string` | — | Caption rendered above the slider |
| `enabled` | `boolean` | `true` | Whether the control is interactive |

### Control props

`Form.Slider` inherits the layout and visibility [control props](/docs/ui/components/control-props) — sizing, spacing, flex, `visible`, `enabled` — plus texture props: `background` and its state variants for the track, `progress` / `progressHover` for the fill, `thumb` / `thumbHover` / `thumbPressed` / `thumbLocked` for the handle, and the geometry that sizes them (`trackHeight`, `thumbWidth`, `thumbHeight`). The theme fills in anything you leave out. A `thumbHover` of your own also becomes the dragged face unless you set `thumbPressed` too.

## Notes

- Keep `step` a clean divisor of `max - min`, same guidance as the runtime [`Form.Slider`](/docs/ui/components/Form/FormSlider) and the non-`Form` [`Slider`](../Slider.md).
- Give it a `label` on settings-style screens — the primitive itself has no caption.
