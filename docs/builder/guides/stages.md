---
sidebar_position: 7
description: "Understand the built-in processing that turns authored files into Minecraft pack output."
---
# Built-in processing

Builder runs the processing needed by the files in your project. Each stage works on temporary copies and passes its output to the next stage.

| Stage | What it does | Learn more |
| --- | --- | --- |
| `manifest` | Resolves manifest variants, project metadata and local pack dependencies | [Projects and packs](./projects.md) |
| `generator` | Evaluates TypeScript content templates and writes Minecraft JSON | [Generate JSON](./generating-json.md) |
| `guides` | Compiles Markdown and MDX into in-game guide pages | [Guide authoring](/docs/guides/authoring) |
| `i18n` | Compiles translation modules into language files and runtime data | [Translation authoring](/docs/i18n/authoring) |
| `ui-compiler` | Compiles JSX screens and application UI into pack resources | [UI compiler](/docs/ui/compiler) |
| `bundler` | Bundles the JavaScript or TypeScript entries declared by script manifests | [Script settings](./configuration.md) |

## Select stages

Omit `stages` to detect inputs automatically. Disable a stage with `false`, or supply an options object to enable it with those settings:

```json
{
  "stages": {
    "generator": false,
    "bundler": { "debug": true }
  }
}
```

These fields belong inside a profile. Stages run in the table's order; content generated earlier is available to later stages.

## Manifest

Use `manifestPath` to select a variant such as `packs/gameplay/manifest.test.json`. A variant can extend `./manifest.json`; objects merge, while arrays and scalar values replace the inherited values. Restate the complete `modules` and `dependencies` arrays when changing them.

## Generator

A default-exported object produces one JSON file. A `[name, content, values]` tuple produces several files. [Generate JSON](./generating-json.md) covers source locations, editor types and both patterns.

## Guides

Place guides under their owning pack's `guides/` directory. Guide and UI compilation require the matching runtime packages in the project.

## Translations

Place locale modules under the owning pack's `i18n/` directory. Set `client: false` when translations are needed only by scripts.

## UI compilation

UI, guides and client translation output use manifest dependencies to find the owner's resource pack. Set `owner` and `resourcePack` when a project has several possible destinations. A resource pack is required only for features that emit client resources.

## Script bundling

Each manifest script module supplies its entry, such as `scripts/main.js`. Builder finds the corresponding authored TypeScript or JavaScript source and emits the declared JavaScript file. Source TypeScript is omitted from the exported pack.

Native Minecraft server API imports remain external. JavaScript helper packages, including `@minecraft/vanilla-data` and `@minecraft/math`, are bundled into the script.

## Next steps

- [Generate JSON](./generating-json.md) — write typed Minecraft content
- [Configuration](./configuration.md) — look up stage settings
- [Plugins](./plugins.md) — add custom processing
