---
sidebar_position: 35
description: "Apply explicit patches while retaining unrelated manifest fields and module identities."
---
# transformManifest

Apply explicit patches while retaining unrelated manifest fields and module identities.

## Import

```ts
import { transformManifest } from '@bedrock-core/builder/manifest';
```

## Signature

```ts
function transformManifest(input: unknown, overrides: ManifestOverrides): JsonObject;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `unknown` | — | Source data accepted by this operation |
| `overrides` | `ManifestOverrides` | — | Header, metadata, dependency and existing module-UUID patches |

## Returns

A cloned manifest with recursive object patches and replaced arrays.

## Notes

Module patches must reference existing UUIDs. scriptEntry requires exactly one script module.

This standalone helper transforms an explicit document. The built-in manifest stage selects files with `manifestPath` and resolves their `extends` chains.
