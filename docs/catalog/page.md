---
sidebar_position: 2
description: "The page every addon publishes for its row in the catalog: drawn from its manifest, baked in its own pack, answered by its own realm."
---

# The addon page

Every addon that installs the catalog has a page in it. The page follows from the manifest, so the build compiles it and the realm publishes it; nothing about it is written by hand.

## What is on it

The page fills the area beside the addon list: the addon's icon, its display name, its version, two buttons, its description in a card, and its authors. An addon that ships a `thumbnail` gets it as a banner behind the top of the page.

Every string on it is a localization key the client resolves from the addon's own `.lang`, and every texture is the addon's own, so the realm drawing the catalog carries none of it. That is what makes the page the addon's to bake and the catalog's to place.

| Manifest field | On the page |
| --- | --- |
| `packName` | the name, large |
| `version` | under the name |
| `icon` | the square icon above the name |
| `thumbnail` | the 16:9 banner, when set |
| `description` | the card |
| `creatorName`, or `creator` | after "Author(s):" |

## Where it comes from

The ui-compiler filter reads the manifest out of `core.register()` and writes a module that asks this package's `shape` for the page; that builds it and registers it, beside the addon's other compiled screens. The realm reads it back on the first tick and publishes its **reference**: per reserved entry, the value it is shown with and where a press leads. That is all another realm needs to draw the page out of the pack every client already holds.

The page is generated for an addon that installed any of the three apps. An addon that installed none publishes no page, and its row shows the fallback area, the name and version alone.

## Where a press goes

The two buttons name the app they open, `config` and `guide`, and the realm routes the press: to the local app when this addon installed it, otherwise to the owning addon's realm over that app's own show method. The catalog never imports either app; it writes a name into a slot and the [realm](/docs/navigation/realm) does the rest.

An entry is drawn live when the owning addon announced that it serves the app, and grayed when it did not, so a press never leads at a request that would be refused.

## The framework's own page

The framework itself has a row and a page, but no realm: nothing calls `core.register()` on its behalf, so it cannot publish anything. Its page and its guide are baked into the render pack instead, and this package carries the table the render pack's build emits. It offers a guide and has no settings.

## The geometry

The catalog draws the frame and the addon's page draws into an area of it. Both packs have to agree on where that area is and how many entries the page may take, and neither can ask the other at runtime. These are that agreement:

| Constant | Value | What it fixes |
| --- | --- | --- |
| `MAIN` | `{ x, y, width, height }` | The area beside the addon list the page draws into |
| `PAGE_SLOTS` | `8` | Entries reserved for the page: the marker, then its own presses |
| `SIDEBAR_WIDTH` | `120` | The addon list's width |
| `ADDONS_MAX` | `12` | Rows the addon list is baked with; a world with more addons shows the first |

The card around everything, its border and header, is [`@bedrock-core/ore-styled`](/docs/ore-styled)'s, shared with every other screen in the family. Changing one of these changes what every page built against it draws into.

## Next steps

- [API](./api.md) — `AddonPage`, `AddonPageInfo`, and the rest
- [References](/docs/navigation/references) — the feed a page's reference travels on
