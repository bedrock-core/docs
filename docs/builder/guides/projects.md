---
sidebar_position: 2
description: "Configure a project containing one pack, a linked pack set or several independent addons."
---
# Projects and packs

Name each source pack in `config.json` and give it an export destination in the profile you build.

## One pack

A resource-only project needs one entry:

```json
{
  "packs": { "textures": "./packs/textures" },
  "bedrockCore": {
    "formatVersion": "1.0.0",
    "profiles": {
      "build": { "export": { "textures": "./build/textures" } }
    }
  }
}
```

These fields are part of the full configuration shown in [Build a pack](./quick-start.md). A behavior-only project uses the same structure with a behavior pack manifest.

## Several packs

Each ID refers to one manifest-bearing source directory. IDs and folder names are independent of Minecraft module types.

```json
{
  "packs": {
    "gameplay": "./packs/gameplay",
    "shop": "./packs/shop",
    "textures": "./packs/textures"
  },
  "bedrockCore": {
    "formatVersion": "1.0.0",
    "profiles": {
      "build": {
        "export": {
          "gameplay": "./build/gameplay",
          "shop": "./build/shop",
          "textures": "./build/textures"
        }
      }
    }
  }
}
```

Packs can belong to the same addon or be independent outputs. Builder does not pair packs by their order or names.

## Link packs that belong together

Builder supports an optional `pack` shorthand for dependencies between packs in the same project. This is a Builder extension used in source manifests. Minecraft reads the [native dependency format](https://learn.microsoft.com/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable#dependencies), which identifies packs by UUID and version.

In your existing `packs/gameplay/manifest.json`, add the entry to the top-level `dependencies` array, alongside `header` and `modules`. This fragment shows only that section; keep the rest of your manifest:

```json title="packs/gameplay/manifest.json (source fragment)"
{
  "dependencies": [
    { "pack": "textures" }
  ]
}
```

`textures` is the ID from `config.json`'s `packs` map above. Builder reads that pack's manifest and replaces the shorthand with its header UUID and version in the exported manifest. Your authored manifest keeps the shorthand.

For example, if the texture pack's header UUID is `230ec717-a663-44e4-8fb4-b4a3c6ec7ad3` and its version is `1.0.0`, the exported gameplay manifest contains:

```json title="build/gameplay/manifest.json (exported fragment)"
{
  "dependencies": [
    {
      "uuid": "230ec717-a663-44e4-8fb4-b4a3c6ec7ad3",
      "version": "1.0.0"
    }
  ]
}
```

The shorthand saves copying local pack UUIDs and keeping dependency versions in sync. Standard UUID dependencies also work for local packs; Builder recognizes configured packs by their header UUIDs. Use UUID dependencies for external packs and `module_name` dependencies for Minecraft scripting APIs.

Features that write both runtime and client resources use these relationships. If an owner has several candidate resource dependencies, choose its `owner` and `resourcePack` in that stage's settings. Unrelated packs remain independent.

## Export complete builds

Every configured pack needs a destination in the selected profile. Paths resolve from `config.json`; development paths can use environment variables such as `%APPDATA%`.

Export to a local build folder for distribution and [BDS tests](/docs/bds-runner/cli#what---packs-accepts). Use another profile to export to Minecraft's development folders. Output paths must not overlap authored sources.

## Next steps

- [Configuration](./configuration.md) — metadata, profiles and export rules
- [Generate JSON](./generating-json.md) — create content within a pack
- [Built-in processing](./stages.md) — choose feature owners and settings
