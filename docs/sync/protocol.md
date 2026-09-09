---
sidebar_position: 6
description: "What actually goes over the wire: the bus, the envelope, framing and rate limiting."
---

# Protocol

What actually goes over the wire: the bus, the envelope, framing and rate limiting. You do not need any of this to use the framework — read it when you are debugging traffic, writing an interoperating implementation, or extending sync itself.

## Import

```ts
import { Bus, Cap, MAX_MESSAGE, MessageType, PROTOCOL_MAX, PROTOCOL_MIN } from '@bedrock-core/sync';
import type { Envelope, BusOptions, SendOptions, EnvelopeHandler, Unsubscribe } from '@bedrock-core/sync';
```

## One channel

Every bedrock-core message in the world travels on a single script-event channel:

```
namespace : bedrock-core
channel   : bedrock-core:bus
```

The bus subscribes to `system.afterEvents.scriptEventReceive` filtered to the `bedrock-core` namespace, and sends with `system.sendScriptEvent('bedrock-core:bus', …)`. Everything — discovery, RPC, state — is multiplexed over that one id and demultiplexed by the envelope's `type`.

## The envelope

```ts
interface Envelope<T = unknown> {
  v: number;      // protocol version this envelope was written at
  src: string;    // sender addon id
  iid: string;    // sender instance id
  dst?: string;   // target addon id; omitted for a broadcast
  type: string;   // message type
  mid: string;    // per-message id — RPC correlation and chunk-group id
  data?: T;       // type-specific payload
}
```

