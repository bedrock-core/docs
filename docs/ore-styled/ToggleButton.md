---
sidebar_position: 11
description: "One choice out of several, drawn as side-by-side segments with fused borders."
---
# ToggleButtonGroup

One choice out of several, drawn as side-by-side segments.

![ToggleButtonGroup](/img/ore-styled/FormToggleButton.png)

## Import

```tsx
import { ToggleButtonGroup } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<ToggleButtonGroup
  name={'difficulty'}
  label={'Difficulty'}
  options={[
    { value: 'easy', label: 'Easy' },
    { value: 'normal', label: 'Normal' },
    { value: 'hard', label: 'Hard' },
  ]}
  defaultValue={'normal'}
/>
```

The same choice a [`Radio`](./Radio.md) makes, in the shape a segmented control wears. Use it when the options benefit from a button-sized hit target and should read as one connected control.

## It depends on the screen

`ToggleButtonGroup` asks [`useMechanism('Select')`](/docs/ui/hooks/useMechanism) what a single choice becomes on the screen it is being drawn on.

| Screen | What it becomes | What reaches script |
| --- | --- | --- |
| [`<Form>`](/docs/ui/components/roots/Form) | the engine's own [inline select](/docs/ui/components/controls/Select) | nothing until submit — the chosen option's **index** arrives at `values[name]` |
| [`<Screen>`](/docs/ui/components/roots/Screen) | a button per segment | `onChange`, with the chosen **value** |
| [`<Container>`](/docs/ui/components/roots/Container) | a segment whose press is an item taken and put back | `onChange`, with the chosen **value** |

The segments are laid out by the library's own flex system either way — equal widths, and a one-pixel overlap so adjacent borders fuse — so the geometry belongs to this layer and no JSON UI edit follows a change here.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options`<Req /> | `ToggleButtonOption[]` | — | The segments, left to right |
| `name` | `string` | — | Result key on a modal, where it is required; ignored where the press is the answer |
| `label` | `string` | — | Caption rendered above the group |
| `defaultValue` | `string` | the first option | Initial selection, matched on `value` |
| `segmentHeight` | `number` | the theme's toggle-button height | Height of each segment |
| `gap` | `Spacing` | `-1` | Space between segments; `-1` is the overlap that fuses adjacent borders |
| `value` | `string` | — | Held by the caller instead of by the group. Only where a press reaches script |
| `onChange` | `(value: string) => void` | — | Called with the chosen value, on the hosts where a press reaches script |
| `enabled` | `boolean` | `true` | `false` draws the disabled faces and ignores presses |

```ts
interface ToggleButtonOption {
  value: string;
  label: string;
}
```

Inherits every prop of [`Select`](/docs/ui/components/controls/Select) except `children`, with the theme's segment faces and text styles as defaults. Segments are glyph-less by default; pass a `bullet` to opt into one and the primitive's per-state fallbacks apply. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### In a modal

```tsx
const MODES = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
];

<Form onSubmit={({ values }) => setMode(MODES[Number(values.difficulty)].value)}>
  <ToggleButtonGroup name={'difficulty'} label={'Difficulty'} options={MODES} defaultValue={'normal'} />
  <Button action={'submit'}>{'Start'}</Button>
</Form>
```

### On a screen of buttons

```tsx
function ModePicker(): JSX.Element {
  const [mode, setMode] = useState('normal');

  return <ToggleButtonGroup label={'Difficulty'} options={MODES} value={mode} onChange={setMode} />;
}
```

### Separated segments

```tsx
<ToggleButtonGroup name={'view'} options={VIEWS} gap={2} />
```

## Notes

The chosen segment sits a pixel lower than the others, which is what reads as pressed.

Segments share the width evenly, so a long label in one of them widens every segment. Keep them short, or reach for [`Radio`](./Radio.md) where each option gets its own line.
