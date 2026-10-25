---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/guides shows an addon's in-game guide: MDX compiled to screens, drawn from the pack in each player's language."
---

# guides

`@bedrock-core/guides` shows an addon's **in-game guide**. You author MDX, and the [`guides` builder stage](/docs/builder/guides/stages#guides) compiles each audience's readable pages into resident forms. Sidebar rows, previous/next controls and inline links switch prepared pages on the client. Repeated pages collapse loops, and visits beyond five Back destinations discard the oldest history without refreshing the form.

Generated entries use [`guideNavigationScreen`](./api.md#resident-screen-runtime), with initial pages for direct entry and shared stack checkpoints for restoration.

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

`registerGuides()` discovers the guide's compiled entries and registers its public navigation destination. Its optional `{ commands: false }` setting disables the command while keeping `guides.open()` available.

Prose rides `.lang` values, so the client resolves every paragraph in each player's own language and the runtime's raw-text length limits never apply to guide copy.

## Install

<Install pkg="@bedrock-core/guides" />

The package has two halves, both on the root export. The **app** is the declaration, the command and the show method, like the other apps. The **renderer** is the compiled screen factories the stage's generated modules call.

It runs beside `@bedrock-core/server` and `@bedrock-core/ui`.

## What you get

- **A command under your own namespace.** `<ns>:guide` opens this addon's guide at its entry, in the set the player may read. Pass `registerGuides({ commands: false })` to keep the name out of the command list and open it from a book or a block instead.
- **A guide any realm can open.** `guides.open(player, addonId)` reaches the owning addon's registered guide destination through server navigation. Static page layouts can also be shown from published references; resident layouts run in their owning realm.
- **Linked-page Back.** Links open a deeper page; Previous/Next replaces the page at that level. Back returns through the retained visits, then to the caller or closes. Index returns to the guide index at the root. Server checkpoints retain the confirmed stack.
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
- [Localizing a guide](./localization.md) — structural keys, translated pages and the `.lang` section the stage writes
- [API](./api.md) — every export of both halves
- [guides builder stage](/docs/builder/guides/stages#guides) — stage configuration and output
- [catalog](/docs/catalog) — where a guide's entry is drawn for every addon
