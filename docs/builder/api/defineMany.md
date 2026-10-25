---
sidebar_position: 16
description: "Generate one named JSON document per item, with typed async callbacks."
---
# defineMany

Generate one named JSON document per item, with typed async callbacks.

## Import

```ts
import { defineMany } from '@bedrock-core/builder-generator';
```

## Signature

```ts
function defineMany<T, D>(name: TemplateName<T>, data: TemplateData<T, D>, items: readonly T[]): ManyTemplate<T, D>;
function defineMany<T, D>(category: string, name: TemplateName<T>, data: TemplateData<T, D>, items: readonly T[]): ManyTemplate<T, D>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `category` | `string` | — | Optional leading document category in the second overload |
| `name` | `TemplateName<T>` | — | Portable output-basename callback |
| `data` | `TemplateData<T, D>` | — | Per-item JSON document callback |
| `items` | `readonly T[]` | — | Items from which named documents are generated |

## Returns

A typed [name, data, items] tuple, optionally tagged with a document category.

## Usage

```ts
import { defineMany } from '@bedrock-core/builder-generator/templates';

export default defineMany(
  item => item.id,
  item => ({ value: item.value }),
  [{ id: 'first', value: 1 }, { id: 'second', value: 2 }],
);
```
