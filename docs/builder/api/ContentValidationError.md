---
sidebar_position: 13
description: "Inspect aggregated JSON syntax and schema validation failures."
---
# ContentValidationError

The error thrown when final JSON syntax or matching document schemas fail.

## Import

```ts
import { ContentValidationError } from '@bedrock-core/builder/validation';
```

## Members

| Member | Type | Description |
| --- | --- | --- |
| `diagnostics` | `readonly ContentDiagnostic[]` | Structured failures collected across checked files |
| `name` | `string` | `ContentValidationError` |
| `message` | `string` | Formatted pack/file/pointer diagnostics |

Each diagnostic carries `pack`, a pack-relative `file` path, JSON `pointer` and `message`. A syntax error can use an empty pointer and report an offset instead.

## Usage

```ts
import { ContentValidationError, validatePackContent } from '@bedrock-core/builder/validation';

try {
  await validatePackContent({
    packs: [{ id: 'assets', path: './build/RP', kind: 'resource' }],
  });
} catch (error) {
  if (error instanceof ContentValidationError) {
    for (const issue of error.diagnostics) console.warn(issue);
  }
  throw error;
}
```

## Notes

Unavailable upstream schemas appear in validation coverage. JSON syntax/schema checks do not prove assets, Molang, UI bindings or in-game behavior.
