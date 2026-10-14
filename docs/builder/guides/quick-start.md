---
sidebar_position: 1
description: "Configure and build a resource pack with a named export destination."
---
# Build a pack

Create a project containing `config.json` and a pack directory.

## Configure the project

```json title="config.json"
{
  "$schema": "./node_modules/@bedrock-core/builder/schemas/config.schema.json",
  "targetVersion": "1.26.50",
  "namespace": "example_assets",
  "name": "Example assets",
  "description": "Textures for an addon",
  "authors": ["Example"],
  "packs": { "assets": "./packs/RP" },
  "bedrockCore": {
    "formatVersion": "1.0.0",
    "profiles": {
      "default": { "export": { "assets": "./build/RP" } }
    }
  }
}
```

Pack IDs are arbitrary names. This project uses `assets`; its manifest determines that it is a resource pack.

## Add the manifest

Builder accepts manifest v3 with string versions. Give each pack and module its own UUID. See the [Microsoft manifest reference](https://learn.microsoft.com/minecraft/creator/reference/content/addonsreference/packmanifest).

```json title="packs/RP/manifest.json"
{
  "format_version": 3,
  "header": {
    "name": "Example assets",
    "description": "Textures for an addon",
    "uuid": "9155af73-4063-4f9c-83ef-ff017d3ed7a2",
    "version": "1.0.0",
    "min_engine_version": "1.26.50"
  },
  "modules": [{
    "type": "resources",
    "uuid": "230ec717-a663-44e4-8fb4-b4a3c6ec7ad3",
    "version": "1.0.0"
  }]
}
```

Place ordinary resource assets under `packs/RP`. No plugin or stage settings are needed for this asset-only pack.

## Build

After [installing builder](../index.md#install), add the project command:

```json title="package.json"
{ "scripts": { "build": "bc-builder build config.json" } }
```

Run `npm run build`, `yarn build` or `pnpm build`. Builder copies the project into a temporary folder, transforms and validates the copied pack, then exports it to `build/RP`. The temporary folder is removed after the build; a failed validation retains the previous export. [How builds run](./build-process.md) explains the full sequence.

Ignore `build/` and `.bedrock-core/` in version control. The latter contains generated editor declarations and local cache records.

## Next steps

- [How builds run](./build-process.md) — the temporary workspace and execution order
- [Configuration](./configuration.md) — multiple packs and profile destinations
- [Stages](./stages.md) — templates, scripts and generated content
- [Watch and cache](./watch.md) — rebuild after authored inputs change
