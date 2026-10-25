---
sidebar_position: 22
description: "Generate guide screen module source for the current page IDs and access gates."
---
# guideScreenModules

Generate guide screen module source for the current page IDs and access gates.

## Import

```ts
import { guideScreenModules } from '@bedrock-core/builder-guides/screens';
```

## Signature

```ts
function guideScreenModules(input: GuideScreensInput): GuideScreenModule[];
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `GuideScreensInput` | — | Page IDs, access gates and screen module destinations |

## Returns

Generated screen paths and source text; the caller writes the modules.

## Notes

Uses current page IDs and access gates to generate player/operator screen families.
