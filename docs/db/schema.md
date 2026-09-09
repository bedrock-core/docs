---
sidebar_position: 3
description: "schema names a collection's document type and carries its version, defaults, migration steps and normalize."
---

# schema

`schema<T>()` names a collection's document type and carries its version, its defaults, the migration steps between versions, and a `normalize` that runs over every write.

## Import

```ts
import { schema } from '@bedrock-core/db';
import type { Schema, DocumentSchema, MigrateStep, DeepPartial } from '@bedrock-core/db';
```

Also re-exported from `@bedrock-core/server`.

## Signature

```ts
schema<T extends object>(definition?: DocumentSchema<T>): Schema<T>
```

## Parameters

| Option | Type | Default | Description |
|---|---|---|---|
| `version` | `number` | `1` | The version documents are stored at |
| `defaults` | `DeepPartial<T>` | — | Filled on read, at every depth, and never stored |
| `migrate` | `Record<number, MigrateStep>` | — | A step per version, keyed by the version it produces |
| `normalize` | `(doc: T) => T` | — | Runs over every write; what it returns is what is stored |

```ts
type MigrateStep = (doc: Record<string, unknown>) => Record<string, unknown>;
```

## Returns

A `Schema<T>` — the definition, branded with the document type so a collection infers `T` from it.

## Usage

```ts
interface ElevatorDoc { configured: boolean; facing: 'north' | 'east' | 'south' | 'west'; floors: number[] }

const elevatorSchema = schema<ElevatorDoc>({
  version: 3,
  defaults: { configured: false, facing: 'north', floors: [] },
  migrate: {
    2: doc => ({ ...doc, facing: doc.facingDirection ?? 'north' }),
    3: ({ legacyMode: _, ...rest }) => rest,
  },
  normalize: doc => ({ ...doc, floors: doc.floors.slice(0, 16) }),
});
```

## Versions and migrations

Every document is stored as `{"v":<version>,"d":{…}}`. The version travels with the bytes, so a document written at version 1 and read by a version-3 schema runs the step for `2`, then the step for `3`, and is rewritten once at 3. Migration is **lazy and per document**: a player who joins two versions late migrates as they load, and nothing sweeps the world at boot.

A step takes the stored document as the previous version wrote it — overrides only, defaults not filled — and returns the next shape. A step that throws quarantines that one document under `<key>#bad` rather than failing the read.

## Defaults

`defaults` fill missing keys on read, at every depth, and are never stored: a document holding `{ facing: 'east' }` reads as `{ configured: false, facing: 'east', floors: [] }`, and its bytes stay one key. A `patch` that sets a key to `undefined` deletes it, which puts it back to its default.

## `normalize`

`normalize` runs over the merged document on every write — `set`, `patch`, a write a peer's RPC handler makes — and what it returns is what is stored. It is the one place to clamp a value, drop one that should not be kept, or keep what is at a default out of the bytes; config's schema uses it to coerce every value to its entry and store only what differs from the default.

## Notes

- The document type comes from `schema<T>()`; `collection` takes no type argument.
- Deep semantics — merge, fill, delete on `undefined` — treat plain objects as structure and everything else, arrays included, as a value.
