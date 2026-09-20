---
sidebar_position: 3
description: "The two commands the config app registers under your namespace, what each verb does, and how to register your own beside them."
---

# Commands

Every command lives under **your addon's own namespace**: `core.id`, which is `<creator>_<pack>`, for example `bt_gc_graves`.

| Command | Who | What |
| --- | --- | --- |
| `<ns>:config` | anyone | open this addon's settings |
| `<ns>:config get <setting>` | anyone | read one of your own settings |
| `<ns>:config set <setting> <value>` | anyone | change one of your own settings (quote a list: `"a, b, c"`) |
| `<ns>:config add <setting> <item>` | anyone | append one item to one of your own **list** settings |
| `<ns>:config remove <setting> <item>` | anyone | take one item back out of one of your own **list** settings |
| `<ns>:configat get <scope.setting> [target]` | operator | read any setting, any scope |
| `<ns>:configat set <scope.setting> <value> [target]` | operator | change any setting, any scope |
| `<ns>:configat add <scope.setting> <item> [target]` | operator | append to any **list** setting, any scope |
| `<ns>:configat remove <scope.setting> <item> [target]` | operator | remove from any **list** setting, any scope |

The catalog's `<ns>:catalog` and the guide's `<ns>:guide` are registered by [their own apps](/docs/catalog).

Every command is `cheatsRequired: false`, so they work in a world with cheats off; authority comes from the permission level instead:

- **`:config`** is `CommandPermissionLevel.Any`, and its setting enum holds **only the runner's own player-scope settings**: a normal player cannot even autocomplete a server setting.
- **`:configat`** is `CommandPermissionLevel.Admin`, which keeps it out of a non-operator's command list entirely. The scope rides **inside** the setting key (`server.pricing.tax_rate`) rather than as a separate argument, so the setting stays at a fixed position and autocompletes.

Every command's description **leads with the namespace**. Bedrock gives the first pack to register a name an unqualified alias for it, with no way to opt out, so a plain `/config` reaches one arbitrary addon; the description is what tells the player which.

## Generated enums

The verb and both setting enums are generated from the addon's schema, so every verb and every setting autocomplete:

| Enum | Contents |
| --- | --- |
| `<ns>:verb` | `get`, `set`, `add`, `remove` |
| `<ns>:setting` | every **player-scope** key |
| `<ns>:scopedsetting` | `<scope>.<key>` for every key in every scope |

Nothing is held back from the key enums, `list` entries included. An entry whose `type` this build has never seen is offered too: it reads with `get` and refuses only on the write.

Commands degrade rather than fail. An addon with no player-scope settings gets a bare, parameter-less `:config` that still opens the screens; `:configat` is not registered at all when there is nothing to reach. A rejected registration is logged (`[config] '<name>' was not registered: …`) with a pointer at `core.id`, never thrown.

## List settings from a command

