---
sidebar_position: 19
description: "Publish pack folders with manifest checks, locks and rollback, without the build runner."
---
# exportPacks

Publish pack folders with manifest checks, locks and rollback, without the build runner.

## Import

```ts
import { exportPacks } from '@bedrock-core/builder/export';
```

## Signature

```ts
function exportPacks({ packs, paths, signal, environment = process.env }: ExportOptions): Promise<ExportedPack[]>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `{ packs, paths, signal, environment = process.env }` | `ExportOptions` | — | Values described by the parameter type |

## Returns

Published pack IDs and absolute destination directories.

## Notes

JSON schema validation is separate. Use validatePackContent before publication when content checks are required.
