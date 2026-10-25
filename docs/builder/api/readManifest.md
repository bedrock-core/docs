---
sidebar_position: 29
description: "Read and validate manifest v3 fields without requiring compiled script files."
---
# readManifest

Read and validate manifest v3 fields without requiring compiled script files.

## Import

```ts
import { readManifest } from '@bedrock-core/builder/manifest';
```

## Signature

```ts
function readManifest(id: string, directory: string): Promise<Manifest>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Configured pack ID used in diagnostics |
| `directory` | `string` | — | Directory containing the current pack manifest |

## Returns

Validated v3 manifest metadata; compiled script files are not required yet.
