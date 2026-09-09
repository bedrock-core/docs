---
sidebar_position: 2
description: "Which of shared, events and RPC carries what between addons, and why a document never crosses a realm on its own."
---

# Sharing data between addons

Nothing crosses a realm on its own. An addon's documents, config values and in-memory state are its own; what a peer can see is exactly what the addon put on one of three channels, and each channel carries one kind of thing.

## The three channels

| Channel | Carries | Kept where | Who writes | Peer reads it |
|---|---|---|---|---|
| [`core.shared`](../api/shared.md) | a **value** every realm should have now | every realm's mirror | the owner | synchronously, from its mirror |
| [`core.events`](../api/events.md) | a **happening** | nowhere — delivered and forgotten | the owner | a listener, the same tick |
| [`core.rpc`](/docs/sync/rpc) | an **answer** to a question | with the owner | the owner's handler | a promise, next tick |

Pick by what the peer needs to do with it:

- **The peer needs the latest value, cheaply and often** — a shop's open flag, the current event, a price. Put it on a shared key. One publish, every realm reads it locally for as long as it wants.
- **The peer needs to react when something happens** — a purchase, a level-up, a reset. Emit an event. It carries a payload, costs one message, and is not kept: a peer that was not listening has missed it.
- **The peer needs something specific, or wants to change something** — one player's balance, a write to a document. Serve an RPC method. The owner answers with its own data, [authorized](../api/authorize.md) against the acting player.

A value only some peers want, some of the time, is an RPC answer, not a shared key — the mirror is paid for by every realm on every write.

## What stays local

[`core.db`](../api/db.md) is local. A collection is this addon's; nothing in it is served, announced or mirrored by default. The same holds for config values: the schema is announced so a UI can build a form, but the values are fetched over the nine `core:config.*` methods the runtime serves, with the acting player checked on each.

That is deliberate. Storage and exposure are different decisions, and an addon that persists a document has not said anything about who may read it.

## Mapping a document onto a channel

An owner exposes a document by naming the channel, in one line each:

```ts
const settings = core.db.collection('settings', { schema: schema<Settings>({ defaults }), accept: worldTarget() });

const { shared, events } = core.register({
  manifest,
  shared: { event: defaults.event },
  events: { purchase: event<{ playerId: string; gold: number }>() },
});

// A shared key: every realm has the current value. Fires on load too, so this is right at boot.
settings.for(world).subscribe(doc => shared.event.set(doc.event));

// An event: peers hear it happened.
core.rpc.serve<EconomyApi>({
  deductGold: ({ playerId, gold, actorId }) => {
    authorize({ entity: playerId }, actorId, 'write');

    const doc = balances.for(playerOf(playerId));

    doc.patch({ gold: (doc.get()?.gold ?? 0) - gold });
    events.purchase.emit({ playerId, gold });

    return doc.get();
  },
});
```

Config peers are not told when a value changes. An owner that wants them told does the same: mirrors the value on a shared key, or emits an event.

## Reading from the other side

```ts
const economy = core.shared.of<EconomyShared>('drav0011_economy');    // undefined until it announces
const purchases = core.events.of<EconomyEvents>('drav0011_economy');  // always a tree
const api = core.rpc.typed<EconomyApi>('drav0011_economy');

economy?.event.subscribe(event => hud.setEvent(event));
purchases.purchase.subscribe(({ playerId, gold }) => hud.flash(playerId, `-${gold}`));

const balance = await api.balance({ playerId: player.id, actorId: player.id });
```

Each read is typed by what the owner exports — `typeof sharedDef`, `typeof eventsDef`, the API interface — from a types package the peer installs. Nothing about the shape travels at runtime beyond the shared key names.

## Where each value can be seen

| Place | Owner | Survives restart | Peers see it | Authoritative |
|---|---|---|---|---|
| an observable | this addon | no | no | yes, for what it holds |
| a db document | this addon | yes | through an RPC method | yes |
| the config accessor tree | this addon | yes | through the config methods | yes |
| a shared key, own namespace | this addon | no — map a document onto it | yes, from their mirror | yes |
| a shared key, a peer's namespace | the peer | no | — | no: a copy; writes are dropped |
| an event | the sender | no | once, if listening | — |
| `core.node.state` | the transport | no | yes | the raw mirror, framework keys included |

## Next steps

- [`core.shared`](../api/shared.md) — the mirror as typed trees
- [`core.events`](../api/events.md) — broadcasts delivered and forgotten
- [RPC](/docs/sync/rpc) — request and reply, with `serve<Api>` and `typed<Api>`
- [Trust model](./trust-model.md) — what the channels do and do not defend against
