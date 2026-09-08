---
sidebar_position: 5
description: "core.shared is the replicated mirror every realm holds, as typed trees."
---

# core.shared

`core.shared` is the replicated mirror every realm holds, as typed trees. An addon declares a shape once, in `register()`, and gets a tree back whose every node reads, writes and subscribes; every other realm mirrors it and reads it through `core.shared.of()`. Reads are local and synchronous. Writes broadcast a delta over sync's [`State`](/docs/sync/state).

Two rules make it safe to build on:

1. **Only the owner writes.** A mirror applies a change to a namespace only from the addon that owns it, unless the owner marked the leaf `open()`.
2. **`persisted()` survives restarts.** The owner writes those leaves to the world on change and restores them on boot; nobody else has to.

## Import

```ts
import { core, open, persisted, leaf } from '@bedrock-core/server-runtime';
import type { SharedTree, PeerSharedTree } from '@bedrock-core/server-runtime';
```

## Declare

Values are leaves, plain objects are branches, and three markers change how a leaf or a whole branch behaves:

```ts
export const sharedDef = {
  currency: 'gold',
  spawnRate: 5,
  tags: ['pvp', 'events'],                                // an array is one leaf
  votes: open(0),                                          // any realm may write it
  event: persisted({ name: 'none', active: false }),      // both leaves survive restarts
  palette: leaf({ fg: '#fff', bg: '#000' }),               // one object under one key, not a branch
};

/** Export the type: a peer gets the typed tree from `core.shared.of<EconomyShared>()`. */
export type EconomyShared = typeof sharedDef;

const { shared } = core.register({
  manifest: { creator: 'drav0011', pack: 'economy', packName: 'Economy', version: '1.0.0' },
  config: configDef,
  shared: sharedDef,
});
```

`register()` returns the typed accessors of what was declared, one key each: `config` (the scope accessors, the same value `core.config.define()` returns) and `shared` (the tree). Markers nest (`persisted(open(0))`) and a marker on a branch applies to every leaf under it. Nested keys become dotted mirror keys (`event.active`), which is what a raw `core.node.state.get(ns, 'event.active')` sees.

A branch cannot have a child named `get`, `set`, `patch` or `subscribe`, and keys cannot contain a dot; `register()` throws on either.

## Use your own tree

```ts
shared.currency.get();                        // 'gold'
shared.currency.set('emerald');               // written to the mirror, broadcast this tick

shared.event.get();                           // { name: 'none', active: false }
shared.event.set({ name: 'race', active: true });
shared.event.patch({ active: false });        // only the leaves given, at any depth
shared.patch({ event: { name: 'quiet' } });

shared.currency.subscribe(kind => hud.setCurrency(kind));      // a leaf
shared.event.subscribe(event => …);                             // a branch — any leaf under it
shared.subscribe(all => …);                                     // the whole namespace
```

Every node has `get` and `subscribe`, so a leaf is a `ReadonlyObservable` for `@bedrock-core/observable`: `computed(() => …, [shared.spawnRate])`, `effect(…, [shared.event.active])` and `toNative(shared.spawnRate)` take it as it is.

The tree is also reachable later as `core.shared.own`, untyped.

## Read a peer's tree

```ts
import type { EconomyShared } from '@drav0011/economy-types';

const economy = core.shared.of<EconomyShared>('drav0011_economy');   // undefined until the peer has registered

economy?.currency.get();                        // string | undefined
economy?.event.subscribe(event => …);
economy?.votes.set(1);                          // only because the owner said open(); a compile error on any other leaf
```

`of()` materializes the tree from the shape the owner announced under `core-shared/shape` when it registered; the type argument is the compile-time view over it, the same arrangement as `core.config.of<Def>()`. A peer's leaf reads `undefined` while its value has not arrived yet, and a peer's branch has no `set`.

Peers that only have the namespace, not the type, still get an untyped tree from `core.shared.of(ns)`.

## Who may write

The transport is last-write-wins, which is right for a mirror and wrong for data two realms disagree about. So the mirror applies an entry for a namespace only when it came from the namespace's owner — the addon whose id it is. A write from anyone else is dropped and counted in `core.node.state.droppedForeign`.

`open()` is the exception, declared by the owner: a mirror takes anyone's write for those leaves, last write wins, and the flag itself can only be set or cleared by the owner. Use it for the counter, the vote, the thing that genuinely has many writers.

This is robustness against a buggy peer, not security: a pack can forge its id, and script events carry no sender identity.

## Persistence

`persisted()` leaves are written to the world as JSON on every change, under `core-shared:<namespace>:<key>`, and written back into the mirror one tick after registration — dynamic properties are not readable before the first tick. Until then the owner's own tree answers with the declared value. Nothing else is saved: a leaf without the marker starts at its declared value on every boot.

A dynamic property string caps at 32 767 characters and throws past it. A persisted shared value is a small value by construction; documents belong in `@bedrock-core/db`.

## Reserved keys

Your namespace carries more than you put there. The framework replicates its own payloads under the same namespace, prefixed `core-`:

| Key | Written by |
|---|---|
| `core-config/schema`, `core-config/groups` | [ConfigRegistry](./config.md) — the published config schema |
| `core-i18n/bundle` | [TranslationsRegistry](./translations.md) — this addon's i18n bundle |
| `core-guide/manifest`, `core-guide/reference` | [GuidesRegistry](./guides.md) — the guide |
| `core-addon/page` | PagesRegistry — the addon's page in the shared list |
| `core-feature/<id>` | [FeatureManager](./features.md) — one boolean per declared feature |
| `core-shared/shape` | the shared registry — every leaf path, and which are open |

The shared tree never sees them. To reach the raw namespace, framework keys included, use `core.node.state`:

```ts
core.node.state.get(core.id, 'core-config/schema');
```

## `core.state`

The string-keyed `core.state` (`set` / `get` / `delete` / `getNamespace` / `subscribe` on this addon's namespace, framework keys hidden) is deprecated: a leaf of the tree covers each of its calls, and `persisted()` in the declaration replaces subscribing to save. It is removed in a later minor.
