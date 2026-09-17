---
sidebar_position: 7
description: "The settings subsystem: a declarative schema in three scopes, typed and persisted."
---

# Settings subsystem

`@bedrock-core/config/server` turns a declarative schema into typed, persisted settings. It is the subsystem behind the `registerConfig` field of the [config app](/docs/config). An addon declares its schema once; the runtime handles storage and change notification.

Underneath, config is three [`core.db`](/docs/server/api/db) collections with a form on top: one document for the world, one per dimension, one per player, each nested exactly as the schema is and holding only what differs from the defaults. Config is local to the addon that declares it: nothing about it is served or announced.

## Import

```ts
import { registerConfig, configOf, flattenGroups, flattenSchema } from '@bedrock-core/config/server';
import type {
  Config, ConfigDeclaration, ConfigDefinition, ConfigEntry, ConfigValue,
  BooleanEntry, NumberEntry, StringEntry, SelectEntry, MultiselectEntry, ListEntry, EntryOptions, OptionValue,
  FlatSchema, FlatGroups, SerializedEntry, SchemaToValue, DeepPartial,
  LocalConfigScopes,
  ScopeTree, ConfigTree, ConfigNode, ConfigChildren, ConfigGroupAccessor, ConfigLeafAccessor, NodeValue,
} from '@bedrock-core/config/server';
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
config.server.pricing.currency.subscribe((next, prev) => { ... });
config.server.pricing.subscribe(pricing => { ... });         // group level
config.player.for(player).allowGifts.get();                // entity scopes pick the entity first
```

The tree is built once, when the schema is registered, and every access down it is an ordinary property lookup — cheap enough to read inside a tick loop.

## `registerConfig`

```ts
registerConfig<I extends ConfigDefinition>(definition: I): ConfigDeclaration<I>
```

The field `core.register()` takes. Installing builds the registry on the runtime's node, namespace and db, fills the `core:config` slot with it, and hands back the typed scope accessors under the `config` key. Declare it once: the slot is filled once, and a second fill throws.

The declaration carries the definition as written, which is how the ui-compiler filter reads it out of the register call to shape the screens.

```ts
const configDef = {
  server: {
    pricing: {
      taxRate: { type: 'number', default: 0.05, min: 0, max: 1, step: 0.01, label: 'Tax Rate', description: 'Tax applied to all purchases' },
      currency: { type: 'select', default: 'emerald', options: ['emerald', 'gold', 'diamond'], label: 'Currency' },
      shopEnabled: { type: 'boolean', default: true, label: 'Shop Enabled' },
    },
    bannedItems: { type: 'list', maxItems: 50, default: [], label: 'Banned Items', description: 'Item IDs that cannot be sold' },
  },
  dimension: {
    miningBonus: { type: 'number', default: 1, min: 0, max: 5, label: 'Mining Bonus' },
  },
  player: {
    allowGifts: { type: 'boolean', default: true, label: 'Allow Gifts' },
    displayCurrency: { type: 'select', default: 'symbol', options: ['symbol', 'name', 'both'], label: 'Currency Display' },
  },
} as const;

export type ShopConfigDef = typeof configDef;

const { config } = core.register({
  manifest: { creator: 'drav0011', pack: 'shop', packName: 'Shop', version: '1.0.0' },
  config: registerConfig(configDef),
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

The `$` sigil is what keeps them out of the child namespace — any bare name (`label`, `meta`, `title`) is one an addon could plausibly want for a setting. For the same reason **no schema key may start with `$`**; `registerConfig()` rejects one that does.

Group strings flatten to their own map beside the schema; see [`flattenGroups`](#flattenschema-and-flattengroups).

:::danger `get`, `set`, `patch`, `subscribe` and `for` are reserved at every depth
They are the verbs each accessor node carries, so a schema key with one of those names would shadow the method on its own node. `registerConfig()` rejects such a schema at registration, naming the path:

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
  server: { ... },
} as const;
```

