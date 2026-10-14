---
sidebar_position: 17
description: "Preserve the authored value while checking its JSON shape in TypeScript."
---
# defineTemplate

Preserve the authored value while checking its JSON shape in TypeScript.

## Import

```ts
import { defineTemplate } from '@bedrock-core/builder-generator';
```

## Signature

```ts
function defineTemplate<T extends object>(data: T): T;
function defineTemplate<T extends object>(category: string, data: T): T;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `category` | `string` | — | Optional leading document category in the second overload |
| `data` | `T` | — | Authored document returned unchanged |

## Returns

The same authored object, optionally tagged with a document category.

## Usage

```ts
import { defineTemplate } from '@bedrock-core/builder-generator/templates';

export default defineTemplate({ value: 1 });
```
