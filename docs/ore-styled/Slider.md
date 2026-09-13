---
sidebar_position: 12
description: "A themed numeric slider for a modal form."
---
# Slider

A themed numeric slider.

![Slider](/img/ore-styled/Slider.png)

## Import

```tsx
import { Slider } from '@bedrock-core/ore-styled';
```

## Usage

Render it inside a [`<Form>`](/docs/ui/components/Form). The value arrives in the form's `onSubmit`, keyed by `name`.

```tsx
<Form onSubmit={({ values }) => console.warn(values.volume)}>
  <Slider name={'volume'} label={'Volume'} min={0} max={100} step={5} />
  <Form.Button type={'submit'} label={'Save'} />
</Form>
```

It is [`Form.Slider`](/docs/ui/components/Form/FormSlider) with the [theme](./theme.md)'s track, progress fill and thumb textures applied, plus a caption above it. The widget is the engine's: the player drags it while the form is open, and the value comes back with every other field on submit.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the value appears at `values[name]` in the form's `onSubmit` |
| `label` | `string` | — | Caption rendered above the slider |
| `min`<Req /> | `number` | — | Minimum selectable value; the left end of the track |
| `max`<Req /> | `number` | — | Maximum selectable value; the right end of the track |
| `step` | `number` | `1` | Increment between selectable values |
| `defaultValue` | `number` | `min` | Initial value |

Inherits every prop of [`Form.Slider`](/docs/ui/components/Form/FormSlider) — the track, progress and thumb textures, `trackHeight`, `thumbWidth` / `thumbHeight` — with the theme's values as defaults rather than a lock. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### A settings form

```tsx
<Form onSubmit={({ values }) => apply(values)}>
  <Slider name={'volume'} label={'Volume'} min={0} max={100} step={5} defaultValue={70} />
  <Slider name={'render'} label={'Render distance'} min={2} max={32} />
  <Form.Button type={'submit'} label={'Apply'} />
</Form>
```

### Disabled

```tsx
<Slider name={'locked'} label={'Volume'} min={0} max={10} defaultValue={5} enabled={false} />
```

## Notes

The interactive hitbox of the thumb is a fixed 16 × 16, so keep the visual thumb at its default size unless a mismatch is acceptable — a larger one looks draggable in places it is not.

There is no `onChange`: a native modal is atomic, so nothing reaches script while the form is open.

## Limits

Modal-only. The engine draws no slider on an action form or a container screen, so [`useMechanism('Slider')`](/docs/ui/hooks/useMechanism) refuses it there at build, naming the fix.
