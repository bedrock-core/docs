---
sidebar_position: 1
description: "States which screen a fragment is written for, and fails the build by name when it is drawn on another."
---
# Expect

States which screen a fragment is written for, and fails the build by name when it is drawn on another.

## Import

```tsx
import { Expect } from '@bedrock-core/ui';
```

## Usage

```tsx
export const AccountFields = (): JSX.Element => (
  <Expect host={'form-modal'}>
    <Form.Input name={'nickname'} />
    <Form.Toggle name={'notify'} />
  </Expect>
);
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `host`<Req /> | `'form-action' \| 'form-modal' \| 'chest'` | — | The screen this fragment is written for |

Draws nothing and takes no layout space: its children are laid out as though it were not there.

## When to reach for it

A root names the host, so anything under a `<Screen>`, `<Form>` or `<Container>` already knows what it becomes. This is for the other case: a component library that renders **into** a screen it does not own — a set of fields meant for a modal, exported as a fragment for an addon to place.

Written at the top of that fragment, it says what the library assumed. An addon that drops it on the wrong screen is told where, once, instead of being told about each field in turn.

## Notes

The host ids are the same three [Hosts](../../guides/hosts.md) names a root resolves to.
