---
sidebar_position: 1
description: "@bedrock-core/server-runtime is the framework layer addons build on."
---

# core

`@bedrock-core/server-runtime` is the framework layer addons build on. Where [`@bedrock-core/sync`](/docs/sync) is the low-level transport, the runtime is the thing you **register into**: an addon declares its identity and everything it installs once, and that declaration flows into a cross-addon registry — a live directory of every bedrock-core addon present in the world.

## Install

<Install pkg="@bedrock-core/server-runtime" />

Most addons install [`@bedrock-core/server`](../index.md) instead, which re-exports everything below and pins matching versions of the packages it is built on. Both imports are interchangeable:

```ts
import { core } from '@bedrock-core/server';          // the meta package
import { core } from '@bedrock-core/server-runtime';  // the runtime alone
```

## `core` — the runtime singleton

`core` is a `Runtime` instance. Import it, register once, and use it for the rest of the addon's life.

```ts
import { core } from '@bedrock-core/server';

core.register({ manifest: { creator: 'drav0011', pack: 'economy', packName: 'Economy', version: '1.0.0' } });
```

Every accessor below throws `runtime.<name> is unavailable: call register() first` until registration has happened.

| Member | Type | What it is |
|---|---|---|
| `core.registered` | `boolean` | Whether `register()` has run. The one member safe to read before it. |
| `core.id` | `string` | This addon's namespace, `creator_pack`. |
| `core.namespace` | `string` | Alias of `core.id`. |
| `core.manifest` | `AddonManifest` | The validated manifest, identity fields only. |
| `core.registry` | [`Registry`](./registry.md) | The cross-addon directory. |
| `core.features` | [`FeatureManager`](./features.md) | Condition-driven togglable behavior. |
| `core.shared` | [`SharedRegistry`](./shared.md) | The replicated mirror as typed trees: `of(ns)` for a peer's, `own` for this addon's. |
| `core.events` | [`EventsRegistry`](./events.md) | Broadcasts delivered and forgotten: `of(ns)` for a peer's, `own` for this addon's. |
| `core.db` | [`Db`](./db.md) | This addon's persisted documents, keyed by target. |
| `core.translations` | [`TranslationsRegistry`](./translations.md) | Cross-addon i18n bundles, with resolvers over all of them. |
| `core.slot(key)`, `core.fill(key, value)` | [`RuntimeSlots`](#slots) | Where a package above the runtime parks its subsystem, keyed `namespace:name`. |
| `core.host` | [`HostElection`](./host.md) | Reserved for capabilities. Nothing elects today. |
| `core.rpc` | `Rpc` | [RPC](/docs/sync/rpc), passed through from the sync node. |
| `core.node` | `SyncNode` | The raw [sync node](/docs/sync) — bus, discovery, the mirror, events. |

Settings are not a member. They are a package above the runtime, reached through `configOf(core)` from `@bedrock-core/config/server`; see [the settings subsystem](/docs/config/settings).

## `register()`

```ts
register<O extends RegisterOptions>(options: O): Declared<O>
```

Declare the addon and bring it online. **Call exactly once, at the top of the entry module, and nothing else runs after it.** It throws on an invalid manifest and on a second call.

`RegisterOptions` is a `manifest` (the [manifest fields](#manifest-fields)) plus any number of **declarations** beside it. A declaration is a value with an `install(core)` method. `register()` installs each one in the order its key was written, on the already-live runtime, and hands what `install` returned back under the same key. The runtime never knows what a declaration builds, which is what lets a package above it add a field and have its own types come back typed.

| Field | Declaration | From |
|---|---|---|
| `shared` | [`registerShared(keys)`](./shared.md) | `@bedrock-core/server` |
| `events` | [`registerEvents(tree)`](./events.md) | `@bedrock-core/server` |
| `config` | [`registerConfig(definition)`](/docs/config) | `@bedrock-core/config` |
| `catalog` | [`registerCatalog()`](/docs/catalog) | `@bedrock-core/catalog` |
| `guides` | [`registerGuides()`](/docs/guides) | `@bedrock-core/guides` |

`Declared<O>` is the result: one key per declaration in the bag, typed by what its `install` returns. Destructure it.

```ts
import { core, registerEvents, registerShared } from '@bedrock-core/server';
import { registerCatalog } from '@bedrock-core/catalog';
import { registerConfig } from '@bedrock-core/config';
import { registerGuides } from '@bedrock-core/guides';
import { configDef, sharedDef, eventsDef } from './example';

const { config, shared, events } = core.register({
  manifest: {
    creator: 'drav0011',
    pack: 'economy',
    packName: 'Economy',
    creatorName: 'DrAv0011',
    version: '1.0.0',
    description: 'Balances, currency and trading',
    dependencies: ['drav0011_core_data'],
    optionalDependencies: ['drav0011_leaderboard'],
    icon: 'textures/ui/economy/icon',
    thumbnail: 'textures/ui/economy/thumbnail',
  },
  catalog: registerCatalog(),
  config: registerConfig(configDef),
  guides: registerGuides(),
  shared: registerShared(sharedDef),
  events: registerEvents(eventsDef),
});

config.server.get();       // fully typed
shared.currency.set('gold');
events.purchase.emit({ playerId: player.id, gold: 5 });
```

A field takes arguments only for what the build cannot know. `registerGuides()` takes none, because the guides filter already compiled the pages. `registerConfig(definition)` takes the definition because the definition *is* the declaration, and the ui-compiler filter reads it out of this very call to shape one screen per section.

### What a declaration may do

`register()` runs at script load, so an `install` runs synchronously inside it, on a live runtime: the node, the registry, features and translations are started and the db is usable. Within that, an install may:

1. Fill one [slot](#slots) and read any other.
2. Serve RPC methods, announce a value on the mirror, read the registry, and store through `core.db`.
3. Subscribe to `system.beforeEvents.startup`. Custom commands can only be registered there, and startup fires after every module has loaded, so a subscription made during `register()` is early enough.

Two rules keep declarations independent of each other:

- **Anything read off the build is published on the first tick, never synchronously.** Compiled screens, a page, a guide manifest: the generated modules that hold them are evaluated before `register()` runs today, and deferring to the first tick makes the import order irrelevant.
- **Knowledge of another field is read at use, through its slot, never at install.** An install cannot see a field written after it, and a slot read when a screen opens always can. There is no second install pass.

`stop?()` runs in reverse install order when the runtime stops. There are no other hooks.

### Writing one

```ts
import type { Declaration, Runtime } from '@bedrock-core/server';

declare module '@bedrock-core/server-runtime' {
  interface RuntimeSlots { 'acme:widgets': WidgetRegistry }
}

export function registerWidgets(definition: WidgetDefinition): Declaration<Widgets> {
  let registry: WidgetRegistry | undefined;

  return {
    install(core: Runtime): Widgets {
      registry = new WidgetRegistry(core.node, core.namespace);
      core.fill('acme:widgets', registry);

      return registry.define(definition);
    },
    stop(): void {
      registry?.stop();
    },
  };
}
```

The factory is named `registerWidgets` rather than `widgets` so the accessor can keep the plain name: `const { widgets } = core.register({ manifest, widgets: registerWidgets(definition) })`.

## Slots

The runtime cannot construct a subsystem that lives above it, so it offers a named slot instead: `core.fill(key, value)` parks one, `core.slot(key)` hands it back. `RuntimeSlots` is empty here and filled in by module augmentation from the package that owns each subsystem, so the runtime never imports what it holds.

```ts
declare module '@bedrock-core/server-runtime' {
  interface RuntimeSlots { 'core:config': ConfigRegistry }
}
```

A key is namespaced the way a feed or an RPC method is, so two packages never collide. `fill` throws on a second fill of one key. A declaration fills its slot from `install`, and the owning package exports one reader, `configOf(core)` for config, which decides for itself what an unfilled slot means: only that package knows whether absence is an error or the ordinary state of an addon that declared nothing.

## Manifest fields

```ts
interface AddonManifest {
  creator: string;
  pack: string;
  packName: string;
  version: string;
  creatorName?: string;
  description?: string;
  dependencies?: string[];
  optionalDependencies?: string[];
  icon?: string;
  thumbnail?: string;
}
```

| Field | Required | Notes |
|---|:---:|---|
| `creator` | ✅ | Creator/vendor id. Must match `/^[a-z0-9_]+$/` — lowercase alphanumeric and underscores. |
| `pack` | ✅ | Abbreviated pack id, same character rule. Joined as `creator_pack` to form the namespace. |
| `packName` | ✅ | Pack **display** name. Not part of identity. |
| `version` | ✅ | Free-form, e.g. semver. Announced to peers by discovery. |
| `creatorName` | — | Creator display name. |
| `description` | — | Short description. |
| `dependencies` | — | Namespaces (`creator_pack`) this addon needs. **Soft** — a missing one logs and fires an event, it never blocks. |
| `optionalDependencies` | — | Namespaces that unlock optional [features](./features.md) when present. |
| `icon` | — | Resource-pack texture path for the catalog icon, e.g. `textures/ui/my_addon_logo`. |
| `thumbnail` | — | Resource-pack texture path for a 16:9 banner on the addon's page. |

### Display fields are translation keys

`packName`, `creatorName` and `description` are assumed to be Minecraft translation keys shipped in the addon's resource pack `.lang`, so a catalog can render them in each player's language. Plain text still works — Bedrock falls back to the literal string when no `.lang` entry matches.

```ts
import { createI18n } from '@bedrock-core/i18n';
import bundle from '@bedrock-core/generated/i18n';

const i18n = createI18n(bundle);

core.register({
  manifest: {
    creator: 'drav0011',
    pack: 'economy',
    packName: i18n.key($ => $.meta.name),
    creatorName: i18n.key($ => $.meta.creator),
    description: i18n.key($ => $.meta.description),
    version: '1.0.0',
  },
});
```

The bundle travels on its own. `register()` publishes the bundle the addon's default `createI18n` instance was created with on the first tick, through [`core.translations`](./translations.md), so an addon that draws nothing still has its name resolved by whatever realm lists it.

### Validation

`register()` validates the manifest and throws a descriptive error rather than letting a misconfigured addon misbehave silently:

| Input | Error |
|---|---|
| Not an object | `addon manifest must be an object` |
| Missing/empty `creator`, `pack`, `packName` or `version` | `addon manifest '<field>' is required and must be a non-empty string` |
| `creator` or `pack` with an illegal character | `invalid <field> '<value>': must be lowercase alphanumeric and underscores only (a-z0-9_)` |
| `dependencies` that is not a `string[]` | `addon manifest '<field>' must be an array of strings` |

## `stop()`

```ts
core.stop();
```

Take the addon offline and clear every accessor. Every declaration's `stop` runs first, in reverse install order. Safe to call before registering (no-op). Mostly useful in GameTests — a shipped addon registers and stays up.

## Several runtimes in one realm

The `Runtime` class stands alone, so a GameTest can create **several runtimes in one script realm**. They talk over the real `system` script-event bus, and each `register()` brings its runtime online independently.

```ts
import { register, type Test } from '@minecraft/server-gametest';
import { Runtime } from '@bedrock-core/server';

register('core', 'discovery_and_rpc', (test: Test) => {
  const a = new Runtime();

  a.register({ manifest: { creator: 'test', pack: 'demo_a', packName: 'A', version: '1.0.0' } });

  const b = new Runtime();

  b.register({ manifest: { creator: 'test', pack: 'demo_b', packName: 'B', version: '1.0.0' } });
  b.rpc.onRequest('ping', () => 'pong');

  // a.id === 'test_demo_a', b.id === 'test_demo_b'

  let reply: unknown;

  test.startSequence()
    .thenIdle(20)
    .thenExecute(() => void a.rpc.request(b.id, 'ping').then((r) => { reply = r; }))
    .thenIdle(20)
    .thenExecute(() => {
      if (!a.registry.has(b.id)) { test.fail('A did not discover B'); }

      if (reply !== 'pong') { test.fail(`expected 'pong', got ${String(reply)}`); }

      a.stop();
      b.stop();
    })
    .thenSucceed();
}).structureName('core:empty').tag('core').maxTicks(220);
```

Use `core` — the singleton — in a real addon. One identity per pack.

## `RUNTIME_VERSION`

```ts
import { RUNTIME_VERSION } from '@bedrock-core/server';
```

The version of `@bedrock-core/server-runtime` this build was compiled against. It is stamped into the discovery `meta` blob automatically and surfaces on every registry entry as `runtimeVersion`. It is generated at release time; addons never set it.

## `isUsable`

```ts
import { isUsable, type EngineHandle } from '@bedrock-core/server';

function isUsable<T extends EngineHandle>(handle: T | null | undefined): handle is T

interface EngineHandle { readonly isValid?: boolean }
```

Whether an engine handle can still be touched — `Entity`, `Player`, `Block`, `Camera`, `Component`, `Container`, `ContainerSlot`, `Effect` and the rest of what exposes a readonly `isValid`. It goes false once the thing the handle points at is gone — despawned, disconnected, moved into an unloaded chunk — and every other member throws from then on. `isUsable` is `false` for `null`/`undefined` and for such a handle, `true` for everything else, including a plain object that carries no `isValid` at all.

Reach for it on a handle that outlives the moment it was obtained: one kept in a map, or one an `afterEvents` subscriber receives, which by definition runs after the fact. A throw from inside a subscriber is never caught by the caller — the engine catches it and logs it against the *pack's* name — so a library depending on this runtime that let one through would have the error attributed to itself.

```ts
const tracked = new Map<string, Player>();

world.afterEvents.playerSpawn.subscribe(({ player }) => { tracked.set(player.id, player); });

function messageIfPresent(playerId: string, text: string): void {
  const player = tracked.get(playerId);

  if (isUsable(player)) { player.sendMessage(text); }
}
```

`Entity.id` is the documented exception: it stays readable once `isValid` is false, so id-keyed bookkeeping still works for a handle that has gone stale — it is any other member that throws.

## In this section

| Page | Description |
|---|---|
| [`core.registry`](./registry.md) | Enumerate peers, resolve dependencies, detect namespace collisions |
| [`core.features`](./features.md) | Behavior that toggles on a condition over the registry and the mirror |
| [`core.shared`](./shared.md) | The replicated mirror as typed trees, one value per key, owner-only writes |
| [`core.events`](./events.md) | Broadcasts delivered and forgotten |
| [`core.db`](./db.md) | Persisted documents keyed by target |
| [`core.translations`](./translations.md) | Announce and resolve i18n bundles across addons |
| [`core.host`](./host.md) | Reserved for capabilities |
| [`Announcement`](./announcement.md) | The shape every cross-addon feed shares |
| [`authorize`](./authorize.md) | The one rule a handler applies on behalf of a player |
