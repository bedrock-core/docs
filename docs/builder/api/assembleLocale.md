---
sidebar_position: 2
description: "Assemble fresh locale state from compiled pages; cached page IR is never mutated."
---
# assembleLocale

Assemble fresh locale state from compiled pages; cached page IR is never mutated.

## Import

```ts
import { assembleLocale } from '@bedrock-core/builder-guides';
```

## Signature

```ts
function assembleLocale( compiled: Map<string, GuidePageCompilation>, categories: Map<string, Record<string, unknown>>, prefix: string, report: Report, targets = new Set(compiled.keys()), ): LocaleBuild;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `compiled` | `Map<string, GuidePageCompilation>` | — | Current locale page compilations indexed by normalized page ID |
| `categories` | `Map<string, Record<string, unknown>>` | — | Current category metadata indexed by category ID |
| `prefix` | `string` | — | Namespace prefix for generated language keys |
| `report` | `Report` | — | Warning/error sink used by locale assembly |
| `targets` | `Set<string>` | `new Set(compiled.keys())` | Known page IDs for link validation; defaults to the compiled page IDs |

## Returns

Assembled locale pages, language entries and validated page IDs.
