---
sidebar_position: 8
description: "Run plugins on packs selected through manifest module types and dependencies."
---
# Plugins

Add custom build processing with a local Node module or an installed npm package.

## Add a plugin

Define its module under `bedrockCore.plugins`, then invoke it in a profile:

```json
{
  "plugins": {
    "content": { "module": "@example/content-builder" }
  },
  "profiles": {
    "build": {
      "steps": [{ "plugin": "content", "before": "bundler" }]
    }
  }
}
```

These fields belong under `bedrockCore`; add the project's export map to the profile. Each step passes its `settings` object to the plugin.

## Choose packs

A pack plugin declares the manifest module types it processes. Builder runs it once per matching pack, regardless of pack IDs or folder names. A pack with several matching modules still receives one invocation.

Restrict an installed plugin to particular eligible packs with `packs`:

```json
{
  "module": "@example/content-builder",
  "packs": ["gameplay"]
}
```

Omit `packs` to process every eligible pack. Unknown IDs and incompatible module types fail. A step can supply its own `packs` list, replacing the definition's list for that invocation.

## Write a pack plugin

Export `requirements` and `run` as named exports:

```js title="tools/build-info.mjs"
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export const requirements = { modules: ['script'] };

export async function run(context) {
  await writeFile(
    path.join(context.pack.path, 'build-info.json'),
    JSON.stringify({ name: context.project.name }),
  );
}
```

Set `module` to `"./tools/build-info.mjs"`. The current owner is `context.pack`; its paths point into the copied workspace. Write generated output there to preserve authored sources.

## Use related packs

Declare named dependencies when processing needs another pack:

```js
export const requirements = {
  modules: ['script'],
  dependencies: {
    assets: { modules: ['resources'] },
  },
};
```

Builder resolves `assets` through each owner's direct local manifest dependencies. Read the destination with `context.linkedPacks.assets[0]`; `context.packs` includes the owner and resolved destinations. External or unrelated packs are not candidates.

A dependency requires exactly one matching pack by default. Set `optional: true` to allow none, or `multiple: true` to accept several. Each `modules` list matches any listed type.

If `gameplay` depends on two resource packs, choose the destination explicitly:

```json
{
  "module": "@example/content-builder",
  "links": { "gameplay": { "assets": "textures" } }
}
```

For a multiple dependency, use an array of pack IDs. Overrides must satisfy the declared types and existing manifest dependencies. Missing or ambiguous requirements fail before any owner runs, with candidate IDs in the error. Step-level `links` replace the named roles they specify and retain other definition defaults.

Different owners can write separate files in a shared destination. Conflicting edits to the same file fail. Use `scope: "project"` on the plugin definition for one invocation containing the union of eligible owners and related packs; that invocation has no current `context.pack`.

## Choose when it runs

Run a producer before its consumer: TypeScript before `bundler`, guide sources before `guides`. A step needs one `before` or `after` boundary. `after: "prepare"` runs before built-in processing; `before: "export"` runs before final validation. Steps at one boundary run in listed order.

A module without `requirements` is a project-wide tool and runs once with all packs. Such tools cannot use pack restrictions, dependency overrides or `scope: "pack"`.

## Track inputs

Register extra files with `context.registerDependency(path)` so watch mode observes them. Use `context.registerArtifact(...)` for generated modules consumed by other stages. Declare non-template source directories with `inputDirectories` to reserve them before JSON generation.

The [plugin API](../api/BuildPlugin.md) and [build context](../api/BuildContext.md) describe detection, artifacts and cache reuse. Running an installed plugin needs only its configuration.

## Next steps

- [Configuration](./configuration.md) — profile settings and export rules
- [Built-in processing](./stages.md) — choose a producer's position
- [Node scripts](./node-scripts.md) — reuse an existing Node filter
