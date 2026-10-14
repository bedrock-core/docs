---
sidebar_position: 42
description: "Build immediately, then coalesce filesystem changes into sequential rebuilds."
---
# watchBuild

Build immediately, then coalesce filesystem changes into sequential rebuilds.

## Import

```ts
import { watchBuild } from '@bedrock-core/builder/watch';
```

## Signature

```ts
function watchBuild(options: WatchOptions): Promise<void>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `WatchOptions` | — | Project inputs, settings and optional integrations for this operation |

## Returns

Resolves when watching stops; the signal cancels active work and closes watchers.

## Usage

```ts
import { watchBuild } from '@bedrock-core/builder/watch';

const controller = new AbortController();
process.once('SIGINT', () => controller.abort());
await watchBuild({
  configPath: './config.json',
  signal: controller.signal,
  onBuild: result => console.warn(result.outputPaths),
  onError: error => console.warn(error),
});
```

## Notes

Rebuilds are sequential. Build failures are reported through onError and do not stop watching. Export paths and cache directories are excluded.
