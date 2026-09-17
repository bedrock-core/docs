---
sidebar_position: 7
description: "The context marking that a subtree is inside a native modal form."
---
# ModalContext

The context marking that a subtree is inside a [`<Form>`](../components/Form.md).

## Import

```tsx
import { ModalContext } from '@bedrock-core/ui';
```

## Type

```ts
const ModalContext: Context<FormConfig | null>;

interface FormConfig {
  onSubmit?: (event: SubmitEvent) => void;
  onCancel?: (event: UiEvent) => void;
}
```

`null` — the default — means the subtree is not inside a modal.

## You do not provide this yourself

[`<Form>`](../components/Form.md) provides it once, at its own root, with the `onSubmit` / `onCancel` handlers it was given:

```tsx
<Form onSubmit={values => save(values)}>
  <Toggle name={'sound'} defaultValue={true} />
  <Form.Button type={'submit'} label={'Save'} />
</Form>
```

Nothing below that needs to read or provide it. It exists for the build's own restriction pass, which reads it to enforce that a field such as `Input` only appears inside a `<Form>`, and that no regular `<Button>` or nested `<Form>` appears within one.

## Notes

A `<Form>` written inside another `<Form>` is refused, by the same pass this context feeds — mix the two form kinds across separate screens, never nested.

## Related

- [`<Form>`](../components/Form.md) — the root that provides it
- [createContext](./createContext.md) — how context works in general
- [Hosts](../guides/hosts.md) — the native modal, and what it can carry
