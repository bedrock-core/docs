---
description: "Choices drawn as side-by-side segments with fused borders: one, or any number with multiple."
---
# ToggleButtons

Choices drawn as side-by-side segments: one, or any number with `multiple`.

![ToggleButtons](/img/ore-styled/FormToggleButton.png)

## Import

```tsx
import { ToggleButtons } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<ToggleButtons
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

With `multiple`, every segment is on or off by itself and pressing one leaves the others alone. Nothing else changes: the segments, their textures and the way a chosen one reads are the same in both modes.

## It depends on the screen

`ToggleButtons` asks [`useMechanism('Select')`](/docs/ui/hooks/useMechanism) what a choice becomes on the screen it is being drawn on.

| Screen | What it becomes | What reaches script |
| --- | --- | --- |
| [`<Form>`](/docs/ui/components/Form) | the engine's own [inline select](/docs/ui/components/Select), or a native toggle per segment with `multiple` | nothing until submit — the chosen **index** arrives at `values[name]`, or with `multiple` the **indices** that are on |
| [`<Screen>`](/docs/ui/components/Screen) | a button per segment | `onChange`, with the chosen **value**, or every chosen **value** with `multiple` |
| [`<Container>`](/docs/ui/components/Container) | a segment whose press is an item taken and put back | `onChange`, as on a screen |

The segments are laid out by the library's own flex system either way — equal widths, and a one-pixel overlap so adjacent borders fuse — so the geometry belongs to this layer and no JSON UI edit follows a change here.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options`<Req /> | `ToggleButtonsOption[]` | — | The segments, left to right |
| `multiple` | `boolean` | `false` | Any number of segments may be on at once |
| `name` | `string` | — | Result key on a modal, where it is required; ignored where the press is the answer |
| `label` | `string` | — | Caption rendered above the segments |
| `defaultValue` | `string`, or `string[]` with `multiple` | the first option, or none with `multiple` | Initial selection, matched on `value` |
| `value` | `string`, or `string[]` with `multiple` | — | Held by the caller instead of by the control. Only where a press reaches script |
| `onChange` | `(value: string) => void`, or `(values: string[]) => void` with `multiple` | — | Called with the chosen value, or every chosen value in segment order, on the hosts where a press reaches script |
| `segmentHeight` | `number` | the theme's toggle-button height | Height of each segment |
| `gap` | `Spacing` | `-1` | Space between segments; `-1` is the overlap that fuses adjacent borders |
| `enabled` | `boolean` | `true` | `false` draws the disabled faces and ignores presses |

```ts
interface ToggleButtonsOption {
  value: string;
  label: string;
}
```

Inherits every prop of [`Select`](/docs/ui/components/Select) except `children`, with the theme's segment faces, label colours and drop as defaults. Segments are glyph-less by default; pass a `bullet` to opt into one and the primitive's per-state fallbacks apply. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### In a modal

```tsx
const MODES = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
];

<Form onSubmit={({ values }) => setMode(MODES[Number(values.difficulty)].value)}>
  <ToggleButtons name={'difficulty'} label={'Difficulty'} options={MODES} defaultValue={'normal'} />
  <Form.Button type={'submit'}>{'Start'}</Form.Button>
</Form>
```

### Several at once in a modal

```tsx
const NOTICES = [
  { value: 'join', label: 'Join' },
  { value: 'leave', label: 'Leave' },
  { value: 'buy', label: 'Buy' },
];

<Form onSubmit={({ values }) => setNotices((values.notices as number[]).map(index => NOTICES[index].value))}>
  <ToggleButtons multiple name={'notices'} label={'Notices'} options={NOTICES} defaultValue={['join']} />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

### On a screen of buttons

```tsx
function ModePicker(): JSX.Element {
  const [mode, setMode] = useState('normal');

  return <ToggleButtons label={'Difficulty'} options={MODES} value={mode} onChange={setMode} />;
}
```

### Separated segments

```tsx
<ToggleButtons name={'view'} options={VIEWS} gap={2} />
```

## Notes

A chosen segment wears the pressed face, a white label and a one-pixel drop, which is what reads as pressed. On a modal the label is drawn inside each state of the engine's own control, so it changes with the segment rather than staying one colour.

Segments share the width evenly, so a long label in one of them widens every segment. Keep them short, or reach for [`Radio`](./Radio.md) where each option gets its own line.
