---
sidebar_position: 7
---
# Input

A single-line text field. Pressing it opens a modal to edit the value. Supports controlled and uncontrolled usage.

## Import

```tsx
import { Input } from '@bedrock-core/ui';
```

## Usage

```tsx
<Input
  label={'Name'}
  placeholder={'type your name'}
  onChange={(value) => console.log(value)}
/>
```

## How it works

Native `ActionFormData` can't take typed input, so `Input` renders as a [`Button`](./Button.md) whose face shows the current value (or the `placeholder` when empty). Pressing it opens a single-field `ModalFormData`; on confirm the typed text is committed (internal state + `onChange`), on cancel nothing changes (`onCancel`). Either way the root form re-presents with the current value.

This is the unstyled runtime primitive — supply a `background` or compose a styled wrapper for a field-like appearance.

## Props

### Component-Specific Props

#### `value`
- Type: `string`
- Description: Controlled value. When provided, the face reflects this on every render and `onChange` is your only way to update it.

#### `defaultValue`
- Type: `string`
- Default: `''`
- Description: Initial value when running uncontrolled.

#### `onChange`
- Type: `(value: string) => void`
- Description: Called with the new text when the player confirms the modal.

#### `onCancel`
- Type: `() => void`
- Description: Called when the player cancels (X / Esc) the modal. The value is left unchanged.

#### `placeholder`
- Type: `string`
- Description: Shown on the button face when the value is empty, and inside the modal text field.

### Modal Field Props

Input inherits all [modal field props](./modal-field-props.md) (`label`, `title`, `body`, `submitLabel`, `tooltip`) for configuring the modal.

### Control Props

Input inherits all standard [control props](./control-props.md). Use `enabled={false}` to make the field inert (no modal opens).

## Examples

### Controlled

```tsx
function NameField() {
  const [name, setName] = useState('');

  return (
    <Panel flexDirection={'column'} gap={6}>
      <Input
        label={'Name'}
        placeholder={'type your name'}
        value={name}
        onChange={setName}
        title={'Edit name'}
        submitLabel={'Save'}
      />
      <Text>{`Hello, ${name !== '' ? name : 'stranger'}`}</Text>
    </Panel>
  );
}
```

### Uncontrolled

```tsx
<Input defaultValue={'Steve'} onChange={(v) => console.log(v)} />
```

### Disabled

```tsx
<Input value={'locked'} enabled={false} />
```

## Best Practices

- Provide a `placeholder` so an empty field still reads as editable.
- Set `title` (or rely on `label`) so the modal has a clear heading.
- Use `value` + `onChange` (controlled) when the value is part of your screen state; reach for `defaultValue` when the field can manage itself.
