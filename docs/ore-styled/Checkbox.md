---
sidebar_position: 8
description: "A themed boolean that draws as a native field on a modal and a press everywhere else."
---
# Checkbox

A labeled boolean: the box, then the caption.

![Checkbox](/img/ore-styled/Checkbox.png)

## Import

```tsx
import { Checkbox } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Checkbox name={'notify'} label={'Enable notifications'} defaultValue={true} />
```

## It depends on the screen

`Checkbox` asks [`useMechanism('Toggle')`](/docs/ui/hooks/useMechanism) what a boolean becomes on the screen it is being drawn on, and draws that. Which props matter follows from the answer:

| Screen | What it becomes | What reaches script |
| --- | --- | --- |
| [`<Form>`](/docs/ui/components/Form) | a native [`Form.Toggle`](/docs/ui/components/Form/FormToggle) the engine owns | nothing until submit — the value arrives at `values[name]` |
| [`<Screen>`](/docs/ui/components/Screen) | a press that holds its own state | `onChange`, on every press |
| [`<Container>`](/docs/ui/components/Container) | an item taken and put straight back | `onChange`, on every press |

So `name` is the modal's prop and required there — a native field with no name has nothing to report under — while `on` and `onChange` only do anything where a press reaches script. You can write all of them and move the control between screens; each host uses the ones it can.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Result key on a modal, where it is required; ignored where the press itself is the answer |
| `label` | `string` | — | The caption beside it. Without one, the control is drawn bare |
| `defaultValue` | `boolean` | `false` | Which way it starts |
| `on` | `boolean` | — | Held by the caller instead of by the control. Only where a press reaches script |
| `onChange` | `(on: boolean) => void` | — | Called with the new state, on the hosts where a press reaches script |
| `enabled` | `boolean` | `true` | `false` draws the disabled texture and ignores presses |

The theme's textures are defaults, not a lock: `background`, `backgroundHover`, `backgroundPressed`, `backgroundLocked`, `checkedBackground`, `checkedHover` and `checkedLocked` are all accepted and yours wins. Inherits [control props](/docs/ui/components/control-props).

## Examples

### In a modal

```tsx
<Form onSubmit={({ values }) => apply(values.notify === true)}>
  <Checkbox name={'notify'} label={'Enable notifications'} defaultValue={true} />
  <Form.Button type={'submit'} label={'Save'} />
</Form>
```

### On a screen of buttons

```tsx
function NotifySetting(): JSX.Element {
  const [enabled, setEnabled] = useState(false);

  return <Checkbox label={'Enable notifications'} on={enabled} onChange={setEnabled} />;
}
```

A press re-presents the screen, so the new state is what the player sees next — the same rule as every other state change on a form.

### Disabled

```tsx
<Checkbox label={'Locked option'} defaultValue={true} enabled={false} />
```

## Notes

Pair related checkboxes in a [`Card`](./Card.md), or a `Panel` with `gap`, to keep their hitboxes legible.

[`Toggle`](./Toggle.md) is the same control with the theme's switch faces and the caption on the left.
