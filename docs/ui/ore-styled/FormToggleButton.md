---
sidebar_position: 16
---
# Form.ToggleButton

Themed single-select segmented group for use inside an ore-styled [`Form`](./Form.md). Renders as side-by-side segments, matching the look of the ActionForm [`ToggleButtonGroup`](./ToggleButton.md).

![FormToggleButton](/img/ore-styled/FormToggleButton.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.ToggleButton
  label={'View'}
  name={'view'}
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'compact', label: 'Compact' },
  ]}
  defaultValue={'grid'}
/>
```

## How it works

Like [`Form.Radio`](./FormRadio.md), `Form.ToggleButton` is a single composed component — not a group + item pair like the non-`Form` [`ToggleButtonGroup` / `ToggleButtonItem`](./ToggleButton.md). Internally it renders the runtime [`Form.InlineSelect`](../ui-runtime/components/FormInlineSelect.md) in row direction, with one [`Form.Option`](../ui-runtime/components/FormOption.md) per entry (equal-width, 1px overlap) — mirroring the non-`Form` control's row exactly. The selected segment uses the theme's pressed face.

:::caution Result is an index, not a value
Like the runtime primitive it's built on, `Form.ToggleButton` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. Map the index back into your own `options` array if you need the string.
:::

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the selected index appears at `values[name]` in the form's `onSubmit`.

#### `options` (required)
- Type: `{ value: string; label: string }[]`
- Description: The segments, left to right.

#### `defaultValue`
- Type: `string`
- Default: the first option
- Description: Initial selected value, matched to its index.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the group is interactive.

#### `label`
- Type: `string`
- Description: Caption rendered above the group.

#### `segmentHeight`
- Type: `number`
- Default: `theme.components.toggleButton.height`
- Description: Height (px) of each segment.

#### `flex` / `width`
- Type: `number` / `FlexSize`
- Description: Layout sizing for the group container.

This component draws on the same theme tokens as the non-`Form` [`ToggleButtonGroup`](./ToggleButton.md) (`theme.components.toggleButton`) — no separate Form-specific theme section exists for it.

## Examples

### Side-by-side with Form.Radio

```tsx
<Panel flexDirection={'row'} gap={8} alignItems={'flex-start'}>
  <Form.Radio
    label={'Team'}
    name={'team'}
    options={[{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }]}
    defaultValue={'blue'}
    flex={1}
  />
  <Form.ToggleButton
    label={'View'}
    name={'view'}
    options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]}
    defaultValue={'grid'}
    flex={1}
  />
</Panel>
```

## Best Practices

- Keep to 3–5 options, same guidance as the non-`Form` [`ToggleButtonGroup`](./ToggleButton.md) — segments get cramped with more.
- Keep `options` order stable across renders — the result is index-based.
- Choose between this and [`Form.Radio`](./FormRadio.md) by label length and hit-target size: short labels read well as segments; longer labels read better as a vertical radio list.
