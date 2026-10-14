---
sidebar_position: 5
description: "Define Node plugins with pack selection, generated imports, cache reuse and bundling contributions."
---
# Plugins

A plugin owns its processing; a profile step selects when it runs.

Built-in stages and external modules use the same [BuildPlugin](../api/BuildPlugin.md) contract. Use `module` for a function receiving shared build services, or `script` for a standalone program working with temporary `BP`, `RP` and `data` folders.

## Definitions and steps

```json
{
  "plugins": {
    "textures": { "module": "./plugins/textures.ts", "targets": "resource" }
  },
  "profiles": {
    "default": {
      "steps": [
        { "plugin": "textures", "after": "prepare", "settings": { "color": "red" } }
      ],
      "export": { "gameplay": "./build/BP", "assets": "./build/RP" }
    }
  }
}
```

Place these maps under `bedrockCore`. Definitions select exactly one of `module` or `script`. Install package entry points through the project's package manager and lockfile.

Each step declares exactly one `before` or `after`: `after: "prepare"`, either side of an enabled stage, or `before: "export"`. Steps at the same boundary run in array order. Disabled stages have no hook boundaries. Final validation follows all modifying hooks.

## Module plugins

Export `run(context, settings)` from a project-relative TS/JS module or installed package entry point:

```ts title="plugins/textures.ts"
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { BuildContext } from '@bedrock-core/builder-plugin';

export async function run(context: BuildContext) {
  if (!context.pack) { throw new Error('This plugin requires pack scope'); }
  const file = path.join(context.pack.path, 'plugin-info.json');
  await writeFile(file, JSON.stringify({ pack: context.pack.id }));
  await context.registerArtifact(`info:${context.pack.id}`, file);
}
```

[BuildContext](../api/BuildContext.md) supplies staged paths, metadata, pack inspection, artifacts, dependencies, cache reuse and bundler extensions. Modules execute trusted code in the builder process and must cooperate with `context.signal`.

Each built-in package owns its `./plugin` entry point. These entry points can also be configured as module steps; disable the corresponding default stage to avoid processing twice. [Stages](./stages.md) lists the packages and their order.

### Automatic participation

An optional `detect(context, settings)` returns `{ needed, reason }` without evaluating resource modules. Built-in stages use it when their selection is automatic. External module steps run unconditionally unless the step sets `mode: "auto"`; a module without a detector runs in either mode.

Plugins can also export `inputDirectories(context, settings)` to reserve non-template source directories before generator discovery. Call `context.excludeFromExport(path)` to retain consumed pack inputs until all downstream operations finish and omit them before final validation and publication.

## Script plugins

A script operates on real temporary `BP`, `RP` and `data` directories. Successful pack edits return to staging before the next operation. Use `targets` for separate per-pack invocations or `packs` to select a BP/RP pair. [Node scripts](./node-scripts.md) documents arguments, environment and mapping.

## Pack selection and scope

`targets` accepts `"behavior"`, `"resource"`, `"both"`, or an object with pack IDs and manifest module types:

```json
{
  "module": "@example/assets/builder",
  "targets": { "packs": ["assets", "theme"], "modules": ["resources"] },
  "scope": "project"
}
```

Explicit IDs intersect with any matching module type. A pack declaring several matching modules is selected once. Classification uses manifests; directory and pack names carry no type meaning.

Modules with targets default to `scope: "pack"`: one invocation per selected pack, with `context.pack` and maps restricted to that pack. `scope: "project"` invokes the module once with the matching set. Without targets, modules default to project scope; explicit pack scope runs once per configured pack. An empty selection skips the step, and failure on any pack prevents publication of the whole build.

`context.inspectPacks()` reads the complete profile-selected pack graph. Descriptors resolve local requirements by header UUID and distinguish external packs and scripting API modules. Reciprocal dependencies do not change pipeline order.

For features with separate runtime and client outputs, use `resolveFeaturePacks(context, { owner, resourcePack })` from `@bedrock-core/builder-plugin`. The destination must be a direct local resource dependency of the owner, or the resource owner itself. Ambiguous ownership requires an explicit ID. [Configuration](./configuration.md#pack-ownership) describes these relationships.

## Artifacts and dependencies

```ts
await context.registerArtifact(`items:${context.pack!.id}`, file, {
  importAs: '@bedrock-core/generated/items',
  pack: context.pack!.id,
});
context.registerDependency('templates/items.json');
```

Artifact IDs are unique. The owning pack consumes `@bedrock-core/generated/items`; explicit consumers use `@bedrock-core/generated/items/<packId>`. Separate packs can own the same unqualified import. `generatedImportsFor(packId)` selects the effective registry, and downstream compilers resolve registered imports automatically.

Register authored filesystem inputs read outside compiler imports. Include the pack ID in generated filenames and artifact IDs shared between invocations. Registered files must exist inside staging; temporary paths expire after cleanup.

## Cache and bundling contributions

`context.reuse` stores invocation-scoped output with an implementation/settings key and tracked files. Hits restore outputs and retain dependencies. Values must be JSON serializable; emitted files must stay inside staging. [BuildContext](../api/BuildContext.md#cache-reuse) documents the input and result contracts.

`context.registerBundleExtension` contributes esbuild plugins, a JSX runtime or project-first import prefixes before the bundler runs. Extension IDs must be unique. Pack-scoped invocations default contributions to their current pack; conflicting JSX runtimes fail. [BundleExtension](../api/BundleExtension.md) documents the fields and cache requirements.

## Runtime entry points

A feature package can expose separate Node builder and Minecraft runtime entry points. Its builder module publishes generated data; its runtime module imports that data and installs behavior through the [declaration contract](/docs/server/api/runtime#writing-one). Building content does not install a runtime declaration.

Expose the entry points callers load and keep helpers and workers package-local.

## Next steps

- [Node scripts](./node-scripts.md) — temporary folders, arguments and environment
- [BuildContext](../api/BuildContext.md) — shared services and generated imports
- [Stages](./stages.md) — built-in packages and hook boundaries
