---
sidebar_position: 4
---

# UI integration

The server side stores, validates and replicates data. It draws nothing. Presentation lives in the `@bedrock-core` **ui** packages — start at the [ui overview](/docs/ui/get-started/overview) for their full reference.

This page is the seam between the two: what `server-runtime` publishes, which UI package consumes it, and what you have to do in your addon to light it up.

## The split

```
  ┌──────────────────────────── your addon ────────────────────────────┐
  │  core.register({ config, translations, guide })                    │
  └───────────────┬────────────────────────────────────────────────────┘
                  │  declares once
                  ▼
  ┌──────────── @bedrock-core/server-runtime ──────────────────────────┐
  │  ConfigRegistry        →  core-config/schema   (replicated)        │
  │  TranslationsRegistry  →  core-i18n/bundle     (replicated)        │
  │  GuidesRegistry        →  core-guide/manifest  (replicated)        │
  │  HostElection          →  who renders                              │
  └───────────────┬────────────────────────────────────────────────────┘
                  │  read by any realm, for any addon
                  ▼
  ┌──────────── @bedrock-core ui packages ─────────────────────────────┐
  │  @bedrock-core/config  — the addon list, config screens, commands  │
  │  @bedrock-core/guides  — the guide renderer                        │
  │  @bedrock-core/i18n    — resolution, interpolation, measurement    │
  │  @bedrock-core/ui      — the JSX runtime everything renders with   │
  └────────────────────────────────────────────────────────────────────┘
```

**The UI reads the registries, not your addon.** It never imports your code and never knows your schema type — everything it draws it discovered at runtime from replicated state.

---

## Mounting the shared UI

One call, after `core.register()`:

```ts
import { core } from '@bedrock-core/server';
import { ui } from '@bedrock-core/config';
import bundle from '@bedrock-core/generated/i18n';
import guides from '@bedrock-core/generated/guides';
import { configDef } from './example';

core.register({
  creator: 'drav0011',
  pack: 'economy',
  packName: 'Economy',
  version: '1.0.0',
  translations: bundle,
  guide: guides,
  config: configDef,
});

ui(core);
```

`ui` comes from [`@bedrock-core/config`](/docs/ui/config) — the shared addon list, settings screens and guide viewer. `ui(core)` registers this addon's commands and serves the open RPC, so this realm can render on behalf of another whenever it wins the [host election](./server-runtime/host.md).

