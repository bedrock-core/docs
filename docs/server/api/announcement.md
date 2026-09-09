---
sidebar_position: 12
description: "Announcement is the shape of every cross-addon feed: one owner-written value under a framework key, read from every realm's mirror."
---

# Announcement

`Announcement<T>` is the shape of every cross-addon feed the runtime publishes: one small, owner-written value under a framework key on the [mirror](/docs/sync/state), read from every realm's local copy.

`core.pages` is one. `core.guides` and `core.translations` extend one. `core.features.flags`, `core.config.schema`, `core.config.groups` and `core.shared.shape` are fields of one. Wherever you meet the five members below, they mean the same thing.

## Import

```ts
import type { Announcement, AnnouncementListener } from '@bedrock-core/server';
```

The runtime constructs every announcement; an addon only reads and writes through them.

## Members

| Member | Signature | Description |
|---|---|---|
| `provide` | `(value: T) => void` | Publish this addon's value, replacing the previous one |
| `own` | `() => T \| undefined` | This addon's own published value |
| `of` | `(namespace: string) => T \| undefined` | What another addon published — `undefined` when nothing has arrived, or it fails the guard |
| `namespaces` | `() => string[]` | Every namespace whose value passes the guard |
| `subscribe` | `(listener: AnnouncementListener) => Unsubscribe` | Told which namespace's value changed, locally or from the wire |
| `key` | `StateKey<T>` | The mirror key, `core-<name>`, the same in every namespace |

```ts
type AnnouncementListener = (namespace: string) => void;
```

## Usage

```ts
core.pages.provide(addonPageReference(AddonPage));   // this addon's

core.pages.of('drav0011_shop');                       // a peer's, or undefined
core.pages.namespaces();                              // who published one

const release = core.pages.subscribe((namespace) => {
  redrawRowFor(namespace);
});
```

## Notes

- Reads are local and synchronous. Nothing is fetched: what `of()` returns is the last value that reached this realm's mirror.
- Every value is guarded on read. A peer that publishes something malformed reads as "nothing published" — it cannot poison a consumer.
- Late joiners are covered by sync's snapshot exchange, so an addon that loads after everyone else still sees every announcement.
- Keys are minted under the [reserved `core-` prefix](./shared.md#reserved-keys). Only the framework writes there; `core.shared` refuses a key that starts so.
