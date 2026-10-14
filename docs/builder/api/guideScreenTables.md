---
sidebar_position: 24
description: "Map current guide page IDs to player and operator screen names."
---
# guideScreenTables

Map current guide page IDs to player and operator screen names.

## Import

```ts
import { guideScreenTables } from '@bedrock-core/builder-guides/screens';
```

## Signature

```ts
function guideScreenTables(input: Pick<GuideScreensInput, 'pageIds' | 'gated' | 'gatedPageIds'>): { screens: Record<string, string>; opScreens?: Record<string, string> };
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `Pick<GuideScreensInput, 'pageIds' \| 'gated' \| 'gatedPageIds'>` | — | Page IDs and operator access gates |

## Returns

Page-to-screen maps for players and, when gated, operators.
