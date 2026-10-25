---
sidebar_position: 31
description: "Read declared runtime entries before their bundles exist."
---
# readScriptEntries

Read declared runtime entries before their bundles exist.

## Import

```ts
import { readScriptEntries } from '@bedrock-core/builder/manifest';
```

## Signature

```ts
function readScriptEntries(id: string, directory: string): Promise<string[]>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Configured pack ID used in diagnostics |
| `directory` | `string` | — | Directory containing the current pack manifest |

## Returns

Relative entry paths declared by the current manifest script modules.
