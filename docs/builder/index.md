---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "Build one or many Minecraft Bedrock packs from a JavaScript or TypeScript project."
---
# builder

Build Minecraft Bedrock packs from JavaScript, TypeScript and ordinary pack assets.

A project can contain one resource pack, one behavior pack or any combination of packs. Builder transforms copied source files, validates the result and exports each pack to its configured destination. Your authored files stay intact.

## Install

Use Node.js 22.18 or newer:

<Install pkg="@bedrock-core/builder" dev />

Run the installed `bc-builder` executable through your package manager. [Build a pack](./guides/quick-start.md) provides a complete resource-only example; the [CLI](/docs/cli) creates a configured starter.

## Build and watch

```json title="package.json"
{
  "scripts": {
    "build": "bc-builder build config.json build",
    "watch": "bc-builder watch config.json default"
  }
}
```

Profiles choose the output paths and build settings. Watch mode rebuilds after input changes. Unchanged compilations are reused when their dependencies still match.

## What gets built

| Your source | Minecraft output |
| --- | --- |
| Pack manifests and ordinary assets | Validated pack files |
| TypeScript JSON templates | JSON blocks, entities, recipes and other content |
| Markdown and MDX guides | In-game guide pages |
| Translation modules | Language files and typed runtime translations |
| JSX screens | Compiled UI and runtime registrations |
| JavaScript and TypeScript scripts | The script modules declared by each manifest |

Only the processing needed by your inputs runs automatically. [Built-in processing](./guides/stages.md) explains the inputs and settings for each stage.

## Extend a build

Use a [plugin](./guides/plugins.md) for custom processing with pack information and build services. Existing Node-based Regolith filters can use the [Node script adapter](./guides/node-scripts.md), which maps their conventional folders onto selected project packs.

## Next steps

- [Build a pack](./guides/quick-start.md) — run a first build
- [Projects and packs](./guides/projects.md) — organize one or many packs
- [Generate JSON](./guides/generating-json.md) — write typed content and generate variants
- [Watch and cache](./guides/watch.md) — rebuild during development
- [Configuration](./guides/configuration.md) — look up profile and export settings
