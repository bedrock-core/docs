---
sidebar_position: 1
---

# sync

`@bedrock-core/sync` is the low-level cross-addon transport for Minecraft Bedrock. It layers a message bus, peer discovery, RPC and a replicated state channel on top of script events, so addons in separate script realms can talk.

:::warning For framework and library developers
If you are building a Bedrock addon, you do not need this package directly — use [`@bedrock-core/server-runtime`](../server-runtime/server-runtime.md) instead. The runtime creates and manages the one sync node for you, and raw transport access is available as `core.node` whenever you want it.
:::

## Install

```bash
npm install @bedrock-core/sync
```

Or reach it through the meta-package, which pins a matching version:

```ts
import { createSync } from '@bedrock-core/server/sync';
```

## When to use it directly

- You are **building a library or framework layer** on top of sync, as `server-runtime` itself does.
- You need **raw bus / discovery / state access** from an addon that already uses `server-runtime` — use `core.node`, no extra install needed.
- You are writing **GameTests** that spin up several isolated nodes in one realm to exercise the protocol.

You do **not** need a second node just to read another addon's state. The state store is a globally shared mirror, so `core.node.state.get('other_addon', 'key')` works from the one node you already have.

---

## Quick start

Create **one** `SyncNode` for the realm and call `start()` once on boot.

```ts
import { createSync } from '@bedrock-core/sync';

export const sync = createSync({
  id: 'mycoolitems',   // unique, stable id (a-z0-9_) — transport address + default owned namespace
  version: '1.0.0',
  meta: { /* opaque data peers see as PeerInfo.meta */ },
});

sync.start();
```

After `start()`, `sync.discovery`, `sync.rpc` and `sync.state` are live.

```ts
sync.discovery.onPeerUp(peer => console.warn('peer up', peer.id));
sync.rpc.onRequest('ping', () => 'pong');
sync.state.set('mycoolitems', 'volume', 5);
```

---

## `SyncNodeOptions`

```ts
interface SyncNodeOptions {
  id: string;
  version?: string;
  schemaVersion?: number;
  meta?: Record<string, unknown>;
  ownedNamespaces?: string[];
  strictOwnership?: boolean;
  maxMessage?: number;
  instanceId?: string;
}
```

| Option | Default | What it does |
|---|---|---|
| `id` | — | Unique addon id. Used as the envelope `src`, the RPC address, and the default owned namespace. |
| `version` | `'0.0.0'` | Announced to peers as `PeerInfo.version`. |
| `schemaVersion` | `0` | Announced alongside `version`, for higher layers that version their payloads. |
| `meta` | — | Opaque metadata broadcast with every announce; surfaces on peers as `PeerInfo.meta`. `server-runtime` puts the addon manifest here. |
| `ownedNamespaces` | `[id]` | Namespaces this node is authoritative for — the ones it answers snapshot requests for. |
| `strictOwnership` | `false` | When `true`, `state.set()` / `state.delete()` throw for a namespace this node does not own. See [ownership](./state.md#ownership-and-strictownership). |
| `maxMessage` | `2000` | Per-message character budget for the [chunker](./protocol.md#framing-and-chunking). Mainly for tests. |
| `instanceId` | generated | Overrides the auto-generated instance id. Mainly for tests. |

---

## `SyncNode`

```ts
class SyncNode {
  readonly id: string;
  readonly bus: Bus;
  readonly discovery: Discovery;
  readonly rpc: Rpc;
  readonly state: State;

  start(): void;   // idempotent
  stop(): void;
}
```

`createSync(options)` simply builds one and returns it; `new SyncNode(options)` is equivalent. `start()` brings up the bus, RPC, discovery and state in that order, and `stop()` tears them down in reverse.

---

## Things to know

- **One node per realm.** Several `SyncNode`s with different ids in one realm is only useful for in-realm testing. Production addons use `server-runtime` and `core.node`.
- **Timing is tick-based.** Messages flush over ticks; you will never get an RPC reply on the same tick you sent it.
- **Large payloads are fine.** Frames above the size budget are split and reassembled transparently.
- **sync never touches dynamic properties.** They are pack-scoped, and persistence is each addon's own responsibility — see [State](./state.md#persistence-is-not-syncs-job).
- **Load order is not a problem.** Every node re-announces on a heartbeat and broadcasts a `whois` at startup, so a late loader catches up and an early loader hears about it.

---

## In This Section

| Page | Description |
|---|---|
| [Discovery](./discovery.md) | Finding peers: announce, whois, TTL eviction, namespace collisions |
| [Rpc](./rpc.md) | Request/response calls, typed clients, handler maps, timeouts |
| [State](./state.md) | Replicated key/value: deltas, snapshots, `requestSync`, ownership |
| [Protocol](./protocol.md) | The bus, the envelope, `PROTOCOL_VERSION`, framing and rate limiting |
