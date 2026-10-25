---
sidebar_position: 40
description: "Validate identity and script files after all build steps finish."
---
# validatePackManifests

Validate identity and script files after all build steps finish.

## Import

```ts
import { validatePackManifests } from '@bedrock-core/builder/manifest';
```

## Signature

```ts
function validatePackManifests(packs: Record<string, string>): Promise<void>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `packs` | `Record<string, string>` | — | Configured pack IDs mapped to their directories |

## Returns

Resolves after all identities, entries and script files pass final manifest checks.
