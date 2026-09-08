---
sidebar_position: 9
description: "Segmented button group with single-selection semantics — visually similar to a row of buttons, behaviorally a radio group."
---
# ToggleButton

Segmented button group with single-selection semantics — visually similar to a row of buttons, behaviorally a radio group. Use it when the choices benefit from a button-sized hit target and you want them to read as a connected control.

![ToggleButton](/img/ore-styled/ToggleButton.png)

## Import

```tsx
import { ToggleButtonGroup, ToggleButtonItem } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<ToggleButtonGroup defaultValue={'survival'} onChange={(v) => console.log(v)}>
  <ToggleButtonItem value={'creative'}>{'Creative'}</ToggleButtonItem>
  <ToggleButtonItem value={'survival'}>{'Survival'}</ToggleButtonItem>
  <ToggleButtonItem value={'adventure'}>{'Adventure'}</ToggleButtonItem>
</ToggleButtonGroup>
```

The group lays its items out in a row with their edges flush, reading as a single segmented control. Each item flex-grows to fill the available width evenly.

## Props

### `ToggleButtonGroup`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled selected value. Provide alongside `onChange` to drive selection from the outside |
| `defaultValue` | `string` | `''` | Initial selected value when running uncontrolled |
| `onChange` | `(value: string) => void` | — | Called whenever the player picks a different item |
| `disabled` | `boolean` | `false` | Disables every item in the group. Individual items can still set their own `disabled={true}` regardless |
| `children` | `JSX.Node` | — (**required**) | One or more `ToggleButtonItem` children |

### `ToggleButtonItem`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — (**required**) | Identifier matched against the group's selected value |
| `disabled` | `boolean` | — | Disables this item only. Falls back to the group's `disabled` when unset |
| `children` | `JSX.Node` | — (**required**) | Item content. A string is auto-wrapped in a themed `Text` whose color reflects the selected/unselected/disabled state |

### Control props

Both `ToggleButtonGroup` and `ToggleButtonItem` inherit all standard [control props](/docs/ui/components/control-props).

## Examples

### Controlled

```tsx
function ModePicker() {
  const [mode, setMode] = useState('survival');

  return (
    <ToggleButtonGroup value={mode} onChange={setMode}>
      <ToggleButtonItem value={'creative'}>{'Creative'}</ToggleButtonItem>
      <ToggleButtonItem value={'survival'}>{'Survival'}</ToggleButtonItem>
      <ToggleButtonItem value={'adventure'}>{'Adventure'}</ToggleButtonItem>
    </ToggleButtonGroup>
  );
}
```

### Disabled item

```tsx
<ToggleButtonGroup defaultValue={'easy'}>
  <ToggleButtonItem value={'easy'}>{'Easy'}</ToggleButtonItem>
  <ToggleButtonItem value={'hard'}>{'Hard'}</ToggleButtonItem>
  <ToggleButtonItem value={'extreme'} disabled>{'Extreme'}</ToggleButtonItem>
</ToggleButtonGroup>
```

## Notes

- Use a `ToggleButtonGroup` when the options are short labels and you want a chunky, button-shaped hit area. For longer lists with descriptive labels reach for [`RadioGroup`](./Radio.md) instead.
- Three to five items is the comfortable range — many more and the segments get cramped.
