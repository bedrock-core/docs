---
sidebar_position: 6
---

# ConfigRegistry

`core.config` turns a declarative schema into typed, persisted, cross-addon settings. An addon declares its schema once; the runtime handles storage, change events, discovery and remote access.

Only the schema is broadcast over replicated state: its presence is the "this addon has config" signal, and it is what lets a UI build a form without a round trip. Values are fetched on demand over RPC, so reading *another* addon's config is always async — your own never is.

## Import

```ts
import { core, RESERVED_KEYS, validateConfigSchema } from '@bedrock-core/server-runtime';
import type {
  Config, ConfigDefinition, ConfigEntry, ConfigValue,
  BooleanEntry, NumberEntry, StringEntry, EnumEntry, ListEntry,
  FlatSchema, SerializedEntry, SchemaToValue, DotPath, PathValue, DeepPartial,
  LocalConfigScopes, RemoteConfigAccessor, TypedRemoteConfig, ConfigAccessOptions,
  // The accessor tree
  ServerConfigTree, ConfigTree, ConfigNode, ConfigChildren,
  ConfigGroupAccessor, ConfigLeafAccessor, NodeValue,
} from '@bedrock-core/server-runtime';
```

## The three scopes

| Scope | Shared across… | Accessor | Value falls back to |
|---|---|---|---|
| `server` | the whole world | `config.server` | schema default |
| `dimension` | one `Dimension` | `config.dimension.for(dim)` | schema default, until overridden for that dimension |
| `player` | one `Player` | `config.player.for(player)` | schema default, until overridden for that player |

They are independent — a schema may declare any combination, including only one.

Each scope is a **dotted accessor tree** mirroring the schema. Every node — group or leaf — carries its own verbs, in the style of `world.afterEvents.playerSpawn.subscribe(...)`:

```ts
config.server.pricing.currency.get();          // 'emerald' | 'gold' | 'diamond'
config.server.pricing.currency.set('gold');
config.server.pricing.currency.subscribe((next, prev) => { /* … */ });
config.server.pricing.subscribe(pricing => { /* … */ });   // group level
config.player.for(player).allowGifts.get();                // entity scopes pick the entity first
```

The tree is built once, when the schema is registered, and every access down it is an ordinary property lookup — cheap enough to read inside a tick loop.

---

## `define`

```ts
core.config.define<I extends ConfigDefinition>(input: I): Config<I>
```

Declare this addon's config and get back the typed scope accessors. **Call once.** A second call throws `core.config.define() called more than once`.

You normally never call it directly: pass `config` to `register()` and it delegates here, returning the same value.

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

