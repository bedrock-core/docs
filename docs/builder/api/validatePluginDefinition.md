---
sidebar_position: 41
description: "Validate a named entry without importing or executing its code."
---
# validatePluginDefinition

Validate a named entry without importing or executing its code.

## Import

```ts
import { validatePluginDefinition } from '@bedrock-core/builder/config';
```

## Signature

```ts
function validatePluginDefinition(definition: unknown, name: string): PluginDefinition;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `definition` | `unknown` | — | Untrusted named plugin configuration |
| `name` | `string` | — | Plugin name included in validation diagnostics |

## Returns

The original definition without inserted defaults.
