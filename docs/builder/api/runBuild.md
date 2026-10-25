---
sidebar_position: 34
description: "Build an isolated staged project and publish all packs after successful validation. Plugins execute as trusted Node code. Build failures retain the previous export."
---
# runBuild

Build an isolated staged project and publish all packs after successful validation. Plugins execute as trusted Node code. Build failures retain the previous export.

## Import

```ts
import { runBuild } from '@bedrock-core/builder/runner';
```

## Signature

```ts
function runBuild(options: BuildOptions): Promise<BuildResult>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `BuildOptions` | — | Project inputs, settings and optional integrations for this operation |

## Returns

Successful export destinations, validation coverage and execution records.

## Usage

```ts
import { runBuild } from '@bedrock-core/builder/runner';

const result = await runBuild({ configPath: './config.json', profile: 'build' });
console.warn(result.outputPaths);
```

## Notes

Each invocation creates an on-disk temporary project copy. Stages and plugins transform its files sequentially, then final validation runs before pack export. The workspace is removed when the invocation finishes or fails. [How builds run](../guides/build-process.md) describes module and script file access. Additional artifact checks run before final manifest and content validation.
