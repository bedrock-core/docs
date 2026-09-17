---
sidebar_position: 6
description: "Every export of @bedrock-core/config, and where the settings subsystem itself is documented."
---

# API

## `@bedrock-core/config`

The field `core.register()` takes.

| Export | Kind | Description |
| --- | --- | --- |
| `registerConfig(definition, options?)` | function | The field `core.register()` takes: installs the scopes, the commands and the show method, and hands back a `ConfigApp` |
| `ConfigOptions` | type | `{ commands?: boolean }` |
| `ConfigApp<I>` | type | The typed scope trees plus `open(player, target?)` |
| `ConfigAppDeclaration<I>` | type | What the field hands `register()`: the installer, the definition, and `app: 'config'` |

## `@bedrock-core/config/server`

The settings subsystem: `registerConfig(definition)`, `configOf(core)` to reach what it installed, and every type of the schema and the accessor trees. Documented on the [settings subsystem](/docs/config/settings) page.

## `@bedrock-core/config/compiled`

What the ui-compiler filter bakes: the screens every config draws, and one screen per section of the definition.
