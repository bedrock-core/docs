---
sidebar_position: 7
description: "A themed on/off switch that draws as a native field on a modal and a press everywhere else."
---
# Toggle

An on/off switch: the caption on the left, the switch pinned to the right — the settings-row reading order.

![Toggle](/img/ore-styled/Toggle.png)

## Import

```tsx
import { Toggle } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Toggle name={'sound'} label={'Sound'} defaultValue={true} />
```

## It depends on the screen

`Toggle` is the same control as [`Checkbox`](./Checkbox.md) with the theme's switch faces: it asks [`useMechanism('Toggle')`](/docs/ui/hooks/useMechanism) what a boolean becomes on the screen it is being drawn on, and draws that.

| Screen | What it becomes | What reaches script |
| --- | --- | --- |
| [`<Form>`](/docs/ui/components/Form) | a native [`Form.Toggle`](/docs/ui/components/Form/FormToggle) the engine owns | nothing until submit — the value arrives at `values[name]` |
| [`<Screen>`](/docs/ui/components/Screen) | a press that holds its own state | `onChange`, on every press |
| [`<Container>`](/docs/ui/components/Container) | an item taken and put straight back | `onChange`, on every press |

`name` is the modal's prop and required there; `on` and `onChange` only do anything where a press reaches script.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Result key on a modal, where it is required; ignored where the press itself is the answer |
| `label` | `string` | — | The caption beside it. Without one, the switch is drawn bare |
| `defaultValue` | `boolean` | `false` | Which way it starts |
| `on` | `boolean` | — | Held by the caller instead of by the control. Only where a press reaches script |
| `onChange` | `(on: boolean) => void` | — | Called with the new state, on the hosts where a press reaches script |
| `enabled` | `boolean` | `true` | `false` draws the disabled texture and ignores presses |

The theme's switch textures are defaults, not a lock: `background`, `backgroundHover`, `backgroundPressed`, `backgroundLocked`, `checkedBackground`, `checkedHover` and `checkedLocked` are all accepted and yours wins. Inherits [control props](/docs/ui/components/control-props).

## Examples

### A settings form

```tsx
<Form onSubmit={({ values }) => apply(values)}>
  <Toggle name={'sound'} label={'Sound'} defaultValue={true} />
  <Toggle name={'hints'} label={'Show hints'} />
  <Form.Button type={'submit'} label={'Save'} />
</Form>
```

### On a screen of buttons

```tsx
function SoundRow(): JSX.Element {
  const [on, setOn] = useState(true);

  return <Toggle label={'Sound'} on={on} onChange={setOn} />;
}
```

### Disabled

```tsx
<Toggle label={'Locked'} defaultValue={true} enabled={false} />
```

## Notes

Reach for `Toggle` in a settings list, where the caption leads and the switches line up on the right, and for [`Checkbox`](./Checkbox.md) where the box should lead.
