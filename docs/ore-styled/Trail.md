---
description: "A breadcrumb trail as a row of its own: title > scope > entity, travelling as one value that collapses from the middle when it does not fit."
---
# Trail

The breadcrumb trail every [`Header`](./Header.md) wears, as a row of its own so any screen can show one.

![Trail](/img/ore-styled/Trail.png)

## Import

```tsx
import { Trail, trailText } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Trail segments={['Economy', 'Server', 'Pricing']} />
```

Renders as `Economy > Server > Pricing`, the separators in the trail's lighter color.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | [`DisplayText`](/docs/i18n/api#displaytext) | — | The whole trail as one value, drawn by one label. `trailText` composes one |
| `maxLength` | `number` | — | Characters `text` reserves, which is what makes the label live |
| `segments` | `readonly DisplayText[]` | — | A trail known at build time, in place of `text`: composed by the build in every language, collapsed to the room the row is laid out with |

Inherits [control props](/docs/ui/components/control-props).

## A live trail is one value

A trail whose segments are only known when the screen opens — an addon's name, the entity being edited — is composed server-side and travels as a single `RawMessage`:

```tsx
const trail = trailText(
  [addonName, scopeLabel, entityName],
  core.translations.forPlayer(player),
  { back: 'icon' },
);

<Trail text={trail} maxLength={trailMaxLength()} />
```

A form entry's text is resolved by the **client** before the binding sees it, so every segment reaches the player in their own language off one entry. `maxLength` is what makes the label live: the compiled screen keeps one entry for the trail and shows whatever it is sent.

## Collapsing from the middle

`trailText` resolves every segment through the resolver it is given and drops what does not fit in the room the header's controls leave. The **last** segment always stays — it is where the player is — the **first** is kept while it fits, and the rest come back in from the end:

```text
Economy > Server > Economy > Balances
Economy > ... > Economy > Balances
Economy > ... > Balances
... > Balances
```

Everything dropped becomes one `...` in the trail's own color. `{ back: 'cancel' }` says the header wears a modal's labeled dismiss, which leaves the trail less room than the icon back.

## Baked segments

`segments` is the build-time trail. The build composes it once for every language the pack ships: each segment resolved in that language, then collapsed from the middle to the width the row was laid out at, by the same rule `trailText` applies to a live trail. One label draws it, through a key the build writes into every language, so the player reads their own.

Every segment is already resolved, so the trail's colors ride along as `§` codes.

## Why it hugs

The row is a [`<Panel stack>`](/docs/ui/components/Panel#stack) of hugging labels. A compiled screen solves a box as wide as the longest string it may ever hold, so a shorter one would leave the rest of that box as air and the trail would drift off-center.

The label instead draws at the width of its own glyphs, the engine packs the row, and the stack hangs from the middle — so the trail stays centered on what it actually says.

## Notes

[`Header`](./Header.md) builds a baked trail from its `title` and `breadcrumbs`, or takes a composed one through its `trail` prop. Use `Trail` directly for a trail somewhere other than a header bar.