An envelope is JSON-serialized and then sent as-is if it fits in one message, or [split into frames](#framing-and-chunking) if it does not. Either way it travels inside a tagged [wire message](#wire-messages).

### `src` vs `iid`

`src` is the addon id. `iid` is unique **per node**, even when two nodes share the same `src` — which is exactly what a namespace collision is.

That distinction does real work:

- The receive path drops a node's **own echoes by `iid`**, not by `src`. A colliding twin announcing your id is therefore still delivered, which is how [collisions](./discovery.md#oncollision) are detectable at all.
- `mid` is derived from `iid` plus a counter, so message ids stay unique across colliding nodes.

### Protocol versions

```ts
PROTOCOL_MIN;   // 1 — oldest wire format this build still reads and writes
PROTOCOL_MAX;   // 2 — newest it knows
```

A node advertises the **range** it speaks, and talks to each peer at the newest version both know. Addons update on their own schedules, so one world routinely holds packs built against different releases; gating on a single version instead would split such a world into two meshes on one channel — each listing only its own half, each electing its own UI host, each timing out every RPC to the other.

Decoding accepts any `v` inside the window. Only a version below `PROTOCOL_MIN` (too old to still be supported) or above `PROTOCOL_MAX` (newer than this build knows) is dropped, along with malformed JSON and structurally invalid envelopes. One bad sender can never crash a listener.

`v` is picked **per recipient**, so the same node emits different versions to different peers. See [negotiation](./discovery.md#protocol-negotiation) for the rule.

#### The support window

The window is two versions wide: a version stays readable for two releases after it stops being the newest. Raising `PROTOCOL_MIN` drops everything below it and is a breaking change.

A node whose range does not overlap this build's at all cannot be addressed. It is reported through [`onIncompatible`](./discovery.md#onincompatible) and named in the addon list rather than quietly missing from it.

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
| `announce` | [Discovery](./discovery.md) | broadcast, or direct in reply to a whois | `{ version, schemaVersion, meta?, pmin?, pmax?, caps? }` |
| `whois` | Discovery | broadcast | none |
| `req` | [RPC](./rpc.md) | direct | `{ method, params? }` |
| `res` | RPC | direct | `{ rid, ok, data?, err? }` |
| `state-delta` | [State](./state.md) | broadcast | `{ ns, key, value?, ver, del? }` |
| `state-req` | State | broadcast | `{}` or `{ ns }` |
| `state-snapshot` | State | broadcast at start, direct in reply | `{ ns, entries }` |

## Bus

```ts
class Bus {
  readonly selfId: string;
  readonly instanceId: string;
  readonly queueSize: number;
  readonly broadcastProtocol: number;    // what a broadcast currently goes out at

  start(): void;
  stop(): void;
  send(options: SendOptions): string;                      // returns the message id
  reply(to: Envelope, type: string, data?: unknown): string;
  on(type: string, handler: EnvelopeHandler): Unsubscribe;

  // Discovery pushes negotiation results in through these; addons do not call them.
  setPeerProtocol(id: string, protocol: number, caps: readonly string[]): void;
  forgetPeer(id: string): void;
}

interface SendOptions {
  dst?: string;      // omit to broadcast
  type: string;
  mid?: string;      // reuse a specific message id
  data?: unknown;
  protocol?: number; // force an encoding instead of the negotiated one
}
```

The receive path, in order:

1. Ignore anything that is not on `bedrock-core:bus`.
2. Read the [wire tag](#wire-messages); drop the message if the tag is unknown or the body is malformed.
3. For a chunk, feed the frame to the reassembler and stop unless the group is now complete, then decode the envelope.
4. Drop any envelope that is malformed or whose `v` falls outside the supported window. A batch keeps whichever of its envelopes are sound.
5. Drop it if `iid` is this instance — its own echo.
6. Drop it if `dst` is set and names another node.
7. Dispatch to every handler registered for `type`.

`stop()` tears down the subscription and the loops but **keeps registered handlers**, so a stopped bus can be restarted.

### Loopback

A message whose `dst` equals the sender's own id never goes over the wire — it could not come back, since step 5 would drop it. `send()` detects that case and delivers the envelope to local handlers via `system.run()` instead, one tick later, preserving the async semantics of a real hop. This is what makes [RPC to self](./rpc.md#calling-yourself) work.

## Wire messages

One script-event message opens with a single tag character naming which of three shapes follows:

```text
0{"v":2,"src":"shop",…}          one envelope, verbatim
2[{"v":2,…},{"v":2,…}]           several envelopes packed into one message
1{"c":"…","s":0,"t":9,"p":"…"}   one frame of an envelope too large to send whole
```

The tag exists to keep the common case cheap. Nesting an envelope inside a frame's `p` field means JSON-escaping the whole thing to sit inside a JSON string — every quote costs a backslash — and a one-piece message would carry a `c`/`s`/`t` header describing a split that never happened. Most bus traffic is one-piece, so the tag keeps the common case cheap.

A batch (`2`) is a JSON array of envelopes, not of encoded strings, so packing costs no escaping either. Batching is the [outbound queue](#outbound-queue-and-rate-limiting)'s work, not the bus's.

A protocol 1 message is a bare frame and opens with `{`. The frame shape is the same under both protocols — only the wrapping differs — so a message recognized by that leading brace is read through the same reassembly path as a tagged chunk.

The tag is otherwise frozen. A shape added by some later protocol takes a character of its own, and a reader that does not know a character drops that one message rather than the peer that sent it.

### Which encoding a message gets

| Message | Encoding |
|---|---|
| Directed at a known peer | the version negotiated with that peer |
| Directed at a peer not yet heard from | `PROTOCOL_MIN` — every supported build reads it |
| Broadcast | the lowest version any live peer can read |
| `announce` / `whois` | always `PROTOCOL_MIN` |

Announces are pinned because they are what establishes everything else: the message that tells peers which versions you speak cannot itself assume an answer. That costs a heartbeat the packing a negotiated message gets, which at one broadcast per 5 s is affordable.

Both broadcast values rise on their own as the peers holding them down expire, so a world returns to the newest encoding once its last outdated addon is gone — no restart, no setting.

## Framing and chunking

Script-event messages are size-capped, so an encoded envelope larger than the budget is split across several **frames**, each sent as its own tagged message:

```ts
interface Frame {
  c: string;   // chunk-group id (the sender's message id)
  s: number;   // zero-based sequence index
  t: number;   // total frames in the group
  p: string;   // this frame's slice of the encoded envelope
}
```

A group is only created when an envelope does not fit in one message, so `t` is always at least 2 in practice; the receiver buffers the group until it is complete.

| Constant | Value | Meaning |
|---|---|---|
| `MAX_MESSAGE` | `2000` chars | Per-message budget, set below the engine's cap. Exported, and overridable per bus via `BusOptions.maxMessage`. |
| `CHUNK_TTL_TICKS` | `200` | An incomplete group is discarded after 10 s. |
| Eviction interval | `20` ticks | How often stalled groups are swept. |

The per-frame payload budget is exact rather than pessimistic: each character is charged what JSON will actually spend escaping it — two for a quote or a backslash, six for a control character, one for anything else, including printable non-ASCII. Ordinary JSON escapes roughly one character in eight, so a frame fills instead of leaving half of it reserved against an all-quotes payload that never arrives. A hostile payload simply yields more frames; none can exceed the budget. Surrogate pairs are never split across a boundary.

The reassembler ignores stray frames whose `t` disagrees with the group, out-of-range sequence numbers, and duplicate sequence numbers — so a partially-arrived group from a node that restarted mid-send times out rather than producing garbage.

## Outbound queue and rate limiting

The engine only processes a bounded number of script events per tick, so **nothing is ever sent inline**. Everything goes into an outbound queue drained on an interval:

| Constant | Value | Meaning |
|---|---|---|
| `FLUSH_INTERVAL_TICKS` | `1` | The queue flushes every tick. |
| `MAX_FLUSH_PER_TICK` | `50` | At most 50 messages leave per flush. |

The bound is on **messages, not bytes**, which is why the queue packs rather than simply draining: consecutive envelopes small enough to share a message leave as one batch. A node that sends a burst in a single tick — a run of `State.set` calls, a snapshot broadcast, an RPC fan-out — therefore spends a few of its slots instead of one per envelope. Each addon has its own queue, so this packs one node's own traffic and never several nodes' together.

Packing is conditional. A packed message is a shape only a reader that knows the batch tag can parse, so the queue stops packing for as long as a live peer predates the tag — a lone envelope is still tagged and sent, and packing resumes by itself once that peer is gone.

Frames are never packed. An envelope is only split when it fills a message on its own, so there is nothing left over to pack it with.

If a send throws — an unexpectedly oversized message slipping through, for instance — that message is dropped and counted rather than being allowed to crash the flush loop. `bus.queueSize` exposes the backlog, counted in queued entries before any packing.

The practical consequence is the one stated everywhere else in these docs: **timing is tick-based**. A reply cannot arrive on the tick you sent the request, and a large payload that spans many frames takes proportionally longer to land.

## Reading it in practice

To watch raw traffic from an addon:

```ts
core.node.bus.on('state-delta', (envelope) => {
  console.warn(`${envelope.src} → ${JSON.stringify(envelope.data)}`);
});
```

Handlers registered on the bus see envelopes **after** reassembly, echo filtering and address filtering, which is almost always what you want. Anything below that — individual frames, the queue — is internal and has no public hook.
