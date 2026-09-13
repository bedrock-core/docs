---
sidebar_position: 11
description: "What this kind of component becomes on the screen it is being drawn on."
---
# useMechanism

What this kind of component becomes on the screen it is being drawn on.

## Import

```tsx
import { useMechanism } from '@bedrock-core/ui';
```

## Signature

```ts
function useMechanism(kind: ComponentKind): Mechanism
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `kind`<Req /> | `ComponentKind` | — | What the author wrote, as the host's table names it |

`ComponentKind` is the library's own vocabulary, not the styled layer's: `'Button'`, `'Toggle'`, `'Select'`, `'Option'`, `'Slider'`, `'Dropdown'`, `'Input'`, `'Form'`, `'Submit'`, `'Slot'`, `'SlotGrid'`.

## Returns

`Mechanism` — one of `'press'`, `'slot'`, `'field'`, `'submit'`, `'cancel'`, `'exit'`, `'collection'` or `'local'`.

`'local'` is the one that costs the host nothing: the client draws it and handles it, and script never hears about it. The rest are the host's own transport, so each is a capability the screen spends.

## Throws

The [host](../guides/hosts.md)'s own refusal when it has no mechanism for the kind. The wording belongs to the screen, because the fix does — the same `Slider` is "put it inside a `<Form>`" on an action form and "a container has no native form" on a container screen.

`ScreenRootError` when nothing above the component names a host at all.

## When to reach for it

This is the seam that lets one component serve every host. You need it when writing a component that *is* one of those kinds and has to draw differently per screen — which is how a `Toggle` is a native field on a modal and a pressed button on a screen of buttons.

```tsx
function Checkbox({ name, label }: CheckboxProps): JSX.Element {
  const mechanism = useMechanism('Toggle');

  return mechanism === 'field'
    ? <Toggle name={name} />
    : <Button action={toggle}><Text>{label}</Text></Button>;
}
```

A component that only lays out or decorates — a card, a header, a row — asks for nothing and needs none of this.

## Notes

A host with no mechanism for the kind throws rather than returning nothing: a component that got an answer it could not use would only draw something inert, which is exactly what the capability model exists to prevent.

[`@bedrock-core/ore-styled`](/docs/ore-styled) is built on this hook, which is why its `Checkbox` works on a modal and on a screen of buttons without the author choosing.
