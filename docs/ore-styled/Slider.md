---
description: "A themed numeric slider for modal forms and live Ore screens."
---
# Slider

A themed numeric slider.

![Slider](/img/ore-styled/Slider.png)

## Import

```tsx
import { Slider } from '@bedrock-core/ore-styled';
```

## Usage

Inside [`<Form>`](/docs/ui/components/Form), the value arrives on submit under `name`. Inside [`<Experimental_OreUI>`](/docs/ui/components/Experimental_OreUI), use `value` and `onChange` for live edits.

```tsx
<Form onSubmit={({ values }) => console.warn(values.volume)}>
  <Slider name={'volume'} label={'Volume'} min={0} max={100} step={5} />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

It is [`Slider`](/docs/ui/components/Slider) with the [theme](./theme.md)'s track, progress fill and thumb textures applied, plus a caption above it. Modal fields report on submit; Ore fields deliver live edits.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | ? | Required result key inside `Form`; optional on an Ore screen |
| `label` | `string` | — | Caption rendered above the slider |
| `min`<Req /> | `number` | — | Minimum selectable value; the left end of the track |
| `max`<Req /> | `number` | — | Maximum selectable value; the right end of the track |
| `step` | `number` | `1` | Increment between selectable values |
| `defaultValue` | `number` | `min` | Initial value |

Inherits every prop of [`Slider`](/docs/ui/components/Slider) — the track, progress and thumb textures, `trackHeight`, `thumbWidth` / `thumbHeight` — with the theme's values as defaults rather than a lock. Through it, [control props](/docs/ui/components/control-props) as well.

## Examples

### A settings form

```tsx
<Form onSubmit={({ values }) => apply(values)}>
  <Slider name={'volume'} label={'Volume'} min={0} max={100} step={5} defaultValue={70} />
  <Slider name={'render'} label={'Render distance'} min={2} max={32} />
  <Form.Button type={'submit'}>{'Apply'}</Form.Button>
</Form>
```

### Disabled

```tsx
<Slider name={'locked'} label={'Volume'} min={0} max={10} defaultValue={5} enabled={false} />
```

## Notes

On `Form`, the native thumb hitbox is fixed at 16 ? 16. The Ore host uses its own live-control presentation.

A modal reports its values together on submit. An Ore screen supports controlled `value` and live `onChange`; see the [experimental host guide](/docs/ui/guides/experimental-ore).

## Limits

Supported inside `Form` and `Experimental_OreUI`. Action forms and container screens refuse this field at build time.
