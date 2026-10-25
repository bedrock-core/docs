---
sidebar_position: 3
description: "Configure project metadata, named profiles, stage selection and pack exports."
---
# Configuration

`config.json` builds on the shared project metadata and pack-path structure of the [Bedrock-OSS Project Config Standard](https://github.com/Bedrock-OSS/project-config-standard). Builder-specific settings live under `bedrockCore`; the fields below describe Builder's requirements and extensions.

## Project fields

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `$schema` | `string` | — | Editor schema reference |
| `targetVersion` | `string` | — | Required target Minecraft version |
| `namespace` | `string` | — | Required project namespace |
| `name` | `string` | — | Required project name |
| `description` | `string` | — | Optional project description |
| `authors` | `(string \| { name: string; logo?: string })[]` | — | Required author list |
| `packs` | `Record<string, string>` | — | Required map of arbitrary pack IDs to source directories |
| `bedrockCore` | `object` | — | Required builder format, plugins and profiles |

Prefer the table's metadata order, followed by remaining fields. Key order is accepted freely. Projects are implicitly Bedrock; no `type` field is needed. Unrelated tool namespaces and other top-level metadata are preserved.

Paths resolve relative to the directory containing `config.json`. Every declared pack must have an export destination in the selected profile. A manifest with `data` or `script` modules is classified as behavior; `resources` means resource. Mixed behavior/resource modules are rejected. See [Microsoft's module reference](https://learn.microsoft.com/minecraft/creator/reference/content/manifestreference/module?view=minecraft-bedrock-stable).

## Pack ownership

Each pack owns its sources: translations under `i18n/`, guides under `guides/` and runtime scripts under `scripts/`. The generator reserves participating plugins' non-template source directories. Consumed source inputs remain available to downstream compilers and are omitted from published packs.

Manifests retain stable UUIDs and module declarations. Source manifests can optionally use Builder's `pack` shorthand inside their top-level `dependencies` array, alongside `header` and `modules`:

```json title="packs/BP/manifest.json (source fragment)"
{ "dependencies": [{ "pack": "assets" }] }
```

`assets` is a configured pack ID. Builder replaces this shorthand with the selected pack's header UUID and version in the exported Minecraft manifest. Standard UUID dependencies also work. [Link packs that belong together](./projects.md#link-packs-that-belong-together) shows both manifest fragments. Local versions must match; reciprocal dependencies are allowed and do not reorder stages.

`i18n`, `guides` and `ui-compiler` settings accept `owner` and `resourcePack` IDs. Translations and guides discover inputs independently in each selected pack; `owner` restricts discovery. UI defaults to the sole script pack, or the sole pack when none declares scripts. Client output goes to the owner's direct local resource dependency, or to the owner itself when it is a resource pack. Ambiguous destinations require an explicit ID. External dependencies cannot receive generated output.

Generated imports are pack-owned. An unqualified import such as `@bedrock-core/generated/i18n` resolves to the consuming pack's bundle; `@bedrock-core/generated/i18n/<packId>` selects an explicit owner. Editor declarations live under `.bedrock-core/generated/` and belong in the project's TypeScript `include`.

Shared display metadata comes from `config.json`; npm identity and default native pack version come from `package.json`. Explicit manifest values take precedence over shared defaults. `@bedrock-core/generated/project` exposes resolved metadata to authored sources; include `.bedrock-core/generated/project.d.ts` for editor types. Each script pack declares its runtime identity in `core.register()`.

Manifest metadata inherits `authors` from config and `license` plus `homepage` (or `url`) from `package.json`. When no package license is set, Builder reads a root `LICENSE`, `LICENCE` or `COPYING` file; `.txt` and `.md` license variants are accepted. `SEE LICENSE IN <filename>` resolves a root license file. Authored manifest values take precedence. Builder appends its version to `metadata.generated_with["bedrock-core"]` and preserves other tools. `product_type` is authored explicitly; the resource-only starter omits it. See [Microsoft's metadata reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable#metadata).

Native plugins declare module eligibility and use `packs` plus `links` for overrides. Node script definitions use `folders` for BP/RP mappings; script steps can replace `folders`, `dataPath` and `persistData`. See [plugins](./plugins.md) and [Node scripts](./node-scripts.md).

## Staging exclusions

Builder copies project sources into a temporary workspace. Set `bedrockCore.staging.exclude` to keep cache directories and retained output outside that workspace and watch mode.

```json title="config.json (fragment)"
{
  "bedrockCore": {
    "staging": { "exclude": ["build", "dist"] }
  }
}
```

Paths are literal and relative to `config.json`; glob patterns are not accepted. An exclusion cannot cover the configuration file or a complete pack source. Configured export destinations and Builder's own caches are already excluded.

## Profiles

`bedrockCore.formatVersion` is `"1.0.0"`. Its `profiles` map holds named builds:

```json
{
  "formatVersion": "1.0.0",
  "profiles": {
    "default": {
      "export": { "gameplay": "./build/BP", "assets": "./build/RP" }
    },
    "development": {
      "cache": true,
      "export": {
        "gameplay": "%APPDATA%/Minecraft Bedrock/Users/Shared/games/com.mojang/development_behavior_packs/example_bp",
        "assets": "%APPDATA%/Minecraft Bedrock/Users/Shared/games/com.mojang/development_resource_packs/example_rp"
      }
    }
  }
}
```

The development example uses the Windows installation path configured by the project. Set it to the development-pack directories used by the target Minecraft installation.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pretty` | `false \| { indent?: "space" \| "tab"; size?: number }` | `false` | Generated JSON formatting inherited by stages |
| `debug` | `boolean` | `false` | Debug output inherited by stages that use it |
| `stages` | `Record<StageName, StageSelection>` | Automatic | Select built-in stages and their settings |
| `steps` | `PluginStep[]` | `[]` | Ordered [plugin invocations](./plugins.md) |
| `export` | `Record<string, string>` | — | Exact destination for every configured pack |
| `cache` | `boolean` | `true` | Reuse verified compilations and JSON checks |
| `watch.debounceMs` | `number` | `100` | Delay used to coalesce input changes |
| `watch.paths` | `string[]` | `[]` | Additional project-relative inputs |

## Stage selection

| Value | Behavior |
| --- | --- |
| Omitted or `"auto"` | Inspect current staged inputs at that stage's boundary |
| `false` | Disable the stage and its hook boundaries |
| `true` | Run the stage with default settings |
| Options object | Run the stage with those settings |

Before hooks run before automatic discovery. A plugin can therefore create the inputs that activate a later stage.

## Shared stage settings

Set `pretty` and `debug` alongside `stages` to supply profile defaults. Each stage can replace either value. Explicit `false` disables the inherited setting; a stage's formatting object replaces the profile formatting object. Stage selection remains automatic unless explicitly enabled.

```json
{
  "pretty": { "indent": "tab" },
  "debug": true,
  "stages": {
    "manifest": { "manifestPath": "./packs/BP/manifest.test.json" },
    "ui-compiler": { "pretty": false },
    "bundler": { "debug": false }
  },
  "export": { "gameplay": "./build/BP", "assets": "./build/RP" }
}
```

Stages use the settings relevant to their output. These defaults apply to built-in stages; plugin steps receive their own `settings`.

## Export paths

`%NAME%`, `$NAME` and `${NAME}` expand from the process environment. Names are case-insensitive on Windows. Missing or empty variables fail before plugin execution. Other shell expressions are not evaluated.

Destinations must be dedicated, separate directories. They cannot overlap one another, source packs or protected project internals. Builder locks destinations for the build and replaces all selected packs together, retaining previous output when a build fails.

## Next steps

- [Plugins](./plugins.md) — named definitions and hook boundaries
- [Stages](./stages.md) — automatic inputs and stage options
- [Commands](./commands.md) — select a config and profile
