---
sidebar_position: 2
---

# Discovery

`sync.discovery` finds the other bedrock-core nodes in the world and keeps a live list of them.

Script events are ephemeral: a pack that loads after another has already announced never hears that announce. Discovery solves that two ways — every node re-announces on a heartbeat, and a freshly started node broadcasts a `whois` that prompts existing peers to announce straight back. A TTL sweep drops peers that go quiet.

## Import

```ts
import type { PeerInfo, CollisionInfo, IncompatiblePeer, PeerListener, CollisionListener, IncompatibleListener, DiscoveryOptions } from '@bedrock-core/sync';
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
  protocol: number;
  caps: readonly string[];
  meta?: Record<string, unknown>;
  lastSeen: number;
}
```

| Field | Meaning |
|---|---|
| `id` | The peer's node id — its transport address. |
| `version` | Whatever it passed as `version`, or `'0.0.0'`. |
| `schemaVersion` | Whatever it passed as `schemaVersion`, or `0`. |
| `protocol` | The wire version this node and that peer [settled on](#protocol-negotiation). |
| `caps` | Optional behaviours the peer can read, narrowed to what `protocol` allows. |
| `meta` | The opaque blob it attached to its announce. `server-runtime` puts the addon manifest plus `runtimeVersion` here. |
| `lastSeen` | The tick this peer was last heard from. |

---

## Protocol negotiation

Discovery is also where two nodes agree on what to speak. Every announce carries the range its sender supports, and hearing one settles the pair on the newest version both know:

```ts
agreed = min(PROTOCOL_MAX, theirMax)          // valid while agreed >= max(PROTOCOL_MIN, theirMin)
```

Nothing is exchanged to arrive at this. Both sides apply the same rule to the same two advertised ranges, so they reach the same answer from one message — the same reasoning the runtime's [host election](../server-runtime/host.md) uses. The result is pushed to the bus, which encodes traffic for that peer at it.

An announce with no range at all comes from a node built before the field existed, which pins it to `PROTOCOL_MIN` exactly.

### Capabilities

`caps` carries optional behaviours a node can **read**, so a sender consults the receiver's set before using one. Versions move in lockstep for everyone; capabilities let a single behaviour appear or degrade on its own, which is what keeps the next addition from needing a version bump.

```ts
Cap.Batch   // 'batch' — reads several envelopes packed into one message
```

A capability is always narrowed by the negotiated version: one advertised by a node that also speaks something newer is still out of reach at the version actually in use.

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

### `incompatiblePeers`

```ts
sync.discovery.incompatiblePeers: IncompatiblePeer[]

interface IncompatiblePeer {
  id: string;
  pmin: number;
  pmax: number;
  lastSeen: number;
}
```

Nodes heard on the bus whose protocol range does not overlap this build's. They are present in the world and cannot be addressed, so they are listed here rather than stored as peers — an addon that cannot be talked to should be named, not missing.

### `onIncompatible`

```ts
sync.discovery.onIncompatible(listener: IncompatibleListener): Unsubscribe
```

Fires the **first** time such a node is heard. At the runtime layer this is [`core.registry.onIncompatible`](../server-runtime/registry.md), which also logs a warning naming both ranges.

### `announce`

```ts
sync.discovery.announce(): void
```

Broadcast this node's presence immediately. `start()` does this for you and the heartbeat repeats it; call it by hand only if you changed something peers need to see sooner than the next beat.

The announce and the `whois` are the two messages pinned to `PROTOCOL_MIN`: they are what establishes which version everything else may use, so they cannot themselves assume one. That costs them the packing a negotiated message gets, which at one broadcast per 5 s is affordable.

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
