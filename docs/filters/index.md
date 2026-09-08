---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "The Regolith filters that build a bedrock-core addon."
---
# filters

Regolith filters that build a bedrock-core addon: they resolve the manifest, compile guides, localization and screens, and bundle the scripts.

:::caution Pre-1.0
The filters are under active development. Breaking changes can still land until `1.0.0` — pin exact versions and read the release notes before upgrading.
:::

## Install

Register the repository as a Regolith resolver once per machine, then install filters by name:

```bash
regolith config resolvers --append github.com/bedrock-core/regolith-filters/resolver.json
regolith install i18n
```

The filters run on **Node.js 22.18 or newer**. They are TypeScript files Regolith runs directly; nothing is compiled or published to npm.

## The stack

Filters run in dependency order. [`core`](./core.md) runs the whole chain as one filter with the namespace declared once; the rest can be listed one by one in `config.json`.

| Order | Filter | What it does |
| --- | --- | --- |
| 1 | [`manifest`](./manifest.md) | Picks the profile's manifest variant and resolves its `extends` chain into `manifest.json` |
| 2 | [`generator`](./generator.md) | Writes Minecraft JSON from TypeScript templates typed against Mojang's schemas (opt-in) |
| 3 | [`guides`](./guides.md) | Compiles MDX guides into a manifest and auto-localized `.lang` entries |
| 4 | [`i18n`](./i18n.md) | Turns TypeScript resources into `.lang` files, a typed runtime bundle and vanilla-key types |
| 5 | [`ui-compile`](./ui-compile.md) | Compiles `*.screen.tsx` into static JSON UI and routes the chest screen to it |
| 6 | [`bundler`](./bundler.md) | Bundles `BP/scripts/` into one `main.js` with esbuild |

`guides`, `i18n` and `ui-compile` share one `namespace` setting: the addon's `creator_pack` string, the same one passed to `core.register()`. Each of them reads it from the register call in `BP/scripts` and needs no settings when that scan succeeds; set `namespace` only to override it.

For GitHub Actions, [Running in CI](./ci.md) sets up the Regolith CLI and the resolver.
