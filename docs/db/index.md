---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/db is persisted documents on dynamic properties: typed collections keyed by target, on whatever properties the target itself can hold."
---

# db

`@bedrock-core/db` is persisted documents on dynamic properties: typed collections keyed by target, stored on whatever dynamic properties the target itself can hold.

:::caution Beta
`@bedrock-core/db` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## What is @bedrock-core/db?

The engine offers two ABIs for dynamic properties — six methods on the world, entities and container slots; three on a block entity's component — and nothing at all on a dimension or a vanilla block. This package puts one adapter over all of it: a [resolver](./resolver.md) that decides, per target, where a document can live, and typed [collections](./collection.md) on top, each document one JSON string with its version travelling in the bytes.

A collection is local to the addon that declared it, and a document handle is an [observable](/docs/observable).

From an addon, [`core.db`](/docs/server/api/db) is an instance of this keyed under the addon's namespace; this section is the package underneath.

## Install

<Install pkg="@bedrock-core/db" />

`@minecraft/server` (`>=2.8.0`) is a peer dependency; block entities need `2.10.0` (Minecraft 1.26.50).

Through the meta package the declaration API is on `@bedrock-core/server` and the rest at `@bedrock-core/server/db`.

## Usage

```ts
import { createEngineDb } from '@bedrock-core/db/minecraft';
import { blockTypes, schema } from '@bedrock-core/db';

const db = createEngineDb('drav0011_economy');

// No acceptor: any storable target. The schema names the document type.
const balances = db.collection('balances', { schema: schema<{ gold: number; lastSeen: number }>() });

balances.for(player).get();                 // undefined until written; cached after the first read
balances.for(player).patch({ gold: 10 });   // written through, one dynamic property; merges deep
balances.for(player).subscribe(doc => hud.refresh(doc));

// With an acceptor `for()` only takes a Block, and `require` is checked against what a Block can do.
const elevators = db.collection('elevators', {
  schema: schema<ElevatorDoc>({
    version: 3,
    defaults: { configured: false, facing: 'north' },
    migrate: {
      2: doc => ({ ...doc, facing: doc.facingDirection ?? 'north' }),
      3: ({ legacyMode: _, ...rest }) => rest,
    },
  }),
  accept: blockTypes('papi:elevator'),
  require: { own: true },                   // refuse a vanilla block instead of storing on the world
});

elevators.for(block).set({ configured: true, facing: 'east' });
elevators.where(stone);                     // { ok: false, reason: "minecraft:stone is not accepted by 'elevators'" }
```

## What you get

- **One JSON string per document**, `{"v":3,"d":{…}}` — the version travels with the bytes, so an old document is migrated lazily on first read, step by step, and rewritten once. Nothing has to be migrated at boot.
- **Deep semantics** — `patch` merges plain objects key by key, replaces arrays and scalars, and deletes on `undefined`; `defaults` fill at every depth on read and are never stored; `normalize` runs over every write, the place to clamp a value or drop one that should not be kept.
- **A subscriber hears the load** — attached before the first read, it fires when the document is read a tick later, so subscribing at registration works.
- **Quarantine, never deletion** — a document that cannot be read is moved under `<key>#bad` and logged, so a bad write cannot destroy a player's data.
- **Budget checked before the engine sees it** — a block entity holds about 950 bytes per pack and more throws `DbBudgetError` naming the collection; on the world, entities and slots a document past 32 767 characters is chunked transparently.
- **`all()` iterates every document from an index** — resumable, so a sweep can take a few per tick, and healed when a block is found replaced.
- **A validity gate on every operation** — a handle keeps an identity, not the object: `get()` is `undefined` and `set()` throws `DbTargetError` once an entity is removed, a slot empties or a chunk unloads, so a stale handle cannot write into the void.
- **Compile-time target checks** — an acceptor narrows what `for()` takes, and a `require` the target type can never satisfy is a type error naming the missing capability.

## Next steps

- [Collections](./collection.md) — `collection`, `for`, `where`, `all`, and the document handle
- [Schema](./schema.md) — `schema<T>()`, versions, migrations, defaults and `normalize`
- [Targets](./targets.md) — the acceptors, `require`, and what each kind of target can hold
- [Resolver](./resolver.md) — where a document lives and why
