---
sidebar_position: 2
description: "A button whose destination is data, so the build can read where it leads."
---
# Link

A button that goes somewhere.

## Import

```tsx
import { Link } from '@bedrock-core/ui';
```

## Usage

```tsx
<Link to={'shop:catalog'}>
  <Text>{'Catalog'}</Text>
</Link>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `to` | `ScreenKey` | — | The screen to open, `<addon>:<name>` as the build wrote it |
| `back` | `boolean` | `false` | Go back to the screen the player came from, whatever it was; set instead of `to` |
| `params` | `Record<string, unknown>` | — | Props the target screen is rendered with; they fill what the layout already reserved |
| `replace` | `boolean` | `false` | Take the place of this screen rather than stacking over it |

Inherits every prop of [`<Button>`](./Button.md) except `action`, and through it [control props](../control-props.md).

## Why not a button that renders

The difference from a `<Button action={() => render(Other, player)}>` is that the destination is **data**: a key on the element, which the build reads straight off the tree. That is what lets a screen of links be described to another addon — its [reference](../../guides/navigation.md#static-screens) is the title, the entry values and one target per entry — and shown by a realm running none of the owner's script.

A press resolves through the installed navigator, so where it leads is decided per realm: this bundle's own screen when it has one, a replicated reference otherwise.

## Examples

### Moving sideways

`replace` is for screens that are peers, where none of them is the way back to another — the pages of a guide, the tabs of a set. A `back` from the target then returns to whatever was under the screen the link was on.

```tsx
<Link to={'guide:page_2'} replace>
  <Text>{'Next'}</Text>
</Link>
```

### The way back

```tsx
<Link back>
  <Text>{'Back'}</Text>
</Link>
```

`back` is the one direction a walk cannot infer. A screen closing and a press that does nothing look identical from outside — the form answers the same either way — so a back control that is only a close leaves whoever opened the screen unable to tell "take me back" from "I am done". As a link the press is attributed.

## Notes

A key with no `<addon>:` in front of it is one of this bundle's own, which is how a screen links to a sibling without repeating a namespace it does not choose.

Nothing resolving the key is a warning where it is decided, not a throw: a screen that did not compile, an addon nobody in this realm runs, or a typo.

A container screen has no key, so `<Link to>` cannot name one. A chest is entered by walking up to an entity.
