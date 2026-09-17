---
sidebar_position: 5
description: "Compiles MDX guides into a guide manifest, one screen per page and auto-localized .lang entries."
---
# guides

The build half of in-game guides. MDX pages under `packs/data/guides/<locale>/` are compiled into what [`@bedrock-core/guides`](/docs/guides) shows: a manifest in Regolith's temp workspace that scripts import as `@bedrock-core/generated/guides`, one screen module per page for the [`ui-compiler`](./ui-compiler.md) filter to bake, and `.lang` entries for every title, heading and paragraph without links, so the client resolves guide prose in each player's language.

## Install

```bash
regolith install github.com/bedrock-core/regolith-filters/guides
```

Add it to `config.json` **before** `i18n`, which carries the guide's `.lang` entries into its bundle's passthrough — how guide keys reach the runtime's text measurement — and before `ui-compiler`, which bakes the pages. `bundler` then inlines the generated modules:

```jsonc title="config.json"
{
  "regolith": {
    "profiles": {
      "default": {
        "filters": [
          { "filter": "guides" },
          { "filter": "i18n" },
          { "filter": "ui-compiler" },
          { "filter": "bundler" }
        ]
      }
    }
  }
}
```

The bundler resolves `@bedrock-core/generated/guides` through a `tsconfig.json` alias against the temp workspace — see [bundler](./bundler.md#authoring). The `.json` never exists on real disk, so keep `packs/data/**/*` in `include`: the `guides.generated.d.ts` that `regolith install` seeds, and that you commit, types the module.

No settings are required when the namespace scan succeeds.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `namespace` | `string` | derived | Addon namespace in generated keys: `<namespace>.guides.*`. Read from the `core.register()` call in `BP/scripts`; set it only to override the scan |
| `sourceDir` | `string` | `"data/guides"` | Content root; direct child *directories* are locale folders |
| `defaultLocale` | `string` | `"en_US"` | Locale defining structure, keys, sidebar and fallback values. Must exist |
| `include` | `string[]` | `["**/*.md", "**/*.mdx"]` | Page selection globs, relative to each locale folder |
| `exclude` | `string[]` | `[]` | Globs excluding pages matched by `include` |
| `manifestPath` | `string` | `"data/guides/guides.generated.json"` | Manifest output path in the temp workspace |
| `maxCodeLineBytes` | `number` | `60` | Hard-wrap budget (UTF-8 bytes) for code-block lines — code is raw un-localized text, which the runtime caps at 80 bytes |
| `strictLocales` | `boolean` | `false` | Fail the build instead of warning on cross-locale key drift |
| `compileScreens` | `boolean` | `true` | Write one generated `*.screen.tsx` per page, plus the guide's entry and index, under `screensDir`, for the ui-compiler filter to bake into the pack. A guide with operator-only pages gets a second set for operators, `guideop_*`, and the `guide_*` set leaves those pages out. `false` writes the manifest and the `.lang` entries alone |
| `screensDir` | `string` | `"BP/scripts/guides"` | Where the generated screen modules go, relative to the Regolith temp workspace. Must sit under the folder the ui-compiler filter scans |
| `screenTitle` | `string` | `"Guide"` | Header title baked into every compiled guide screen |
| `componentsModule` | `string` | `""` | Module whose default export is the registry of components an MDX `cmp` block may use, relative to the Regolith temp workspace. Empty, a `cmp` block renders the unsupported-content placeholder on compiled screens |
| `pretty` | `false \| { indent?, size? }` | `false` | How generated JSON is laid out. Absent or `false` writes it minified. An object lays it out: `indent` is `"tab"` or `"space"`, `size` the characters per level (2 for spaces, 1 for tabs when omitted) |

The derived namespace is the `<creator>_<pack>` join of `core.register({ manifest: { creator, pack } })` — the same one [the i18n filter derives](/docs/i18n/authoring#namespacing) and the server runtime builds at startup, so every key your pack emits sits under one prefix.

A missing `sourceDir`, no locale directories, or no pages in the default locale is an info-level no-op, not a failure. A missing `defaultLocale` directory, a broken internal link, or any other compile error exits non-zero.

See [guides](/docs/guides) for [authoring pages](/docs/guides/authoring), [localizing them](/docs/guides/localization) and the runtime API.
