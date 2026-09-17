---
sidebar_position: 3
description: "Every export of @bedrock-core/catalog."
---

# API

| Export | Kind | Description |
| --- | --- | --- |
| `registerCatalog(options?)` | function | The field `core.register()` takes: installs the command, the show method and the announcement, and hands back a `Catalog` |
| `CatalogOptions` | type | `{ commands?: boolean }` |
| `Catalog` | type | `{ open(player, addonId?) }`, what the field hands back |
| `CatalogDeclaration` | type | What the field hands `register()`: the installer, `app: 'catalog'` and the `compiled` module the build bakes |
| `catalogOf(core)` | function | This realm's `Catalog`, or `undefined` when this addon installed none |

## `@bedrock-core/catalog/compiled`

What the ui-compiler filter bakes: the catalog screen and the page the manifest becomes.

| Export | Kind | Description |
| --- | --- | --- |
| `AddonPage` | component | The addon page, for a pack that bakes one no manifest describes |
| `AddonPageInfo` | type | What the page draws: `packName`, `version`, `creator`, and optionally `creatorName`, `description`, `icon`, `thumbnail` |
