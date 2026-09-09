---
sidebar_position: 8
description: "core.config turns a declarative schema into typed, persisted, cross-addon settings."
---

# core.config

`core.config` turns a declarative schema into typed, persisted, cross-addon settings. An addon declares its schema once; the runtime handles storage, change notification, discovery and remote access.

Underneath, config is three [`core.db`](./db.md) collections with a form on top: one document for the world, one per dimension, one per player, each nested exactly as the schema is and holding only what differs from the defaults. Only the schema is announced to other realms; values stay with the owning addon and are fetched over RPC, so reading *another* addon's config is always async — your own never is.

## Import

```ts
import { core } from '@bedrock-core/server';
import type {
  Config, ConfigDefinition, ConfigEntry, ConfigValue,
  BooleanEntry, NumberEntry, StringEntry, EnumEntry, ListEntry, MultiselectEntry,
  FlatSchema, FlatGroups, SerializedEntry, SchemaToValue, DeepPartial,
  LocalConfigScopes, RemoteConfigAccessor, TypedRemoteConfig, ConfigAccessOptions,
  ScopeTree, ConfigTree, ConfigNode, ConfigChildren, ConfigGroupAccessor, ConfigLeafAccessor, NodeValue,
} from '@bedrock-core/server';
```

## The three scopes

| Scope | Shared across… | Accessor | Stored on |
|---|---|---|---|
| `server` | the whole world | `config.server` | the world |
| `dimension` | one `Dimension` | `config.dimension.for(dim)` | the world, keyed by the dimension |
| `player` | one `Player` | `config.player.for(player)` | the player entity |

They are independent — a schema may declare any combination, including only one.

Each scope is a **dotted accessor tree** mirroring the schema. Every node — group or leaf — is an [observable](/docs/observable) with `get` / `set` / `subscribe`, in the style of `world.afterEvents.playerSpawn.subscribe(…)`:

```ts
config.server.pricing.currency.get();          // 'emerald' | 'gold' | 'diamond'
config.server.pricing.currency.set('gold');
config.server.pricing.currency.subscribe((next, prev) => { … });
config.server.pricing.subscribe(pricing => { … });         // group level
config.player.for(player).allowGifts.get();                // entity scopes pick the entity first
```

The tree is built once, when the schema is registered, and every access down it is an ordinary property lookup — cheap enough to read inside a tick loop.

## `define`

```ts
core.config.define<I extends ConfigDefinition>(input: I): Config<I>
```

Declare this addon's config and get back the typed scope accessors. **Call once.** A second call throws `core.config.define() called more than once`.

You normally never call it directly: pass `config` to `register()` and it delegates here, returning the same value under the `config` key.

```ts
const configDef = {
  server: {
    pricing: {
      taxRate: { type: 'number', default: 0.05, min: 0, max: 1, step: 0.01, label: 'Tax Rate', description: 'Tax applied to all purchases' },
      currency: { type: 'enum', default: 'emerald', options: ['emerald', 'gold', 'diamond'], label: 'Currency' },
      shopEnabled: { type: 'boolean', default: true, label: 'Shop Enabled' },
    },
    bannedItems: { type: 'list', itemType: 'string', maxItems: 50, default: [], label: 'Banned Items', description: 'Item IDs that cannot be sold' },
  },
  dimension: {
    miningBonus: { type: 'number', default: 1, min: 0, max: 5, label: 'Mining Bonus' },
  },
  player: {
    allowGifts: { type: 'boolean', default: true, label: 'Allow Gifts' },
    displayCurrency: { type: 'enum', default: 'symbol', options: ['symbol', 'name', 'both'], label: 'Currency Display' },
  },
} as const;

export type ShopConfigDef = typeof configDef;

const { config } = core.register({
  manifest: { creator: 'drav0011', pack: 'shop', packName: 'Shop', version: '1.0.0' },
  config: configDef,
});
```

:::tip `as const` is what makes it typed
Without it, `type: 'number'` widens to `string` and `options` widens to `string[]`, so the inferred value type collapses. Apply `as const` once at the end of the object literal — it applies to every nested field, including enum `options`.
:::

