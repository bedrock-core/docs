---
sidebar_position: 2
description: "A collection names a document type and which targets hold one; a document handle is an observable over one target's bytes."
---

# Collections

A collection names a document type and which targets hold one. `for(target)` hands back a document handle: an [observable](/docs/observable) over that one target's bytes, with `get`, `set`, `patch`, `delete` and `subscribe`.

## Import

```ts
import { createEngineDb } from '@bedrock-core/db/minecraft';
import type { Db, Collection, CollectionOptions, Document, IndexedDocument, Where } from '@bedrock-core/db';
```

From an addon, [`core.db`](/docs/server/api/db) is the `Db`.

## `db.collection`

```ts
db.collection<T extends object, Target = StorableTarget, R extends Requirements = Requirements>(
  name: string,
  options: CollectionOptions<T, Target, R>,
): Collection<T, Target>
```

| Option | Type | Default | Description |
|---|---|---|---|
| `schema` <Req /> | `Schema<T>` | — | The document type — see [schema](./schema.md) |
| `accept` | `Acceptor<Target>` | any storable target | Which targets `for()` takes — see [targets](./targets.md) |
| `require` | `Requirements` | `{}` | Capabilities the host must have: `own`, `enumerable`, `readableWhenUnloaded` |
| `coalesce` | `boolean` | `false` | Write-behind: one property write per dirty document per tick |

The document type comes from `schema<T>()`; `collection` takes no type argument.

```ts
const balances = db.collection('balances', {
  schema: schema<{ gold: number }>({ defaults: { gold: 0 } }),
  accept: players(),
});
```

### `coalesce`

With `coalesce: true` a write marks the document dirty and one property write per dirty document happens at the end of the tick. Offered on the world and on entities only — a block or slot document could die with its target before the flush, so those targets are refused with a reason. An entity that unloads before the flush has its document parked and written on `entityLoad`; a leaving player is flushed in `beforeEvents.playerLeave`. `db.flush(target?)` writes now.

## `Collection`

| Member | Signature | Description |
|---|---|---|
| `name` | `string` | The collection's name |
| `for` | `(target: Target) => Document<T>` | The handle for one target's document |
| `where` | `(target: Target) => Where` | Whether this collection would store on `target`, and with which capabilities, without touching it |
| `forget` | `(target: Target) => void` | Drop what the collection remembers about a target — its cached document and subscribers |
| `all` | `() => IterableIterator<IndexedDocument<T>>` | Every target known to hold a document, lazily, from the index |
| `at` | `(kind: TargetKind, identity: string) => IndexedDocument<T> \| undefined` | The document for one indexed identity, without holding the target |
| `size` | `number` | How many documents the index knows of |

```ts
type Where
  = { ok: true; kind: TargetKind; caps: Capabilities }
  | { ok: false; kind: TargetKind; reason: string };
```

### `all`

`all()` iterates the collection's index, kept in chunked world properties and updated on a document's first write, on `delete`, and by [`blockCleanup`](./targets.md#blocks) when a block breaks; a block found replaced by another type is removed from it. The iterator is resumable, so a sweep can take a few per tick:

```ts
for (const doc of elevators.all()) {
  if (!doc.available) { continue; }      // unloaded chunk, removed entity

  doc.patch({ configured: false });
}
```

A target that cannot be reached right now is still yielded, with `available` false — or readable, when its document lives on the world. Slots are never indexed.

### `at`

What a remote caller has, since a `Block` or an `Entity` cannot travel over the wire:

```ts
const doc = elevators.at('block', 'overworld:10,64,-3:papi:elevator');
```

## `Document`

| Member | Signature | Description |
|---|---|---|
| `available` | `boolean` | Whether the target can be reached and the collection accepts it right now |
| `reason` | `string \| undefined` | Why `available` is false |
| `get` | `() => T \| undefined` | The document with its defaults filled, `undefined` when there is none or the target cannot be reached |
| `set` | `(doc: T) => void` | Store `doc` as it is, after the schema's `normalize` |
| `patch` | `(changes: DeepPartial<T>) => void` | Merge into the stored document, deep |
| `delete` | `() => void` | Remove the document; never throws |
| `subscribe` | `(listener: (doc: T \| undefined, prev: T \| undefined) => void) => Unsubscribe` | Local change events for this document |

An `IndexedDocument` — what `all()` and `at()` yield — adds `kind: TargetKind` and `identity: string`.

### `patch`

A nested object merges key by key, an array replaces the one there, and `undefined` deletes a key — which puts it back to its default. What is stored is exactly what was written, after `normalize`.

```ts
balances.for(player).patch({ gold: 10 });                    // one key
settings.for(world).patch({ event: { active: false } });     // deep
settings.for(world).patch({ event: undefined });             // back to the default
```

### `subscribe`

Fires with the new document, or `undefined` on delete, and the one before it. A listener attached before the document was first read hears it load, which is what makes this correct at boot as well as on every later change:

```ts
settings.for(world).subscribe(doc => shared.event.set(doc?.event ?? defaults.event));
```

`get` and `subscribe` together are a `ReadonlyObservable`, so a document can be [`computed`](/docs/observable/computed) over or handed to a UI hook directly.

## `Db`

| Member | Signature | Description |
|---|---|---|
| `collection` | see above | Declare a collection |
| `find` | `(name: string) => Collection<object, unknown> \| undefined` | A collection by name, untyped |
| `flush` | `(target?: unknown) => void` | Write every coalesced document now, or one target's |
| `blockRemoved` | `(dimensionId, location, typeId) => void` | Tell every collection a block is gone; what `blockCleanup` calls |
| `resolver` | `Resolver` | The [host resolver](./resolver.md) |

`createEngineDb(namespace, log?)` from `@bedrock-core/db/minecraft` builds one over the world, with the engine's classifier and locator and the lifecycle hooks for `entityLoad` and `playerLeave` wired only when a coalescing collection exists. The `namespace` prefixes every property key, so two packs never meet.

## Notes

- **Every operation re-resolves the target**, at most once per tick. A handle from `for()` keeps an identity, not the object: `get()` is `undefined` and `set()` throws `DbTargetError` once an entity is removed, a slot empties, or a block's chunk unloads — except a proxied document (dimension, vanilla block), which lives on the world and stays reachable.
- **Hold a handle when hammering one target.** `for()` is cheap, but the handle resolves its target once per tick and caches the parsed document.
- **A document that cannot be read** — bytes that are not the envelope, a migration that throws — is quarantined under `<key>#bad`, logged, and reads as `undefined`. Nothing is deleted.
- **Budget.** A block entity holds about 950 bytes per pack; a document past it throws `DbBudgetError` naming the collection before the engine sees the write. On the world, entities and slots a document past 32 767 characters is chunked into `<key>#0..n` transparently.
