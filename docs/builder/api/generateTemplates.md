---
sidebar_position: 21
description: "Evaluate explicit trusted templates and emit JSON after every template passes validation."
---
# generateTemplates

Evaluate explicit trusted templates and emit JSON after every template passes validation.

## Import

```ts
import { generateTemplates } from '@bedrock-core/builder-generator';
```

## Signature

```ts
function generateTemplates(options: GeneratorOptions): Promise<GeneratorResult>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `GeneratorOptions` | — | Project inputs, settings and optional integrations for this operation |

## Returns

Written JSON documents and consumed inputs; authored template files remain intact.

## Usage

```ts
import { generateTemplates } from '@bedrock-core/builder-generator';

const result = await generateTemplates({
  root: process.cwd(),
  files: ['packs/BP/items/example.ts'],
  pretty: { indent: 'space', size: 2 },
});
```

## Notes

Outputs are written beside explicit templates after all generated documents pass validation. Template evaluation executes trusted Node code.
