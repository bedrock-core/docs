---
sidebar_position: 6
description: "A breadcrumb trail as a row of its own: title > scope > entity, with live segments that take no room when empty."
---
# Trail

The breadcrumb trail every [`Header`](./Header.md) wears, as a row of its own so any screen can show one.

## Import

```tsx
import { Trail } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Trail segments={['Economy', 'Server', 'Pricing']} />
```

Renders as `Economy > Server > Pricing`, the separators in the trail's lighter color.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `segments`<Req /> | `readonly TrailSegment[]` | — | The segments in order |

```ts
type TrailSegment = DisplayText | { text: DisplayText; maxLength: number };
```

Inherits [control props](/docs/ui/components/control-props).

## Baked and live segments

A bare segment is **baked**: the build writes the string into the pack.

A segment given a `maxLength` is **live**: the compiled screen keeps a box that wide and shows whatever it is sent at show time — a key the client resolves, or a literal. Reach for it where the text is only known when the screen opens, such as an addon's name or the entity being edited.

```tsx
<Trail segments={[
  'Economy',
  { text: scopeLabel, maxLength: 16 },
  { text: entityName, maxLength: 24 },
]} />
```

A live segment sent empty **hides with its separator**, so a two-deep trail and a three-deep one are the same compiled screen.

## Why each segment is its own label

One label cannot hold two localization keys, so every segment is a `<Text>` of its own. That keeps a key a key all the way to the client, where it resolves in that player's language.

The coloring follows from the same rule: a literal takes the trail color as a `§` code, while a key or a live segment is colored through the label instead, because a `§` code in front of a key stops it resolving.

## Why it hugs

The row is a [`<Panel stack>`](/docs/ui/components/layout/Panel#stack) of hugging labels. A compiled screen solves a box for each segment as wide as the longest string it may ever hold, so a shorter one would leave the rest of that box as air and the trail would drift off-center.

Each label instead draws at the width of its own glyphs, the engine packs them, an empty segment takes no room at all, and the stack hangs from the middle — so the trail stays centered on what it actually says.

## Notes

[`Header`](./Header.md) builds one from its `title` and `breadcrumbs`, or takes a whole `segments` array through to here. Use `Trail` directly for a trail somewhere other than a header bar.
