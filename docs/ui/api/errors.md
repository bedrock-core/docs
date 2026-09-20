---
sidebar_position: 5
description: "The error classes the UI throws, what each one means, and the fix it names."
---
# Errors

Every error the library throws is a class you can catch with `instanceof`. Each one names the fix rather than only the symptom.

## Import

```ts
import {
  ContainerScreenError,
  ModalFormError,
  ScreenRootError,
  SerializationError,
  UncompiledScreenError,
} from '@bedrock-core/ui';
```

## UncompiledScreenError

`render()` was handed a screen the build never compiled, so nothing in the pack answers to its title.

Two things produce a registration: the [`ui-compiler` filter](/docs/filters/ui-compiler) seeing the screen, and `@bedrock-core/generated/ui` being imported once so the registrations run. Check both.

## ScreenRootError

The tree has no host root, or a root below its root.

A screen's root names its [host](../guides/hosts.md) — [`<Screen>`](../components/Screen.md), [`<Form>`](../components/Form.md) or [`<Container>`](../components/Container.md) — and there is no default, so a tree that starts with a `Panel`, a themed card, or two elements side by side has no screen to be. Providers and fragments above the root are looked through.

It is also what a component throws when it asks [`useMechanism`](../hooks/useMechanism.md) and nothing above it names a host at all.

## ContainerScreenError

The tree breaks the container-screen rules. The cases:

- a `<Container>` handed to `render()`, or a form handed to `createContainerScreen`
- a container-only control — [`<Slot>`](../components/Slot.md), [`<SlotGrid>`](../components/SlotGrid.md) — outside a `<Container>`
- a `<Container>` naming neither `entity` nor `block`, or both
- more container slots than a block-hosted screen's 54-slot cap
- content that does not fit the 320 × 210 canvas, which a container screen cannot scroll past
- a hook that needs a player where one compiled layout serves every player

## ModalFormError

The tree breaks the modal rules: a regular `<Button>` inside a `<Form>`, a `Form.*` field outside one, no submit button, or more than one.

A native modal draws only its typed fields plus its submit and exit buttons. Mix the two form kinds across separate screens, never nested.

## SerializationError

A value could not be written into the payload the render pack decodes — most often a string holding the pad character, or a field past the width its slot reserves.

## Notes

Every one of these is thrown at **build** time where it can be: the compiler renders each screen once, so a refusal reaches you as a failed build with the control and the host named, rather than as a screen drawn inert in game.

`TranslationKeysError` is exported and never thrown: a key missing from the resolver measures as the literal key string, mirroring how Bedrock paints an unmatched key.
