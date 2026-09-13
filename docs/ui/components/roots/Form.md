---
sidebar_position: 2
description: "The root that makes a screen a native modal form: one atomic ModalFormData, every value arriving together on submit."
---
# Form

The root that makes a screen a native modal form.

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx title="packs/BP/scripts/settings.screen.tsx"
export default function Settings(): JSX.Element {
  return (
    <Form onSubmit={({ values }) => apply(values)}>
      <Text>{'Settings'}</Text>
      <Toggle name={'music'} defaultValue={true} />
      <Slider name={'volume'} min={0} max={10} />
      <Input name={'nickname'} />
      <Button action={'submit'}>{'Save'}</Button>
    </Form>
  );
}
```

`Form` is a **host**, the way [`<Screen>`](./Screen.md) and [`<Container>`](./Container.md) are. Its presence makes the renderer build one atomic `ModalFormData` instead of a screen of buttons.

## Form has no members

There is no `Form.Toggle`, no `Form.Input`, no `Form.Button`. Every control is a top-level component imported by its own name, and **which hosts it works on is its own capability**, not something a namespace decides:

```tsx
import { Button, Dropdown, Form, Input, Option, Select, Slider, Text, Toggle } from '@bedrock-core/ui';
```

[`<Toggle>`](../controls/Toggle.md), [`<Select>`](../controls/Select.md) and [`<Option>`](../controls/Option.md) work on all three hosts and draw differently on each. [`<Input>`](../fields/Input.md), [`<Slider>`](../fields/Slider.md) and [`<Dropdown>`](../fields/Dropdown.md) only work here, because the engine draws no text field, slider or popup anywhere else. See [Hosts](../../guides/hosts.md) for the whole table.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSubmit` | `(event: SubmitEvent) => void` | — | Called once when the player submits. `event.values` holds every control's value keyed by its `name` |
| `onCancel` | `(event: UiEvent) => void` | — | Called when the player dismisses the modal — the X, Esc, or an exit button |
| `children` | `JSX.Node` | — | The controls, the decoration and the action buttons, in any order |

`Form` takes no [control props](../control-props.md): it is a marker, not a panel. Put a `Panel` inside it for a background, padding or a direction.

## Values arrive once

The native modal is atomic: nothing reaches script while it is open, and every value comes back together on submit.

```tsx
<Form onSubmit={({ values }) => {
  values.music;      // boolean
  values.volume;     // number
  values.nickname;   // string
}}>
```

`FormValues` is `Record<string, ModalValue>`, where `ModalValue` is `string | number | boolean | undefined`. That is why a control here has a `name` and no `onChange` — there is nothing to call one from.

A heading is a `<Text>`: the modal has no `title` or `body` prop of its own.

## Rules

The build enforces these, with a message naming the fix.

- **Exactly one submit.** A modal has no built-in submit control, so the screen declares one: `<Button action={'submit'}>`. At most one `action={'exit'}` beside it.
- **No nested root.** A `<Form>` inside a `<Form>`, or a `<Screen>` or `<Container>` inside one, is refused. Mix the two form kinds across separate screens, never nested.
- **Only what this host can draw.** A [`<Slot>`](../cells/Slot.md) or a plain press with a handler is refused here by name — a modal draws its typed controls plus its own two actions and nothing else.

## Notes

A form cannot be mutated while it is open, so a state change never repaints it. The player sees a new snapshot when they press. [State](../../guides/state.md) covers what follows from that.

## Next steps

- [Hosts](../../guides/hosts.md) — what each of the three screens can carry
- [`<Toggle>`](../controls/Toggle.md) — the clearest example of one component, three mechanisms
- [Modal fields](../fields/Input.md) — the three that live only here
- [`@bedrock-core/ore-styled`](/docs/ore-styled) — the same controls, themed
