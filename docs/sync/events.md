---
sidebar_position: 5
description: "Events is the sync subsystem for a happening: one message, delivered to every listening node in the same tick, kept by nobody."
---

# Events

`Events` is the sync subsystem for a happening: the sender says something happened, every node listening for that sender and name hears it in the same tick, and nothing is stored or replayed.

It is the third thing a node does beside pushing a value ([State](./state.md)) and answering a question ([Rpc](./rpc.md)). From an addon, reach it typed through [`core.events`](/docs/server/api/events); this page is the transport underneath.

## Import

```ts
import type { Events, EventHandler } from '@bedrock-core/sync';
```

`sync.events` is created and started by the node.

## Usage

```ts
sync.events.emit('purchase', { playerId, gold: 5 });          // every realm, this tick

const release = sync.events.on('drav0011_economy', 'purchase', (payload, from) => {
  console.warn(`${from} sold for ${String((payload as { gold: number }).gold)}`);
});

release();
```

## API

### `emit`

```ts
sync.events.emit(name: string, payload?: unknown): void
```

Announce a happening under this node's id. Handlers this node registered for its own id run first, synchronously, before the message leaves; then one `event` message is broadcast.

### `on`

```ts
sync.events.on(namespace: string, name: string, handler: EventHandler): Unsubscribe

type EventHandler = (payload: unknown, from: string) => void;
```

Listen for one sender's name. The namespace matched is the envelope's `src`, read from the transport rather than the payload, so a message cannot claim to come from a node that did not send it. A handler may be registered before the sender exists — a subscription is only a filter.

## Notes

- **Nothing is replayed.** A node that was not listening when an event was announced has missed it. A late joiner receives no backlog, unlike [State](./state.md#snapshots-and-late-join).
- **A handler that throws is caught** and logged against the namespace and name; the others still run.
- **One `emit` is one message**, subject to the [outbound queue](./protocol.md#outbound-queue-and-rate-limiting). A value that changes every tick belongs in State, where the cost is one publish rather than one message per change.
- **No reply.** An event has no answer; that is [Rpc](./rpc.md).

## Wire

One message type, `event`, carrying `{ n: name, p: payload }`. A payload that is not an object with a string `n` is dropped.
