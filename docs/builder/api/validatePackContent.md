---
sidebar_position: 39
description: "Validate every JSON document; catalog matches additionally receive schema checks."
---
# validatePackContent

Validate every JSON document; catalog matches additionally receive schema checks.

## Import

```ts
import { validatePackContent } from '@bedrock-core/builder/validation';
```

## Signature

```ts
function validatePackContent(options: ContentValidationOptions): Promise<ContentValidationResult>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `ContentValidationOptions` | — | Project inputs, settings and optional integrations for this operation |

## Returns

Schema catalog version and per-file coverage; invalid documents throw ContentValidationError.

## Usage

```ts
import { validatePackContent } from '@bedrock-core/builder/validation';

const result = await validatePackContent({
  packs: [{ id: 'assets', path: './build/RP', kind: 'resource' }],
});
console.warn(result.schemaVersion);
```
