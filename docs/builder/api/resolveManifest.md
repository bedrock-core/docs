---
sidebar_position: 32
description: "Resolve a manifest file's relative inheritance chain without writing pack files."
---
# resolveManifest

Resolve a selected manifest and validate its complete v3 document.

## Import

```ts
import { resolveManifest } from '@bedrock-core/builder/manifest';
```

## Signature

```ts
function resolveManifest(file: string, options?: ManifestResolveOptions): Promise<ResolvedManifest>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `file` | `string` | — | Selected path, absolute or relative to the process working directory |
| `options.root` | `string` | — | Restrict the file and all ancestors to this directory |
| `options.signal` | `AbortSignal` | — | Cooperative cancellation |

## Returns

`ResolvedManifest` contains `manifest`, the complete document without `extends`, and `inputs`, the absolute paths read to assemble it. The function writes no files.

## Usage

```ts
import { resolveManifest } from '@bedrock-core/builder/manifest';

const result = await resolveManifest('./packs/BP/manifest.test.json', {
  root: process.cwd(),
});
console.warn(result.manifest, result.inputs);
```

## Notes

Each `extends` reference is relative to its declaring file. Objects merge recursively; arrays and scalars replace inherited values. Missing files, cycles, project-boundary escapes and invalid resolved manifests reject the promise.

The built-in stage additionally writes canonical manifests and removes staged variants. See [Stages](../guides/stages.md#manifest).