`version` is handed straight to db, which stamps each target's document with it and runs the `migrate` steps when it reads one written at an older version. Each step takes one target's stored document — nested as the schema is, overrides only — and the scope it belongs to, and returns the next shape. Steps run lazily, per document, so a player who joins two versions late migrates as they load. There is no separate config migration engine.

## Entry types

```ts
type ConfigValue = boolean | number | string | readonly string[];
type ConfigEntry = BooleanEntry | NumberEntry | StringEntry | SelectEntry | MultiselectEntry | ListEntry;
```

Every entry requires `type`, `default` and **`label`**. `description` is optional on all of them.

| Type | Required | Optional |
|---|---|---|
| `'boolean'` | `default: boolean`, `label` | `description` |
| `'number'` | `default: number`, `min: number`, `max: number`, `label` | `step`, `description` |
| `'string'` | `default: string`, `label` | `maxLength`, `description` |
| `'select'` | `default: OptionValue<O>`, `options: O`, `label` | `description` |
| `'multiselect'` | `default: readonly OptionValue<O>[]`, `options: O`, `label` | `description` |
| `'list'` | `default: readonly string[]`, `label` | `maxItems`, `description` |

:::caution `label` is required, and `min`/`max` are required on numbers
`NumberEntry` declares `min` and `max` as required, not optional, and every entry type declares `label` as required.
:::

### Options

A `select` and a `multiselect` take their `options` as a string array or a string `enum`, `EntryOptions`:

```ts
enum Currency { Emerald = 'emerald', Gold = 'gold', Diamond = 'diamond' }

currency: { type: 'select', options: Currency, default: Currency.Emerald, label: 'Currency' },
rounding: { type: 'select', options: ['down', 'nearest', 'up'], default: 'nearest', label: 'Rounding' },
coins: { type: 'multiselect', options: Currency, default: [Currency.Gold], label: 'Accepted Coins' },
```

`OptionValue<O>` is one of the values `O` offers: an enum's member, or an array's element. A numeric `enum` does not fit `EntryOptions` and is a compile error, since a setting's choices are strings.

### `multiselect` vs `list`

Both hold a string array, and the difference is whether the whole option set is known up front.

A **`multiselect`** picks any number from a fixed `options` set, so every choice fits on screen and the UI draws it inside the settings form like any other field — segments that take several for a short set, one checkbox per option for a longer one:

```ts
features: { type: 'multiselect', options: ['pvp', 'tp', 'shop'], default: ['pvp'], label: 'Enabled Features' },
```

A **`list`** is open-ended — an addon can cap it with `maxItems` but cannot enumerate it — so there is nothing for a form to draw, and it gets a page of its own instead. Reach for `multiselect` whenever the set really is fixed; the result is one screen fewer for the player.

### Lists

A `list` entry is an ordered array of free strings, and the only array whose items are not drawn from `options`:

```ts
config.server.bannedItems.get();   // string[]
config.server.bannedItems.set(['minecraft:bedrock', 'minecraft:barrier']);
```

`maxItems` caps the length. A setting whose items come from a fixed set is a `multiselect`.

