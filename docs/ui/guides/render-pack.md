---
sidebar_position: 7
description: "Install the shared UI textures supplied with every UI release."
---

# Shared resource pack

The shared resource pack supplies the textures used by Bedrock Core UI.

## Install the assets

Import `core-ui-<UI version>.mcpack` from the matching UI release and enable it alongside
your addon. The [CLI](/docs/cli) downloads this asset when creating a project.

The shared pack UUID is `761ecd37-ad1c-4a64-862a-d6cc38767426`. The behavior pack declares
the required asset version in its manifest:

```json
{
  "dependencies": [
    {
      "uuid": "761ecd37-ad1c-4a64-862a-d6cc38767426",
      "version": "1.12.1"
    }
  ]
}
```

Every UI release includes a resource-pack artifact, even when its textures are unchanged.
The pack major is the UI library major plus one; its minor, patch and any prerelease
suffix match the library version. UI `0.12.1`, for example, ships pack `1.12.1`.

## Next steps

- [Installation](../installation.md) — install the libraries and shared textures
- [UI compiler](/docs/builder/guides/stages#ui-compilation) — configure the addon build
