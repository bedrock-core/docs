---
sidebar_position: 2
description: "A select field backed by a modal dropdown."
---
# Dropdown

A select field backed by a modal dropdown. Pressing it opens a modal to choose one of a fixed set of options. Supports controlled and uncontrolled usage.

:::caution Deprecated
This is the legacy one-modal-per-field pattern. For new screens, use [`Form.Dropdown`](../Form/FormDropdown.md) inside a [`Form`](../Form/Form.md). Still fully supported for existing screens.
:::

## Import

```tsx
import { Dropdown } from '@bedrock-core/ui';
```

## Usage

```tsx
<Dropdown
  label={'Difficulty'}
  options={['Peaceful', 'Easy', 'Normal', 'Hard']}
  defaultValue={'Normal'}
  onChange={(value) => console.log(value)}
/>
```

## How it works

`Dropdown` renders as a [`Button`](../Button.md) whose face shows the current selection. Pressing it opens a single-dropdown `ModalFormData`; on confirm the chosen option is committed (internal state + `onChange`), on cancel nothing changes (`onCancel`). Either way the root form re-presents with the current selection.

The native modal works on item *indices*; `Dropdown` maps the selected index back to the matching `options` entry, so its public API stays value-based like [`Input`](./Input.md).

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options`<Req /> | `string[]` | — | The selectable options. The face shows the current one; the modal lists them all |
| `value` | `string` | — | Controlled selection — should match one of `options`. When provided, the face reflects it on every render and `onChange` is your only way to update it |
| `defaultValue` | `string` | the first option | Initial selection when running uncontrolled |
| `onChange` | `(value: string, index: number) => void` | — | Called with the chosen option and its index in `options` when the player confirms the modal |
| `onCancel` | `() => void` | — | Called when the player cancels (X / Esc) the modal. The selection is left unchanged |
| `face` | `JSX.Node` | a `Text` showing the current selection | Overrides the content drawn on the button face. Lets a styled wrapper render its own face (e.g. the value plus a chevron) while reusing this component's modal + state logic. This is how [`@bedrock-core/ore-styled`](/docs/ore-styled/Dropdown) builds its themed `Dropdown` |

### Modal field props

Dropdown inherits all [modal field props](./modal-field-props.md) (`label`, `title`, `body`, `submitLabel`, `tooltip`) for configuring the modal.

### Control props

Dropdown inherits all standard [control props](../control-props.md). Use `enabled={false}` to make the field inert (no modal opens).

## Examples

### Controlled

```tsx
function DifficultySetting() {
  const [difficulty, setDifficulty] = useState('Normal');

  return (
    <Panel flexDirection={'column'} gap={6}>
      <Dropdown
        label={'Difficulty'}
        options={['Peaceful', 'Easy', 'Normal', 'Hard']}
        value={difficulty}
        onChange={setDifficulty}
        title={'Select difficulty'}
        submitLabel={'Save'}
      />
      <Text>{`Selected: ${difficulty}`}</Text>
    </Panel>
  );
}
```

### Uncontrolled

```tsx
<Dropdown
  options={['Red', 'Green', 'Blue']}
  onChange={(value, index) => console.log(index, value)}
/>
```

## Notes

- Keep `options` stable across renders; deriving it inline from changing data can shift indices unexpectedly.
- A controlled `value` should always be one of `options` — an unknown value falls back to the first option on the face.
- For two-state choices use a [`Toggle`](/docs/ore-styled/Toggle) instead of a two-item dropdown.
