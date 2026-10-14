---
sidebar_position: 25
description: "Produce a reviewable config and diagnostics without evaluating or executing filters."
---
# migrateRegolithConfig

Produce a reviewable config and diagnostics without evaluating or executing filters.

## Import

```ts
import { migrateRegolithConfig } from '@bedrock-core/builder/migrate';
```

## Signature

```ts
function migrateRegolithConfig(input: unknown, options: MigrationOptions = {}): MigrationResult;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `unknown` | — | Source data accepted by this operation |
| `options` | `MigrationOptions` | `{}` | Project inputs, settings and optional integrations for this operation |

## Returns

A configuration preview, conversion diagnostics and readiness flag.

## Notes

Filters, shell commands and expressions are not executed. This operation converts configuration, not project code or pack manifests.
