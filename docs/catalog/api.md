---
sidebar_position: 3
description: "Every export of @bedrock-core/catalog."
---

# API

| Export | Kind | Description |
| --- | --- | --- |
| `registerCatalog(options?)` | function | The field `core.register()` takes: installs the command and registered navigation entry, and hands back a `Catalog` |
| `CatalogOptions` | type | `{ commands?: boolean }` |
| `Catalog` | type | `{ open(player, addonId?) }`, what the field hands back |
| `CatalogDeclaration` | type | What the field hands `register()`: the installer, `app: 'catalog'` and the `compiled` module the build bakes |
| `CATALOG_PAGE_AREA` | constant | The addon page rectangle within the shared frame: `x`, `y`, `width` and `height` |
| `catalogOf(core)` | function | This realm's `Catalog`, or `undefined` when this addon installed none |

## `@bedrock-core/catalog/compiled`

What the ui-compiler stage bakes: the catalog screen and the page the manifest becomes.

| Export | Kind | Description |
| --- | --- | --- |
| `AddonPage` | component | The addon page, for a pack that bakes one no manifest describes |
| `AddonPageInfo` | type | What the page draws: `packName`, `version`, `creator`, and optionally `creatorName`, `description`, `icon`, `thumbnail` |

## `@bedrock-core/catalog/integration`

| Export | Kind | Description |
| --- | --- | --- |
| `CATALOG_PAGE_AREA` | constant | The same page rectangle exported by `@bedrock-core/catalog`, for use as `Embed`'s `area` |
| `registerCatalogPage(Page)` | function | Schedule publication from the default Core runtime |
| `publishCatalogPage(runtime, Page)` | function | Publish from an explicitly registered runtime |
| `pages(runtime)` | function | Read and publish addon page references |
| `addonPageReference(Page)` | function | Derive reserved page values and entry-point targets |
| `isAddonPageReference(value)` | type guard | Validate an addon-page reference envelope |
| `pageTargeted(name)` | function | Mark a compiled page button with an entry-point name |
| `PagesRegistry` | class | Publish and discover addon page announcements |
| `AddonPageReference` | type | Reserved values and entry-point targets for an addon page |
| `PageTarget`, `TargetedPress` | types | Entry-point name and the handler that describes it |

These functions can be used without installing a catalog browser.
