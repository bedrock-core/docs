---
sidebar_position: 10
---
# Form

Atomic modal form. Renders one native `ModalFormData` — every field is shown at once, and nothing comes back until the player presses submit, at which point every value arrives together, keyed by each field's `name`, in `onSubmit`.

This replaces the older one-modal-per-field pattern ([`Input`](./Input.md), [`Dropdown`](./Dropdown.md), [`Slider`](./Slider.md)), which opens a separate single-control modal per field. Those components are now deprecated — for new screens with more than one field, use `Form`.

## Import

```tsx
import { Form } from '@bedrock-core/ui';
```

`Form` is a namespace object: the root `<Form>` component plus its field members.

- [**`Form`**](#formprops) — the root component; wraps the whole modal.
- [**`Form.Toggle`**](./FormToggle.md) — boolean on/off field.
- [**`Form.Slider`**](./FormSlider.md) — numeric field within a range.
- [**`Form.Dropdown`**](./FormDropdown.md) — select one of a fixed set of options from a popup.
- [**`Form.InlineSelect`**](./FormInlineSelect.md) — same selection model as `Form.Dropdown`, rendered inline with no popup.
- [**`Form.Option`**](./FormOption.md) — one selectable entry, used as a child of `Form.Dropdown` or `Form.InlineSelect`.
- [**`Form.Input`**](./FormInput.md) — single-line text field.
- [**`Form.Button`**](./FormButton.md) — the form's submit/exit action buttons.

## How it works

`Form` renders a transparent host node that marks the tree as a native modal form; the presenter detects it and builds one atomic `ModalFormData` instead of the all-buttons `ActionFormData` used elsewhere. Descendants get access to a `ModalContext`, which a validation pass uses to enforce the rules below.

Decorative nodes — `Text`, `Image`, `Panel`, `Card`, and so on — render fine inside a `Form`; they ride the modal's label slot. There is no `title`/`body` prop on the modal itself — author a heading as a `Text` node instead.

Values only arrive once, in `onSubmit`, keyed by each field's `name`:

```tsx
<Form onSubmit={v => { v.sound; v.volume; }}>
  <Text>{'Settings'}</Text>
  <Form.Toggle   name={'sound'}  defaultValue={true} />
  <Form.Slider   name={'volume'} min={0} max={10} />
  <Form.Dropdown name={'mode'}   defaultValue={'A'}>
    <Form.Option value={'A'} label={'A'} />
    <Form.Option value={'B'} label={'B'} />
  </Form.Dropdown>
  <Form.Input    name={'nick'} />
  <Form.Button   type={'submit'} label={'Save'} />
</Form>
```

## Props

#### `onSubmit`
- Type: `(values: FormValues) => void`
- Description: Called once when the player presses the submit button, with every field's value keyed by its `name`. `FormValues = Record<string, ModalValue>`, where `ModalValue = string | number | boolean | undefined`.

#### `onCancel`
- Type: `() => void`
- Description: Called when the player dismisses the modal — the X button, Esc, or a `Form.Button type="exit"`.

#### `children`
- Type: `JSX.Node`
- Description: Field declarations, decorative content, and the form's action buttons, in any order.

## Rules & Restrictions

These are enforced at build time — violating them throws a `ModalFormError`, not just a lint warning:

- Exactly **one** `Form.Button type="submit"` is required. The native modal has no built-in submit control.
- At most **one** `Form.Button type="exit"` is allowed.
- A `Form` cannot be nested inside another `Form`.
- A plain `Button` or `ItemRenderer` cannot appear inside a `Form` — only `Form.*` field members and decorative nodes are allowed. If you need an `ActionFormData`-style screen with regular buttons, use a separate screen (switch via navigation) instead of nesting form kinds.

## Best Practices

- Give every field a unique, stable `name` — it's the only handle you get back on submit.
- Keep exactly one `Form.Button type="submit"`; add a `type="exit"` only when you want an explicit cancel action distinct from the OS-level Esc/X (which already calls `onCancel`).
- Decorative content (headings, help text, images) is fine anywhere in the flow — it doesn't need to be a field.
- Prefer switching between an `ActionFormData` screen and a `Form` screen via navigation rather than trying to mix both kinds in one tree.

:::note
Advanced: the writer-level `nativeArgs` channel and the `MODAL_*_SLOT_TYPE` string constants (re-exported from the package for custom-writer authors) are internal serialization details — most `Form` users never need to touch them.
:::
