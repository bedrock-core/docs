---
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

Inside [`<Form>`](/docs/ui/components/Form), the selected index arrives on submit under `name`. Inside [`<Experimental_OreUI>`](/docs/ui/components/Experimental_OreUI), `onChange` receives the selected option value.

```tsx
<Form onSubmit={({ values }) => console.warn(values.difficulty)}>
  <Dropdown
    name={'difficulty'}
    label={'Difficulty'}
    options={['Peaceful', 'Easy', 'Normal', 'Hard']}
    defaultValue={'Normal'}
  />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

It is [`Dropdown`](/docs/ui/components/Dropdown) with the [theme](./theme.md)'s closed-box, popup and option-row textures applied, plus a caption above the box. The ore layer owns the option children: it maps each entry of `options` to a `Option` whose value and label are both that string, which is why `children` is not accepted here.

:::caution Modal results use indexes
Like the primitive, the submitted value is the selected option's **index** (a `number`), not the string — that is the native modal dropdown's behavior. Read it back as `options[values[name]]`. On an Ore screen, `onChange` receives the option string instead.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | ? | Required result key inside `Form`; optional on an Ore screen |
| `options`<Req /> | `string[]` | — | The selectable options; each becomes a `Option` with its value and label set to the string |
| `label` | `string` | — | Caption rendered above the closed box |
| `defaultValue` | `string` | the first option | Initial selection, matched against one of `options` |

Inherits every prop of [`Dropdown`](/docs/ui/components/Dropdown) except `children` — the popup background, the option row faces, the option and current-value text styles — with the theme's values as defaults rather than a lock. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### Reading the selection back

```tsx
const MODES = ['Peaceful', 'Easy', 'Normal', 'Hard'];

<Form onSubmit={({ values }) => console.warn(MODES[Number(values.difficulty)])}>
  <Dropdown name={'difficulty'} label={'Difficulty'} options={MODES} defaultValue={'Normal'} />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

### Disabled

```tsx
<Dropdown name={'mode'} label={'Mode'} options={['A', 'B']} enabled={false} />
```

`enabled={false}` draws the disabled texture, dims the chevron and makes the box inert.

## Notes

A modal reports its values together on submit. An Ore screen supports controlled `value` and live `onChange`; see the [experimental host guide](/docs/ui/guides/experimental-ore).

For the same selection model drawn inline, with no popup, use [`Select`](/docs/ui/components/Select) — or [`Radio`](./Radio.md) and [`ToggleButtons`](./ToggleButtons.md) for its themed forms.

## Limits

Supported inside `Form` and `Experimental_OreUI`. Action forms and container screens refuse this field at build time.
