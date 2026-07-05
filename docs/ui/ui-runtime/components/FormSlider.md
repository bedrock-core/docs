---
sidebar_position: 12
---
# Form.Slider

Numeric field drawn as a track + thumb, for use inside a [`Form`](./Form.md).

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.log(v.volume)}>
  <Form.Slider name={'volume'} min={0} max={10} defaultValue={5} />
  <Form.Button type={'submit'} />
</Form>
```

## How it works

`Form.Slider` is a pure field declaration — no `onChange` / controlled value. It renders to the native `ModalFormData.slider` control; the result (`number`) arrives at `values[name]` in the form's `onSubmit`, once, on submit.

## Props

### Component-Specific Props

#### `min` (required)
- Type: `number`
- Description: Minimum selectable value.

#### `max` (required)
- Type: `number`
- Description: Maximum selectable value.

#### `step`
- Type: `number`
- Default: `1` (native default)
- Description: Increment between selectable values.

#### `defaultValue`
- Type: `number`
- Default: `min`
- Description: Initial value.

#### `progress`
- Type: `string`
- Default: the resolved track base texture
- Description: Progress-fill texture, drawn to the left of the thumb.

#### `progressHover`
- Type: `string`
- Default: the resolved `progress` texture
- Description: Progress-fill hover texture.

#### `thumb`
- Type: `string`
- Default: the resolved track base texture
- Description: Draggable handle texture.

#### `thumbHover` / `thumbPressed` / `thumbLocked`
- Type: `string`
- Default: the resolved `thumb` texture
- Description: Thumb texture for hover, pressed/dragged, and disabled (`enabled={false}`) states.

#### `trackHeight`
- Type: `number`
- Default: `10`
- Description: Height (px) of the track + progress fill. The track always spans the full control width and is vertically centered.

#### `thumbWidth` / `thumbHeight`
- Type: `number`
- Default: `16`
- Description: Size (px) of the draggable thumb. The interactive hitbox is a fixed 16×16, so keep the visual thumb at the default size unless you've confirmed the mismatch is acceptable.

The track uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](./Button.md).

### Control Props

`Form.Slider` inherits all standard [control props](./control-props.md). Defaults to `width: '100%'` when no explicit sizing is given.

## Examples

### Basic slider

```tsx
<Form.Slider name={'volume'} min={0} max={10} defaultValue={5} />
```

### With a step

```tsx
<Form.Slider name={'brightness'} min={0} max={100} step={5} defaultValue={50} />
```

## Best Practices

- Keep `step` a clean divisor of `max - min` so every reachable value looks intentional on the track.
- Don't resize `thumbWidth`/`thumbHeight` far from the 16×16 default — the interactive hitbox stays fixed at 16×16 regardless, so a larger visual thumb can look pressable in places it isn't.
- For themed screens, prefer [`@bedrock-core/ore-styled`](../../ore-styled/FormSlider.md)'s `Form.Slider` over styling this primitive by hand.
