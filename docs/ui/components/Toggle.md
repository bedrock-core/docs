---
description: "A boolean. A native field on a modal, a press that flips on a screen, a slot on a container."
---
# Toggle

A boolean, on any of the three screens.

## Import

```tsx
import { Toggle } from '@bedrock-core/ui';
```

## Usage

```tsx
<Toggle name={'music'} defaultValue={true} />
```

## One component, three mechanisms

`Toggle` asks [`useMechanism('Toggle')`](../hooks/useMechanism.md) what a boolean becomes on the screen it is being drawn on, and draws that. The component is written once; what differs is the host.

| Screen | What it is | How the value moves |
| --- | --- | --- |
| [`<Form>`](./Form.md) | a native field the engine owns | nothing until submit, then `values[name]` |
| [`<Screen>`](./Screen.md) | a button that flips its state and renders the screen again | `onChange` on the press; the player sees the new state on the next present |
| [`<Container>`](./Container.md) | a cell of the host's container — the press is an item taken and put straight back | `onChange` on the press; the slots settle in the same tick |

So `name` is what the modal reports under, and `on` / `onChange` are what the two press hosts give you. Write all of them and the control moves between screens unchanged: each host uses the ones it can.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Result key on a modal, where it is required; ignored where the press is the answer |
| `defaultValue` | `boolean` | `false` | Which way it starts |
| `on` | `boolean` | — | Held by the caller instead of by the control. Only where a press reaches script |
| `onChange` | `(on: boolean) => void` | — | Called with the new state, on the hosts where a press reaches script |
| `background` | `string` | the blank-canvas placeholder | The unchecked face |
| `backgroundHover` / `backgroundPressed` / `backgroundLocked` | `string` | `background` | The unchecked face per state |
| `checkedBackground` | `string` | the resolved `background` | The checked face |
| `checkedHover` / `checkedLocked` | `string` | `checkedBackground` | The checked face per state |

Inherits [control props](./control-props.md). Geometry is solved by the layout like any other component and encoded for the render pack, so a native widget is positioned by the same flexbox as everything else.

## Examples

### In a modal

```tsx
<Form onSubmit={({ values }) => setMusic(values.music === true)}>
  <Toggle name={'music'} defaultValue={true} />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

### On a screen of buttons

```tsx
function MusicRow(): JSX.Element {
  const [on, setOn] = useState(true);

  return <Toggle on={on} onChange={setOn} />;
}
```

The press re-presents the screen, which is how the player sees the flip — a form cannot change while it is open, and an action form is a form.

### On a container screen

```tsx
<Container entity={'core:console'} padding={8} gap={4}>
  <Toggle on={running} onChange={setRunning} />
</Container>
```

The cell takes one index in the host's container. A press is an item taken and put straight back, so the handler runs and the slots settle in the same tick.

## Notes

The faces resolve by one rule — `state ?? base ?? unstyled` — so a single `background` styles every state, and a `checkedBackground` styles the whole checked side.

[`@bedrock-core/ore-styled`](/docs/ore-styled/Toggle)'s `Toggle` and `Checkbox` are this component with the theme's faces and a caption.
