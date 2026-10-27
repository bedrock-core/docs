---
description: "A themed single-line text field for modal forms and live Ore screens."
---
# Input

A themed single-line text field.

![Input](/img/ore-styled/Input.png)

## Import

```tsx
import { Input } from '@bedrock-core/ore-styled';
```

## Usage

Inside [`<Form>`](/docs/ui/components/Form), the value arrives on submit under `name`. Inside [`<Experimental_OreUI>`](/docs/ui/components/Experimental_OreUI), use `value` and `onChange` for live edits.

```tsx
<Form onSubmit={({ values }) => console.warn(values.nickname)}>
  <Input name={'nickname'} label={'Name'} placeholder={'type your name'} width={160} />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

It is [`Input`](/docs/ui/components/Input) with the [theme](./theme.md)'s field textures and font applied, plus a caption above the box. Modal fields report on submit; Ore fields deliver live edits.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | ? | Required result key inside `Form`; optional on an Ore screen |
| `label` | `string` | — | Caption rendered above the field |
| `placeholder` | `string` | — | Text shown inside the field when it is empty |
| `defaultValue` | `string` | `''` | Initial text |

Inherits every prop of [`Input`](/docs/ui/components/Input) — the font, the scale, the text offsets and the per-state box textures — with the theme's values as defaults rather than a lock: pass one and yours wins. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### Two fields in one form

```tsx
<Form onSubmit={({ values }) => save(values.nickname, values.motto)}>
  <Input name={'nickname'} label={'Name'} placeholder={'type your name'} />
  <Input name={'motto'} label={'Motto'} defaultValue={'hello'} />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

### Disabled

```tsx
<Input name={'locked'} label={'Name'} defaultValue={'Steve'} enabled={false} />
```

## Notes

Give the field a `width`, or let it stretch in a column, so the framed box reads as a field even when empty. A `placeholder` keeps an empty one reading as editable.

A modal reports its values together on submit. An Ore screen supports controlled `value` and live `onChange`; see the [experimental host guide](/docs/ui/guides/experimental-ore).

## Limits

Supported inside `Form` and `Experimental_OreUI`. Action forms and container screens refuse this field at build time.
