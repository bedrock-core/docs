---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "The Regolith filters that build a bedrock-core addon."
---
# filters

Regolith filters that build a bedrock-core addon: they resolve the manifest, compile guides, localization and screens, and bundle the scripts.

:::caution Beta
`@bedrock-core/regolith-filters` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## Install

Register the repository as a Regolith resolver once per machine, then install filters by name:

```bash
regolith config resolvers --append github.com/bedrock-core/regolith-filters/resolver.json
regolith install core manifest generator guides i18n ui-compiler bundler
```

For a `core` profile, declare those same seven names in `config.json` under
`regolith.filterDefinitions`. `regolith install-all` reads that object; it does not
install the filters that `core` invokes transitively.

The filters run on **Node.js 22.18 or newer**. They are TypeScript files Regolith runs directly; nothing is compiled or published to npm.

## The stack

Filters run in dependency order. [`core`](./core.md) runs the whole chain as one filter with the namespace declared once; the rest can be listed one by one in `config.json`.

| Order | Filter | What it does |
| --- | --- | --- |
| 1 | [`manifest`](./manifest.md) | Picks the profile's manifest variant and resolves its `extends` chain into `manifest.json` |
| 2 | [`generator`](./generator.md) | Writes Minecraft JSON from TypeScript templates typed against Mojang's schemas (opt-in) |
| 3 | [`guides`](./guides.md) | Compiles MDX guides into a manifest and auto-localized `.lang` entries |
| 4 | [`i18n`](./i18n.md) | Turns TypeScript resources into `.lang` files, a typed runtime bundle and vanilla-key types |
| 5 | [`ui-compiler`](./ui-compiler.md) | Compiles `*.screen.tsx` into static JSON UI and registers each screen with the host that serves it |
| 6 | [`bundler`](./bundler.md) | Bundles `BP/scripts/` into one `main.js` with esbuild |

`guides`, `i18n` and `ui-compiler` share one `namespace` setting: the addon's `creator_pack` string, the same one passed to `core.register()`. Each of them reads it from the register call in `BP/scripts` and needs no settings when that scan succeeds; set `namespace` only to override it.

The compiler `ui-compiler` runs is a library of its own; its passes, layers and entry points are in [Compiler](/docs/ui/compiler).

For GitHub Actions, [Running in CI](./ci.md) sets up the Regolith CLI and the resolver.
