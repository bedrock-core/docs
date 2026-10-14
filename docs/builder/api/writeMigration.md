---
sidebar_position: 44
description: "Write only complete migrations, retaining an exclusive backup for an in-place edit."
---
# writeMigration

Write only complete migrations, retaining an exclusive backup for an in-place edit.

## Import

```ts
import { writeMigration } from '@bedrock-core/builder/migrate';
```

## Signature

```ts
function writeMigration(result: ProjectMigration, outputPath = result.configPath): Promise<{ path: string; backup?: string }>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `result` | `ProjectMigration` | — | Values described by the parameter type |
| `outputPath` | `string` | `result.configPath` | Destination config path; defaults to the previewed source config |

## Returns

The written configuration path and an optional in-place backup path.

## Notes

Requires a ready preview. In-place writes retain a backup and reject changes to the original config after inspection.
