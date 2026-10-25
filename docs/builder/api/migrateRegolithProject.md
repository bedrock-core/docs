---
sidebar_position: 26
description: "Inspect pack metadata and known local wrappers without importing any project code."
---
# migrateRegolithProject

Inspect pack metadata and known local wrappers without importing any project code.

## Import

```ts
import { migrateRegolithProject } from '@bedrock-core/builder/migrate';
```

## Signature

```ts
function migrateRegolithProject(configPath = 'config.json', options: MigrationOptions = {}): Promise<ProjectMigration>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `configPath` | `string` | `'config.json'` | Values described by the parameter type |
| `options` | `MigrationOptions` | `{}` | Project inputs, settings and optional integrations for this operation |

## Returns

A preview with inspected metadata and the original config text for guarded writes.

## Notes

Inspects source manifests and known local wrapper identities without importing authored filter code.
