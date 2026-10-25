---
sidebar_position: 5
description: "Bundle one explicit TS/JS entry without requiring the builder or Minecraft runtime libraries."
---
# bundleScripts

Bundle one explicit TS/JS entry without requiring the builder or Minecraft runtime libraries.

## Import

```ts
import { bundleScripts } from '@bedrock-core/builder-bundler';
```

## Signature

```ts
function bundleScripts(options: BundleOptions): Promise<BundleResult>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `BundleOptions` | — | Project inputs, settings and optional integrations for this operation |

## Returns

Written bundle paths, source inputs, resolution candidates and esbuild metadata.

## Usage

```ts
import { bundleScripts } from '@bedrock-core/builder-bundler';

const result = await bundleScripts({
  root: process.cwd(),
  entry: 'packs/BP/scripts/main.ts',
  outfile: 'build/scripts/main.js',
  debug: true,
});
```
