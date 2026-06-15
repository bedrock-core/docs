---
sidebar_position: 12
---
# Modal Field Props

Shared props for the **modal-backed field** components — [`Input`](./Input.md), [`Dropdown`](./Dropdown.md), and [`Slider`](./Slider.md).

Native `ActionFormData` (what this runtime renders to) can't take typed input, so each of these components is really a [`Button`](./Button.md) that *looks like* a form field. Pressing it opens a single-control `ModalFormData`; when the player confirms, the value is committed and the root form re-presents. These props configure that modal — they do **not** appear on the button face, which always shows the current value (or placeholder).

`ModalFieldProps` extends [control props](./control-props.md), so every field also supports the full set of layout / visibility / background props.

## Available Props

#### `label`
- Type: `string`
- Description: Label for the control *inside* the modal. Not shown on the button face.

#### `title`
- Type: `string`
- Default: the `label`
- Description: Title of the modal window.

#### `body`
- Type: `string`
- Description: Descriptive text shown above the control. `ModalFormData` has no body, so this renders as a leading label line.

#### `submitLabel`
- Type: `string`
- Description: Text on the modal's confirm/submit button.

#### `tooltip`
- Type: `string`
- Description: Hover tooltip on the modal control.

## TypeScript

```tsx
import type { ModalFieldProps } from '@bedrock-core/ui';
```

Handy when building your own styled wrapper around `Input` / `Dropdown` / `Slider`.
