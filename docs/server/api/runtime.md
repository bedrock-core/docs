---
sidebar_position: 1
description: "@bedrock-core/server-runtime is the framework layer addons build on."
---

# core

`@bedrock-core/server-runtime` is the framework layer addons build on. Where [`@bedrock-core/sync`](/docs/sync) is the low-level transport, the runtime is the thing you **register into**: an addon declares its identity and its data once, and that declaration flows into a cross-addon registry — a live directory of every bedrock-core addon present in the world.

## Install

<Install pkg="@bedrock-core/server-runtime" />

Most addons install [`@bedrock-core/server`](https://www.npmjs.com/package/@bedrock-core/server) instead, which re-exports everything below and pins a matching `@bedrock-core/sync`. Both imports are interchangeable:

```ts
import { core } from '@bedrock-core/server';          // meta-package (recommended)
import { core } from '@bedrock-core/server-runtime';  // direct
```

## `core` — the runtime singleton

`core` is a `Runtime` instance. Import it, register once, and use it for the rest of the addon's life.

```ts
import { core } from '@bedrock-core/server-runtime';

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
| `core.host` | [`HostElection`](./host.md) | Which realm does the work only one realm may do. |
| `core.shared` | [`SharedRegistry`](./shared.md) | The replicated mirror as typed trees: `of(ns)` for a peer's, `own` for this addon's. |
| `core.config` | [`ConfigRegistry`](./config.md) | Schema, scopes and cross-addon config access. |
| `core.translations` | [`TranslationsRegistry`](./translations.md) | Cross-addon i18n bundles. |
| `core.guides` | [`GuidesRegistry`](./guides.md) | Cross-addon compiled guides. |
| `core.rpc` | `Rpc` | [RPC](/docs/sync/rpc), passed through from the sync node. |
| `core.node` | `SyncNode` | The raw [sync node](/docs/sync) — bus, discovery, unscoped state. |

## `register()`

```ts
register(options: RegisterOptions): { config, shared }   // one key per declaration; void when neither is declared
```

Declare the addon and bring it online. **Call exactly once — there is no separate `start()`.** It throws on an invalid manifest and on a second call.

`RegisterOptions` is `{ manifest: AddonManifest; translations?; guide?; guideReference?; page?; config?; shared? }` — a `manifest` (the [manifest fields](#manifest-fields)) plus the optional declarations beside it. Each declaration is exactly equivalent to the standalone call listed beside it, which stays available for publishing late or replacing data at runtime:

| Field | Type | Equivalent to |
|---|---|---|
| `translations` | `I18nBundle` | [`core.translations.provide()`](./translations.md#provide) |
| `guide` | `GuideManifest` | [`core.guides.provideManifest()`](./guides.md#providemanifest) |
| `config` | `ConfigDefinition` | [`core.config.define()`](./config.md#define) |

`register()` returns the typed accessors of what was declared, one key each: `config` (the scope accessors, the same value [`core.config.define()`](./config.md#define) returns) and [`shared`](./shared.md) (the tree). Each key is present only when its declaration was given; with neither, the return type is `void`.

```ts
import { core } from '@bedrock-core/server-runtime';
import bundle from '@bedrock-core/generated/i18n';
import guides from '@bedrock-core/generated/guides';
import { configDef } from './example';

const { config } = core.register({
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
  translations: bundle,
  guide: guides,
  config: configDef,
});

config.server.get();  // fully typed
```

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
| `icon` | — | Resource-pack texture path for a registry UI icon, e.g. `textures/ui/my_addon_logo`. |
| `thumbnail` | — | Resource-pack texture path for a 16:9 banner. |

### Display fields are translation keys

`packName`, `creatorName` and `description` are assumed to be Minecraft translation keys shipped in the addon's resource pack `.lang`, so a registry UI can render them in each player's language. Plain text still works — Bedrock falls back to the literal string when no `.lang` entry matches.

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
  translations: bundle,
});
```

### Validation

`validateManifest(input)` is exported, and `register()` runs it for you. It throws a descriptive error rather than letting a misconfigured addon misbehave silently:

| Input | Error |
|---|---|
| Not an object | `addon manifest must be an object` |
| Missing/empty `creator`, `pack`, `packName` or `version` | `addon manifest '<field>' is required and must be a non-empty string` |
| `creator` or `pack` with an illegal character | `invalid <field> '<value>': must be lowercase alphanumeric and underscores only (a-z0-9_)` |
| `dependencies` that is not a `string[]` | `addon manifest '<field>' must be an array of strings` |

`addonNamespace(manifest)` is exported too, and simply returns `` `${manifest.creator}_${manifest.pack}` ``.

## `stop()`

```ts
core.stop();
```

Take the addon offline and clear every accessor. Safe to call before registering (no-op). Mostly useful in GameTests — a shipped addon registers and stays up.

## Several runtimes in one realm

The `Runtime` class stands alone, so a GameTest can create **several runtimes in one script realm**. They talk over the real `system` script-event bus, and each `register()` brings its runtime online independently.

```ts
import { register, type Test } from '@minecraft/server-gametest';
import { Runtime } from '@bedrock-core/server-runtime';

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

## Version helpers

```ts
import { RUNTIME_VERSION, compareVersions } from '@bedrock-core/server-runtime';
```

- **`RUNTIME_VERSION`** — the version of `@bedrock-core/server-runtime` this build was compiled against. It is stamped into the discovery `meta` blob automatically, surfaces on every registry entry as `runtimeVersion`, and is what the [host election](./host.md) compares. It is generated at release time; addons never set it.
- **`compareVersions(a, b)`** — minimal semver comparison returning `-1` / `0` / `1`, suitable for `Array.prototype.sort`. Handles `major.minor.patch` with an optional `-prerelease` tail; anything unparseable sorts as `0.0.0` rather than throwing.

## In this section

| Page | Description |
|---|---|
| [Registry](./registry.md) | Enumerate peers, resolve dependencies, detect namespace collisions |
| [FeatureManager](./features.md) | Behavior that toggles on a condition over registry and state |
| [HostElection](./host.md) | `core.host` — deterministic "who does the shared work" |
| [Shared](./shared.md) | The replicated mirror as typed trees, one value per key, owner-only writes |
| [ConfigRegistry](./config.md) | Schema, three scopes, persistence, cross-addon access, authorization |
| [TranslationsRegistry](./translations.md) | Publish and resolve i18n bundles across addons |
| [GuidesRegistry](./guides.md) | Publish and read compiled guide manifests across addons |
