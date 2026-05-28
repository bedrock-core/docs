---
sidebar_position: 7
---
# ToggleButton

Segmented button group with single-selection semantics — visually similar to a row of buttons, behaviourally a radio group. Use it when the choices benefit from a button-sized hit target and you want them to read as a connected control.

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

The group lays its items out in a row with negative gap so the button edges butt up against each other and read as a single segmented control. Each item flex-grows to fill the available width evenly.

## Props

### `ToggleButtonGroup`

#### `value`
- Type: `string`
- Description: Controlled selected value. Provide alongside `onChange` to drive selection from the outside.

#### `defaultValue`
- Type: `string`
- Default: `''`
- Description: Initial selected value when running uncontrolled.

#### `onChange`
- Type: `(value: string) => void`
- Description: Called whenever the player picks a different item.

#### `disabled`
- Type: `boolean`
- Default: `false`
- Description: Disables every item in the group. Individual items can still set their own `disabled={true}` regardless.

#### `children`
- Type: `JSX.Node`
- Required: Yes
- Description: One or more `ToggleButtonItem` children.

### `ToggleButtonItem`

#### `value`
- Type: `string`
- Required: Yes
- Description: Identifier matched against the group's selected value.

#### `disabled`
- Type: `boolean`
- Description: Disables this item only. Falls back to the group's `disabled` when unset.

#### `children`
- Type: `JSX.Node`
- Required: Yes
- Description: Item content. A string is auto-wrapped in a themed `Text` whose color reflects the selected/unselected/disabled state.

### Control Props

Both `ToggleButtonGroup` and `ToggleButtonItem` inherit all standard [control props](../ui-runtime/components/control-props.md).

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

### Disabled Item

```tsx
<ToggleButtonGroup defaultValue={'easy'}>
  <ToggleButtonItem value={'easy'}>{'Easy'}</ToggleButtonItem>
  <ToggleButtonItem value={'hard'}>{'Hard'}</ToggleButtonItem>
  <ToggleButtonItem value={'extreme'} disabled>{'Extreme'}</ToggleButtonItem>
</ToggleButtonGroup>
```

## Best Practices

- Use a `ToggleButtonGroup` when the options are short labels and you want a chunky, button-shaped hit area. For longer lists with descriptive labels reach for [`RadioGroup`](./Radio.md) instead.
- Three to five items is the comfortable range — many more and the segments get cramped.
