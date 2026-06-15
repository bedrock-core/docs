---
sidebar_position: 9
---
# Slider

A numeric field backed by a modal slider. Pressing it opens a modal to pick a value within a range. Supports controlled and uncontrolled usage.

## Import

```tsx
import { Slider } from '@bedrock-core/ui';
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

## How it works

`Slider` renders as a [`Button`](./Button.md) whose face shows the current value. Pressing it opens a single-slider `ModalFormData`; on confirm the chosen value is committed (internal state + `onChange`), on cancel nothing changes (`onCancel`). Either way the root form re-presents with the current value.

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
- Default: `1`
- Description: Increment between selectable values.

#### `value`
- Type: `number`
- Description: Controlled value. When provided, the face reflects it on every render and `onChange` is your only way to update it.

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

Slider inherits all [modal field props](./modal-field-props.md) (`label`, `title`, `body`, `submitLabel`, `tooltip`) for configuring the modal.

### Control Props

Slider inherits all standard [control props](./control-props.md). Use `enabled={false}` to make the field inert (no modal opens).

## Examples

### Controlled

```tsx
function VolumeSetting() {
  const [volume, setVolume] = useState(50);

  return (
    <Panel flexDirection={'column'} gap={6}>
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
      <Text>{`Volume: ${volume}%`}</Text>
    </Panel>
  );
}
```

### Uncontrolled

```tsx
<Slider min={1} max={10} defaultValue={3} onChange={(v) => console.log(v)} />
```

## Best Practices

- Choose a `step` that matches the precision you actually need — players can only land on `min + n * step`.
- Make sure `defaultValue` (or a controlled `value`) sits within `[min, max]`.
- Pair the slider with a `Text` that echoes the value so the current setting stays visible without opening the modal.
