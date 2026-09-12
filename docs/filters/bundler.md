---
sidebar_position: 9
description: "Bundles the behavior pack's TypeScript into one main.js with esbuild."
---
# bundler

Bundles the TypeScript under `BP/scripts/` into the single `main.js` Minecraft executes, with esbuild. It reads your `tsconfig.json`, inlines the generated bundles the other filters emit, and strips the sources from the output.

## Install

```bash
regolith install bundler
```

It runs last, after every filter that writes something the scripts import:

```jsonc title="config.json"
{
  "regolith": {
    "profiles": {
      "default": {
        "filters": [
          { "filter": "guides" },
          { "filter": "i18n" },
          { "filter": "ui-compiler" },
          { "filter": "bundler" }
        ]
      }
    }
  }
}
```

The project needs a `tsconfig.json` and a `package.json` at its root, and the scripts under `packs/BP/scripts/`. Install dependencies from the project root with any package manager.

## Authoring

Write the addon as ordinary TypeScript modules. The `@bedrock-core` packages ship TypeScript sources — their `exports` maps point at `src/*.ts` — and the bundler compiles them along with your code, so nothing in `node_modules` needs a build step of its own.

**The entry point** is resolved from `tsconfig.json`: the first entry of `files` if set, else `main.ts` or `index.ts` under the first `include` pattern, else `BP/scripts/main.ts` or `BP/scripts/index.ts`. Paths are adjusted to Regolith's temp workspace automatically. The build bundles to one file, so it needs one entry point.

**JSX** is configured from `jsxImportSource` in `tsconfig.json`, or its `extends` chain. A project using `@bedrock-core/ui` sets it once and needs no esbuild options:

```jsonc title="tsconfig.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@bedrock-core/ui",
    "files": ["packs/BP/scripts/main.ts"]
  }
}
```

**Generated bundles** reach the scripts through `paths` aliases. An alias whose target lives under `packs/data/` is resolved against the temp workspace rather than the real disk, because those files exist only during a build:

```jsonc title="tsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "@bedrock-core/generated/i18n": ["./packs/data/i18n/i18n.generated.json"],
      "@bedrock-core/generated/guides": ["./packs/data/guides/guides.generated.json"]
    }
  }
}
```

Every other alias, and everything in `node_modules`, goes through esbuild's own tsconfig resolver.

**Minecraft modules** are never bundled. `@minecraft/server`, `@minecraft/server-ui`, `@minecraft/server-gametest`, `@minecraft/server-net`, `@minecraft/server-admin` and `@minecraft/debug-utilities` stay external, provided by the game at runtime.

## What it generates

| Output | Where | Commit it? |
| --- | --- | --- |
| `main.js` | `BP/scripts/` in the temp workspace | no |
| `main.js.map` | beside it, `debug` only | no |
| build metadata | beside it, `debug` only | no |

The output is ESM, targeting the `target` in `tsconfig.json` (default `es2020`), minified unless `debug` is on. After bundling, every `.ts` file and folder under `BP/scripts/` is removed from the output so sources never ship.

`debug: true` keeps the output readable: source maps, no minification, function names preserved, verbose logging and build metadata.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `tsConfigPath` | `string` | `"tsconfig.json"` | Path to the tsconfig to read, relative to the project root |
| `debug` | `boolean` | `false` | Source maps, no minification, preserved names, verbose output |

## Checks

| Message | Fix |
| --- | --- |
| `tsconfig.json not found` | Create it at the project root, beside `config.json`, or point `tsConfigPath` at it |
| `No entry point found` | Set `files` in `tsconfig.json` to the entry, or create `BP/scripts/main.ts` |
| `Build output file not created` | A compile error stopped esbuild; its own output names the file and line |
