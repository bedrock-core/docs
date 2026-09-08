---
sidebar_position: 6
description: "Labeled boolean control."
---
# Checkbox

Labeled boolean control. Supports controlled and uncontrolled usage.

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

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Controlled value. When provided, the component renders this state and `onChange` is your only way to update it. Omit to use the uncontrolled `defaultChecked` form |
| `defaultChecked` | `boolean` | `false` | Initial state when running uncontrolled |
| `onChange` | `(checked: boolean) => void` | — | Called with the next state every time the player toggles the checkbox |
| `label` | `string` | — | Text rendered next to the checkbox. Omit for a plain box with no label |
| `disabled` | `boolean` | `false` | When `true`, the checkbox renders the disabled texture and ignores presses |

### Control props

Checkbox inherits all standard [control props](/docs/ui/components/control-props).

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

## Notes

- Reach for the uncontrolled form (`defaultChecked` + `onChange`) when the parent doesn't need to read the value every render.
- Pair related checkboxes in a [`Card`](./Card.md) or a `Panel` with `gap` to keep their hitboxes legible.
