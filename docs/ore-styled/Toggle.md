---
sidebar_position: 7
description: "On/off switch."
---
# Toggle

On/off switch. Supports controlled and uncontrolled usage.

![Toggle](/img/ore-styled/Toggle.png)

## Import

```tsx
import { Toggle } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Toggle defaultOn={true} onChange={(on) => console.log(on)} />
```

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `on` | `boolean` | — | Controlled value. When provided, the component renders this state and `onChange` is your only way to update it |
| `defaultOn` | `boolean` | `false` | Initial state when running uncontrolled |
| `onChange` | `(on: boolean) => void` | — | Called with the next state every time the player flips the toggle |
| `disabled` | `boolean` | `false` | When `true`, the toggle renders the disabled texture and ignores presses |

### Control props

Toggle inherits all standard [control props](/docs/ui/components/control-props).

## Examples

### Controlled

```tsx
function MusicSetting() {
  const [on, setOn] = useState(true);

  return (
    <Panel flexDirection={'row'} alignItems={'center'} gap={6}>
      <Text>{'Music'}</Text>
      <Toggle on={on} onChange={setOn} />
    </Panel>
  );
}
```

### Disabled

```tsx
<Toggle on={true} disabled />
```

## Notes

- Pair `Toggle` with a left-aligned label inside a `Panel` row so the player knows what they're flipping.
- For more than two states, use [`ToggleButtonGroup`](./ToggleButton.md) or [`RadioGroup`](./Radio.md) instead.
