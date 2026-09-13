---
sidebar_position: 2
description: "Numeric field drawn as a track + thumb, for use inside a Form."
---
# Slider

Numeric field drawn as a track + thumb, for use inside a [`Form`](../roots/Form.md).

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.volume)}>
  <Slider name={'volume'} min={0} max={10} defaultValue={5} />
  <Button action={'submit'}>{'Save'}</Button>
</Form>
```

## How it works

`Slider` is a pure field declaration — no `onChange` / controlled value. It renders to the native `ModalFormData.slider` control; the result (`number`) arrives at `values[name]` in the form's `onSubmit`, once, on submit.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min`<Req /> | `number` | — | Minimum selectable value |
| `max`<Req /> | `number` | — | Maximum selectable value |
| `step` | `number` | `1` (native default) | Increment between selectable values |
| `defaultValue` | `number` | `min` | Initial value |
| `progress` | `string` | the resolved track base texture | Progress-fill texture, drawn to the left of the thumb |
| `progressHover` | `string` | the resolved `progress` texture | Progress-fill hover texture |
| `thumb` | `string` | the resolved track base texture | Draggable handle texture |
| `thumbHover` / `thumbPressed` / `thumbLocked` | `string` | the resolved `thumb` texture | Thumb texture for hover, pressed/dragged, and disabled (`enabled={false}`) states |
| `trackHeight` | `number` | `10` | Height (px) of the track + progress fill. The track always spans the full control width and is vertically centered |
| `thumbWidth` / `thumbHeight` | `number` | `16` | Size (px) of the draggable thumb. The interactive hitbox is a fixed 16×16, so keep the visual thumb at the default size unless you've confirmed the mismatch is acceptable |

The track uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](../controls/Button.md).

Inherits [control props](../control-props.md). Defaults to `width: '100%'` when no explicit sizing is given.

## Examples

### Basic slider

```tsx
<Slider name={'volume'} min={0} max={10} defaultValue={5} />
```

### With a step

```tsx
<Slider name={'brightness'} min={0} max={100} step={5} defaultValue={50} />
```

## Notes

- Keep `step` a clean divisor of `max - min` so every reachable value looks intentional on the track.
- Don't resize `thumbWidth`/`thumbHeight` far from the 16×16 default — the interactive hitbox stays fixed at 16×16 regardless, so a larger visual thumb can look pressable in places it isn't.
- For themed screens, prefer [`@bedrock-core/ore-styled`](/docs/ore-styled/Slider)'s `Slider` over styling this primitive by hand.

## Limits

Modal-only. The engine draws no slider on an action form or a container screen, so writing one there is a build error naming the fix rather than a control drawn inert. [`<Toggle>`](../controls/Toggle.md) and [`<Select>`](../controls/Select.md) are the controls that serve all three hosts.
