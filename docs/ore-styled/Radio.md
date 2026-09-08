---
sidebar_position: 8
description: "Single-choice radio set."
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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled selected value. Provide alongside `onChange` to drive the group from the outside |
| `defaultValue` | `string` | `''` | Initial selected value when running uncontrolled |
| `onChange` | `(value: string) => void` | — | Called whenever the player selects a different `Radio` |
| `disabled` | `boolean` | `false` | Disables every `Radio` inside the group. Individual `Radio`s can still set their own `disabled={true}` regardless |
| `children` | `JSX.Node` | — (**required**) | One or more `Radio` items |

### `Radio`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — (**required**) | Identifier matched against the group's selected value |
| `label` | `string` | — | Text rendered next to the radio. Omit for an unlabeled bullet |
| `disabled` | `boolean` | — | Disables this `Radio` only. Falls back to the group's `disabled` when unset |

### Control props

Both `RadioGroup` and `Radio` inherit all standard [control props](/docs/ui/components/control-props).

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

### Disabled group

```tsx
<RadioGroup defaultValue={'easy'} disabled>
  <Radio value={'easy'} label={'Easy'} />
  <Radio value={'hard'} label={'Hard'} />
</RadioGroup>
```

## Notes

- Always provide a `defaultValue` (or `value`) so the group has a clear initial selection — radio groups without a pre-selection are confusing for players.
- Keep `value` strings short and stable — they're not shown to the player, that's what `label` is for.
