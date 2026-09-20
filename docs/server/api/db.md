---
sidebar_position: 7
description: "core.db is this addon's persisted documents, keyed by target and stored on whatever dynamic properties the target itself can hold."
---

# core.db

`core.db` is this addon's persisted documents — a [`@bedrock-core/db`](/docs/db) instance keyed under the addon's namespace, so two addons never meet on the same dynamic property.

A collection names a document type and, optionally, which targets it accepts; a document lives on the target's own dynamic properties when it has them (the world, an entity, a player, a block entity, a slot) and on the world keyed by the target's identity when it does not (a dimension, a vanilla block). Every handle is an [observable](/docs/observable). A collection is local to this addon; what a peer can reach is what the addon puts on one of the [three channels](../guides/channels.md).

## Import

```ts
import { core, schema, players, entityTypes, blockTypes, dimensions, worldTarget, slots, accepting, allOf, anyOf, except } from '@bedrock-core/server';
import type { Collection, Db, Document, IndexedDocument, Schema } from '@bedrock-core/server';
```

The runtime re-exports what a collection is *declared* with. The rest of the package — the resolver, the host and capability types, the index — is at [`@bedrock-core/server/db`](/docs/db).

## Usage

```ts
interface Balance { gold: number; lastSeen: number }

const balances = core.db.collection('balances', {
  schema: schema<Balance>({ defaults: { gold: 0, lastSeen: 0 } }),
  accept: players(),
});

balances.for(player).get();                  // Balance | undefined
balances.for(player).patch({ gold: 10 });    // written through, merges deep
balances.for(player).subscribe((doc, prev) => hud.refresh(doc));
```

`core.db` is available from `register()` on; the world's properties are readable one tick later, so a subscriber attached during registration hears the document load.

## API

### `collection`

```ts
core.db.collection<T extends object, Target = StorableTarget>(name: string, options: CollectionOptions<T, Target>): Collection<T, Target>
```

| Option | Type | Default | Description |
|---|---|---|---|
| `schema` <Req /> | `Schema<T>` | — | The document type, with its `version`, `defaults`, `migrate` steps and `normalize` |
| `accept` | `Acceptor<Target>` | any storable target | Which targets `for()` takes, checked at compile time and at runtime |
| `require` | `Requirements` | `{}` | Capabilities the host must have — `own`, `enumerable`, `readableWhenUnloaded` — refusing a target that lacks one |
| `coalesce` | `boolean` | `false` | Write-behind: one property write per dirty document per tick, on the world and entities only |

The name is scoped to this addon. See [collections](/docs/db/collection) for `for`, `where`, `all`, `at`, `forget` and the document handle, [schema](/docs/db/schema) for versions and migrations, and [targets](/docs/db/targets) for the acceptors.

### `find`

```ts
core.db.find(name: string): Collection<object, unknown> | undefined
```

A collection by name, untyped — for tooling that did not declare it.

### `flush`

```ts
core.db.flush(target?: unknown): void
```

Write every coalesced document now, or only the given target's. The runtime flushes a leaving player itself.

### `resolver`

```ts
core.db.resolver: Resolver
```

The [host resolver](/docs/db/resolver): where a target's documents can live, and why not.

## Notes

- Config is three collections on `core.db` — `config-server`, `config-dimension`, `config-player` — so a config document and a db document persist, migrate and quarantine identically.
- A peer reaches a document only through an RPC method this addon wrote, with [`authorize`](./authorize.md) in front of it. Nothing is served by default.
