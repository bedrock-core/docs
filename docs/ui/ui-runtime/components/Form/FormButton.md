---
sidebar_position: 8
---
# Form.Button

The submit/exit action button of a [`Form`](./Form.md).

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

## Usage

```tsx
<Panel flexDirection={'row'} gap={4}>
  <Form.Button type={'submit'} label={'Save'} flex={2} />
  <Form.Button type={'exit'} label={'Cancel'} flex={1} />
</Panel>
```

## How it works

`Form.Button` is **not** a native modal control and consumes no `formValues` slot, so you can position it anywhere in the form's layout flow like any other row.

A `Form` enforces the cardinality of these buttons at build time (see [`Form`'s Rules & Restrictions](./Form.md#rules--restrictions)): exactly one `type="submit"` is required, and at most one `type="exit"` is allowed.

## Props

### Component-Specific Props

#### `type` (required)
- Type: `'submit' | 'exit'`
- Description: `'submit'` presses the native submit — field values return via the form's `onSubmit`. `'exit'` closes the form like Esc — no values, the form's `onCancel` fires instead.

#### `label`
- Type: `string`
- Default: `'Submit'` for `type="submit"`, `'Close'` for `type="exit"`
- Description: Button text.

### Control Props

`Form.Button` inherits all standard [control props](../control-props.md), plus `background`/`backgroundHover`/`backgroundPressed`/`backgroundLocked` for per-state texturing — the same shape as [`Button`](../Button.md). Defaults to `width: '100%'` when no explicit sizing is given.

## Examples

### Submit + exit pair

```tsx
<Panel flexDirection={'row'} gap={4} padding={4}>
  <Form.Button type={'submit'} label={'Save'} flex={2} />
  <Form.Button type={'exit'} label={'Cancel'} flex={1} />
</Panel>
```

## Best Practices

- Give the submit button an actionable label ("Save", not the generic default "Submit") — it's user-facing.
- Only add a `type="exit"` button when you want an explicit, visible cancel action — Esc/X already calls `onCancel` without one.
- Position these anywhere in the form's flow; they don't need to be the last elements.
- For themed screens, prefer [`@bedrock-core/ore-styled`](../../../ore-styled/Form/FormButton.md)'s `Form.Button`, which adds a `variant` prop.
