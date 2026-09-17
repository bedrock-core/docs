---
sidebar_position: 3
description: "Folding a dependency's typed strings into your bundle, and overriding a library's or a vanilla string."
---

# Libraries and overrides

A library ships its strings inside its own package and declares them in `package.json`, together with an export that makes them reachable for the generated types:

```jsonc
"bedrockCore": { "i18n": { "dir": "./src/i18n", "namespace": "core" } },
"exports": { "./i18n/*": { "types": "./src/i18n/*.ts", "import": "./src/i18n/*.ts" } }
```

## Libraries

The [i18n filter](/docs/filters/i18n) walks the dependency graph for that field and folds each library's resources in under the declared namespace: its keys are emitted into your `.lang` files, its tree appears under `$.core.*`, and its strings ride in your runtime bundle.

Discovery rules:

- **The walk is transitive and sees through non-declaring packages** — a declarer may sit behind an umbrella that declares nothing itself, like `@bedrock-core/config` behind `@bedrock-core/ui`.
- **Resolution follows Node's rules**: nearest `node_modules` first, then ancestors.
- **`devDependencies` count only at the addon root** — transitive devDependencies are not installed.
- **Several packages may share one namespace** (the whole bedrock-core family publishes under `core`). Their trees are merged; a key two packages define with *different* values is a build error naming both.
- A library declaring `bedrockCore.i18n` whose directory has no `<xx_YY>.ts` files is a warning, not an error. A library namespace of `vanilla` is rejected.

## Overriding a library string

Library branches are **override-only** from `data/i18n`. You may author `core.addons.title` to deliberately rename a library string ("Addons" → "Mods") and your value wins — but only for paths the library actually defines:

```ts
// packs/data/i18n/en_US.ts
export default {
  core: { addons: { title: 'Mods' } },   // override — 'core.addons.title' must exist
  shop: { title: 'Shop' },
} as const;
```

An unknown path under a library branch is a build error. Overrides are exempt from the parity check — override in one locale without the others and the library's own translation fills the gap — but an override must keep the library's interpolation variable set.

## Vanilla strings

Opt in with the filter's `vanilla` setting. Off by default, because it fetches and diffs the vanilla `.lang` files against Mojang's `bedrock-samples` on every build. Once on, `$.vanilla.*` autocompletes — the full vanilla tree (~10k keys) is generated into `vanilla.generated.d.ts`. Those strings are never emitted into the resource pack: the client already ships them, so re-adding them would only bloat the pack.

Server-side values (what `t()` returns and what the layout engine measures) are included in the runtime bundle **only for the keys your compiled scripts actually reference**. The filter scans the compiled output — and every discovered library's `src` — for string literals and for `$.vanilla.` selector chains:

```ts
t($ => $.vanilla.item.apple.name);        // found -> bundled
t('vanilla.item.apple.name');             // found -> bundled
t(`item.${id}.name`);                     // NOT found — assembled at runtime
```

A key that is not found still resolves on the client through `key()` / `raw()`; what degrades is `t()` (falls back to the raw key) and layout measurement for that one string.

Vanilla `.lang` content is fetched per locale from Mojang's `bedrock-samples` and cached under `.regolith/cache/i18n/` for `cacheMaxAgeHours`. A locale whose fetch fails warns and falls back to the default locale's strings.

## Overriding a vanilla string

A `vanilla` branch in the addon's own resources overrides a vanilla string, the same way an addon overrides a library's keys:

```ts
// packs/data/i18n/en_US.ts
export default {
  shop: { title: 'Shop' },
  vanilla: { item: { apple: { name: 'Golden Snack' } } },
} as const;
```

The overridden key is written to the resource pack's `.lang` under its **vanilla** name, not the namespaced form — `item.apple.name=Golden Snack` — because Bedrock merges every installed pack's `.lang`, and that is the key the client already looks up for that string. The runtime bundle carries the replacement wherever it carries that vanilla string, which is only when `vanilla` is on and the key is one your compiled scripts reference.

With the filter's `vanilla` setting on, a key no vanilla string has is reported.
