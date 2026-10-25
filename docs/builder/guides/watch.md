---
sidebar_position: 8
description: "Use serial watch rebuilds and verified local compilation and validation caches."
---
# Watch and cache

Watch mode builds immediately and coalesces authored input changes into sequential rebuilds.

## Watch inputs

Select a profile:

<PackageCommands
  npm="npx bc-builder watch config.json development"
  yarn="yarn bc-builder watch config.json development"
  pnpm="pnpm exec bc-builder watch config.json development"
/>

The watcher observes project sources, configuration, detected compiler inputs and plugin-registered dependencies. Add extra project-relative files or directories through `watch.paths`.

```json
{
  "watch": {
    "debounceMs": 100,
    "paths": ["./plugins", "./templates/shared.json"]
  }
}
```

Build failures report diagnostics and keep watching. Changes during a build queue another build; they do not run a second build concurrently. Ctrl+C closes watchers and cancels the active build.

Export destinations, `.git`, `node_modules`, caches and temporary workspaces are ignored. Explicitly discovered dependency files inside `node_modules` can still be observed. Outputs from earlier profile configurations remain excluded after config edits.

## Reuse

The profile's `cache` option defaults to `true`. Compilations track content, compiler settings, generated imports and module-resolution dependencies. Missing candidates are tracked because adding a file can change which module an import resolves to.

Unchanged scripts, templates, locale modules, guide pages, screens and final JSON checks can reuse verified results. Every rebuild creates a fresh [temporary workspace](./build-process.md#temporary-workspace), restores reusable output into it and performs final checks before export. Changed screen sets are linked together, including unchanged screens.

Set `cache: false` to disable reuse for a profile. Local records live under `.bedrock-core/cache` and should not be committed. Module plugins and standalone scripts still execute when their steps participate.

## Limits

Watch mode uses native filesystem notifications on a local filesystem and has no polling fallback. Staged plugin paths are temporary; register authored dependencies or add `watch.paths` for inputs outside normal discovery.

## Next steps

- [`watchBuild`](../api/watchBuild.md) — cancellation and build/error callbacks
- [Plugins](./plugins.md) — dependency registration
- [Configuration](./configuration.md) — profile settings
