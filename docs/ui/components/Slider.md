---
description: "Numeric slider with submitted modal results or live Ore changes."
---
# Slider

Numeric field drawn as a track and thumb inside a [`Form`](./Form.md) or [`Experimental_OreUI`](./Experimental_OreUI.md) screen.

## Import

```tsx
import { Form, Slider } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.volume)}>
  <Slider name={'volume'} min={0} max={10} defaultValue={5} />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

## How it works

Inside `Form`, the native slider reports a number at `values[name]` on submit. Inside `Experimental_OreUI`, `value` controls the number and `onChange` receives live changes. Without `value`, internal state starts at `defaultValue` or `min`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Required result key inside `Form`; optional on an Ore screen |
| `value` | `number` | internal state | Controlled value on an Ore screen |
| `onChange` | `(value: number, event: UiEvent) => void \| Promise<void>` | — | Receives live Ore changes and the owning player's event |
| `min`<Req /> | `number` | — | Minimum selectable value |
| `max`<Req /> | `number` | — | Maximum selectable value |
| `step` | `number` | `1` (native default) | Increment between selectable values |
| `defaultValue` | `number` | `min` | Initial value |
| `progress` | `string` | the resolved track base texture | Progress-fill texture, drawn to the left of the thumb |
| `progressHover` | `string` | the resolved `progress` texture | Progress-fill hover texture |
| `thumb` | `string` | the resolved track base texture | Draggable handle texture |
| `thumbHover` / `thumbPressed` / `thumbLocked` | `string` | the resolved `thumb` texture | Thumb texture for hover, pressed/dragged, and disabled (`enabled={false}`) states |
| `trackHeight` | `number` | `10` | Height (px) of the track + progress fill. The track always spans the full control width and is vertically centered |
| `thumbWidth` / `thumbHeight` | `number` | `16` | Size (px) of the draggable thumb; `Form` uses a fixed 16×16 interactive hitbox |

The track uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](./Button.md).

Inherits [control props](./control-props.md). Defaults to `width: '100%'` when no explicit sizing is given.

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
- Inside `Form`, keep `thumbWidth`/`thumbHeight` close to the 16×16 hitbox so the visual thumb matches the pressable area.
- For themed screens, prefer [`@bedrock-core/ore-styled`](/docs/ore-styled/Slider)'s `Slider` over styling this primitive by hand.

## Limits

Supported inside `Form` and `Experimental_OreUI`. Action forms and container screens refuse sliders at build time. The fixed 16 × 16 native thumb hitbox applies to `Form`; Ore uses its own live-control presentation.
