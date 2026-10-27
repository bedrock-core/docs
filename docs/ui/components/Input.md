---
description: "Single-line text field with submitted modal results or live Ore edits."
---
# Input

Single-line text field for a [`Form`](./Form.md) or [`Experimental_OreUI`](./Experimental_OreUI.md) screen.

## Import

```tsx
import { Form, Input } from '@bedrock-core/ui';
```

## Usage

```tsx
<Form onSubmit={v => console.warn(v.nickname)}>
  <Input name={'nickname'} placeholder={'§7type here'} />
  <Form.Button type={'submit'}>{'Save'}</Form.Button>
</Form>
```

## How it works

Inside `Form`, the native text field reports a string at `values[name]` on submit. Inside `Experimental_OreUI`, `value` controls the text and `onChange` receives live edits. Without `value`, the live field retains internal state initialized by `defaultValue`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Required result key inside `Form`; optional on an Ore screen |
| `value` | `string` | internal state | Controlled text on an Ore screen; modal forms use `defaultValue` |
| `onChange` | `(value: string, event: UiEvent) => void \| Promise<void>` | — | Receives live Ore edits and the owning player's event |
| `placeholder` | `string` | — | Text shown inside the native field when empty |
| `defaultValue` | `string` | `''` | Initial text |
| `font` | `TextFont` | `'mojangles'` | Font family for the typed value and placeholder |
| `scale` | `number` | `1.0` | Scale multiplier relative to the standard glyph size |
| `textOffsetX` / `textOffsetY` | `number` | `8` / vertically centered | Typed-value position offset (px) from the box's left-middle frame |
| `placeholderOffsetX` / `placeholderOffsetY` | `number` | `8` / vertically centered | Placeholder position offset (px), same frame as the typed value |

The box uses `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](./Button.md); `backgroundPressed` doubles as the focused-field state.

Inherits [control props](./control-props.md).

## Examples

### Basic input

```tsx
<Input name={'nickname'} placeholder={'§7type here'} />
```

### Two inputs side by side

```tsx
<Panel flexDirection={'row'} gap={4}>
  <Input name={'first'} placeholder={'§7first'} flex={1} />
  <Input name={'second'} placeholder={'§7second'} flex={1} />
</Panel>
```

## Notes

- Always provide a `placeholder` — it's the only hint the player gets about what to type.
- Inside `Form`, keep `name` stable across renders; it identifies the submitted value.
- For themed screens, prefer [`@bedrock-core/ore-styled`](/docs/ore-styled/Input)'s `Input` over styling this primitive by hand.

## Limits

Supported inside `Form` and `Experimental_OreUI`. Action forms and container screens refuse text fields at build time. The Ore host requires [version-matched client resources](../guides/experimental-ore.md).
