---
sidebar_position: 6
---
# Radio

Single-choice radio set. `RadioGroup` owns the selected value and shares it with its `Radio` children via context.

![Radio](/img/ore-styled/Radio.png)

## Import

```tsx
import { RadioGroup, Radio } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<RadioGroup defaultValue={'easy'} onChange={(v) => console.log(v)}>
  <Radio value={'peaceful'} label={'Peaceful'} />
  <Radio value={'easy'} label={'Easy'} />
  <Radio value={'normal'} label={'Normal'} />
  <Radio value={'hard'} label={'Hard'} />
</RadioGroup>
```

## Props

### `RadioGroup`

#### `value`
- Type: `string`
- Description: Controlled selected value. Provide alongside `onChange` to drive the group from the outside.

#### `defaultValue`
- Type: `string`
- Default: `''`
- Description: Initial selected value when running uncontrolled.

#### `onChange`
- Type: `(value: string) => void`
- Description: Called whenever the player selects a different `Radio`.

#### `disabled`
- Type: `boolean`
- Default: `false`
- Description: Disables every `Radio` inside the group. Individual `Radio`s can still set their own `disabled={true}` regardless.

#### `children`
- Type: `JSX.Node`
- Required: Yes
- Description: One or more `Radio` items.

### `Radio`

#### `value`
- Type: `string`
- Required: Yes
- Description: Identifier matched against the group's selected value.

#### `label`
- Type: `string`
- Description: Text rendered next to the radio. Omit for an unlabelled bullet.

#### `disabled`
- Type: `boolean`
- Description: Disables this `Radio` only. Falls back to the group's `disabled` when unset.

### Control Props

Both `RadioGroup` and `Radio` inherit all standard [control props](../components/control-props.md).

## Examples

### Controlled

```tsx
function DifficultyPicker() {
  const [difficulty, setDifficulty] = useState('easy');

  return (
    <RadioGroup value={difficulty} onChange={setDifficulty}>
      <Radio value={'peaceful'} label={'Peaceful'} />
      <Radio value={'easy'} label={'Easy'} />
      <Radio value={'normal'} label={'Normal'} />
      <Radio value={'hard'} label={'Hard'} />
    </RadioGroup>
  );
}
```

### Disabled Group

```tsx
<RadioGroup defaultValue={'easy'} disabled>
  <Radio value={'easy'} label={'Easy'} />
  <Radio value={'hard'} label={'Hard'} />
</RadioGroup>
```

## Best Practices

- Always provide a `defaultValue` (or `value`) so the group has a clear initial selection — radio groups without a pre-selection are confusing for players.
- Keep `value` strings short and stable — they're not shown to the player, that's what `label` is for.
