---
sidebar_position: 5
description: "The resolver probes a target once per type for where its documents can live, and hands back a host with its capabilities or a refusal with its reason."
---

# Resolver

The resolver decides, per target, where a document can live: on the target's own dynamic properties through one of the engine's two ABIs, or on a world property keyed by the target's identity when it has none — or nowhere, with a reason.

Nothing is declared. A target is probed once **per type** — a block type either has the `minecraft:dynamic_properties` component or it does not, an item type is either stackable or not — and the decision is cached; a throw (a block in an unloaded chunk) is never cached.

## Import

```ts
import { createEngineResolver } from '@bedrock-core/db/minecraft';
import type { Resolver, Resolution, Accepted, Refused, Capabilities, TargetKind } from '@bedrock-core/db';
```

A `Db` carries its resolver as `db.resolver`; a collection asks it on every operation.

## Usage

```ts
const resolver = createEngineResolver('drav0011_economy');
const resolution = resolver.resolve(block);

if (resolution.ok) {
  resolution.host.caps;              // { own, enumerable, budget, readableWhenUnloaded, batch }
  resolution.host.write('doc', json);
} else {
  resolution.reason;                 // e.g. "a stackable item (minecraft:stone) cannot hold dynamic properties"
}
```

## `Resolver`

| Member | Signature | Description |
|---|---|---|
| `resolve` | `(target: unknown) => Resolution` | Where this target's documents live, probing its type on first sight |
| `decision` | `(typeKey: string) => 'direct' \| 'component' \| 'proxied' \| undefined` | The cached decision for a type, or `undefined` before it was probed |
| `absent` | `(kind: TargetKind, typeId: string, identity: string) => Accepted \| undefined` | A host for an identity whose target is not in hand — a proxied document reachable while the target is unloaded |

```ts
type Resolution = Accepted | Refused;

interface Accepted { ok: true; kind: TargetKind; typeId: string; typeKey: string; identity: string; host: DpHost }
interface Refused { ok: false; kind: TargetKind; reason: string }
```

## Hosts

| Target | Host | Why |
|---|---|---|
| `World`, `Entity`, `Player` | `own`, direct ABI | six methods, 32 767 characters per value |
| `ContainerSlot` with a non-stackable item | `own`, direct ABI | the slot is the item's place; a stackable item refuses properties |
| block whose type declares `minecraft:block_entity` with `dynamic_properties: true` | `own`, component ABI | about 950 bytes per block, dies with the block |
| `Dimension`, any other block | `proxied` | a world property keyed by the target's identity |
| `ItemStack` | **refused** | a detached copy — the write never reaches the world |

A host's `caps` say what a collection may [`require`](./targets.md#require):

```ts
interface Capabilities {
  readonly own: boolean;                  // the target holds the bytes itself
  readonly enumerable: boolean;           // the host can list its keys
  readonly budget: number;                // characters per value before the engine throws
  readonly readableWhenUnloaded: boolean; // the bytes are on the world, reachable without the target
  readonly batch: boolean;                // several keys can be written in one call
}
```

## Without the engine

The main entry is structural and runs without `@minecraft/server`: `createResolver({ world, namespace, classify })` takes any `DirectDp` as the world and a `Classifier` that maps a target to its kind, which is how the package's own tests run in vitest. `@bedrock-core/db/minecraft` supplies the engine's `instanceof` classifier, the locator that finds an entity by id and a block by location again, and the world.

## Notes

- **Identity, not object.** An `Accepted` carries an `identity` — an entity id, `<dim>:<x>,<y>,<z>:<typeId>` for a block, a dimension id — which is what the index keeps and what a handle re-resolves from.
- **A refusal names its reason**, so `where()` can show it and a collection's `for()` can throw it.
- The `namespace` prefixes every property key the resolver hands out, so two packs' documents on one target never meet.
