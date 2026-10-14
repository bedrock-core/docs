---
sidebar_position: 4
description: "The shared module contract for built-in stages and external Node plugins."
---
# BuildPlugin

A module owns processing, optional input detection and source-directory declarations.

## Import

```ts
import type { BuildPlugin } from '@bedrock-core/builder-plugin';
```

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `run` | `BuildStep` | Required operation receiving context and settings |
| `detect` | `(context, settings) => BuildDetection \| Promise<BuildDetection>` | Optional input probe used in automatic mode |
| `inputDirectories` | `(context, settings) => readonly string[] \| Promise<readonly string[]>` | Optional non-template source directories reserved before generation |

`BuildStep` returns `void`, `{ cached?, reason? }` or a promise of either. Throwing or rejecting prevents export. `BuildDetection` contains `needed: boolean` and `reason: string`; detection must inspect inputs without evaluating resource modules.

## Usage

```ts
import type { BuildPlugin } from '@bedrock-core/builder-plugin';

export const detect: BuildPlugin['detect'] = (context) => ({
  needed: Object.keys(context.packs).length > 0,
  reason: 'configured packs',
});

export const run: BuildPlugin['run'] = async (context) => {
  context.signal?.throwIfAborted();
  context.registerDependency('config.json');
};
```

## Notes

Export these functions as named module exports. [Plugin definitions](../guides/plugins.md) identify the module and profile boundary. External steps run unconditionally unless they select `mode: "auto"`; a module without a detector runs in either mode.

Built-in packages expose this contract through their `./plugin` entry points. The host supplies [BuildContext](./BuildContext.md) services and manages ordering, staging, validation and publication.
