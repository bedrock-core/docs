---
sidebar_position: 10
description: "One choice out of several with every option visible: a bullet and a label per row."
---
# Radio

One choice out of several, every option visible: a bullet and a label per row.

![Radio](/img/ore-styled/Radio.png)

## Import

```tsx
import { Radio } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Radio
  name={'team'}
  label={'Team'}
  options={[
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
  ]}
  defaultValue={'red'}
/>
```

The options are an array, not children — this layer owns them and maps each entry to a `Form.Option`, so a caller-supplied child could only fight the array.

## It depends on the screen

`Radio` asks [`useMechanism('Select')`](/docs/ui/hooks/useMechanism) what a single choice becomes on the screen it is being drawn on.

| Screen | What it becomes | What reaches script |
| --- | --- | --- |
| [`<Form>`](/docs/ui/components/Form) | the engine's own [inline select](/docs/ui/components/Form/FormInlineSelect) | nothing until submit — the chosen option's **index** arrives at `values[name]` |
| [`<Screen>`](/docs/ui/components/roots/Screen) | a button per row | `onChange`, with the chosen **value** |
| [`<Container>`](/docs/ui/components/roots/Container) | a row whose press is an item taken and put back | `onChange`, with the chosen **value** |

So `name` is the modal's prop, and `value` / `onChange` only do anything where a press reaches script. Note the asymmetry: the modal answers with an index, a press answers with the value.

The rows are laid out by the library's own flex system either way, so the geometry belongs to this layer — change `rowHeight` or `gap` and the in-game layout follows with no JSON UI edit.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options`<Req /> | `RadioOption[]` | — | The options, top to bottom |
| `name` | `string` | — | Result key on a modal, where it is required; ignored where the press is the answer |
| `label` | `string` | — | Caption rendered above the group |
| `defaultValue` | `string` | the first option | Initial selection, matched on `value` |
| `rowHeight` | `number` | `17` | Height of each option row |
| `gap` | `Spacing` | `2` | Space between rows |
| `value` | `string` | — | Held by the caller instead of by the group. Only where a press reaches script |
| `onChange` | `(value: string) => void` | — | Called with the chosen value, on the hosts where a press reaches script |
| `enabled` | `boolean` | `true` | `false` draws the disabled bullets and ignores presses |

```ts
interface RadioOption {
  value: string;
  label: string;
}
```

Inherits every prop of [`Form.InlineSelect`](/docs/ui/components/Form/FormInlineSelect) except `children` — the bullet glyphs per state, their size, the option row faces and the label style — with the theme's values as defaults. Row surfaces default to nothing: the bullet carries the look. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### In a modal, reading the index back

```tsx
const TEAMS = [{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }];

<Form onSubmit={({ values }) => join(TEAMS[Number(values.team)].value)}>
  <Radio name={'team'} label={'Team'} options={TEAMS} defaultValue={'red'} />
  <Form.Button type={'submit'} label={'Join'} />
</Form>
```

### On a screen of buttons, reading the value

```tsx
function TeamPicker(): JSX.Element {
  const [team, setTeam] = useState('red');

  return <Radio label={'Team'} options={TEAMS} value={team} onChange={setTeam} />;
}
```

### Tighter rows

```tsx
<Radio name={'mode'} options={MODES} rowHeight={14} gap={0} />
```

## Notes

Use `Radio` when the options read as a list and each needs its own line. [`ToggleButtonGroup`](./ToggleButton.md) is the same choice drawn as side-by-side segments, for when a button-sized hit target suits better.

## Limits

A screen that can draw neither an inline select nor a press refuses it at build, in that host's own words.
