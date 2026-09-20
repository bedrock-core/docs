---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/guides shows an addon's in-game guide: MDX compiled to screens, drawn from the pack in each player's language."
---

# guides

`@bedrock-core/guides` shows an addon's **in-game guide**. You author MDX, the [`guides` Regolith filter](/docs/filters/guides) compiles one screen per page into the addon's pack, and this package shows them: sidebar, pages, prev/next, admonitions and all.

![An in-game guide page rendered MDX](/img/ui/guide-page.png)

:::caution Beta
`@bedrock-core/guides` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## Usage

Pass `registerGuides()` as the `guides` field, then open the guide for a player:

```ts
import { core } from '@bedrock-core/server';
import { registerGuides } from '@bedrock-core/guides';

const { guides } = core.register({ manifest, guides: registerGuides() });

guides.open(player);
```

`registerGuides()` takes no arguments. The filter already read the MDX under your `guides/` directory and compiled one screen per page into your pack, at a fixed path in a fixed form, so the field's presence is the whole declaration.

Prose rides `.lang` values, so the client resolves every paragraph in each player's own language and the runtime's raw-text length limits never apply to guide copy.

## Install

<Install pkg="@bedrock-core/guides" />

The package has two halves, both on the root export. The **app** is the declaration, the command and the show method, like the other apps. The **renderer** is the compiled screen factories the filter's generated modules call.

It runs beside `@bedrock-core/server` and `@bedrock-core/ui`.

## What you get

- **A command under your own namespace.** `<ns>:guide` opens this addon's guide at its entry, in the set the player may read. Pass `registerGuides({ commands: false })` to keep the name out of the command list and open it from a book or a block instead.
- **A guide any realm can show.** A guide is compiled screens whose every press is a link, so a realm shows one from the references its owner published, with none of that addon's script involved. `guides.open(player, addonId)` opens another addon's guide the same way it opens your own.
- **A way back.** The index a player reaches from somewhere carries a back control. Backing out returns to the addon's page in the [catalog](/docs/catalog) when this realm has one, and closes the UI when it does not.
- **An entry in the catalog, only when there is a guide.** The app announces itself on the first tick after checking the build actually compiled pages, so an addon with the app installed and no guide written gets a grayed entry rather than an empty index.

## Where a guide opens

| Manifest | Opens on | Sidebar |
| --- | --- | --- |
| Several pages, no `home` | the index | yes |
| Several pages, `home: true` on a page | that page | yes, one press away |
| A single page | that page | no index at all |
| A `home` naming no page | the index | yes (ignored, not an error) |

`home` is set in a page's frontmatter and pairs naturally with `hidden: true`, since a landing page is usually not also a sidebar row. In a guide with [operator-only pages](./authoring.md#operator-only-pages) the table is read per audience: a home page only operators may see is no home to anyone else.

## Next steps

- [Authoring a guide](./authoring.md) — frontmatter, categories, what the renderer makes of each block, links, operator-only pages and embedded components
- [Localizing a guide](./localization.md) — structural keys, translated pages and the `.lang` section the filter writes
- [API](./api.md) — every export of both halves
- [guides Regolith filter](/docs/filters/guides) — installing the filter and its settings
- [catalog](/docs/catalog) — where a guide's entry is drawn for every addon
