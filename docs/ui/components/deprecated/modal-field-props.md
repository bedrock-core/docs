---
sidebar_position: 4
description: "These props belong to the legacy one-modal-per-field components."
---
# Modal field props

:::caution Deprecated
These props belong to the legacy one-modal-per-field components. New [`Form`](../Form/Form.md) fields configure modal chrome differently — there's no per-field `label`/`title`/`body`/`submitLabel`/`tooltip`, since a `Form` has one shared modal and headings are authored as a `Text` node.
:::

Shared props for the **modal-backed field** components — [`Input`](./Input.md), [`Dropdown`](./Dropdown.md), and [`Slider`](./Slider.md).

Native `ActionFormData` (what this runtime renders to) can't take typed input, so each of these components is really a [`Button`](../Button.md) that *looks like* a form field. Pressing it opens a single-control `ModalFormData`; when the player confirms, the value is committed and the root form re-presents. These props configure that modal — they do **not** appear on the button face, which always shows the current value (or placeholder).

`ModalFieldProps` extends [control props](../control-props.md), so every field also supports the full set of layout / visibility / background props.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label for the control *inside* the modal. Not shown on the button face |
| `title` | `string` | the `label` | Title of the modal window |
| `body` | `string` | — | Descriptive text shown above the control. `ModalFormData` has no body, so this renders as a leading label line |
| `submitLabel` | `string` | — | Text on the modal's confirm/submit button |
| `tooltip` | `string` | — | Hover tooltip on the modal control |

## Customizing the face

Each field also accepts a component-specific `face` prop (`JSX.Node`) that overrides what's drawn on the button face — while the component keeps owning the modal flow and value state. This is the seam styled wrappers build on: run the field controlled (`value` + `onChange`) so you know the current value, then pass a `face` node that renders it however you like.

```tsx
<Input
  value={name}
  onChange={setName}
  background={'textures/ui/my_field'}
  face={<Text>{`§f${name === '' ? '§7type a name' : name}`}</Text>}
/>
```

The themed [`@bedrock-core/ore-styled`](/docs/ore-styled) `Input`, `Dropdown`, and `Slider` are exactly this pattern: the chevron and the slider track/thumb are custom `face` nodes.

## TypeScript

```tsx
import type { ModalFieldProps } from '@bedrock-core/ui';
```

Handy when building your own styled wrapper around `Input` / `Dropdown` / `Slider`.
