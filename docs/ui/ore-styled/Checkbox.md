---
sidebar_position: 4
---
# Checkbox

Labelled boolean control. Supports controlled and uncontrolled usage.

![Checkbox](/img/ore-styled/Checkbox.png)

## Import

```tsx
import { Checkbox } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Checkbox label={'Enable notifications'} defaultChecked={true} onChange={(v) => console.log(v)} />
```

## Props

### Component-Specific Props

#### `checked`
- Type: `boolean`
- Description: Controlled value. When provided, the component renders this state and `onChange` is your only way to update it. Omit to use the uncontrolled `defaultChecked` form.

#### `defaultChecked`
- Type: `boolean`
- Default: `false`
- Description: Initial state when running uncontrolled.

#### `onChange`
- Type: `(checked: boolean) => void`
- Description: Called with the next state every time the player toggles the checkbox.

#### `label`
- Type: `string`
- Description: Text rendered next to the checkbox. Omit for a plain box with no label.

#### `disabled`
- Type: `boolean`
- Default: `false`
- Description: When `true`, the checkbox renders the disabled texture and ignores presses.

### Control Props

Checkbox inherits all standard [control props](../components/control-props.md).

## Examples

### Controlled

```tsx
function NotifySetting() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Checkbox checked={enabled} onChange={setEnabled} label={'Enable notifications'} />
  );
}
```

### Uncontrolled

```tsx
<Checkbox defaultChecked={true} label={'Auto-save'} onChange={(v) => console.log('auto-save', v)} />
```

### Disabled

```tsx
<Checkbox checked={true} disabled label={'Locked option'} />
```

## Best Practices

- Reach for the uncontrolled form (`defaultChecked` + `onChange`) when the parent doesn't need to read the value every render.
- Pair related checkboxes in a [`Card`](./Card.md) or a `Panel` with `gap` to keep their hitboxes legible.
