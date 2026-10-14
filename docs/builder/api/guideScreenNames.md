---
sidebar_position: 23
description: "Resolve runtime-compatible names for a guide screen family."
---
# guideScreenNames

Resolve runtime-compatible names for a guide screen family.

## Import

```ts
import { guideScreenNames } from '@bedrock-core/builder-guides/screens';
```

## Signature

```ts
function guideScreenNames(audience: GuideAudience): GuideScreenNames;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `audience` | `GuideAudience` | — | Player or operator screen family |

## Returns

Stable home, index and page identifiers for the selected audience.
