---
sidebar_position: 2
description: "A screen one pack draws into another pack's screen, over an area the host reserves."
---
# Embed

A screen another pack draws into this one.

## Import

```tsx
import { Embed, EmbedSlots, embedMarker } from '@bedrock-core/ui';
```

## Why it exists

A compiled screen's layout lives in the pack of the addon that built it, and a host realm shows it by title. Some of what a host draws is not the host's to bake: the page for one addon in the addon list — its thumbnail, its description, its authors — belongs to that addon, baked in that addon's pack, and the host has nothing to say about it but where it goes.

Neither side renders the other. The one contract is the host's frame, the area's place in it, and the slot count.

## The embedded side

`<Embed>` is the root of the embedded component: a panel the size of the area the host leaves for it. That area is its canvas — the tree fills it, and nothing inside knows where the host put it.

```tsx
<Embed frame={{ width: 300, height: 200 }} area={{ x: 90, y: 20, width: 200, height: 160 }}>
  <Image texture={'textures/ui/my_icon'} width={32} height={32} />
  <Text maxLength={40}>{description}</Text>
</Embed>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `frame`<Req /> | `{ width: number; height: number }` | — | The canvas the host bakes its own screen against |
| `area`<Req /> | `{ x: number; y: number; width: number; height: number }` | — | The area of that frame this component fills |

Inherits [control props](../control-props.md) except `width` and `height`, which come from `area`.

## The host side

`<EmbedSlots>` is the run of entries a host reserves before its own. Slot 0 carries a **marker** naming the embedded screen; the pack holding that screen gates it on the marker instead of on the title, and draws it over the host's canvas. The slots after it are the embedded screen's own entries, which the host writes from the values the screen's owner published and reads back as presses by slot.

```tsx
<EmbedSlots
  count={6}
  values={[embedMarker('shop'), ...publishedValues]}
  onPress={(index) => console.warn(`embedded entry ${String(index)}`)}
/>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `count`<Req /> | `number` | — | How many entries are reserved; a constant of the embedding screen |
| `values`<Req /> | `readonly string[]` | — | What each slot carries this present — the marker first, then the embedded screen's values |
| `onPress` | `(index: number, event: PressEvent) => unknown` | — | A press on slot `index`, never 0 |

## embedMarker

```ts
embedMarker(namespace: string): string
```

The value slot 0 carries for one addon's screen: `core_addon:<namespace>`, which is also the namespace that addon's compiled screens are emitted under.

## Notes

An embedded screen's own entries are numbered from **1**, because slot 0 is the marker. Both sides walk the tree through the same helper, so the numbering cannot drift.

`count` is a constant of the embedding screen: the embedded one is baked against it, so changing it means rebuilding both packs.
