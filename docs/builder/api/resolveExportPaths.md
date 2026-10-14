---
sidebar_position: 33
description: "Resolve explicit pack destinations with environment variable expansion."
---
# resolveExportPaths

Expand `%NAME%`, `$NAME` and `${NAME}`, then resolve destinations relative to the project.

## Import

```ts
import { resolveExportPaths } from '@bedrock-core/builder/export';
```

## Signature

```ts
function resolveExportPaths(project: string, packs: Record<string, string>, selection: Record<string, string>, environment: NodeJS.ProcessEnv = process.env): Record<string, string>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `project` | `string` | — | Absolute directory containing config.json |
| `packs` | `Record<string, string>` | — | Configured pack IDs mapped to their directories |
| `selection` | `Record<string, string>` | — | Destination for every configured pack ID |
| `environment` | `NodeJS.ProcessEnv` | `process.env` | Variable values; defaults to process.env |

## Returns

Absolute destinations without creating directories or publishing files.

## Notes

Supports `%NAME%`, `$NAME` and `${NAME}`. Environment names are case-insensitive on Windows. Missing variables, pack destinations and unsafe overlaps fail.
