---
sidebar_position: 5
description: "core.shared is the replicated mirror every realm holds, as typed trees."
---

# core.shared

`core.shared` is the replicated mirror every realm holds, as typed trees. An addon declares a flat shape once, in `register()`, and gets a tree back whose every key reads, writes and subscribes; every other realm mirrors it and reads it through `core.shared.of()`. Reads are local and synchronous. Writes broadcast a delta over sync's [`State`](/docs/sync/state).

The mirror does exactly one job: **the owner sets a value, every realm can read it now, and is told when it changes.** Two rules follow from it:

1. **Only the owner writes.** A mirror applies a change to a namespace only from the addon that owns it. A peer that wants a change asks over [RPC](/docs/sync/rpc).
2. **Nothing is stored.** The mirror never touches the world. A value that must survive a restart is a [`core.db`](./db.md) document the owner maps onto a key.

## Import

```ts
import { core } from '@bedrock-core/server';
import type { SharedTree, PeerSharedTree } from '@bedrock-core/server';
```

## Declare

A declaration is a flat record. Every top-level key is one value, and an object is one value too — replicated whole on every write.

```ts
export const sharedDef = {
  currency: 'gold',
  spawnRate: 5,
  tags: ['pvp', 'events'],
  event: { name: 'none', active: false },   // one object under one key, written whole
};

/** Export the type: a peer gets the typed tree from `core.shared.of<EconomyShared>()`. */
export type EconomyShared = typeof sharedDef;

const { shared } = core.register({
  manifest: { creator: 'drav0011', pack: 'economy', packName: 'Economy', version: '1.0.0' },
  config: configDef,
  shared: sharedDef,
});
```

`register()` returns the typed accessors of what was declared, one key each: `config` (the scope accessors `registerConfig(definition)` installs) and `shared` (the tree).

A key may not begin `core-`, which is the framework's own announcement prefix; `register()` throws if one does.

## Use your own tree

```ts
shared.currency.get();                        // 'gold'
shared.currency.set('emerald');               // written to the mirror, broadcast this tick

shared.event.get();                           // { name: 'none', active: false }
shared.event.set({ name: 'race', active: true });

shared.currency.subscribe((next, prev) => hud.setCurrency(next));
```

Every key has `get` and `subscribe`, so it is a `ReadonlyObservable` for [`@bedrock-core/observable`](/docs/observable): `computed(() => …, [shared.spawnRate])`, `effect(…, [shared.event])` and `toNative(shared.spawnRate)` take it as it is. The backend subscription is attached with the first listener and released with the last, so a tree nobody watches costs nothing per change.

The owner's tree falls back to the declared value while the mirror holds none, so it answers correctly before its first write lands.

The tree is also reachable later as `core.shared.own`, untyped.

### `shape`

```ts
core.shared.shape: Announcement<Shape>   // Shape = readonly string[]
```

The key names each owner announces under `core-shared/shape`, the [`Announcement`](./announcement.md) a peer's tree is built from.

## Read a peer's tree

```ts
import type { EconomyShared } from '@drav0011/economy-types';

const economy = core.shared.of<EconomyShared>('drav0011_economy');   // undefined until the peer has registered

economy?.currency.get();                        // string | undefined
economy?.event.subscribe(event => ...);
```

`of()` materializes the tree from the key names the owner announced under `core-shared/shape` when it registered; the type argument is the compile-time view over it. A peer's key reads `undefined` while its value has not arrived — a peer never knows what the owner declared — and a peer's tree has no `set` at all, in the type and at runtime.

Peers that only have the namespace, not the type, still get an untyped tree from `core.shared.of(ns)`.

## Who may write

The transport is last-write-wins, which is right for a mirror and wrong for data two realms disagree about. So the mirror applies an entry for a namespace only when it came from the namespace's owner — the sending node for a delta, the recorded writer for a snapshot entry, so a snapshot relayed by a third party still names the original writer. A write from anyone else is dropped and counted in `core.node.state.droppedForeign`.

The local mirror applies the same rule to its own writes, so a foreign write is visible locally exactly when it is visible everywhere, which is never.

This is robustness against a buggy peer, not security: a pack can forge its id, and script events carry no sender identity.

## Persisting a shared value

The mirror is not storage. When a value has to survive a restart, the owner keeps it in a [`core.db`](./db.md) document and maps it across in one line:

```ts
settings.for(world).subscribe(doc => shared.event.set(doc.event));
```

A document's subscriber hears the document load, so that line is correct at boot as well as on every later change.

## Reserved keys

Your namespace carries more than you put there. The framework replicates its own payloads under the same namespace, prefixed `core-`:

| Key | Written by |
|---|---|
| `core-i18n/bundle` | [`core.translations`](./translations.md) — this addon's i18n bundle |
| `core-ui/reference` | [`screens(core)`](/docs/navigation/references) — this addon's compiled screens, as references |
| `core-addon/page` | [`pages(core)`](/docs/navigation/references) — the addon's page in the shared list |
| `core-feature/flags` | [`core.features`](./features.md) — every declared feature's flag, one record |
| `core-shared/shape` | the shared registry — the owner's key names |

Each is an [`Announcement`](./announcement.md). The shared tree never sees them; to reach the raw namespace, framework keys included, use `core.node.state`:

```ts
core.node.state.get(core.id, 'core-feature/flags');
```
