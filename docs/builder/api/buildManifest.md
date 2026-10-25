---
sidebar_position: 4
description: "Build a runtime guide manifest from the assembled current locale and categories."
---
# buildManifest

Build a runtime guide manifest from the assembled current locale and categories.

## Import

```ts
import { buildManifest } from '@bedrock-core/builder-guides';
```

## Signature

```ts
function buildManifest({ build, categories, prefix, ns, defaultLocale, locales, report }: { build: LocaleBuild; categories: Map<string, Record<string, unknown>>; prefix: string; ns: string; defaultLocale: string; locales: string[]; report: Report; }): GuideManifest<CompiledBlock>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `{ build, categories, prefix, ns, defaultLocale, locales, report }` | `{ build: LocaleBuild; categories: Map<string, Record<string, unknown>>; prefix: string; ns: string; defaultLocale: string; locales: string[]; report: Report; }` | — | Current locale build, categories, namespace and diagnostic sink |

## Returns

Guide runtime manifest assembled from the current locale and category data.