:::note Where a list is editable in game
A modal form has no control for a list, so whether the config screen can edit one depends on where it sits; the commands work either way. See [how a schema becomes screens](/docs/config/schema-to-screens#one-rule-per-level) and [list settings from a command](/docs/config/commands#list-settings-from-a-command).
:::

### Inferred value shape

`SchemaToValue<S>` converts a schema tree into the nested object your accessors return:

| Entry type | Value type |
|---|---|
| `boolean` | `boolean` |
| `number` | `number` |
| `string` | `string` |
| `select` | one of `options`: the enum, or the union of the array's strings |
| `multiselect` | an array of the same |
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

Two write operations with identical semantics in all three scopes:

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
config.player.for(player).get();                      // { allowGifts: boolean; displayCurrency: ... }
```

The entity-first forms — `config.player.get(player)`, `patch(player, …)` — remain for callers holding an untyped scope, such as [`configOf(core).local`](#configofcorelocal).

A player's tree is dropped when the player leaves, so a tree held across a leave answers for an invalidated handle; take it from `for(player)` again on the next spawn.

## Change listeners

`subscribe` sits on **every** node, so you watch a value by naming it. A node's listener fires when the value *at that node* changes — a leaf for its own value, a group for anything under it — with the new value and the one before it:

```ts
config.server.pricing.taxRate.subscribe((next, prev) => {
  console.warn(`tax ${String(prev)} -> ${String(next)}`);
});

config.server.pricing.subscribe(pricing => console.warn(pricing.taxRate));   // the subtree value
config.server.subscribe(full => console.warn(full.pricing.taxRate));         // the whole scope
config.player.for(player).allowGifts.subscribe((next, prev) => { ... });
```

Every `subscribe` returns an unsubscribe function. A node is a `ReadonlyObservable`, so `computed`, `effect`, `useObservable` and `toNative` from [`@bedrock-core/observable`](/docs/observable) take it as it is.

## Timing

Dynamic properties are unreadable during early execution, so the tree answers with the schema defaults until one tick after registration, when the documents are read. What that means for your code:

- Reads **before** that tick return schema defaults.
- When the documents load, listeners fire for every node whose stored value differs from its default.
- Therefore a subscriber attached right after `register()` always ends up seeing the real values. You do not need to defer your own subscription.

```ts
const { config } = core.register({ manifest, config: registerConfig(configDef) });

// Safe here: if the stored taxRate is 0.2, this fires once on load with (0.2, 0.05).
config.server.pricing.taxRate.subscribe((next) => { applyTax(next); });
```

## Other addons

Another addon cannot read or write your settings on its own, and a [`config.open()`](/docs/config/api) or command naming another addon hands the screens to that addon's realm, which draws its own. An addon that wants a setting seen or changed from elsewhere puts it on a channel itself: a [shared key](/docs/server/api/shared) for a value every realm should have, or an [RPC method](/docs/sync/rpc) with [`authorize`](/docs/server/api/authorize) in front of it:

```ts
core.rpc.serve<ShopApi>({
  setTaxRate: ({ taxRate, actorId }) => {
    authorize({ world: true }, actorId, 'write');
    config.server.pricing.taxRate.set(taxRate);

    return config.server.pricing.taxRate.get();
  },
});
```

See [sharing data between addons](/docs/server/guides/channels) for which channel carries what.

## `flattenSchema` and `flattenGroups`

```ts
import { flattenGroups, flattenSchema } from '@bedrock-core/config/server';

function flattenSchema(schema: SchemaGroup, prefix?: string): FlatSchema
function flattenGroups(schema: SchemaGroup, prefix?: string): FlatGroups
```

Turns a `SchemaGroup` into dot-path keys: every setting in `flattenSchema`, every group that names a `$label` or `$description` in `flattenGroups`. This is what an addon's **build** needs: the ui-compiler filter reads the definition out of `core.register()` and calls these to get the keys the compiled screens are shaped and keyed by, without a runtime in hand.

## `configOf(core).local`

```ts
configOf(core).local: LocalConfigScopes | undefined
```

Your own scopes, narrowed to what a generic consumer can use **without** knowing the schema's type. Reach for it from tooling built on a plain `Runtime` — the config screens and commands, debug screens — where the typed `config` that `register()` returned is not in hand.

```ts
interface LocalConfigScopes {
  server: { readonly schema: FlatSchema; get(): unknown; patch(partial: Record<string, unknown>): void };
  dimension: { readonly schema: FlatSchema; get(entity: Dimension): unknown; patch(entity: Dimension, partial: Record<string, unknown>): void };
  player: { readonly schema: FlatSchema; get(entity: Player): unknown; patch(entity: Player, partial: Record<string, unknown>): void };
  groups: Record<'server' | 'dimension' | 'player', FlatGroups>;
}
```

It is `undefined` for an addon that declared no config, and **synchronously available** from the moment the field installs, which is what makes it usable at startup, e.g. while registering custom commands. `groups` holds each scope's group display strings, as `flattenGroups` produces them. Writes go through the same `patch` the typed accessors use, so persistence, change notification and revert-to-default behave identically.
