---
sidebar_position: 18
---
# Form.Dropdown

Themed select field with a chevron, for use inside an ore-styled [`Form`](./Form.md). Pressing it opens a themed popup listing the fixed set of options.

![FormDropdown](/img/ore-styled/FormDropdown.png)
![FormDropdownPopup](/img/ore-styled/FormDropdownPopup.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Form.Dropdown
  label={'Mode'}
  name={'mode'}
  options={['Easy', 'Normal', 'Hard']}
  defaultValue={'Normal'}
/>
```

Built on top of the runtime [`Form.Dropdown`](../ui-runtime/components/FormDropdown.md) primitive and the [theme](./theme.md) token map. Unlike the primitive (which takes `Form.Option` children), this layer keeps the simple `options: string[]` API and maps each string to a `Form.Option value={o} label={o}` under the hood. The current selection sits on the left with a chevron on the right, inside the Ore-UI field frame — same look as the non-`Form` [`Dropdown`](./Dropdown.md).

:::caution Result is an index, not a value
Like the runtime primitive it's built on, `Form.Dropdown` reports the selected option's **index** (a `number`) at `values[name]`, not its `value` string. Map the index back into your own `options` array if you need the string — this differs from the non-`Form` [`Dropdown`](./Dropdown.md), which resolves back to a value string for you.
:::

## Props

### Component-Specific Props

#### `name` (required)
- Type: `string`
- Description: Result key — the selected index appears at `values[name]` in the form's `onSubmit`.

#### `options` (required)
- Type: `string[]`
- Description: The selectable options. The closed box shows the current one; the popup lists them all.

#### `defaultValue`
- Type: `string`
- Default: the first option
- Description: Initial selection.

#### `label`
- Type: `string`
- Description: Caption rendered above the closed box.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the field is interactive. When `false`, renders the disabled face and a dimmed chevron.

#### `currentInsetX` / `currentInsetY`
- Type: `number`
- Default: `8` / vertically centered
- Description: Position offset (px) of the closed-box current-value text from the box's left-middle frame. Unlike the theme-owned colors and fonts, these stay exposed at the instance level because they're a per-instance layout concern — useful for nudging the value text clear of a neighboring dropdown or an overlapping decoration.

### Control Props

`Form.Dropdown` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Examples

### Basic dropdown

```tsx
<Form.Dropdown label={'Mode'} name={'mode'} options={['Easy', 'Normal', 'Hard']} defaultValue={'Normal'} />
```

### Offsetting the current-value text

Two dropdowns side by side, where the second's closed-box value text is nudged 40px right of the default inset so it doesn't sit flush against a neighboring element:

```tsx
<Form.Dropdown label={'Mode'} name={'mode'} options={['Easy', 'Normal', 'Hard']} defaultValue={'Normal'} />
<Form.Dropdown
  label={'Difficulty'}
  name={'difficulty'}
  options={['Easy', 'Normal', 'Hard', 'Expert', 'Insane', 'Nightmare', 'Ultra', 'Custom']}
  defaultValue={'Normal'}
  currentInsetX={48}
/>
```

## Best Practices

- Keep `options` order stable across renders — the result is an index.
- Read `values[name]` as an index and map it back to your own `options` array if you need the string.
- Only reach for `currentInsetX`/`currentInsetY` when the default 8px inset visibly collides with something else in your layout.
