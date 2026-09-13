---
sidebar_position: 1
description: "The themed native modal root, plus the submit and exit buttons this layer styles."
---
# Form

The themed modal root: the runtime [`<Form>`](/docs/ui/components/Form) unchanged — the same config, the same `onSubmit` and `onCancel` — with the action buttons this layer styles.

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## The fields are not members of it

`Form` has exactly one member, [`Form.Button`](./FormButton.md). The fields are separate components, imported by their own names:

```tsx
import { Checkbox, Dropdown, Form, Input, Radio, Slider, Toggle, ToggleButtonGroup } from '@bedrock-core/ore-styled';
```

Each of them serves every host it can be drawn on. Inside a `<Form>` they become the engine's own fields; outside one they become whatever that screen offers, or say so at build. That is why there is no themed modal variant of each — one component covers both, and a field written for a settings modal moves to a screen of buttons without being rewritten.

## Usage

```tsx
<Form onSubmit={({ values }) => apply(values)} onCancel={() => back(player)}>
  <Toggle name={'music'} label={'Music'} defaultValue={true} />
  <Checkbox name={'agree'} label={'I agree to the terms'} />
  <Dropdown name={'mode'} label={'Mode'} options={['Easy', 'Normal', 'Hard']} defaultValue={'Normal'} />
  <Radio name={'team'} label={'Team'} options={[{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }]} />
  <Input name={'nickname'} label={'Nickname'} placeholder={'type here'} />
  <Slider name={'volume'} label={'Volume'} min={0} max={10} defaultValue={5} />

  <Panel flexDirection={'row'} gap={4}>
    <Form.Button type={'submit'} label={'Save'} flex={2} />
    <Form.Button type={'exit'} label={'Cancel'} variant={'danger'} flex={1} />
  </Panel>
</Form>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSubmit` | `(event: SubmitEvent) => void` | — | Called once when the player submits, with every field's value keyed by its `name` |
| `onCancel` | `(event: UiEvent) => void` | — | Called when the player dismisses the modal |
| `children` | `JSX.Node` | — | The fields, the decoration and the action buttons, in any order |

Unchanged from the primitive — see the runtime [`<Form>`](/docs/ui/components/Form) for the full contract.

## Rules

The same ones the primitive enforces, as a build error rather than a warning: exactly one `Form.Button type="submit"` is required, at most one `type="exit"`, no nested `<Form>`, and no plain `<Button>` inside.

## Captions

The runtime's `Form.*` primitives are deliberately label-free — a caption is composed in this layer. `fieldLabel` is that composition, exported for a field of your own:

```tsx
import { fieldLabel } from '@bedrock-core/ore-styled';

fieldLabel('Volume', true);   // the caption, in the theme's field-label style
```

It takes the label and whether the control is enabled, and colors the caption accordingly. A literal string carries the state color as a `§` prefix; a string the active resolver knows as a `.lang` key passes through untouched, because a prefix in front of a key stops it resolving. Bake the codes into the translation when a localized caption needs them.

Every themed field already calls it for you when you pass `label`.

## Notes

`Radio`, `ToggleButtonGroup` and `Dropdown` all report the selected option's **index**, not its value — the native modal dropdown's behavior. Each page says so.

## Next steps

- [`Form.Button`](./FormButton.md) — the submit and exit actions
- [Checkbox](../Checkbox.md) and [Toggle](../Toggle.md) — booleans
- [Radio](../Radio.md) and [ToggleButtonGroup](../ToggleButton.md) — one choice out of several
- [Input](../Input.md), [Dropdown](../Dropdown.md), [Slider](../Slider.md) — the modal-only fields
