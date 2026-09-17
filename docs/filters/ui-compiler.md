---
sidebar_position: 7
description: "Compiles *.screen.tsx into static JSON UI, and registers every screen with the runtime that serves it."
---
# ui-compiler

Every `*.screen.tsx` under `BP/scripts` goes in; static JSON UI in the resource pack comes out, together with the module that tells the runtime which screens the pack holds.

## Install

```bash
regolith install ui-compiler
```

It runs after every filter that writes something a screen reads, and before the bundler that strips the sources:

```jsonc title="config.json"
{
  "regolith": {
    "profiles": {
      "default": {
        "filters": [
          { "filter": "guides" },
          { "filter": "i18n" },
          { "filter": "ui-compiler", "settings": { "namespace": "drav0011_shop" } },
          { "filter": "bundler" }
        ]
      }
    }
  }
}
```

`guides` first, because a guide's pages are screens this filter compiles. `i18n` second, so a localized `<Text>` is measured as the string the client will draw rather than as its key. `bundler` last, because it inlines the module this filter generates. [`core`](./core.md) runs the whole chain in that order as a single filter.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `namespace` | `string` | declared | The addon's namespace, lowercase `a-z`, `0-9` and `_`; it prefixes every screen's JSON UI namespace and names the router file and the output folder. Left unset, it is the `creator` and `pack` of the manifest the addon declared |
| `stamp` | `boolean` | `false` | Draw a build stamp at the HUD's top left — a short hash over everything under `RP/ui` plus the build clock — so what a running client is rendering is never in question |
| `screens` | `string[]` | `[]` | Modules whose default export is a record of screens to compile besides the addon's own, each export key naming one |
| `pretty` | `false \| { indent?, size? }` | `false` | How generated JSON is laid out. Absent or `false` writes it minified. An object lays it out: `indent` is `"tab"` or `"space"`, `size` the characters per level (2 for spaces, 1 for tabs when omitted). Laid out, each file is headed with the comment saying it is generated; minified, it is headerless too |

Every path is what the game needs, so none of them is a setting: screens under `BP/scripts`, entities under `BP/entities`, blocks under `BP/blocks`, output under `RP/ui/core-ui/screens`, texts under `RP/texts`, and the hooks at vanilla's own paths.

No screen to compile and no `screens` setting is an info-level no-op. Everything else stops the build with the compiler's own message; [Build checks](/docs/ui/compiler/checks) lists them.

See [Compiler](/docs/ui/compiler) for writing screens, what the build writes into the pack, and how the compiler works.
