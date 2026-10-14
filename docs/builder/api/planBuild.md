---
sidebar_position: 28
description: "Resolve a deterministic execution plan without loading or executing plugin code."
---
# planBuild

Resolve a deterministic execution plan without loading or executing plugin code.

## Import

```ts
import { planBuild } from '@bedrock-core/builder';
```

## Signature

```ts
function planBuild(config: ProjectConfig, profileName = 'default'): PlannedStep[];
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `ProjectConfig` | — | Project configuration; paths remain relative to its containing project |
| `profileName` | `string` | `'default'` | Named profile; defaults to default |

## Returns

Prepare, hooks, selected stages, validation and export in deterministic order.

## Usage

```ts
import { readFile } from 'node:fs/promises';
import { validateConfig } from '@bedrock-core/builder/config';
import { planBuild } from '@bedrock-core/builder';

const config = validateConfig(JSON.parse(await readFile('config.json', 'utf8')));
const plan = planBuild(config, 'default');
console.warn(plan);
```

## Notes

Automatic stage boundaries are included; input detection happens during execution after before hooks. This operation does not import plugin code.
