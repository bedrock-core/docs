---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/catalog is the addon browser: every addon in the world, each with the page it published."
---

# catalog

`@bedrock-core/catalog` is the **addon browser**: every bedrock-core addon in the world, each with the page it published.

![The catalog: the addon list on the left, one addon's page beside it](/img/ui/addon-list.png)

:::caution Beta
`@bedrock-core/catalog` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## Usage

Pass `registerCatalog()` as the `catalog` field, then open the list for a player:

```ts
import { core } from '@bedrock-core/server';
import { registerCatalog } from '@bedrock-core/catalog';

const { catalog } = core.register({ manifest, catalog: registerCatalog() });

catalog.open(player);
```

`registerCatalog()` takes no arguments: the list is the [registry](/docs/server/api/registry), and each page is what its addon published.

## Install

<Install pkg="@bedrock-core/catalog" />

It runs beside `@bedrock-core/server` and `@bedrock-core/ui`.

## What you get

- **A command.** `<namespace>:catalog` opens the list with this addon selected. `registerCatalog({ commands: false })` leaves the command out, so you can open it from an item or a block instead.
- **Every addon in the world.** Each addon that called `core.register()`, in the same order everywhere, with the framework last.
- **Each addon's page, drawn from its own pack.** The [page](./page.md) is built from the addon's manifest, so an addon with no catalog of its own still has one.

## Next steps

- [The addon page](./page.md) — what is on it, where it comes from, and where its presses go
- [API](./api.md) — every export
- [`core.registry`](/docs/server/api/registry) — the addons the catalog lists
- [The realm](/docs/navigation/realm) — how a press reaches the realm that answers it
