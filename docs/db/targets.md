---
sidebar_position: 4
description: "Acceptors say which targets a collection takes, checked in the IDE and at runtime; require says what the host must be able to do."
---

# Targets

An acceptor says which targets a collection takes, and `require` says what their host must be able to do. Both are checked twice: at compile time against the target type, and at runtime per target type, cached beside the resolver's decision.

## Import

```ts
import { players, entityTypes, blockTypes, dimensions, worldTarget, slots, accepting, anyOf, allOf, except } from '@bedrock-core/db';
import type { Acceptor, Requirements, StorableTarget, TargetKind } from '@bedrock-core/db';
```

All re-exported from `@bedrock-core/server`.

## What can hold a document

```ts
type StorableTarget = World | Dimension | Entity | Block | ContainerSlot;
type TargetKind = 'world' | 'dimension' | 'entity' | 'block' | 'slot' | 'itemStack' | 'unknown';
```

| Target | Where the document lives | Own properties |
|---|---|---|
| `World` | the world | ✅ |
| `Player`, `Entity` | the entity; dies with it | ✅ |
| `Block` whose type declares `minecraft:block_entity` with `dynamic_properties: true` | the block entity, about 950 bytes per pack; dies with the block | ✅ |
| `ContainerSlot` holding a non-stackable item | the slot's item | ✅ |
| `Dimension` | the world, keyed by the dimension id | ❌ |
| any other block | the world, keyed by dimension and location | ❌ |
| `ItemStack` | refused — a detached copy; the write never reaches the world | — |
| `ContainerSlot` holding a stackable item | refused — a stackable item cannot hold properties | — |

See [Blocks](#blocks) for what a block needs, and the [resolver](./resolver.md) for how the decision is made.

## Acceptors

An acceptor is a rule over target *types*: it is asked once per type with the type id — block or entity type, the item type of a slot, `minecraft:overworld` for a dimension, `world` for the world — and cached. Types, not instances, which is what keeps the check free on the hot path.

| Acceptor | Takes | Target type |
|---|---|---|
| `players()` | players | `Player` |
| `entityTypes(...ids)` | entities of the listed types; every entity when none is listed | `Entity` |
| `blockTypes(...ids)` | blocks of the listed types; every block when none is listed | `Block` |
| `dimensions(...ids)` | the listed dimensions; every dimension when none is listed | `Dimension` |
| `worldTarget()` | the world | `World` |
| `slots(...itemIds)` | container slots holding the listed items; any item when none is listed | `ContainerSlot` |
| `accepting(test, kinds?)` | any rule over type ids, for the target type the caller names | `T` |

Without an `accept`, a collection takes any `StorableTarget`.

```ts
const balances = db.collection('balances', { schema: balanceSchema, accept: players() });

balances.for(player);     // ok
balances.for(block);      // compile error: Block is not Player
```

### Combining

| Combinator | Result |
|---|---|
| `anyOf(a, b)` | any of the rules; the target type is the union — `anyOf(players(), entityTypes('papi:merchant'))` takes a `Player \| Entity` |
| `allOf(a, b)` | all of the rules; the target type is the intersection |
| `except(base, excluded)` | the base rule minus another — `except(entityTypes(), players())` takes every entity but a player |

`except` keeps the base type, since TypeScript cannot subtract a subclass: what is excluded is refused when `for()` runs, with a reason.

## `require`

```ts
interface Requirements {
  readonly own?: true;                  // the target must hold its own properties
  readonly enumerable?: true;           // the host must be able to list its keys
  readonly readableWhenUnloaded?: true; // the document must be readable while the target is not loaded
}
```

Only `true` is a demand; an omitted key is indifferent. A target whose host lacks a required capability is refused by `for()` with a reason — a block without dynamic properties under `require: { own: true }` is refused instead of stored on the world.

The check also runs in the IDE: a requirement the acceptor's target type can *never* satisfy is a compile error whose missing-property name is the reason. `own` on a `dimensions()` collection and `readableWhenUnloaded` on an `entityTypes()` collection are both type errors.

```ts
db.collection('elevators', {
  schema: elevatorSchema,
  accept: blockTypes('papi:elevator'),
  require: { own: true },
});
```

## Blocks

A block holds its own documents when its type turns dynamic properties on:

```json
"minecraft:block_entity": { "dynamic_properties": true }
```

The resolver probes for the `minecraft:dynamic_properties` component this gives the block, not for the block entity: a block entity without it is stored on the world like any other block.

Two things a block collection needs from the pack:

- **`blockCleanup`** — a custom component to register and list on every accepted block type. Its `onBreak` fires for every removal, `/setblock` and script `setPermutation` included, and is what keeps the [index](./collection.md#all) honest:

  ```ts
  import { blockCleanup } from '@bedrock-core/db/minecraft';

  system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent('papi:db_cleanup', blockCleanup(db));
  });
  ```

- **A loot function**, if a mined block should carry its document on the dropped item. By default a mined block-entity item carries none.

An unregistered custom component named in block JSON removes the block from the world, so register it before the pack's blocks load.

## Slots

A `ContainerSlot` is a runtime-decided host: the same slot holds a document while it holds a non-stackable item and refuses one while it holds a stackable item. `where(slot)` answers for the item there now. Slot documents are never indexed, so `all()` does not yield them.
