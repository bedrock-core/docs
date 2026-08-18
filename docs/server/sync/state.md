---
sidebar_position: 4
---

# State

`sync.state` is a **replicated** key/value store. Every node keeps a full in-memory mirror, so reads are local and synchronous; writes broadcast a delta that every other node applies to its own mirror.

The model is **shared-mutable**: any node may read or write any `namespace:key`. Conflicts resolve last-write-wins on a Lamport-style logical clock, so every mirror converges regardless of delivery order.

:::tip From an addon, prefer `core.state`
[`ScopedState`](../server-runtime/scoped-state.md) pre-fills your namespace and hides the framework's reserved keys. Drop to `core.node.state` — the object documented here — when you need to read another namespace or reach a framework key.
:::

## Import

```ts
import { State, stateKey } from '@bedrock-core/sync';
import type { StateKey, StateChange, StateChangeListener, StateOptions, SnapshotEntry } from '@bedrock-core/sync';
```

## Usage

```ts
sync.state.set('mycoolitems', 'spawnRate', 5);
const rate = sync.state.get('mycoolitems', 'spawnRate');   // 5
const all = sync.state.getNamespace('drav0011_economy');   // { currency: 'gold', … }

sync.state.subscribe(({ ns, key, value, deleted }) => { /* … */ });
sync.state.delete('mycoolitems', 'spawnRate');
```

---

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

Write a key, apply it locally, and broadcast a `state-delta`. Throws when [`strictOwnership`](#ownership-and-strictownership) is on and `ns` is not owned.

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
Config schemas, i18n bundles, guide manifests and feature flags all replicate through this channel, so a raw `subscribe` sees traffic from every addon in the world. Filter by `ns` and `key`, or use [`core.state.subscribe`](../server-runtime/scoped-state.md#subscribe), which filters to your own namespace and drops framework keys.
:::

---

## Typed keys

```ts
import { stateKey } from '@bedrock-core/sync';

const SPAWN_RATE = stateKey<number>('spawnRate');

sync.state.set('mycoolitems', SPAWN_RATE, 5);          // value must be a number
const rate = sync.state.get('mycoolitems', SPAWN_RATE); // number | undefined
```

`StateKey<T>` is a branded string — a **compile-time assertion only**. Like any state read, the actual value comes from whichever peer wrote it last and is never validated at runtime.

---

## Conflict resolution

Each write stamps an entry with a version from a monotonically increasing logical clock, plus the writer's id:

1. Higher `ver` wins.
2. Equal `ver` is broken by the higher `src` string — a total, stable rule, so every mirror picks the same winner.

Receiving a delta or snapshot also advances the local clock to at least the incoming version.

---

## Snapshots and late join

A node that starts long after everyone else still needs the current picture. Two mechanisms cover that, and they run automatically inside `state.start()`:

```
node.start()
  └─ state.start()
       ├─ requestSync()               broadcast "send me your state"
       └─ broadcastOwnedSnapshots()   push our own owned namespaces out
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

Responders answer **only for namespaces they own** — `ownedNamespaces`, which defaults to `[id]`. A namespace with no live owner is not re-served by whoever happens to be mirroring it, so a stale mirror is never presented as authoritative.

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

---

## Ownership and `strictOwnership`

```ts
const sync = createSync({
  id: 'mycoolitems',
  ownedNamespaces: ['mycoolitems', 'mycoolitems_shared'],
  strictOwnership: true,
});
```

`ownedNamespaces` (default `[id]`) does two things:

1. It is the set this node answers snapshot requests for.
2. With `strictOwnership: true`, it is the set this node is allowed to write.

By default **writes are open** — any node may write any namespace. With `strictOwnership` enabled, a write outside the owned set throws:

```
[sync] cannot write to namespace 'drav0011_economy': not owned by this node (strictOwnership is enabled)
```

The runtime creates its node with `ownedNamespaces: [namespace]` and leaves `strictOwnership` at its default, so `core.node.state` can still write anywhere. `core.state` narrows that by construction — it only ever addresses your own namespace.

:::note Ownership is a convention, not a security boundary
`strictOwnership` guards *your* node against writing where it should not. It cannot stop another pack from writing your namespace — every addon in a world runs arbitrary script. Treat state as shared and cooperative; put anything that needs an authority check behind [RPC](./rpc.md), the way [config](../server-runtime/config.md#authorization) does.
:::

---

## Persistence is not sync's job

sync is in-memory only, and it deliberately does **not** touch dynamic properties — those are pack-scoped, and each addon owns its own durability.

To persist: call `subscribe`, write your namespace to your own dynamic properties, and re-publish on load. Defer all of it with `system.run`, since dynamic properties cannot be touched during early execution.

```ts
import { system, world } from '@minecraft/server';

system.run(() => {
  const NS = 'mycoolitems';
  const saved = world.getDynamicProperty(`${NS}:save`);

  if (typeof saved === 'string') {
    for (const [k, v] of Object.entries(JSON.parse(saved) as Record<string, unknown>)) {
      sync.state.set(NS, k, v);
    }
  }

  sync.state.subscribe((change) => {
    if (change.ns !== NS) { return; }

    world.setDynamicProperty(`${NS}:save`, JSON.stringify(sync.state.getNamespace(NS)));
  });
});
```

See [ScopedState](../server-runtime/scoped-state.md#persistence-is-your-job) for the per-key variant, which is what you want once a namespace can grow past a dynamic property's 32767-character ceiling.