Groups nest to any depth. `type` is a **reserved key** — never use it as a group name.

### Naming a group

A group can carry its own display strings with `$label` and `$description`:

```ts
server: {
  economy: {
    $label: 'Economy',
    $description: 'Balances, currency and what players may go negative to.',
    balances: {
      $label: 'Balances',
      startingBalance: { type: 'number', default: 100, min: 0, max: 10000, label: 'Starting Balance' },
    },
  },
},
```

Leave them off and the UI derives a title from the key (`economy` reads as "Economy"), so both fields are optional.

They are **not** settings. `$label` never appears in the value object and is not patchable:

```ts
config.server.economy.get();                   // { balances: { startingBalance: number } } — no $label
config.server.economy.patch({ $label: 'x' });  // compile error
```

The `$` sigil is what keeps them out of the child namespace — any bare name (`label`, `meta`, `title`) is one an addon could plausibly want for a setting. For the same reason **no schema key may start with `$`**; `define()` rejects one that does.

Group strings travel on their own announcement, [`core.config.groups`](#schema-and-groups), beside the schema.

:::danger `get`, `set`, `patch`, `subscribe` and `for` are reserved at every depth
They are the verbs each accessor node carries, so a schema key with one of those names would shadow the method on its own node. `define()` rejects such a schema at registration, naming the path:

```text
config schema: "server.economy.set" uses the reserved key "set"; reserved keys are get, set, patch, subscribe, for
```
:::

### Versioning the stored document

```ts
const configDef = {
  version: 2,
  migrate: {
    2: (stored, scope) => ({ ...stored, taxRate: stored.tax ?? stored.taxRate }),
  },
  server: { … },
} as const;
```

`version` is handed straight to db, which stamps each target's document with it and runs the `migrate` steps when it reads one written at an older version. Each step takes one target's stored document — nested as the schema is, overrides only — and the scope it belongs to, and returns the next shape. Steps run lazily, per document, so a player who joins two versions late migrates as they load. There is no separate config migration engine.

## Entry types

```ts
type ConfigValue = boolean | number | string | readonly string[];
type ConfigEntry = BooleanEntry | NumberEntry | StringEntry | EnumEntry | ListEntry | MultiselectEntry;
```

Every entry requires `type`, `default` and **`label`**. `description` is optional on all of them.

| Type | Required | Optional |
|---|---|---|
| `'boolean'` | `default: boolean`, `label` | `description` |
| `'number'` | `default: number`, `min: number`, `max: number`, `label` | `step`, `description` |
| `'string'` | `default: string`, `label` | `maxLength`, `description` |
| `'enum'` | `default: O[number]`, `options: readonly string[]`, `label` | `description` |
| `'multiselect'` | `default: readonly string[]`, `options: readonly string[]`, `label` | `description` |
| `'list'` | `default: readonly string[]`, `itemType: 'string' \| 'enum'`, `label` | `options`, `maxItems`, `description` |

:::caution `label` is required, and `min`/`max` are required on numbers
`NumberEntry` declares `min` and `max` as required, not optional, and every entry type declares `label` as required.
:::

### `multiselect` vs `list`

Both hold a string array, and the difference is whether the whole option set is known up front.

A **`multiselect`** picks any number from a fixed `options` set, so every choice fits on screen and the UI draws one checkbox per option, inside the settings form like any other field:

```ts
features: { type: 'multiselect', options: ['pvp', 'tp', 'shop'], default: ['pvp'], label: 'Enabled Features' },
```

A **`list`** is open-ended — an addon can cap it with `maxItems` but cannot enumerate it — so there is nothing for a form to draw, and it gets a page of its own instead. Reach for `multiselect` whenever the set really is fixed; the result is one screen fewer for the player.

### Lists

A `list` entry is an ordered string array, stored and transported as one:

```ts
config.server.bannedItems.get();   // string[]
config.server.bannedItems.set(['minecraft:bedrock', 'minecraft:barrier']);
```

`itemType: 'enum'` plus `options` constrains what the UI offers and what a command will accept as an item; `maxItems` caps the length.

:::note Where a list is editable in game
A modal form has no control for a list, so whether the config screen can edit one depends on where it sits; the commands work either way. See [how a schema becomes screens](/docs/config#how-a-schema-becomes-screens) and [list settings from a command](/docs/config#list-settings-from-a-command).
:::

### Inferred value shape

`SchemaToValue<S>` converts a schema tree into the nested object your accessors return:

| Entry type | Value type |
|---|---|
| `boolean` | `boolean` |
| `number` | `number` |
| `string` | `string` |
| `enum` | the union of `options` |
| `multiselect` | `string[]` |
| `list` | `string[]` |
| group | nested object (its `$label` / `$description` excluded) |

```ts
config.server.get();
// {
//   pricing: { taxRate: number; currency: 'emerald' | 'gold' | 'diamond'; shopEnabled: boolean };
//   bannedItems: string[];
// }
```

The accessor tree is built from the same machinery, so a node's `get()` returns exactly the value type for that node — a group's is its subtree, a leaf's is that row of the table:

```ts
config.server.pricing.get();            // { taxRate: number; currency: 'emerald' | 'gold' | 'diamond'; shopEnabled: boolean }
config.server.pricing.currency.get();   // 'emerald' | 'gold' | 'diamond'
config.server.bannedItems.get();        // string[]
config.server.pricing.nope;             // compile error — not a schema key
```

## Reading and writing

Two write operations with identical semantics everywhere — local and remote, all three scopes:

| Operation | Semantics |
|---|---|
| `patch(partial)` | **Deep merge.** Every part of the object is optional; only the provided keys change. |
| `set(value)` | **Full replace.** Requires the whole object. Any schema key missing from the payload reverts to its schema default. |

Both are available on **every** group of the tree, scoped to that group: `config.server.pricing.patch({ taxRate: 0.1 })` merges within `pricing`, and `config.server.pricing.set({ … })` replaces `pricing` — reverting only the keys under it. A leaf has `set` alone, which is the same single-key write.

Every value is coerced to its entry on the way in — a number clamped to `min`/`max`, an enum outside its `options` reverted to the default — and a value equal to its default is not stored at all, so the document holds only what the player changed.

### Server scope

```ts
config.server.pricing.taxRate.get();    // number
config.server.pricing.taxRate.set(0.1);
config.server.pricing.patch({ taxRate: 0.1 });

const cfg = config.server.get();        // the whole scope, a fully typed nested object

config.server.patch({ pricing: { taxRate: 0.1 } });
config.server.set({
  pricing: { taxRate: 0.1, currency: 'gold', shopEnabled: true },
  bannedItems: [],
});
```

### Dimension and player scopes

`for(entity)` picks the entity and hands back the same tree the server scope is, so both scopes read identically past that point. An entity with no stored document resolves to the **schema defaults**.

```ts
import { world } from '@minecraft/server';

const nether = world.getDimension('nether');

config.dimension.for(nether).miningBonus.get();       // number
config.dimension.for(nether).miningBonus.set(2);
config.dimension.for(nether).set({ miningBonus: 3 });

config.player.for(player).allowGifts.set(false);
config.player.for(player).get();                      // { allowGifts: boolean; displayCurrency: … }
```

The entity-first forms — `config.player.get(player)`, `patch(player, …)` — remain for callers holding an untyped scope, such as [`core.config.local`](#coreconfiglocal).

A player's tree is dropped when the player leaves, so a tree held across a leave answers for an invalidated handle; take it from `for(player)` again on the next spawn.

## Change listeners

`subscribe` sits on **every** node, so you watch a value by naming it. A node's listener fires when the value *at that node* changes — a leaf for its own value, a group for anything under it — with the new value and the one before it:

```ts
config.server.pricing.taxRate.subscribe((next, prev) => {
  console.warn(`tax ${String(prev)} → ${String(next)}`);
});

config.server.pricing.subscribe(pricing => console.warn(pricing.taxRate));   // the subtree value
config.server.subscribe(full => console.warn(full.pricing.taxRate));         // the whole scope
config.player.for(player).allowGifts.subscribe((next, prev) => { … });
```

Every `subscribe` returns an unsubscribe function. A node is a `ReadonlyObservable`, so `computed`, `effect`, `useObservable` and `toNative` from [`@bedrock-core/observable`](/docs/observable) take it as it is.

## Timing

Dynamic properties are unreadable during early execution, so the tree answers with the schema defaults until one tick after registration, when the documents are read. What that means for your code:

- Reads **before** that tick return schema defaults.
- When the documents load, listeners fire for every node whose stored value differs from its default.
- Therefore a subscriber attached right after `register()` always ends up seeing the real values. You do not need to defer your own subscription.

```ts
const { config } = core.register({ manifest, config: configDef });

// Safe here: if the stored taxRate is 0.2, this fires once on load with (0.2, 0.05).
config.server.pricing.taxRate.subscribe((next) => { applyTax(next); });
```

The schema is announced to other realms in that same tick.

## Cross-addon config

### `of`

```ts
core.config.of(addonId: string, options?: ConfigAccessOptions): RemoteConfigAccessor | undefined
core.config.of<I extends ConfigDefinition>(addonId: string, options?: ConfigAccessOptions): TypedRemoteConfig<I> | undefined
```

Returns `undefined` until that addon's schema has reached the local mirror — which is the synchronous "does this addon have config?" test. Value reads and writes go over RPC and are async.

```ts
import type { ShopConfigDef } from '@drav0011/shop-types';

const shopCfg = core.config.of<ShopConfigDef>('drav0011_shop');

const server = await shopCfg?.server.get();       // typed nested object | undefined

await shopCfg?.server.patch({ pricing: { taxRate: 0.1 } });
```

Remote entity scopes take an **id string**, not an entity — the target may be in another realm:

```ts
await shopCfg?.player.get(player.id);
await shopCfg?.dimension.patch(dimension.id, { miningBonus: 2 });
```

Every remote `patch` / `set` resolves with the updated effective values, so a caller gets read-after-write in a single round trip. `get` resolves `undefined` on a malformed response.

Omit the type parameter for untyped access — `RemoteConfigAccessor` exposes the same methods returning `unknown`, plus:

| Member | What it is |
|---|---|
| `schema` | `FlatSchema` — flat dot-path keys, scope segment stripped |
| `scopedSchema` | `FlatSchema` — the announced map, keys prefixed `server.` / `dimension.` / `player.` |
| `scopedGroups` | `FlatGroups` — the announced group strings, same prefixes |

A config peer is **not told when a value changes**. An owner that wants peers told mirrors the value on a [shared key](./shared.md) or emits an [event](./events.md).

### `subscribe`

```ts
core.config.subscribe(addonId, listener): Unsubscribe
core.config.subscribe<I extends ConfigDefinition>(addonId, listener): Unsubscribe
```

Fires immediately if that addon's schema is already announced, and again whenever it announces a new one.

```ts
core.config.subscribe<ShopConfigDef>('drav0011_shop', async (shopCfg) => {
  const cfg = await shopCfg.server.get();

  console.warn(`shop taxRate = ${String(cfg?.pricing.taxRate)}`);
});
```

:::note `subscribe` hands you an addon-level accessor
The accessor `subscribe` passes carries no `actorId`, so it acts as your addon rather than on a player's behalf. When a request is player-driven, build the accessor yourself with `core.config.of(id, { actorId: player.id })`.
:::

### Publishing a config type

Export the `ConfigDefinition` type from a shared types package so consumers get full typing:

```ts
// @drav0011/shop-types
export const configDef = {
  server: { pricing: { taxRate: { type: 'number', default: 0.05, min: 0, max: 1, label: 'Tax Rate' } } },
} as const;

export type ShopConfigDef = typeof configDef;
```

```ts
// in the shop addon's entry
import { configDef } from '@drav0011/shop-types';

const { config } = core.register({ manifest, config: configDef });
```

A consumer passes `ShopConfigDef` to `core.config.of()` or `core.config.subscribe()` and gets `pricing.taxRate` typed as `number`.

## Authorization

Remote access can be made **on behalf of a player** by passing an `actorId`. The owning addon then runs [`authorize`](./authorize.md) against that player before every request:

```ts
const shopCfg = core.config.of('drav0011_shop', { actorId: player.id });

await shopCfg?.server.patch({ pricing: { taxRate: 0.1 } });
// rejects unless `player` is a world operator
```

The targets are the world for the `server` scope, the dimension for `dimension`, and the player's own entity for `player` — so an operator reaches anything, anyone else reads world and dimension settings and reaches only their own player document, and a request with no actor is an addon acting for itself. A refusal **rejects the RPC** rather than silently doing nothing.

## The RPC surface

`define()` registers these methods on your node. You will not call them by hand — `core.config.of()` wraps them — but they are the contract a non-bedrock-core caller would need.

| Method | Params | Returns |
|---|---|---|
| `core:config.server.get` | `{ actorId? }` | the server document, defaults filled |
| `core:config.server.patch` | `{ changes, actorId? }` | the updated document |
| `core:config.server.set` | `{ doc, actorId? }` | the updated document |
| `core:config.dimension.get` | `{ dimId, actorId? }` | the dimension's document |
| `core:config.dimension.patch` | `{ dimId, changes, actorId? }` | the updated document |
| `core:config.dimension.set` | `{ dimId, doc, actorId? }` | the updated document |
| `core:config.player.get` | `{ playerId, actorId? }` | the player's document |
| `core:config.player.patch` | `{ playerId, changes, actorId? }` | the updated document |
| `core:config.player.set` | `{ playerId, doc, actorId? }` | the updated document |

`changes` and `doc` are nested as the schema is, so an `actorId` can never collide with a schema key. A dimension or player that is not in the world rejects the request by name.

## Schema and groups

```ts
core.config.schema: Announcement<FlatSchema>
core.config.groups: Announcement<FlatGroups>
```

One tick after registration the flattened schema is [announced](./announcement.md) with every key prefixed by its scope:

```
<your namespace>  →  core-config/schema  →  FlatSchema
```

```ts
{
  'server.pricing.taxRate': { type: 'number', default: 0.05, min: 0, max: 1, step: 0.01, label: 'Tax Rate', description: '…' },
  'server.bannedItems':     { type: 'list', itemType: 'string', maxItems: 50, default: [], label: 'Banned Items' },
  'player.allowGifts':      { type: 'boolean', default: true, label: 'Allow Gifts' },
}
```

That single map lets a UI addon enumerate every field of every provider without knowing any of them in advance. Its presence is the "this addon has config" signal.

[Group display strings](#naming-a-group) ride beside it, keyed by the group's dot-path under the same prefixes:

```
<your namespace>  →  core-config/groups  →  FlatGroups
```

```ts
{
  'server.economy':          { label: 'Economy', description: 'Balances, currency and …' },
  'server.economy.balances': { label: 'Balances' },
}
```

A group that names neither is absent rather than empty; a reader that finds no entry falls back to the key-derived title.

## `core.config.local`

```ts
core.config.local: LocalConfigScopes | undefined
```

Your own scopes, narrowed to what a generic consumer can use **without** knowing the schema's type. Reach for it from tooling built on a plain `Runtime` — config commands, debug screens — where the typed `config` that `register()` returned is not in hand.

```ts
interface LocalConfigScopes {
  server: { readonly schema: FlatSchema; get(): unknown; patch(partial: Record<string, unknown>): void };
  dimension: { readonly schema: FlatSchema; get(entity: Dimension): unknown; patch(entity: Dimension, partial: Record<string, unknown>): void };
  player: { readonly schema: FlatSchema; get(entity: Player): unknown; patch(entity: Player, partial: Record<string, unknown>): void };
}
```

It is `undefined` until `define()` has run, and **synchronously available** afterwards — unlike `core.config.of(core.id)`, which needs the schema to have reached the mirror one tick later. That is what makes it usable at startup, e.g. while registering custom commands. Writes go through the same `patch` the typed accessors use, so persistence, change notification and revert-to-default behave identically.
