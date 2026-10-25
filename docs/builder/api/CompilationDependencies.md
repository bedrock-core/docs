---
sidebar_position: 9
description: "Track inputs and missing candidates that can change script module resolution."
---
# CompilationDependencies

Collect module-resolution dependencies for compiler caching and watch integration.

## Import

```ts
import { CompilationDependencies } from '@bedrock-core/builder-bundler/dependencies';
```

## Signature

```ts
new CompilationDependencies(root: string, config?: string)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `root` | `string` | — | Project directory for compiler configuration |
| `config` | `string` | — | Optional tsconfig path relative to root |

## Members

| Member | Behavior |
| --- | --- |
| `files` | Set of observed input paths and missing candidates |
| `candidates(file)` | Track a resolved path, alternative extensions, index files and package metadata |
| `imports(specifier, directory)` | Track relative, package and tsconfig-alias resolution candidates |
| `parents(directory)` | Track ancestor package metadata |

## Notes

Missing candidates matter: adding a file can change which module a later build resolves. This class collects dependency paths; it does not watch them or compile an entry.
