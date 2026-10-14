---
sidebar_position: 3
description: "Shared staged paths, pack inspection, artifacts, cache reuse and bundler extensions for Node plugins."
---
# BuildContext

Services supplied to built-in and external trusted Node plugins.

## Import

```ts
import type { BuildContext } from '@bedrock-core/builder-plugin';
```

`@bedrock-core/builder/runner` re-exports the same type.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `projectRoot` | `string` | Absolute authored directory containing config.json |
| `namespace` | `string` | Configured project namespace |
| `project` | `ProjectMetadata \| undefined` | Shared package and display metadata |
| `stagedRoot` | `string` | Project copy inside the temporary build directory |
| `generatedDir` | `string` | Temporary generated-intermediate directory |
| `packs` | `Readonly<Record<string, string>>` | Selected pack IDs and staged paths |
| `allPacks` | `Readonly<Record<string, string>> \| undefined` | All configured staged pack paths |
| `pack` | `PackInfo \| undefined` | Current pack for an invocation with pack scope |
| `outputPaths` | `Readonly<Record<string, string>>` | Selected pack IDs and absolute export destinations |
| `profile` | `string` | Selected profile name |
| `generatedImports` | `Readonly<Record<string, string>>` | Registered import names mapped to artifact IDs |
| `cache` | `boolean` | Whether verified reuse is enabled |
| `bundleExtensions` | `readonly BundleExtension[]` | Registered bundling contributions in execution order |
| `inputDirectories` | `readonly string[] \| undefined` | Non-template source directories reserved by plugins |
| `logger` | `Pick<Console, 'info' \| 'warn' \| 'error'>` | Build diagnostic sink |
| `signal` | `AbortSignal \| undefined` | Cooperative cancellation |

Pack-scoped invocations expose one pack through `packs`, `outputPaths` and `pack`. Project-scoped invocations expose the selected set and have no current `pack`. `allPacks` and `inspectPacks()` retain access to the complete configured graph. [Plugins](../guides/plugins.md#pack-selection-and-scope) describes selectors and scope.

`PackInfo` includes `id`, `path`, `kind`, `moduleTypes`, optional `outputPath`, resolved manifest, header UUID, version and dependencies. Dependencies distinguish local pack IDs, external pack UUIDs and scripting API modules.

## Methods

| Method | Behavior |
| --- | --- |
| `registerDependency(path)` | Track an authored input; relative paths resolve from projectRoot |
| `registerArtifact(id, path, { importAs?, pack? })` | Register an existing staged file; relative paths resolve from stagedRoot |
| `artifact(id)` | Return an earlier artifact or throw for a missing ID |
| `generatedImportsFor(packId)` | Return global imports plus that pack's unqualified imports |
| `inspectPack(id)` | Read a pack's selected manifest and resolved dependencies |
| `inspectPacks()` | Read the complete graph of configured packs |
| `excludeFromExport(path)` | Retain a staged pack input for consumers and omit it before final validation and export |
| `reuse<T>(id, options)` | Reuse invocation-scoped output with file dependency tracking |
| `registerBundleExtension(extension)` | Register a [bundling contribution](./BundleExtension.md) before bundling |

Artifact IDs are unique across the build. `{ importAs, pack }` assigns an unqualified import to its owner pack and exposes `importAs/<packId>` to explicit consumers. Different packs can own the same unqualified name; conflicts within a scope fail. `generatedAliases` from `@bedrock-core/builder-plugin` resolves the registry's artifact IDs to current staged files.

The builder supplies the optional pack, metadata and source-ownership services. Standalone plugin hosts can omit the corresponding optional members.

## Usage

```ts
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { BuildContext } from '@bedrock-core/builder-plugin';

export async function run(context: BuildContext) {
  context.signal?.throwIfAborted();
  if (!context.pack) { throw new Error('This plugin requires pack scope'); }
  const file = path.join(context.generatedDir, `${context.pack.id}.json`);
  await writeFile(file, JSON.stringify({ namespace: context.namespace }));
  await context.registerArtifact(`settings:${context.pack.id}`, file, {
    importAs: '@bedrock-core/generated/settings',
    pack: context.pack.id,
  });
  context.registerDependency('config.json');
}
```

## Cache reuse

`reuse` accepts `inputs`, an optional JSON-compatible `key`, an optional `cache` flag and an async `run` callback. Include implementation and settings changes in the key. The callback returns `{ value, inputs?, files?, cache? }`; values must be JSON serializable and emitted files must remain inside staging roots.

Hits restore declared files into fresh staging and retain dependency tracking. The result contains `value`, `cached`, `inputs` and `files`. `profile.cache: false` forces execution. [Watch and cache](../guides/watch.md) describes automatic stage reuse.

## Notes

Apply pack edits through staged paths. Temporary paths expire after the host finishes; successful build results report published destinations and artifact identities. Failure or cancellation prevents publication. Plugins execute trusted Node code and must cooperate with cancellation. [How builds run](../guides/build-process.md) describes staging, export and cleanup.
