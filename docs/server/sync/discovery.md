---
sidebar_position: 2
---

# Discovery

`sync.discovery` finds the other bedrock-core nodes in the world and keeps a live list of them.

Script events are ephemeral: a pack that loads after another has already announced never hears that announce. Discovery solves that two ways — every node re-announces on a heartbeat, and a freshly started node broadcasts a `whois` that prompts existing peers to announce straight back. A TTL sweep drops peers that go quiet.

## Import

```ts
import type { PeerInfo, CollisionInfo, PeerListener, CollisionListener, DiscoveryOptions } from '@bedrock-core/sync';
```

## Usage

```ts
sync.discovery.onPeerUp(peer => console.warn(`${peer.id} v${peer.version} joined`));
sync.discovery.onPeerDown(peer => console.warn(`${peer.id} left`));

const peers = sync.discovery.peers;
const economy = sync.discovery.getPeer('drav0011_economy');
```

From a runtime, the same information arrives pre-interpreted through [`core.registry`](../server-runtime/registry.md), which turns each peer's `meta` into an addon manifest. Reach for `core.node.discovery` only when you want the raw peer records.

---

## `PeerInfo`

```ts
interface PeerInfo {
  id: string;
  version: string;
  schemaVersion: number;
  meta?: Record<string, unknown>;
  lastSeen: number;
}
```

| Field | Meaning |
|---|---|
| `id` | The peer's node id — its transport address. |
| `version` | Whatever it passed as `version`, or `'0.0.0'`. |
| `schemaVersion` | Whatever it passed as `schemaVersion`, or `0`. |
| `meta` | The opaque blob it attached to its announce. `server-runtime` puts the addon manifest plus `runtimeVersion` here. |
| `lastSeen` | The tick this peer was last heard from. |

---

## API

### `peers`

```ts
sync.discovery.peers: PeerInfo[]
```

Known live peers. **Excludes self.**

### `getPeer`

```ts
sync.discovery.getPeer(id: string): PeerInfo | undefined
```

### `onPeerUp`

```ts
sync.discovery.onPeerUp(listener: PeerListener): Unsubscribe
```

Fires when a peer is seen for the **first** time. Subsequent heartbeats from the same peer refresh `lastSeen` without re-firing.

### `onPeerDown`

```ts
sync.discovery.onPeerDown(listener: PeerListener): Unsubscribe
```

Fires when a peer expires — its `lastSeen` fell outside the TTL window during a sweep. Note that this is a **timeout**, not a graceful goodbye: there is no "leaving" message, so a peer that stops answering takes up to the TTL to disappear.

### `onCollision`

```ts
sync.discovery.onCollision(listener: CollisionListener): Unsubscribe

interface CollisionInfo {
  id: string;
  instanceId: string;
}
```

Fires when **another instance is announcing our own id** — a namespace collision. Such an announce is surfaced here rather than being stored as a peer.

At the runtime layer this is [`core.registry.onNamespaceCollision`](../server-runtime/registry.md#onnamespacecollision).

### `announce`

```ts
sync.discovery.announce(): void
```

Broadcast this node's presence immediately. `start()` does this for you and the heartbeat repeats it; call it by hand only if you changed something peers need to see sooner than the next beat.

### `whois`

```ts
sync.discovery.whois(): void
```

Ask every peer to announce itself. Sent once at `start()`. Peers reply **directly to the asker** rather than broadcasting, so a late loader joining a busy world does not spam everyone.

---

## Timing

| Constant | Value | Meaning |
|---|---|---|
| `ANNOUNCE_INTERVAL_TICKS` | `100` | Heartbeat period — every node re-announces every 5 s. |
| `PEER_TTL_TICKS` | `320` | A peer unheard from for 16 s is considered gone. |
| Sweep interval | `40` ticks | How often the TTL check runs. |

So a peer that disappears is detected somewhere between 16 and 18 seconds later, and a peer that appears is normally visible within a tick or two of its `whois` reply — but **never assume a peer exists on tick 0**. React to peers through events (`onPeerUp`, [`onDependenciesSatisfied`](../server-runtime/registry.md#ondependenciessatisfied), a [feature condition](../server-runtime/features.md)) rather than by checking once at startup.

`DiscoveryOptions` lets a test override `announceIntervalTicks` and `peerTtlTicks`.