A `list` is the one entry type a form cannot draw a control for. The screens [edit it on a page of its own](./schema-to-screens.md#editing-a-list-in-game) where there is room for a button; the commands work everywhere, and all four verbs apply:

```text
/<ns>:config get moderation.bannedItems
moderation.bannedItems = [tnt, lava_bucket] (2/50)

/<ns>:config set moderation.bannedItems "tnt, lava_bucket, bedrock"
/<ns>:config add moderation.bannedItems flint_and_steel
/<ns>:config remove moderation.bannedItems tnt
```

| Verb | On a `list` |
| --- | --- |
| `get` | the items in brackets, plus `(count/maxItems)` when the schema caps the list. An empty list reads `(empty)`, never `[]` |
| `set` | replaces the whole list from one comma-separated argument, trimming whitespace around each item. **Quote it**: a comma-separated list contains spaces, and Bedrock would otherwise read only the first word. `set <key> ""` clears it |
| `add` | appends one item |
| `remove` | takes one item back out |

`add` and `remove` refuse rather than no-op:

| Situation | Message |
| --- | --- |
| `add` an item already in the list | `'tnt' is already in the list.` |
| `add` when `maxItems` is reached | `The list already holds its maximum of 50 items.` |
| `remove` an item that is not there | `'tnt' is not in the list.` |
| `set` more items than `maxItems` | `That is 4 items; the maximum is 3.` |
| `set` naming an item twice | `'tnt' is listed twice.` |
| `add` / `remove` on a non-`list` key | `add only works on a list setting, and pricing.taxRate is not one.` |

Every one of these messages is an i18n key under `core.command.list.*`, resolved in the runner's own language and [overridable](./localization.md) like any other library string.

:::note Lists are one flat key
A list is stored as the `JSON.stringify` of its array under a single dot-path key, so a command patches it exactly like a scalar. See [lists](/docs/config/settings#lists).
:::

## Argument validation

`:config set` and `:configat set` parse and validate against the entry before writing, with messages like `Unknown setting`, `Expected true or false`, `Expected a number`, `Minimum is 0`, `Maximum is 100`, `Expected one of: …`, and `Longer than the 32 character limit`. A `list` key takes the [list verbs](#list-settings-from-a-command) instead; an entry whose `type` this build does not know still refuses with `'<type>' settings cannot be changed from a command`.

The screens are more forgiving: a number typed into a slider is **clamped** into range rather than rejected.

## Your own commands under the same namespace

:::warning One addon, one namespace
Every other command your addon registers must use `core.id` too. Minecraft allows a pack exactly one namespace, and the config app has already spent yours on `:config`, `:configat` and their enums. A command registered under a different prefix is your addon claiming a second namespace, which is not yours to claim.
:::

Read it once, at the top of your startup handler, and build every name from it:

```ts
import { system, CommandPermissionLevel } from '@minecraft/server';
import { core } from '@bedrock-core/server';
import { registerConfig } from '@bedrock-core/config';
import { configDef } from './config';

core.register({
  manifest: { creator: 'drav0011', pack: 'shop', packName: 'drav0011.shop.name', version: '1.0.0' },
  config: registerConfig(configDef),
});

system.beforeEvents.startup.subscribe((ev) => {
  const ns = core.id;                     // 'drav0011_shop' — never hardcode it

  ev.customCommandRegistry.registerEnum(`${ns}:shopaction`, ['buy', 'sell']);
  ev.customCommandRegistry.registerCommand(
    {
      name: `${ns}:shop`,
      description: `${ns} - open the shop.`,
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false,
    },
    origin => { /* ... */ },
  );
});
```

Three things that template gets right, and are worth copying:

- **`const ns = core.id`, not a string literal.** Rename the pack and every command follows; a literal silently keeps the old prefix and starts colliding with whatever else claimed it.
- **The description leads with the namespace.** Same reason as the built-in commands: the first pack to register `shop` also gets plain `/shop`, with no way to opt out and no way to detect it. The description is the only place a player can see which addon answered.
- **Enums are namespaced too.** `registerEnum('shopaction', …)` is a world-wide name; two addons doing that is a hard failure at startup.

## Changing your namespace

The namespace is not configurable on its own. It is derived, `${creator}_${pack}`, so you change it by changing those two fields in `core.register()`:

```ts
core.register({ manifest: { creator: 'drav0011', pack: 'shop', /* ... */ } });   // drav0011_shop
core.register({ manifest: { creator: 'dv',       pack: 'market', /* ... */ } }); // dv_market
```

Both halves must match `/^[a-z0-9_]+$/`: lowercase letters, digits and underscores. The convention is creator-then-pack (`bt_gc_graves` is Bedrock Tweaks, gameplay changes, graves), and shorter is better: the namespace is typed in front of every command.

:::danger Changing it after release orphans data
The namespace is the addon's identity **everywhere**: its sync transport id, its [shared](/docs/server/api/shared) keys, its config storage, its guide, and the id peers name in `dependencies`. Changing it on a live world is a rename with no migration: existing settings and state stay filed under the old namespace and the addon comes up empty. Pick it before you ship, and keep the Minecraft pack namespace in your BP/RP identical to it.
:::

## Turning the commands off

`registerConfig(definition, { commands: false })` registers **neither** command and no enums. Reach for it when you would rather not add names to the command list, or when you want to drive the screens from your own command or an item:

```ts
import { world } from '@minecraft/server';

const { config } = core.register({
  manifest,
  config: registerConfig(configDef, { commands: false }),
});

world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
  if (itemStack.typeId !== `${core.id}:wrench`) { return; }

  void config.open(source);
});
```

The screens stay fully available. `config.open(player, target?)` is the same funnel the commands go through, permission clamp included, and the target names where to land: another `addonId`, a `scope`, and a `scopeId` to open straight into one entity's settings. It frees the two names, not the namespace: your own commands still belong under `core.id`.

`open` returns a `Promise<void>` that settles once the screen is handed to the renderer. From a ui-runtime presser, **return it** so the handoff lands inside the press's transaction, flash-free and with no `useExit` call, because the renderer [swaps the running app out itself](/docs/ui/guides/state#one-ui-slot-per-player). Outside a presser, `void config.open(...)` is fine: the promise never rejects.

## Next steps

- [Permissions and scopes](./permissions-and-scopes.md) — why `:config` and `:configat` are two commands
- [From a schema to screens](./schema-to-screens.md) — what the commands edit, drawn
- [Localization](./localization.md) — overriding a command reply in your own bundle
