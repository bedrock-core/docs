---
sidebar_position: 7
description: "Select automatic stages and independently usable builder stage packages."
---
# Stages

Built-in stages run in a fixed order after preparation and before final validation and export.

| Stage | Automatic inputs | API or configuration |
| --- | --- | --- |
| `manifest` | Configured pack manifests | [`resolveManifest`](../api/resolveManifest.md) |
| `generator` | TS templates in packs | [`generateTemplates`](../api/generateTemplates.md) |
| `guides` | Markdown/MDX in `guides` | [`compileGuides`](../api/compileGuides.md) |
| `i18n` | Locale modules in `i18n` or pack language files | [`compileI18n`](../api/compileI18n.md) |
| `ui-compiler` | Screen sources, app declarations or generated UI declarations/imports | [Builder UI stage](#ui-compilation) |
| `bundler` | Script modules declared by manifests | [`bundleScripts`](../api/bundleScripts.md) |

Omit `stages` for automatic discovery. An options object forces participation; `false` disables a stage. Before hooks run before discovery. Stages consume the current staged files, including earlier generated artifacts.

Each stage loads a package-owned `./plugin` entry point implementing the shared [BuildPlugin](../api/BuildPlugin.md) contract:

| Stage | Package |
| --- | --- |
| `manifest` | `@bedrock-core/builder-manifest` |
| `generator` | `@bedrock-core/builder-generator` |
| `guides` | `@bedrock-core/builder-guides` |
| `i18n` | `@bedrock-core/builder-i18n` |
| `ui-compiler` | `@bedrock-core/builder-ui` |
| `bundler` | `@bedrock-core/builder-bundler` |

Use [pack ownership](./configuration.md#pack-ownership) to route runtime and client outputs without relying on pack names.

## Manifest

Keep manifest documents in pack directories. Omitted `manifestPath` selects every pack's `manifest.json`; a string or array selects one source per named pack directory. Paths are relative to `config.json`. Unselected packs still use their canonical manifests.

```json
{
  "manifestPath": [
    "./packs/BP/manifest.test.json",
    "./packs/RP/manifest.test.json"
  ]
}
```

A variant can declare `"extends": "./manifest.json"`. Each reference resolves relative to its declaring file. Objects merge recursively; child arrays and scalars replace inherited values. Restate complete `modules` and `dependencies` arrays when changing them. Cycles, missing sources and paths outside the project fail.

All manifests resolve before any are written. Resolved documents become staged `manifest.json`; every configured pack loses staged `manifest.*.json` variants, including unselected packs. Authored files remain intact. Sources and ancestors are registered as watch dependencies. Manifest output uses the effective `pretty` setting.

Final checks require manifest v3, string versions, unique pack/module UUIDs, valid script language and existing declared script outputs. Builder does not generate missing authored manifests.

## Generator

Default discovery selects `.ts` templates in packs outside script directories and declaration files. A default-exported object writes a same-basename JSON document. A `[name, data, items]` tuple writes one named JSON document per item; [`defineMany`](../api/defineMany.md) and [`defineTemplate`](../api/defineTemplate.md) are optional helpers.

The adapter removes consumed templates from staging and registers JSON artifacts. Source files remain intact. Names must be portable basenames; repeated output names retain the last emitted document. Use `include` and `exclude` to narrow discovery, and keep shared helpers outside pack template discovery.

Editor declarations are generated under `.bedrock-core/generated/mc` by default when the stage participates. Include that directory in tsconfig. `types: false` disables declarations; `schemaVersion`, `typesDir`, `typePrefix`, `strict` and `maxAgeHours` control them. Declaration generation and final content validation are separate checks.

## Guides

The guides stage compiles each pack's localized Markdown/MDX into a runtime manifest, language entries, editor declarations and optional screen modules. It supports page/category navigation, translated links, images and operator-only access. `sourceDir` defaults to the owner pack's `guides` directory; the default locale is `en_US`.

Each owner registers `@bedrock-core/generated/guides/<packId>` and writes editor types under `.bedrock-core/generated/guides/<packId>`. Language output goes to its linked resource pack; screen modules default to the owner's `scripts/guides` directory. `owner` and `resourcePack` select explicit pack IDs when needed.

`compileScreens: false` emits content without screen modules. Screen generation requires a behavior pack, and the downstream UI stage needs the project's guide/UI runtime packages. Use `sourceDir`, `include`, `exclude`, `strictLocales` and `maxCodeLineBytes` to control authoring checks. [Guide authoring](/docs/guides) describes runtime content.

## Translations

The i18n stage compiles each owner's default-exported `i18n/<locale>.ts` objects, library resources, nesting, plural forms and interpolation. Existing pack language files also activate compilation, including guide-only content. It emits `@bedrock-core/generated/i18n/<packId>`, language entries and editor declarations under `.bedrock-core/generated/i18n/<packId>`. Include `.bedrock-core/generated/i18n/**/*.d.ts` in tsconfig for typed keys.

`sourceDir` stays inside its owner pack. `owner` restricts discovery and `resourcePack` selects a direct local resource dependency; `client: false` produces runtime data without client language output. Separate owners retain separate runtime bundles and generated language sections.

`sourceDir`, `defaultLocale`, `strict`, `types`, `vanilla`, `pretty` and `tsconfig` customize compilation. Generated bundle imports are registered for later consumers. [i18n](/docs/i18n) describes the runtime API.

## UI compilation

Build `@bedrock-core` UI through this stage. It uses the project's installed UI compiler and toolkit to compile screen sources and declared app screens, link the complete screen set and write resource UI, language, host and runtime registration outputs. It supports arbitrary configured behavior/resource pack IDs.

`owner` and `resourcePack` route output. `screens`, `namespace`, `tsconfig`, `pretty`, `testMetadata` and `stamp` control selection and output. Screen JSX evaluation executes trusted authored code. [Compiler](/docs/ui/compiler) documents screen authoring, emitted output and compile checks.

The UI plugin registers its JSX transformation and project import preferences through [BundleExtension](../api/BundleExtension.md). Runtime registration includes compiled screen keys and host kinds. Editor declarations are written under `.bedrock-core/generated/ui/`.

## Script bundling

Each manifest script module supplies its entry. `scripts/main.js` can resolve to the matching `.ts`, `.tsx`, `.mts` or `.cts` source, or the JavaScript file itself. Multiple TypeScript candidates or a generated `.js` beside its TypeScript source are conflicts.

`debug`, `target`, `tsconfig`, `external` and `generatedImports` apply to all bundles. Normal JSON imports need no generated artifact. Earlier producers' registered import names resolve automatically. Consumed TypeScript sources are removed from staged script packs after all bundles succeed.

## Validation and standalone use

Final JSON receives syntax checks; matching documents receive Mojang schema checks. Unknown documents and unavailable upstream schemas receive syntax checks, with coverage reported in `BuildResult.validation`. These checks do not establish assets, Molang, UI layout/bindings or in-game behavior. Use [BDS runner](/docs/bds-runner) for GameTests and the target client for UI acceptance.

Bundling, templates, translations, guides and validation have standalone APIs that accept explicit inputs and return their outputs/dependencies. They do not run the builder pipeline or export packs. Install the package needed for that operation. UI compilation runs through the builder stage with the project's runtime toolkit.

## Next steps

- [API](../api/index.md) — standalone packages, input types and results
- [Plugins](./plugins.md) — produce artifacts before a stage consumes them
- [Configuration](./configuration.md) — stage selection and export destinations
