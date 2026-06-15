---
sidebar_position: 11
---
# Slider

Numeric field drawn as a track with a thumb. The thumb shows the value's position along the track; pressing it opens a modal to pick a value within the range. Supports controlled and uncontrolled usage.

![Slider](/img/ore-styled/Slider.png)

## Import

```tsx
import { Slider } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Slider
  label={'Volume'}
  min={0}
  max={100}
  step={5}
  onChange={(value) => console.log(value)}
/>
```

Built on top of the [`Slider`](../ui-runtime/components/Slider.md) primitive and the [theme](./theme.md) token map. The thumb is positioned at `(value - min) / (max - min)` along the track to display the current value; pressing the field opens a single-slider modal where the value is actually chosen — confirm commits, cancel keeps the current one.

## Props

### Component-Specific Props

#### `min` (required)
- Type: `number`
- Description: Minimum selectable value; the left end of the track.

#### `max` (required)
- Type: `number`
- Description: Maximum selectable value; the right end of the track.

#### `step`
- Type: `number`
- Default: `1`
- Description: Increment between selectable values in the modal.

#### `value`
- Type: `number`
- Description: Controlled value. When provided, the thumb reflects it on every render and `onChange` is your only way to update it.

#### `defaultValue`
- Type: `number`
- Default: `min`
- Description: Initial value when running uncontrolled.

#### `onChange`
- Type: `(value: number) => void`
- Description: Called with the new value when the player confirms the modal.

#### `onCancel`
- Type: `() => void`
- Description: Called when the player cancels (X / Esc) the modal. The value is left unchanged.

### Modal Field Props

Slider inherits all [modal field props](../ui-runtime/components/modal-field-props.md) (`label`, `title`, `body`, `submitLabel`, `tooltip`) for configuring the modal.

### Control Props

Slider inherits all standard [control props](../ui-runtime/components/control-props.md). Use `enabled={false}` to render the disabled track/thumb textures and make the field inert (no modal opens).

## Examples

### Controlled

```tsx
function VolumeSetting() {
  const [volume, setVolume] = useState(50);

  return (
    <Panel flexDirection={'row'} alignItems={'center'} gap={8}>
      <Slider
        label={'Volume'}
        min={0}
        max={100}
        step={5}
        value={volume}
        onChange={setVolume}
        title={'Set volume'}
        submitLabel={'Save'}
      />
      <Text>{`${volume}`}</Text>
    </Panel>
  );
}
```

### Uncontrolled

```tsx
<Slider min={1} max={10} defaultValue={3} onChange={(v) => console.log(v)} />
```

## Best Practices

- The thumb only *shows* the value — pair the slider with a `Text` echo if you want the exact number visible without opening the modal.
- Choose a `step` that matches the precision you actually need — players can only land on `min + n * step`.
- Make sure `defaultValue` (or a controlled `value`) sits within `[min, max]` so the thumb stays on the track.
