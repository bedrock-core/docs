---
sidebar_position: 4
description: "sync.state is a replicated key/value store."
---

# State

`sync.state` is a **replicated** key/value store. Every node keeps a full in-memory mirror, so reads are local and synchronous; writes broadcast a delta that every other node applies to its own mirror.

Any node may read any `namespace:key`. A mirror **applies** an entry for a namespace only when it came from the namespace's owner — the node whose id is the namespace. Among accepted entries conflicts resolve last-write-wins on a logical clock (a higher version wins; on a tie, the lexicographically greater `src`), so every mirror converges regardless of delivery order. Refused entries are counted in `droppedForeign`.

:::tip From an addon, prefer `core.shared`
[Shared](/docs/server/api/shared) declares a shape and gives you a typed tree over this store, with the framework's reserved keys hidden. Drop to `core.node.state` — the object documented here — when you need a raw key or a framework key.
:::

## Import

```ts
import { State, stateKey } from '@bedrock-core/sync';
import type { StateKey, StateChange, StateChangeListener, SnapshotEntry } from '@bedrock-core/sync';
```

## Usage

```ts
sync.state.set('mycoolitems', 'spawnRate', 5);
const rate = sync.state.get('mycoolitems', 'spawnRate');   // 5
const all = sync.state.getNamespace('drav0011_economy');   // { currency: 'gold', ... }

sync.state.subscribe(({ ns, key, value, deleted }) => { /* ... */ });
sync.state.delete('mycoolitems', 'spawnRate');
```

## API

### `get`

```ts
get<T = unknown>(ns: string, key: StateKey<T>): NoInfer<T> | undefined
get(ns: string, key: string): unknown | undefined
```

Read from the local mirror. `undefined` when the key is absent or tombstoned.

### `getNamespace`

```ts
getNamespace(ns: string): Record<string, unknown>
```

Every live key in a namespace as a plain object. Tombstoned keys are excluded.

### `namespaces`

```ts
namespaces(): string[]
```

Every namespace currently present in the mirror, in insertion order.

### `set`

```ts
set<T = unknown>(ns: string, key: StateKey<T>, value: NoInfer<T>): void
set(ns: string, key: string, value: unknown): void
```

