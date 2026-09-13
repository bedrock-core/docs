---
sidebar_position: 10
description: "A themed dropdown for a modal form, with the options given as a string array."
---
# Dropdown

A themed dropdown: the current selection with a chevron, and a popup listing the options.

![Dropdown](/img/ore-styled/Dropdown.png)

## Import

```tsx
import { Dropdown } from '@bedrock-core/ore-styled';
```

## Usage

Render it inside a [`<Form>`](/docs/ui/components/Form). The selection arrives in the form's `onSubmit`, keyed by `name`.

```tsx
<Form onSubmit={({ values }) => console.warn(values.difficulty)}>
  <Dropdown
    name={'difficulty'}
    label={'Difficulty'}
    options={['Peaceful', 'Easy', 'Normal', 'Hard']}
    defaultValue={'Normal'}
  />
  <Form.Button type={'submit'} label={'Save'} />
</Form>
```

It is [`Form.Dropdown`](/docs/ui/components/Form/FormDropdown) with the [theme](./theme.md)'s closed-box, popup and option-row textures applied, plus a caption above the box. The ore layer owns the option children: it maps each entry of `options` to a `Form.Option` whose value and label are both that string, which is why `children` is not accepted here.

:::caution The result is an index
Like the primitive, the submitted value is the selected option's **index** (a `number`), not the string — that is the native modal dropdown's behavior. Read it back as `options[values[name]]`.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`<Req /> | `string` | — | Result key — the selected index appears at `values[name]` in the form's `onSubmit` |
| `options`<Req /> | `string[]` | — | The selectable options; each becomes a `Form.Option` with its value and label set to the string |
| `label` | `string` | — | Caption rendered above the closed box |
| `defaultValue` | `string` | the first option | Initial selection, matched against one of `options` |

Inherits every prop of [`Form.Dropdown`](/docs/ui/components/Form/FormDropdown) except `children` — the popup background, the option row faces, the option and current-value text styles — with the theme's values as defaults rather than a lock. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### Reading the selection back

```tsx
const MODES = ['Peaceful', 'Easy', 'Normal', 'Hard'];

<Form onSubmit={({ values }) => console.warn(MODES[Number(values.difficulty)])}>
  <Dropdown name={'difficulty'} label={'Difficulty'} options={MODES} defaultValue={'Normal'} />
  <Form.Button type={'submit'} label={'Save'} />
</Form>
```

### Disabled

```tsx
<Dropdown name={'mode'} label={'Mode'} options={['A', 'B']} enabled={false} />
```

`enabled={false}` draws the disabled texture, dims the chevron and makes the box inert.

## Notes

There is no `onChange`: a native modal is atomic, so nothing reaches script while the form is open.

For the same selection model drawn inline, with no popup, use [`Form.InlineSelect`](/docs/ui/components/Form/FormInlineSelect) — or [`Radio`](./Radio.md) and [`ToggleButtonGroup`](./ToggleButton.md) for its themed forms.

## Limits

Modal-only. The engine draws no dropdown on an action form or a container screen, so [`useMechanism('Dropdown')`](/docs/ui/hooks/useMechanism) refuses it there at build, naming the fix.
