---
sidebar_position: 10
---
# Dropdown

Select field with a chevron. Pressing it opens a modal to choose one of a fixed set of options. Supports controlled and uncontrolled usage.

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

Built on top of the [`Dropdown`](../ui-runtime/components/Dropdown.md) primitive and the [theme](./theme.md) token map. The current selection sits on the left with a chevron on the right, inside the Ore-UI field frame; pressing it opens a single-dropdown modal — confirm commits the choice, cancel keeps the current one.

## Props

### Component-Specific Props

#### `options` (required)
- Type: `string[]`
- Description: The selectable options. The face shows the current one; the modal lists them all.

#### `value`
- Type: `string`
- Description: Controlled selection — should match one of `options`. When provided, the face reflects it on every render and `onChange` is your only way to update it.

#### `defaultValue`
- Type: `string`
- Default: the first option
- Description: Initial selection when running uncontrolled.

#### `onChange`
- Type: `(value: string, index: number) => void`
- Description: Called with the chosen option and its index in `options` when the player confirms the modal.

#### `onCancel`
- Type: `() => void`
- Description: Called when the player cancels (X / Esc) the modal. The selection is left unchanged.

### Modal Field Props

Dropdown inherits all [modal field props](../ui-runtime/components/modal-field-props.md) (`label`, `title`, `body`, `submitLabel`, `tooltip`) for configuring the modal.

### Control Props

Dropdown inherits all standard [control props](../ui-runtime/components/control-props.md). Use `enabled={false}` to render the disabled texture (including a dimmed chevron) and make the field inert (no modal opens).

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

## Best Practices

- Keep `options` stable across renders; deriving it inline from changing data can shift indices unexpectedly.
- A controlled `value` should always be one of `options` — an unknown value falls back to the first option on the face.
- For two-state choices use a [`Toggle`](./Toggle.md) instead of a two-item dropdown.
