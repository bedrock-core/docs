---
sidebar_position: 15
---
# Form.Radio

Themed single-select radio group for use inside an ore-styled [`Form`](./Form.md). Renders as a bullet + label per option, stacked vertically, matching the look of the ActionForm [`Radio`](./Radio.md).

![FormRadio](/img/ore-styled/FormRadio.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.Radio
  label={'Team'}
  name={'team'}
  options={[
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
  ]}
  defaultValue={'blue'}
/>
```

## How it works

`Form.Radio` is a single composed component — not a group + item pair like the non-`Form` [`RadioGroup` / `Radio`](./Radio.md). Internally it renders the runtime [`Form.InlineSelect`](../ui-runtime/components/FormInlineSelect.md) with one [`Form.Option`](../ui-runtime/components/FormOption.md) per entry in `options`, styled with the theme's `radio` bullet textures. Since each option is a genuinely flex-laid-out child, changing `rowHeight`/`gap` reflows the whole group with no JSON-UI edit.

:::caution Result is an index, not a value
Like the runtime primitive it's built on, `Form.Radio` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. Map the index back into your own `options` array if you need the string.
:::

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the selected index appears at `values[name]` in the form's `onSubmit`.

#### `options` (required)
- Type: `{ value: string; label: string }[]`
- Description: The options, top to bottom.

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

#### `rowHeight`
- Type: `number`
- Default: `17`
- Description: Height (px) of each option row.

#### `gap`
- Type: `number`
- Default: `2`
- Description: Vertical gap (px) between option rows.

#### `flex` / `width`
- Type: `number` / `FlexSize`
- Description: Layout sizing for the group container.

This component draws on the same theme tokens as the non-`Form` [`Radio`](./Radio.md) (`theme.components.radio`) — no separate Form-specific theme section exists for it.

## Examples

### Side-by-side with Form.ToggleButton

```tsx
<Panel flexDirection={'row'} gap={8} alignItems={'flex-start'}>
  <Form.Radio
    label={'Team'}
    name={'team'}
    options={[{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }, { value: 'green', label: 'Green' }]}
    defaultValue={'blue'}
    flex={1}
  />
  <Form.ToggleButton
    label={'View'}
    name={'view'}
    options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'compact', label: 'Compact' }]}
    defaultValue={'grid'}
    flex={1}
  />
</Panel>
```

## Best Practices

- Keep `options` order stable across renders — the result is index-based, so reordering shifts what a saved index means.
- Use `flex`/`width` to size the group within a row, as in the side-by-side example above.
- Prefer [`Form.ToggleButton`](./FormToggleButton.md) instead when the options read better as short segmented labels than a vertical list.
