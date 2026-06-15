---
sidebar_position: 9
---
# Input

Single-line text field. Pressing it opens a modal to edit the value. Supports controlled and uncontrolled usage.

![Input](/img/ore-styled/Input.png)

## Import

```tsx
import { Input } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Input
  label={'Name'}
  placeholder={'type your name'}
  onChange={(value) => console.log(value)}
/>
```

Built on top of the [`Input`](../ui-runtime/components/Input.md) primitive and the [theme](./theme.md) token map. The current value (or the `placeholder`, shown muted) is rendered inside the Ore-UI field frame; pressing it opens a single-field modal — confirm commits the typed value, cancel keeps the current one.

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
- Description: Shown (muted) on the field face when the value is empty, and inside the modal text field.

### Modal Field Props

Input inherits all [modal field props](../ui-runtime/components/modal-field-props.md) (`label`, `title`, `body`, `submitLabel`, `tooltip`) for configuring the modal.

### Control Props

Input inherits all standard [control props](../ui-runtime/components/control-props.md). Use `enabled={false}` to render the disabled texture and make the field inert (no modal opens).

## Examples

### Controlled

```tsx
function NameField() {
  const [name, setName] = useState('');

  return (
    <Panel flexDirection={'column'} gap={6}>
      <Input
        width={160}
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

- Give the field a `width` (or let it stretch in a column) so the framed box reads as a field even when empty.
- Provide a `placeholder` so an empty field still reads as editable.
- Set `title` (or rely on `label`) so the modal has a clear heading.
