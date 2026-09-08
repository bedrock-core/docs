---
sidebar_position: 13
description: "Numeric field drawn as a track with a thumb."
---
# Slider

Numeric field drawn as a track with a thumb. The thumb shows the value's position along the track; pressing it opens a modal to pick a value within the range. Supports controlled and uncontrolled usage.

:::caution Deprecated
This is the legacy one-modal-per-field pattern. For new screens, use [`Form.Slider`](./Form/FormSlider.md) inside a [`Form`](./Form/Form.md). Still fully supported for existing screens.
:::

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

Built on top of the [`Slider`](/docs/ui/components/deprecated/Slider) primitive and the [theme](./theme.md) token map. The thumb only displays the current value; pressing the field opens a single-slider modal where the value is actually chosen — confirm commits, cancel keeps the current one.

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min`<Req /> | `number` | — | Minimum selectable value; the left end of the track |
| `max`<Req /> | `number` | — | Maximum selectable value; the right end of the track |
| `step` | `number` | `1` | Increment between selectable values in the modal |
| `value` | `number` | — | Controlled value. When provided, the thumb reflects it on every render and `onChange` is your only way to update it |
| `defaultValue` | `number` | `min` | Initial value when running uncontrolled |
| `onChange` | `(value: number) => void` | — | Called with the new value when the player confirms the modal |
| `onCancel` | `() => void` | — | Called when the player cancels (X / Esc) the modal. The value is left unchanged |

### Modal field props

Slider inherits all [modal field props](/docs/ui/components/deprecated/modal-field-props) (`label`, `title`, `body`, `submitLabel`, `tooltip`) for configuring the modal.

### Control props

Slider inherits all standard [control props](/docs/ui/components/control-props). Use `enabled={false}` to render the disabled track/thumb textures and make the field inert (no modal opens).

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

## Notes

- The thumb only *shows* the value — pair the slider with a `Text` echo if you want the exact number visible without opening the modal.
- Choose a `step` that matches the precision you actually need — players can only land on `min + n * step`.
- Make sure `defaultValue` (or a controlled `value`) sits within `[min, max]` so the thumb stays on the track.