Write a key, apply it locally, and broadcast a `state-delta`. Only the namespace's owner writes it: a write to another node's namespace is dropped by every mirror, this one included, and counted in `droppedForeign`. See [ownership](#ownership).

### `delete`

```ts
delete(ns: string, key: string): void
```

Tombstone a key and broadcast the delta. Deletions are tombstones rather than removals so a late-arriving older write cannot resurrect a removed key.

### `subscribe`

```ts
subscribe(listener: StateChangeListener): Unsubscribe

interface StateChange {
  ns: string;
  key: string;
  value: unknown | undefined;   // undefined when deleted
  deleted: boolean;
}
```

Fires on **every applied change**, local or remote, in **every** namespace. Only writes that win the last-write-wins comparison are applied, so a losing delta fires nothing.

:::caution This listener is very chatty
Config schemas, i18n bundles, guide manifests and feature flags all replicate through this channel, so a raw `subscribe` sees traffic from every addon in the world. Filter by `ns` and `key`, or subscribe on a node of a [shared tree](/docs/server/api/shared#use-your-own-tree), which fires for one leaf, one branch or one namespace.
:::

## Typed keys

```ts
import { stateKey } from '@bedrock-core/sync';

const SPAWN_RATE = stateKey<number>('spawnRate');

sync.state.set('mycoolitems', SPAWN_RATE, 5);          // value must be a number
const rate = sync.state.get('mycoolitems', SPAWN_RATE); // number | undefined
```

`StateKey<T>` is a branded string — a **compile-time assertion only**. Like any state read, the actual value comes from whichever peer wrote it last and is never validated at runtime.

## Conflict resolution

Each write stamps an entry with a version from a monotonically increasing logical clock, plus the writer's id:

1. Higher `ver` wins.
2. Equal `ver` is broken by the higher `src` string — a total, stable rule, so every mirror picks the same winner.

Receiving a delta or snapshot also advances the local clock to at least the incoming version.

## Snapshots and late join

A node that starts long after everyone else still needs the current picture. Two mechanisms cover that, and they run automatically inside `state.start()`:

```
node.start()
  └─ state.start()
       ├─ requestSync()               broadcast "send me your state"
       └─ broadcastOwnedSnapshots()   push the owned namespaces out
```

### `requestSync`

```ts
requestSync(ns?: string): void
```

Broadcast a request for peers to send their state. With no argument every responder replies with **all** of its owned namespaces; pass a namespace to ask for just that one.

```ts
sync.state.requestSync();                        // everything
sync.state.requestSync('drav0011_economy');      // only that namespace
```

Responders answer **only for their own namespace**, the one named by their id. A namespace with no live owner is not re-served by whoever happens to be mirroring it, so a stale mirror is never presented as authoritative.

Empty namespaces are skipped rather than answered with an empty snapshot.

### `broadcastOwnedSnapshots`

```ts
broadcastOwnedSnapshots(): void
```

Push a full snapshot of every owned, non-empty namespace to everyone. Called once at start; call it again by hand only after bulk-restoring state that peers should learn about without asking.

### `snapshot`

```ts
snapshot(ns: string): SnapshotEntry[]

interface SnapshotEntry {
  k: string;
  v?: unknown;
  ver: number;
  src: string;
  del?: boolean;
}
```

Serialize a namespace, **including tombstones** — a snapshot that dropped them could resurrect deleted keys on the receiver.

### Deltas vs. snapshots

| | Delta | Snapshot |
|---|---|---|
| Trigger | Every `set` / `delete` | Startup, or a `requestSync` |
| Carries | One key | A whole namespace, tombstones included |
| Addressed | Broadcast | Broadcast at startup, direct reply to a request |
| Applied | Last-write-wins per key | Last-write-wins per entry |

## Ownership

A namespace has one writer: the node whose id is the namespace. Every mirror applies that rule, this node's own included, so a write to another node's namespace is dropped everywhere and counted in `droppedForeign`.

[`core.shared`](/docs/server/api/shared) never reaches another namespace: its trees only ever address your own, and a peer's tree has no `set`.

:::note Ownership is a convention, not a security boundary
A mirror trusts a delta's sender id, and no message carries an identity worth trusting; a pack can also write the underlying dynamic properties directly. Every addon in a world runs arbitrary script. Treat state as shared and cooperative; put anything that needs an authority check behind [RPC](./rpc.md), with [`authorize`](/docs/server/api/authorize) in front of it.
:::

## Persistence is not sync's job

sync is in-memory only, and it deliberately does **not** touch dynamic properties — those are pack-scoped, and each addon owns its own durability.

To persist, keep the namespace in a [`@bedrock-core/db`](/docs/db) document: restore it on load, then save it on every change. Do both inside `system.run`, since dynamic properties cannot be read during early execution, and restore before subscribing, so the restore does not save straight back.

```ts
import { schema } from '@bedrock-core/db';
import { createEngineDb } from '@bedrock-core/db/minecraft';
import { system, world } from '@minecraft/server';

const NS = 'mycoolitems';
const saved = createEngineDb(NS)
  .collection('state', { schema: schema<Record<string, unknown>>() })
  .for(world);

system.run(() => {
  for (const [key, value] of Object.entries(saved.get() ?? {})) {
    sync.state.set(NS, key, value);
  }

  sync.state.subscribe((change) => {
    if (change.ns === NS) { saved.set(sync.state.getNamespace(NS)); }
  });
});
```

A db document is one JSON string, chunked past a property's 32 767-character ceiling, versioned and migrated on read. From an addon, [`core.db`](/docs/server/api/db) is that instance already keyed under the addon's namespace, and a [shared](/docs/server/api/shared) key that must survive a restart is one such document, mirrored across in a line.
