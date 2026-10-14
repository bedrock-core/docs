---
sidebar_position: 38
description: "Validate without adding defaults or removing other tools' configuration."
---
# validateConfig

Validate without adding defaults or removing other tools' configuration.

## Import

```ts
import { validateConfig } from '@bedrock-core/builder/config';
```

## Signature

```ts
function validateConfig(config: unknown): ProjectConfig;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `unknown` | — | Project configuration; paths remain relative to its containing project |

## Returns

The original configuration typed as ProjectConfig.

## Usage

```ts
import { readFile } from 'node:fs/promises';
import { validateConfig } from '@bedrock-core/builder/config';

const configText = await readFile('config.json', 'utf8');
const config = validateConfig(JSON.parse(configText));
```

## Notes

Validation preserves unrelated metadata/tool namespaces and does not insert defaults. Plugin references and hook availability are checked by planBuild.
