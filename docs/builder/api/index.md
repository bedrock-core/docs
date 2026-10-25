---
slug: /api
sidebar_position: 1
sidebar_label: Overview
description: "Public builder entry points, plugin context and independently usable stage APIs."
---
# API

Most projects use the CLI and need no Builder API imports. This reference is for plugin authors and tools that run builds programmatically.

For content authoring, start with [Generate JSON](../guides/generating-json.md). For extension configuration, start with [Plugins](../guides/plugins.md).

## Start here

| Task | Entry point |
| --- | --- |
| Write a plugin | [`BuildPlugin`](./BuildPlugin.md) and [`BuildContext`](./BuildContext.md) from `@bedrock-core/builder-plugin` |
| Run a build from Node | [`runBuild`](./runBuild.md) from `@bedrock-core/builder/runner` |
| Watch from Node | [`watchBuild`](./watchBuild.md) from `@bedrock-core/builder/watch` |

The remaining reference covers specialized build integrations and standalone compiler packages.

<details>
<summary>Specialized API reference</summary>

## Build and configuration

| Export | Kind | Description |
| --- | --- | --- |
| [`planBuild`](./planBuild.md) | Function | Resolve a profile without loading plugins |
| [`validateConfig`](./validateConfig.md) | Function | Validate project metadata and builder configuration |
| [`validatePluginDefinition`](./validatePluginDefinition.md) | Function | Check a named module or script definition |
| [`runBuild`](./runBuild.md) | Function | Stage, execute, validate and publish packs |
| [`watchBuild`](./watchBuild.md) | Function | Run serial rebuilds with cancellation and callbacks |
| [`BuildContext`](./BuildContext.md) | Interface | Plugin paths, current pack, artifacts and dependencies |
| [`BuildPlugin`](./BuildPlugin.md) | Interface | Shared execution, detection and source-directory contract |
| [`BundleExtension`](./BundleExtension.md) | Interface | Feature-owned compiler plugins, JSX runtime and import preferences |

`@bedrock-core/builder` also exports the frozen `stages` order and planned-step types. `@bedrock-core/builder/config` exports `configSchema` and project/profile/plugin types. `@bedrock-core/builder/runner` exports the build options, result, step and artifact contracts.

`@bedrock-core/builder-plugin` owns the shared plugin, pack, artifact and cache types. It also exports `generatedAliases`, `hasFiles`, `fingerprint`, pack inspection/selection helpers and `resolveFeaturePacks`. [Plugin authoring](../guides/plugins.md) describes their use.

## Manifests and exports

| Export | Kind | Description |
| --- | --- | --- |
| [`resolveManifest`](./resolveManifest.md) | Function | Resolve a selected file and its relative inheritance chain |
| [`transformManifest`](./transformManifest.md) | Function | Apply explicit patches to a cloned manifest |
| [`readManifest`](./readManifest.md) | Function | Read v3 metadata before bundles exist |
| [`readScriptEntries`](./readScriptEntries.md) | Function | Read manifest-declared runtime entry paths |
| [`validatePackManifests`](./validatePackManifests.md) | Function | Check final identities and script files |
| [`resolveExportPaths`](./resolveExportPaths.md) | Function | Resolve and validate environment-expanded destinations |
| [`withExportPaths`](./withExportPaths.md) | Function | Hold destination locks around a publication callback |
| [`exportPacks`](./exportPacks.md) | Function | Publish explicit pack directories without the runner |

## Standalone stages

| Export | Kind | Description |
| --- | --- | --- |
| [`bundleScripts`](./bundleScripts.md) | Function | Bundle explicit TS/JS entries with esbuild |
| [`CompilationDependencies`](./CompilationDependencies.md) | Class | Track files and missing module-resolution candidates |
| [`generateTemplates`](./generateTemplates.md) | Function | Evaluate explicit templates and write JSON |
| [`defineTemplate`](./defineTemplate.md) | Function | Preserve and optionally categorize document data |
| [`defineMany`](./defineMany.md) | Function | Build a typed multi-document tuple |
| [`generateSchemaTypes`](./generateSchemaTypes.md) | Function | Generate editor declarations from Mojang schemas |
| [`compileI18n`](./compileI18n.md) | Function | Compile a translation library |
| [`parseLang`](./parseLang.md) | Function | Parse a language table |
| [`compileGuides`](./compileGuides.md) | Function | Compile localized Markdown/MDX guides |
| [`validatePackContent`](./validatePackContent.md) | Function | Validate final JSON syntax and matching schemas |
| [`ContentValidationError`](./ContentValidationError.md) | Class | Inspect structured content failures |

Each standalone package exports its options and result types. APIs accept explicit paths and do not imply runner staging or pack publication. `@bedrock-core/builder/validation` also exposes the standalone validation API.

## UI compilation

Use the [UI stage](../guides/stages.md#ui-compilation) to build `@bedrock-core` screens. `@bedrock-core/builder-ui` exports the `UiSettings` configuration type. Screen authoring and compiler behavior are documented under [Compiler](/docs/ui/compiler).

## Guide assembly

| Export | Kind | Description |
| --- | --- | --- |
| [`compileGuidePage`](./compileGuidePage.md) | Function | Compile a single localized page |
| [`assembleLocale`](./assembleLocale.md) | Function | Assemble navigation and validate current-set links |
| [`buildManifest`](./buildManifest.md) | Function | Create the runtime guide manifest |
| [`guideScreenNames`](./guideScreenNames.md) | Function | Resolve player/operator screen names |
| [`guideScreenTables`](./guideScreenTables.md) | Function | Map current page IDs to screen names |
| [`guideScreenModules`](./guideScreenModules.md) | Function | Generate guide screen module source |

`@bedrock-core/builder-guides/types` exports runtime and intermediate guide data types. `@bedrock-core/builder-guides/screens` exports screen-generation types and `SCREEN_HEADER`, the generated-file marker.

## Configuration conversion

| Export | Kind | Description |
| --- | --- | --- |
| [`migrateRegolithConfig`](./migrateRegolithConfig.md) | Function | Convert supported configuration into a reviewable preview |
| [`migrateRegolithProject`](./migrateRegolithProject.md) | Function | Inspect project metadata without loading filters |
| [`writeMigration`](./writeMigration.md) | Function | Write a ready preview with source-change guards |

Conversion types are exported from `@bedrock-core/builder/migrate`. These APIs convert configuration and leave authored project code and pack manifests intact.

</details>
