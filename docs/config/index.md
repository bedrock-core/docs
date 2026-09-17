---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/config is an addon's settings and the screens that edit them."
---

# config

`@bedrock-core/config` is an addon's **settings and the screens that edit them**: a schema in three scopes, stored as documents, and editable in game and from chat.

![An addon's settings screen, built from its config schema](/img/ui/config-screen.png)

:::caution Beta
`@bedrock-core/config` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## Usage

Declare each scope's settings in `registerConfig()`, then read a value or open the screens for a player:

```ts
import { core } from '@bedrock-core/server';
import { registerConfig } from '@bedrock-core/config';

const { config } = core.register({
  manifest,
  config: registerConfig({
    server: { announce: { type: 'boolean', label: 'Announce deaths', default: true } },
    player: { theme: { type: 'select', label: 'Theme', default: 'dark', options: ['dark', 'light'] } },
  }),
});

config.server.announce.get();
config.open(player);
```

Nothing else runs. The definition installs the scopes, the ui-compiler filter reads it out of this very call to shape one screen per section, and the install registers the commands and serves the show method another realm asks on.

The subsystem itself, the scopes, the entry types, storage, cross-addon reads and authorization, is documented on [its own page](/docs/config/settings); this section is about what the screens and the commands make of it.

## Install

<Install pkg="@bedrock-core/config" />

It runs beside `@bedrock-core/server` and `@bedrock-core/ui`.

## What you get

- **Screens shaped for your schema.** One compiled screen per section, baked into your own pack at build. A level of only groups is a screen of buttons, a level with a field is a form, and a list gets an editor of its own. Nothing about a section travels at runtime; only the values do.
- **Two commands under your own namespace.** `<ns>:config` for a player's own settings and `<ns>:configat` for an operator reaching any scope, with generated autocomplete for every verb and every setting. Turn them off with `registerConfig(definition, { commands: false })`.
- **Each addon draws its own settings.** A command or `config.open()` naming another addon hands the screens to that addon's realm, which draws them from its own pack and values, and the player comes back.
- **Strings you can override.** Every label, hint and command reply is a `core.*` key folded into your bundle, so a rename or a locale you ship reaches every screen.

## Next steps

- [From a schema to screens](./schema-to-screens.md) — which levels become forms, which become buttons, and what each entry is drawn as
- [Commands](./commands.md) — the two commands, the list verbs, and registering your own beside them
- [Permissions and scopes](./permissions-and-scopes.md) — who reaches which scope
- [Localization](./localization.md) — the `core` namespace, overrides, and strings resolved in script
- [API](./api.md) — every export, and the three subpaths
