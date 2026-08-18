---
sidebar_position: 5
---

# Protocol

What actually goes over the wire: the bus, the envelope, framing and rate limiting. You do not need any of this to use the framework — read it when you are debugging traffic, writing an interoperating implementation, or extending sync itself.

## Import

```ts
import { Bus, MessageType, PROTOCOL_VERSION } from '@bedrock-core/sync';
import type { Envelope, BusOptions, SendOptions, EnvelopeHandler, Unsubscribe } from '@bedrock-core/sync';
```

---

## One channel

Every bedrock-core message in the world travels on a single script-event channel:

```
namespace : bedrock-core
channel   : bedrock-core:bus
```

The bus subscribes to `system.afterEvents.scriptEventReceive` filtered to the `bedrock-core` namespace, and sends with `system.sendScriptEvent('bedrock-core:bus', …)`. Everything — discovery, RPC, state — is multiplexed over that one id and demultiplexed by the envelope's `type`.

---

## The envelope

```ts
interface Envelope<T = unknown> {
  v: number;      // protocol version
  src: string;    // sender addon id
  iid: string;    // sender instance id
  dst?: string;   // target addon id; omitted for a broadcast
  type: string;   // message type
  mid: string;    // per-message id — RPC correlation and chunk-group id
  data?: T;       // type-specific payload
}
```

An envelope is JSON-serialized and then split into one or more wire [frames](#framing-and-chunking).

### `src` vs `iid`

`src` is the addon id. `iid` is unique **per node**, even when two nodes share the same `src` — which is exactly what a namespace collision is.

That distinction does real work:

- The receive path drops a node's **own echoes by `iid`**, not by `src`. A colliding twin announcing your id is therefore still delivered, which is how [collisions](./discovery.md#oncollision) are detectable at all.
- `mid` is derived from `iid` plus a counter, so message ids stay unique across colliding nodes.

### `PROTOCOL_VERSION`

```ts
PROTOCOL_VERSION;   // 1
```

Bumped on any breaking change to the envelope or frame wire format. Decoding is strict: an envelope whose `v` does not match **exactly** is dropped silently, along with malformed JSON and structurally invalid envelopes. One bad sender can never crash a listener — and two incompatible protocol generations simply do not see each other rather than corrupting each other.

---

## Message types

```ts
MessageType.Announce       // 'announce'
MessageType.Whois          // 'whois'
MessageType.Request        // 'req'
MessageType.Response       // 'res'
MessageType.StateDelta     // 'state-delta'
MessageType.StateRequest   // 'state-req'
MessageType.StateSnapshot  // 'state-snapshot'
```

| Type | Layer | Direction | Payload |
|---|---|---|---|
| `announce` | [Discovery](./discovery.md) | broadcast, or direct in reply to a whois | `{ version, schemaVersion, meta? }` |
| `whois` | Discovery | broadcast | none |
| `req` | [RPC](./rpc.md) | direct | `{ method, params? }` |
| `res` | RPC | direct | `{ rid, ok, data?, err? }` |
| `state-delta` | [State](./state.md) | broadcast | `{ ns, key, value?, ver, del? }` |
| `state-req` | State | broadcast | `{}` or `{ ns }` |
| `state-snapshot` | State | broadcast at start, direct in reply | `{ ns, entries }` |

---

## Bus

```ts
class Bus {
  readonly selfId: string;
  readonly instanceId: string;
  readonly queueSize: number;

  start(): void;
  stop(): void;
  send(options: SendOptions): string;                      // returns the message id
  reply(to: Envelope, type: string, data?: unknown): string;
  on(type: string, handler: EnvelopeHandler): Unsubscribe;
}

interface SendOptions {
  dst?: string;   // omit to broadcast
  type: string;
  mid?: string;   // reuse a specific message id
  data?: unknown;
}
```

The receive path, in order:

1. Ignore anything that is not on `bedrock-core:bus`.
2. Decode the frame; drop it if malformed.
3. Feed it to the reassembler; stop unless the group is now complete.
4. Decode the envelope; drop it if malformed or the protocol version mismatches.
5. Drop it if `iid` is our own instance — that is our own echo.
6. Drop it if `dst` is set and is not us.
7. Dispatch to every handler registered for `type`.

`stop()` tears down the subscription and the loops but **keeps registered handlers**, so a stopped bus can be restarted.

### Loopback

A message whose `dst` equals the sender's own id never goes over the wire — it could not come back, since step 5 would drop it. `send()` detects that case and delivers the envelope to local handlers via `system.run()` instead, one tick later, preserving the async semantics of a real hop. This is what makes [RPC to self](./rpc.md#calling-yourself) work.

---

## Framing and chunking

Script-event messages are size-capped, so every wire message is a **frame**, and an encoded envelope larger than the budget is split across several:

```ts
interface Frame {
  c: string;   // chunk-group id (the sender's message id)
  s: number;   // zero-based sequence index
  t: number;   // total frames in the group
  p: string;   // this frame's slice of the encoded envelope
}
```

A single-frame group (`t === 1`) carries the whole envelope and skips buffering entirely. Larger groups are buffered by the receiver until complete.

| Constant | Value | Meaning |
|---|---|---|
| `MAX_MESSAGE` | `2000` chars | Per-message budget, set well below the engine's real cap. |
| `CHUNK_TTL_TICKS` | `200` | An incomplete group is discarded after 10 s. |
| Eviction interval | `20` ticks | How often stalled groups are swept. |

The per-frame payload budget is the remaining space **halved**, because worst-case JSON escaping can double every character of `p`. That guarantees each encoded frame fits, at the cost of some efficiency.

The reassembler ignores stray frames whose `t` disagrees with the group, out-of-range sequence numbers, and duplicate sequence numbers — so a partially-arrived group from a node that restarted mid-send times out rather than producing garbage.

---

## Outbound queue and rate limiting

The engine only processes a bounded number of script events per tick, so **nothing is ever sent inline**. Every frame goes into an outbound queue drained on an interval:

| Constant | Value | Meaning |
|---|---|---|
| `FLUSH_INTERVAL_TICKS` | `1` | The queue flushes every tick. |
| `MAX_FLUSH_PER_TICK` | `50` | At most 50 frames leave per flush. |

If a send throws — an unexpectedly oversized message slipping through, for instance — that message is dropped and counted rather than being allowed to crash the flush loop. `bus.queueSize` exposes the backlog for inspection.

The practical consequence is the one stated everywhere else in these docs: **timing is tick-based**. A reply cannot arrive on the tick you sent the request, and a large payload that spans many frames takes proportionally longer to land.

---

## Reading it in practice

To watch raw traffic from an addon:

```ts
core.node.bus.on('state-delta', (envelope) => {
  console.warn(`${envelope.src} → ${JSON.stringify(envelope.data)}`);
});
```

Handlers registered on the bus see envelopes **after** reassembly, echo filtering and address filtering, which is almost always what you want. Anything below that — individual frames, the queue — is internal and has no public hook.