Pass the `Runtime` itself, not the typed config accessors — everything `ui` needs it reaches generically, through [`core.config.local`](./server-runtime/config.md#coreconfiglocal), `core.config.of()`, `core.registry`, `core.guides`, `core.translations` and `core.host`.

---

## The three feeds

### Config

[`ConfigRegistry`](./server-runtime/config.md) publishes a **flattened, scope-prefixed schema** to replicated state:

```
<namespace> → core-config/schema → {
  'server.pricing.taxRate': { type: 'number', default: 0.05, min: 0, max: 1, step: 0.01, label: 'Tax Rate' },
  'player.allowGifts':      { type: 'boolean', default: true, label: 'Allow Gifts' },
}
```

**Registering alone puts your addon in the UI's addon list** — `config`, like `guide`, is optional; without it the addon's row simply has no Config entry. Declaring it publishes the schema map above, which is everything a form needs — the UI builds the whole form without a round trip. Values are fetched separately, on demand, over the `core:config.*` RPCs.

The schema describes **data only**; the UI picks the control:

| Schema says | UI picks |
|---|---|
| `type: 'boolean'` | a toggle or checkbox |
| `type: 'number'` with `min`/`max`/`step` | a slider or a numeric input |
| `type: 'string'` with `maxLength` | a text input |
| `type: 'enum'` with `options` | a dropdown or a toggle-button row |
| `type: 'list'` with `itemType`/`maxItems` | *no control* — a modal form has nothing to draw for it. The screen shows the label, the current items against `maxItems`, and the command that changes it; editing goes through [`get`/`set`/`add`/`remove`](/docs/ui/config#list-settings-from-a-command) |

Authorization crosses the seam too. When the UI acts for a player it builds its accessor with `core.config.of(addonId, { actorId: player.id })`, and the owning addon applies [the operator rule](./server-runtime/config.md#authorization) on its side. The caller-side permission checks in the UI are a convenience — they keep unreachable settings out of a player's command list and screens — but the decision that counts is made by the addon that owns the data.

### i18n

[`TranslationsRegistry`](./server-runtime/translations.md) replicates each addon's `I18nBundle` — the artifact the `i18n` Regolith filter generates as `@bedrock-core/generated/i18n`.

`packName`, `creatorName` and `description` are translation keys in *someone else's* resource pack. `core.translations.forPlayer(player)` resolves them against every published bundle, picking the player's locale through the [override → client locale → sibling region → default chain](/docs/ui/i18n#locale-resolution).

Declare `translations`, or the realm rendering your addon can neither resolve your labels nor **measure** them — and layout needs a string's width before it is sent to the client.

```ts
const resolve = core.translations.forPlayer(player);

for (const addon of core.registry.all()) {
  const label = resolve(addon.packName) ?? addon.packName;   // key → text, or the literal
}
```

### Guides

[`GuidesRegistry`](./server-runtime/guides.md) replicates each addon's compiled `GuideManifest` — the `guides` Regolith filter's output, `@bedrock-core/generated/guides`.

The runtime treats it as opaque: two fields, `tree` and `pages`, and no interpretation. [`@bedrock-core/guides`](/docs/ui/guides) owns the real intermediate representation and narrows the payload with `isGuideManifest` at the point of rendering.

Because manifests are replicated rather than fetched, the elected host already has every guide in memory:

```ts
for (const id of core.guides.addonsWithGuides()) {
  const manifest = core.guides.of(id);   // synchronous, no RPC
}
```

---

## Which realm renders

The realm whose command was typed forwards the raw request to the realm running the newest `@bedrock-core/server-runtime`, and every decision happens there. See [HostElection](./server-runtime/host.md).

---

## What you have to do

| Step | Why |
|---|---|
| Declare `config` in `register()` (optional) | Publishes the schema — this is what gives your row a Config screen |
| Declare `translations` in `register()` | Makes your display keys resolvable and measurable by whoever renders |
| Declare `guide` in `register()` | Publishes your guide for the host to render |
| Set `icon` / `thumbnail` in the manifest | Resource-pack texture paths the addon list draws |
| Call `ui(core)` once, after `register()` | Registers your commands and serves the open RPC |
| Ship the generated artifacts | The `i18n` and `guides` Regolith filters produce `@bedrock-core/generated/*` |

Everything else is the ui side's job: [screens and components](/docs/ui/ui-runtime), [navigation](/docs/ui/navigation), [theming](/docs/ui/ore-styled), and [per-player locale](/docs/ui/i18n).

---

## The generated imports

Two of the three feeds come from build-time filters rather than hand-written code:

```ts
import bundle from '@bedrock-core/generated/i18n';    // the i18n filter's output
import guides from '@bedrock-core/generated/guides';  // the guides filter's output
```

Those specifiers are aliases mapped in `tsconfig.json` to the filter's generated JSON, and inlined by the [`bundler` Regolith filter](https://github.com/bedrock-core/regolith-filters) at build time:

```jsonc title="tsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "@bedrock-core/generated/i18n": ["./packs/data/i18n/i18n.generated.json"],
      "@bedrock-core/generated/guides": ["./packs/data/guides/guides.generated.json"]
    }
  }
}
```

Both filters take a `namespace` setting, which must be **your addon's namespace** — the same `creator_pack` string you pass to `register()`:

```jsonc title="config.json (Regolith)"
{
  "filter": "i18n",
  "settings": { "namespace": "drav0011_economy" }
}
```

An addon with no guide simply omits the `guide` field and the filter; the registries handle absence everywhere (`core.guides.of()` returns `undefined`, `core.config.of()` returns `undefined`, resolvers fall through).
