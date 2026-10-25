---
sidebar_position: 10
description: "Compile a page independently of the current sidebar, categories and translations."
---
# compileGuidePage

Compile a page independently of the current sidebar, categories and translations.

## Import

```ts
import { compileGuidePage } from '@bedrock-core/builder-guides';
```

## Signature

```ts
function compileGuidePage(input: GuidePageInput): GuidePageCompilation;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `GuidePageInput` | — | MDX source, page ID, language prefix and image/code constraints |

## Returns

Parsed page content, generated language entries, link targets and diagnostics.

## Notes

Compiles a single page independently; current-set link and navigation checks belong to assembleLocale.
