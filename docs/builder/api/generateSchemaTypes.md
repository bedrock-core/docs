---
sidebar_position: 20
description: "Generate global document aliases and Many from the official cached schemas for the IDE."
---
# generateSchemaTypes

Generate global document aliases and Many from the official cached schemas for the IDE.

## Import

```ts
import { generateSchemaTypes } from '@bedrock-core/builder-generator';
```

## Signature

```ts
function generateSchemaTypes(options: SchemaTypeOptions): Promise<SchemaTypeResult>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SchemaTypeOptions` | — | Project inputs, settings and optional integrations for this operation |

## Returns

Resolved schema version, absolute declaration directory and whether output changed.

## Usage

```ts
import { generateSchemaTypes } from '@bedrock-core/builder-generator';

const result = await generateSchemaTypes({
  root: process.cwd(),
  schemaVersion: '1.26.50',
});
```

## Notes

The standalone call generates declarations directly; the profile types switch controls whether the runner invokes it.
