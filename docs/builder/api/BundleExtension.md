---
sidebar_position: 5
description: "Feature-owned esbuild plugins, JSX runtimes and import preferences consumed by the bundler."
---
# BundleExtension

A plugin registers bundling contributions through `context.registerBundleExtension` before the bundler runs.

## Import

```ts
import type { BundleExtension } from '@bedrock-core/builder-plugin';
```

## Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Required build-wide unique identity |
| `version` | `string` | — | Required implementation/settings fingerprint for bundle cache keys |
| `packs` | `readonly string[]` | Selected packs | Pack IDs receiving the extension |
| `inputs` | `readonly string[]` | `[]` | Source files and resolution candidates affecting reuse |
| `plugins` | `readonly Plugin[]` | `[]` | esbuild plugins applied in registration order before the host resolver |
| `jsxImportSource` | `string` | — | Package supplying the automatic JSX runtime |
| `resolveFromProject` | `readonly string[]` | `[]` | Import prefixes resolved from the authored dependency root first |
| `cache` | `boolean` | `false` | Opt custom compiler plugins into verified reuse |

## Usage

```ts
import type { BuildContext, BundleExtension } from '@bedrock-core/builder-plugin';

export function run(context: BuildContext) {
  const extension: BundleExtension = {
    id: '@example/widgets',
    version: '1',
    jsxImportSource: '@example/widgets',
    resolveFromProject: ['@example/widgets'],
  };
  context.registerBundleExtension(extension);
}
```

## Notes

Extensions default to the invocation's selected packs. Pack-scoped invocations contribute to their current pack; `packs` can select explicit configured pack IDs. Unknown pack IDs, duplicate extension IDs and conflicting JSX runtimes fail.

Custom esbuild plugins rebuild by default. Set `cache: true` only when `version` includes implementation/settings changes and every input is declared in `inputs` or returned through hook `watchFiles`. Directory watches and virtual inputs without observable files disable reuse conservatively. [Watch and cache](../guides/watch.md) describes the host cache.
