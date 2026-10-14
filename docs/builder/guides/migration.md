---
sidebar_position: 9
description: "Convert Regolith configuration into builder profiles, review diagnostics and validate migrated packs."
---
# Migrate from Regolith

Convert a Regolith project's configuration into builder profiles, built-in stages and explicit pack destinations.

## Preview the conversion

Use Node 22.18 or newer and install the builder as described in the [overview](../index.md#install). Run the command from the project containing `config.json`:

```sh
bc-builder migrate config.json
bc-builder migrate config.json --json
```

Preview is the default and leaves files intact. The command reads JSON, pack manifests and file paths; it does not import project modules, execute filters or shell commands, evaluate expressions, or download dependencies.

The text output contains a proposed configuration and diagnostics. `--json` returns `config`, `diagnostics` and `ready`. Error diagnostics produce exit code 1 and prevent writes. Warnings identify checks that still need review. `ready: true` means configuration conversion has no errors; it does not establish equivalent build output or Minecraft behavior.

## Supported conversion

| Input | Result |
| --- | --- |
| Regolith `formatVersion` `1.4.0` or `1.8.0` | `bedrockCore.formatVersion` `1.0.0`, with the source `regolith` section retained |
| Project metadata and other tool sections | Preserved; singular `author` becomes `authors` when no author list exists |
| Profile references | Flattened with cycle detection |
| Verified `@bedrock-core` manifest, generator, guides, i18n, UI compiler and bundler filters | Built-in stages with supported settings; absent and disabled stages stay disabled |
| `core` filter | Shared settings merged into stages, with generator opt-in preserved |
| `watchPaths` | Each selected profile's `watch.paths` |
| Bundler `tsConfigPath` | Bundler `tsconfig`; script entry selection remains owned by pack manifests |
| Manifest `manifestPath` and `pretty` | Project-relative manifest selection, inheritance and output formatting |
| Generator pack paths, local UI screen modules, guides and i18n data paths | Project-relative paths instead of Regolith workspace paths |
| Local and exact exports | Explicit per-pack paths; local defaults use `build/<project-name>_bp` and `_rp` |

Supported @bedrock-core wrappers are recognized by verified repository identity or canonical script paths. Other local modules and forks need an explicit mapping such as `--filter manifest=manifest` or `--filter core=core`, after verifying their built-in equivalent. A mapping does not adapt or execute custom code. Pinned versions produce a warning because stages use the installed builder implementation.

The file-based command requires source packs inside the project, valid v3 manifests, and unique pack and module UUIDs. Manifest modules determine behavior/resource classification, including arbitrary pack IDs. See [Microsoft's manifest reference](https://learn.microsoft.com/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable) for manifest fields.

When `targetVersion` is absent, the command can infer it if the available manifest `min_engine_version` strings agree. Otherwise, supply `--target-version`. Namespace can be inferred from agreeing stage settings; otherwise, supply `--namespace`. Existing `bedrockCore` configuration is not replaced. Unrelated metadata is preserved, and the conversion omits an implicit Bedrock project `type`.

## Select profiles and destinations

All profiles are selected by default. Repeat `--profile` to select a subset. A selected profile can reference an unselected profile: its filters are flattened into the selected profile, and its export destination is ignored.

Every configured pack needs a destination. Development, world, no-export, expression-based and multiple-target export policies require explicit replacements. This preview selects one profile and dedicated local folders for two configured pack IDs:

```sh
bc-builder migrate config.json --profile default \
  --export default:behaviorPack=./build/migrated/BP \
  --export default:resourcePack=./build/migrated/RP
```

Use the actual IDs from the project's `packs` map. `--export` replaces the selected profile's entire export map, so repeat it for every pack in that profile. Replacement also replaces read-only and multiple-target policies and produces a warning. Use separate builder profiles when several destinations are needed.

Destinations cannot overlap source packs, one another, the project root or protected builder directories. Regolith export expressions and environment substitutions are not evaluated during conversion. See [export paths](./configuration.md#export-paths) for authored builder destination rules.

| Option | Purpose |
| --- | --- |
| `--profile name` | Select a profile; repeatable, with all profiles selected by default |
| `--namespace value` | Supply the intended project namespace |
| `--target-version value` | Supply the intended Minecraft target version |
| `--export profile:pack=path` | Replace a profile's export map; repeat for every pack |
| `--filter id=stage` | Declare a verified equivalent for a local filter or fork; accepts `core`, `manifest`, `generator`, `guides`, `i18n`, `ui-compiler` or `bundler` |
| `--write` | Save a complete conversion |
| `--output path` | With `--write`, create a sibling configuration |
| `--json` | Print configuration, diagnostics and readiness as JSON |
| `--help` | Show CLI usage |

## Save the configuration

Use the same profile, metadata, filter and destination options from the reviewed preview when adding `--write`.

```sh
bc-builder migrate config.json --write --output config.builder.json
```

The output must sit beside the original configuration so relative project paths keep their meaning. Relative `--output` values resolve from the input configuration's directory. Existing output files are not overwritten, and `--output` requires `--write`.

To update the input configuration in place:

```sh
bc-builder migrate config.json --write
```

In-place writes retain the original content in `config.json.regolith.bak`. Existing backups are not overwritten. The writer checks the inspected source again before replacement and rejects intervening edits. Errors prevent writes; warnings remain part of the conversion result and require review.

## Review project inputs

The conversion changes configuration. Project code, pack manifests, imports, TypeScript aliases and declaration references are separate inputs and are not rewritten.

Review manifest script entries before building. Builder selects script entry points from manifests; `tsconfig.files` and `include` do not select them. Manifest stage selections retain their project-relative files and `extends` chains. Guides keep locale-relative include/exclude patterns, while content, screen and component paths resolve against the authored project.

Include the declarations needed by the project in its TypeScript configuration:

| Generated types | Default location |
| --- | --- |
| Generator | `.bedrock-core/generated/mc/globals.d.ts` |
| Guides | `.bedrock-core/generated/guides` |
| Translations | `.bedrock-core/generated/i18n` |
| UI screen keys | `.bedrock-core/generated/ui` |

Generated guide and translation runtime imports use `@bedrock-core/generated/guides` and `@bedrock-core/generated/i18n`. Builder resolves these imports from their producing stages. Use the configured generator declaration path when it differs from the default.

## Limits

Conditions, shell commands, filter CLI arguments, parallel groups, repeated or reordered built-in stages, and custom filters require manual configuration using trusted TS/JS plugins or separate profiles. Unknown properties and unsupported settings are reported at their configuration paths, including inside referenced profiles.

Standalone Node programs can be configured as named script plugins with profile steps; [Node scripts](./node-scripts.md) describes working folders and arguments. Use [module plugins](./plugins.md) for code receiving builder context. `--filter` only identifies a verified built-in equivalent.

## Validate the migrated project

Inspect the selected profile before building:

```sh
bc-builder plan config.builder.json default
bc-builder build config.builder.json default
```

Use the profile name present in the converted configuration and isolated export folders. Compare manifests, scripts, generated UI, translations and other pack artifacts against the corresponding Regolith build. Review diagnostics and perform the project's Minecraft runtime checks before adopting the builder profile. A ready migration preview does not validate complete pack content or prove output parity.

## Programmatic conversion

The public migration API can inspect a project and save a reviewed result:

```ts
import { migrateRegolithProject, writeMigration } from '@bedrock-core/builder/migrate';

const result = await migrateRegolithProject('config.json', {
  profiles: ['build'],
  exports: { build: { gameplay: './build/migrated/BP', visuals: './build/migrated/RP' } },
});

if (result.ready) {
  await writeMigration(result, 'config.builder.json');
}
```

Use configured pack IDs in `exports`. [`migrateRegolithConfig`](../api/migrateRegolithConfig.md) transforms an already parsed configuration without inspecting files; pass `packKinds` for arbitrary pack IDs and any required metadata. [`migrateRegolithProject`](../api/migrateRegolithProject.md) adds manifest inspection, type inference, local-wrapper verification and destination checks. [`writeMigration`](../api/writeMigration.md) applies the same guarded write rules as the CLI.

## Next steps

- [Configuration](./configuration.md) — project fields, profiles and pack destinations
- [Node scripts](./node-scripts.md) — standalone filter entry points and arguments
- [Plugins](./plugins.md) — builder modules and ordered profile steps
- [Stages](./stages.md) — built-in inputs and settings
