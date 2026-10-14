---
sidebar_position: 43
description: "Hold destination locks while the callback prepares and publishes validated packs."
---
# withExportPaths

Hold destination locks while the callback prepares and publishes validated packs.

## Import

```ts
import { withExportPaths } from '@bedrock-core/builder/export';
```

## Signature

```ts
function withExportPaths<T>(paths: Record<string, string>, build: (publish: PublishPacks) => Promise<T>): Promise<T>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `paths` | `Record<string, string>` | — | Dedicated nonoverlapping pack destination directories |
| `build` | `(publish: PublishPacks) => Promise<T>` | — | Callback receiving the guarded publication function |

## Returns

The callback result, with destination locks released on completion.

## Notes

This API holds locks and provides publication; the callback owns preparation and any additional validation.