const config = core.register({
  creator: 'drav0011',
  pack: 'shop',
  packName: 'Shop',
  version: '1.0.0',
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

Leave them off and the UI derives a title from the key (`economy` reads as "Economy"), which is what every schema did before these existed — so adding them is optional and never breaking.

They are **not** settings. `$label` never appears in the value object, is not patchable, and is not a dot-path:

```ts
config.server.economy.get();              // { balances: { startingBalance: number } } — no $label
config.server.economy.patch({ $label: 'x' });          // compile error
config.server.subscribe('economy.$label', fn);         // compile error
```

The `$` sigil is what keeps them out of the child namespace — any bare name (`label`, `meta`, `title`) is one an addon could plausibly want for a setting. For the same reason **no schema key may start with `$`**; `define()` rejects one that does.

:::info How they travel
Group strings ride a separate replicated key (`core-config/groups`) from the schema itself, so a consumer that predates them is unaffected and simply sees none. See [the published schema](#the-published-schema).
:::

:::danger `get`, `set`, `patch`, `subscribe` and `for` are reserved at every depth
They are the verbs each accessor node carries, so a schema key with one of those names would shadow the method on its own node. `define()` rejects such a schema at registration, naming the path:

```text
config schema: "server.economy.set" uses the reserved key "set"; reserved keys are get, set, patch, subscribe, for
```

The list is exported as `RESERVED_KEYS`, and `validateConfigSchema(scope, schema)` runs the same check if you want it earlier.
:::

---

## Entry types

```ts
type ConfigValue = boolean | number | string;
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

A `list` entry is an ordered string array. Values are flat, so it is stored and transported as a **JSON string** under its single dot-path key, and read back as an array:

```ts
config.server.bannedItems.get();   // string[]
config.server.bannedItems.set(['minecraft:bedrock', 'minecraft:barrier']);
```

`itemType: 'enum'` plus `options` constrains what the UI offers and what a command will accept as an item; `maxItems` caps the length.

:::note Where a list is editable in game
A modal form still has no control for a list, so whether the config screen can edit one comes down to where it sits — see [how a schema becomes screens](/docs/ui/config#how-a-schema-becomes-screens). On a level that renders as buttons it gets a row and a full editor; on a level that renders as a form it falls back to showing its items and naming the command.

The commands work either way, and carry [four verbs](/docs/ui/config#list-settings-from-a-command):

```text
/<ns>:config get bannedItems              → [tnt, lava_bucket] (2/50)
/<ns>:config set bannedItems "tnt, lava_bucket"
/<ns>:config add bannedItems flint_and_steel
/<ns>:config remove bannedItems tnt
```

From code the typed API is unchanged — `get()` still returns `string[]` and `set()` still takes one.
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

---

## Reading and writing

Two write operations with identical semantics everywhere — local and remote, all three scopes:

| Operation | Semantics |
|---|---|
| `patch(partial)` | **Deep merge.** Every part of the object is optional; only the provided keys change. |
| `set(value)` | **Full replace.** Requires the whole object. Any schema key missing from the payload reverts to its schema default and its persisted override is deleted. |

Both are available on **every** node of the tree, scoped to that node: `config.server.pricing.patch({ taxRate: 0.1 })` merges within `pricing`, and `config.server.pricing.set({ … })` replaces `pricing` — reverting only the keys under it. A leaf has `set` alone, which is the same single-key write.

### Server scope

```ts
// Walk to the node you mean
config.server.pricing.taxRate.get();    // number
config.server.pricing.taxRate.set(0.1);
config.server.pricing.patch({ taxRate: 0.1 });

// Or take the whole scope — a fully typed nested object
const cfg = config.server.get();

console.warn(cfg.pricing.taxRate);      // number

config.server.patch({ pricing: { taxRate: 0.1 } });
config.server.set({
  pricing: { taxRate: 0.1, currency: 'gold', shopEnabled: true },
  bannedItems: [],
});
```

### Dimension and player scopes

`for(entity)` picks the entity and hands back the same tree the server scope is, so both scopes read identically past that point. An entity with no stored override resolves to the **schema default**.

```ts
import { world } from '@minecraft/server';

const nether = world.getDimension('nether');

config.dimension.for(nether).miningBonus.get();       // number
config.dimension.for(nether).miningBonus.set(2);
config.dimension.for(nether).get();                   // { miningBonus: number }
config.dimension.for(nether).set({ miningBonus: 3 });

config.player.for(player).allowGifts.set(false);
config.player.for(player).get();                      // { allowGifts: boolean; displayCurrency: … }
```

The entity-first forms — `config.player.get(player)`, `patch(player, …)`, `set(player, …)` — remain for callers holding an untyped scope, such as [`core.config.local`](#coreconfiglocal).

:::caution Player values only exist while the player is online
The player scope tracks connected players. Values are loaded on `playerSpawn` (and for anyone already connected when the schema is defined, which matters after a `/reload`), and cleared on `playerLeave`. A remote `patch`/`set` aimed at an offline player logs a warning and is ignored — the read still answers with schema defaults.
:::

---

## Change listeners

`subscribe` sits on **every** node, so you watch a value by naming it. Listeners **bubble**: a change to `pricing.taxRate` fires the leaf listener, then the `pricing` group listener, then the root listener — deepest first.

```ts
// Leaf — next and previous
config.server.pricing.taxRate.subscribe((next, prev) => {
  console.warn(`tax ${String(prev)} → ${String(next)}`);
});

// Group — the subtree value
config.server.pricing.subscribe(pricing => console.warn(pricing.taxRate));

// Root — the whole scope value
config.server.subscribe(full => console.warn(full.pricing.taxRate));
```

Entity scopes are identical past `for(entity)`:

```ts
config.player.for(player).allowGifts.subscribe((next, prev) => { /* … */ });
config.player.for(player).subscribe(full => { /* … */ });
```

### The dot-path escape hatch

Groups (the scope root included) also take a **dot-path**, for a path computed at runtime rather than written out. It is still type-checked against the schema (`DotPath<S>`), and the value is inferred (`PathValue<S, P>`). Paths resolve relative to the node they are called on.

```ts
config.server.subscribe('pricing.taxRate', (next, prev) => { /* … */ });
config.server.pricing.subscribe('taxRate', (next, prev) => { /* … */ });
config.player.for(player).subscribe('allowGifts', (next, prev) => { /* … */ });
```

When the path is a literal, prefer the node — `config.server.pricing.taxRate.subscribe(…)` says the same thing with no string to keep in sync.

The listener signature is `(next, prev)` where `prev` may be `undefined`. Every `subscribe` returns an unsubscribe function.

---

## Timing and persistence

Values live in dynamic properties, one property per key:

| Scope | Dynamic property |
|---|---|
| `server` | `world` → `core-cfg:s:<addonId>:<key>` |
| `dimension` | `world` → `core-cfg:d:<addonId>:<dimId>:<key>` |
| `player` | the player entity → `core-cfg:p:<addonId>:<key>` |

Dynamic properties are unreadable during early execution, so `define()` schedules its load with `system.run()` — one tick after registration. In that same deferred pass the schema is broadcast to replicated state.

What that means for your code:

- Reads **before** the load completes return schema defaults.
- When loading completes, change listeners fire for every key whose persisted value differs from its default.
- Therefore a subscriber attached right after `register()` always ends up seeing the real values. You do not need to defer your own subscription.

```ts
const config = core.register({ /* … */, config: configDef });

// Safe here: if the stored taxRate is 0.2, this fires once on load with (0.2, 0.05).
config.server.pricing.taxRate.subscribe((next) => { applyTax(next); });
```

---

## Cross-addon config

### `of`

```ts
core.config.of(addonId: string, options?: ConfigAccessOptions): RemoteConfigAccessor | undefined
core.config.of<I extends ConfigDefinition>(addonId: string, options?: ConfigAccessOptions): TypedRemoteConfig<I> | undefined
```

Returns `undefined` until that addon's schema has reached the local state mirror — which is the synchronous "does this addon have config?" test. Value reads and writes go over RPC and are async.

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
| `scopedSchema` | `FlatSchema` — the raw published map, keys prefixed `server.` / `dimension.` / `player.` |

### `subscribe`

```ts
core.config.subscribe(addonId, listener): Unsubscribe
core.config.subscribe<I extends ConfigDefinition>(addonId, listener): Unsubscribe
```

Fires immediately if that addon's schema is already published, and again whenever it re-publishes.

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

const config = core.register({ /* …identity… */, config: configDef });
```

A consumer passes `ShopConfigDef` to `core.config.of()` or `core.config.subscribe()` and gets `pricing.taxRate` typed as `number`.

---

## Authorization

Remote access can be made **on behalf of a player** by passing an `actorId`. The owning addon then authorizes every request against that player.

```ts
const shopCfg = core.config.of('drav0011_shop', { actorId: player.id });

await shopCfg?.server.patch({ pricing: { taxRate: 0.1 } });
// rejects unless `player` is a world operator
```

The rule, implemented by `denyReason(scope, actorId, targetId)`:

| Situation | Outcome |
|---|---|
| No `actorId` | **Allowed.** An addon acting programmatically, not a player. |
| Actor is not in the world | **Refused** — `acting player '<id>' is not in the world` |
| Actor is a world operator | **Allowed** in every scope |
| Anyone else, `server` or `dimension` scope | **Refused** — `<scope> config may only be changed by an operator` |
| Anyone else, `player` scope, someone else's id | **Refused** — `a non-operator may only reach their own player config` |
| Anyone else, `player` scope, their own id | **Allowed** |

Checks apply to **every write**, and to **player-scope reads** as well — server and dimension settings are world settings, not secrets, but one player's settings are not another player's business.

A refusal **rejects the RPC** rather than silently doing nothing, so the caller learns why:

```
'drav0011_shop' config: server request refused - server config may only be changed by an operator
```

### `isOperator`

```ts
import { isOperator } from '@bedrock-core/server-runtime';

isOperator(player);   // boolean
```

Reads `player.playerPermissionLevel`, which is **readonly** on `Player`. It deliberately does **not** read `commandPermissionLevel`, which is mutable and could be rewritten by any script in the world — authorization must never rest on a value another addon can hand itself. `PlayerPermissionLevel.Custom` is a separate bucket, not a tier above `Operator`, so it is not accepted.

:::warning What this does and does not defend against
Every addon in a world runs arbitrary script and can write the underlying dynamic properties directly, so nothing here stops a hostile *pack*. The boundary this enforces is the one that actually exists: a **player** driving a config UI or a config command must not be able to change settings they have no business changing.
:::

---

## The RPC surface

`define()` registers these methods on your node automatically. You will not call them by hand — `core.config.of()` wraps them — but they are the contract a non-bedrock-core caller would need.

| Method | Params | Returns |
|---|---|---|
| `core:config.get-server` | `{}` | flat server values |
| `core:config.patch` | `{ values, actorId? }` | updated flat server values |
| `core:config.set` | `{ values, actorId? }` | updated flat server values |
| `core:config.get-dim` | `{ dimId }` | flat dimension values |
| `core:config.patch-dim` | `{ dimId, values, actorId? }` | updated flat values |
| `core:config.set-dim` | `{ dimId, values, actorId? }` | updated flat values |
| `core:config.get-player` | `{ playerId, actorId? }` | flat player values |
| `core:config.patch-player` | `{ playerId, values, actorId? }` | updated flat values |
| `core:config.set-player` | `{ playerId, values, actorId? }` | updated flat values |

`values` is a flat dot-path map of primitives, always nested under a `values` field so that an `actorId` can never collide with a schema key of the same name.

---

## The published schema

In the same deferred pass that loads values, the flattened schema is written to replicated state:

```
<your namespace>  →  core-config/schema  →  FlatSchema
```

with every key prefixed by its scope:

```ts
{
  'server.pricing.taxRate': { type: 'number', default: 0.05, min: 0, max: 1, step: 0.01, label: 'Tax Rate', description: '…' },
  'server.bannedItems':     { type: 'list', itemType: 'string', maxItems: 50, default: '[]', label: 'Banned Items' },
  'player.allowGifts':      { type: 'boolean', default: true, label: 'Allow Gifts' },
}
```

That single map lets a UI addon enumerate every field of every provider without knowing any of them in advance.

A published value is always a primitive — `ConfigValue` is `boolean | number | string`. Both array-valued types, [`list`](#lists) and [`multiselect`](#multiselect-vs-list), therefore travel as the `JSON.stringify` of their array — which is why `bannedItems` above publishes `default: '[]'` — and the typed accessors parse them back to `string[]`.

### Group strings

[Group display strings](#naming-a-group) are published beside the schema, on a key of their own:

```
<your namespace>  →  core-config/groups  →  FlatGroups
```

keyed by the group's dot-path, under the same scope prefixes:

```ts
{
  'server.economy':          { label: 'Economy', description: 'Balances, currency and …' },
  'server.economy.balances': { label: 'Balances' },
}
```

A group that names neither is absent rather than empty, so a schema that names nothing publishes `{}`.

:::info Why a second key rather than one map
`core-config/schema` keeps exactly the shape it always had. A consumer written before group strings existed reads it unchanged and never sees the new key; one written after reads both and falls back to key-derived titles when the second is missing — which is the same thing it does for an addon that simply names no group. Neither side needs a version check.
:::

---

## `core.config.local`

```ts
core.config.local: LocalConfigScopes | undefined
```

Your own scopes, narrowed to what a generic consumer can use **without** knowing the schema's type. Reach for it from tooling built on a plain `Runtime` — config commands, debug screens — where the typed value `register()` returned is not in hand.

```ts
interface LocalConfigScopes {
  server: { readonly schema: FlatSchema; get(): unknown; patch(partial: Record<string, unknown>): void };
  dimension: { readonly schema: FlatSchema; get(entity: Dimension): unknown; patch(entity: Dimension, partial: Record<string, unknown>): void };
  player: { readonly schema: FlatSchema; get(entity: Player): unknown; patch(entity: Player, partial: Record<string, unknown>): void };
}
```

It is `undefined` until `define()` has run, and **synchronously available** afterwards — unlike `core.config.of(core.id)`, which needs the schema to have reached replicated state one tick later. That is what makes it usable at startup, e.g. while registering custom commands. Writes go through the same `patch` the typed accessors use, so persistence, change events and revert-to-default behave identically.
