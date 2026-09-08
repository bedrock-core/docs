---
sidebar_position: 12
description: "Select field with a chevron."
---
# Dropdown

Select field with a chevron. Pressing it opens a modal to choose one of a fixed set of options. Supports controlled and uncontrolled usage.

:::caution Deprecated
This is the legacy one-modal-per-field pattern. For new screens, use [`Form.Dropdown`](./Form/FormDropdown.md) inside a [`Form`](./Form/Form.md). Still fully supported for existing screens.
:::

![Dropdown](/img/ore-styled/Dropdown.png)

## Import

```tsx
import { Dropdown } from '@bedrock-core/ore-styled';
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

Built on top of the [`Dropdown`](/docs/ui/components/deprecated/Dropdown) primitive and the [theme](./theme.md) token map. The current selection sits on the left with a chevron on the right, inside the Ore-UI field frame; pressing it opens a single-dropdown modal — confirm commits the choice, cancel keeps the current one.

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options`<Req /> | `string[]` | — | The selectable options. The face shows the current one; the modal lists them all |
| `value` | `string` | — | Controlled selection — should match one of `options`. When provided, the face reflects it on every render and `onChange` is your only way to update it |
| `defaultValue` | `string` | the first option | Initial selection when running uncontrolled |
| `onChange` | `(value: string, index: number) => void` | — | Called with the chosen option and its index in `options` when the player confirms the modal |
| `onCancel` | `() => void` | — | Called when the player cancels (X / Esc) the modal. The selection is left unchanged |

### Modal field props

Dropdown inherits all [modal field props](/docs/ui/components/deprecated/modal-field-props) (`label`, `title`, `body`, `submitLabel`, `tooltip`) for configuring the modal.

### Control props

Dropdown inherits all standard [control props](/docs/ui/components/control-props). Use `enabled={false}` to render the disabled texture (including a dimmed chevron) and make the field inert (no modal opens).

## Examples

### Controlled

```tsx
function DifficultySetting() {
  const [difficulty, setDifficulty] = useState('Normal');

  return (
    <Panel flexDirection={'column'} gap={6}>
      <Dropdown
        width={160}
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
- For two-state choices use a [`Toggle`](./Toggle.md) instead of a two-item dropdown.
