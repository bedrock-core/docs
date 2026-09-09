---
sidebar_position: 6
description: "core.events is a broadcast delivered and forgotten: the owner says something happened, every listener hears it in the same tick, and nobody keeps it."
---

# core.events

`core.events` is a broadcast that is delivered and forgotten: the owner says something happened, every listener in every realm hears it in the same tick, and nobody keeps it.

It is the third thing the transport does, beside pushing a value ([`core.shared`](./shared.md)) and answering a question ([RPC](/docs/sync/rpc)). A value you want peers to *have* is a shared key; a question you want peers to *ask* is an RPC method; a thing that *happened* is an event. It has the shape `world.afterEvents` already has.

## Import

```ts
import { core, event } from '@bedrock-core/server';
import type { EventsTree, PeerEventsTree } from '@bedrock-core/server';
```

## Declare

An events shape names each event and, through `event<T>()`, the type of its payload. There is no default and no initial value: what crosses is the name and the payload.

```ts
export const eventsDef = {
  purchase: event<{ playerId: string; gold: number }>(),
  levelUp: event<{ playerId: string; level: number }>(),
  reset: event(),                                        // no payload
};

/** Export the type: a peer gets the typed tree from `core.events.of<EconomyEvents>()`. */
export type EconomyEvents = typeof eventsDef;

const { events } = core.register({
  manifest: { creator: 'drav0011', pack: 'economy', packName: 'Economy', version: '1.0.0' },
  events: eventsDef,
});
```

`register()` returns the typed tree under `events`, beside `config` and `shared`.

## Emit and listen to your own

```ts
events.purchase.emit({ playerId: player.id, gold: 5 });   // one message, every realm, this tick

events.purchase.subscribe(({ playerId, gold }) => {       // the owner hears its own first
  ledger.record(playerId, gold);
});
```

The owner's listeners run synchronously, before the message leaves — that is how one addon decouples its own modules without a second mechanism.

## Listen to a peer's

```ts
import type { EconomyEvents } from '@drav0011/economy-types';

const economy = core.events.of<EconomyEvents>('drav0011_economy');

const release = economy.purchase.subscribe(({ playerId, gold }, from) => {
  hud.flash(playerId, `-${gold}`);
});

release();
```

A peer's tree has `subscribe` and no `emit`, in the type and at runtime. The second listener argument is the sending namespace.

`of()` never answers `undefined`. A subscription is a filter on namespace and name, so a listener attached before the owning addon has registered — or before it is installed — simply hears the first event it announces. Being late is unrecoverable here, so being early is free.

## API

### `core.events.of`

```ts
core.events.of<Def extends EventsDef>(namespace: string): PeerEventsTree<Def>
```

Another addon's events as a typed tree. Always a tree; nothing is read from the mirror to build it.

### `core.events.on`

```ts
core.events.on(namespace: string, name: string, listener: (payload: unknown, from: string) => void): Unsubscribe
```

Listen without a declaration — the escape hatch for a name computed at runtime, and what the typed tree is built on.

### `core.events.own`

```ts
core.events.own: EventsTree<EventsDef> | undefined
```

This addon's tree, untyped, once declared.

### `core.events.define`

```ts
core.events.define<Def extends EventsDef>(def: Def): EventsTree<Def>
```

What `register({ events })` calls. Once per addon.

## Notes

- **Nothing is replayed.** Subscribe after it fired and you missed it. An event is not a value: a peer that wants the latest wants a shared key or an RPC answer. [`last()`](/docs/observable/last) turns an event into one when a screen needs it.
- **Owner only.** The namespace a listener matches is the envelope's sender, read from the transport rather than the payload, so a message cannot claim to come from an addon that did not send it.
- **Isolation.** A listener that throws is caught and logged against the namespace and name; the others still run.
- **One `emit` is one message.** A per-tick counter belongs in `core.shared`, where the cost is one publish rather than one message per change.

## Limits

- No delivery guarantee. A realm that is not listening when an event is announced has missed it.
- No ordering across senders. Per sender, messages arrive in order; between senders there is no clock worth trusting.
- No reply. That is [RPC](/docs/sync/rpc); an event has no answer.
