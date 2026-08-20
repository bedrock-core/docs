---
sidebar_position: 1
---

# config

`@bedrock-core/config` is the **shared addon list, config and guide UI**. Every bedrock-core addon mounts it with one line — the registry, config schemas, guides and translations all replicate over `@bedrock-core/sync`.

```ts
import { core } from '@bedrock-core/server-runtime';
import { ui } from '@bedrock-core/config';

core.register({ creator: 'bt', pack: 'gc_graves', /* …translations, guide, config… */ });
ui(core);
```

Your addon gets a settings screen, a guide screen, a row in the world's addon list, and four commands — without writing a screen.

![An addon's settings screen, built from its config schema](/img/ui/config-screen.png)

:::caution Requires the server runtime
This package is a UI over [`@bedrock-core/server-runtime`](/docs/server/server-runtime)'s [registry](/docs/server/server-runtime/registry), [config](/docs/server/server-runtime/config) and [RPC](/docs/server/sync/rpc). It is a **types-only** dependency at build time, so the two version independently — but at runtime you need a `Runtime` (`core`) to pass it.
:::

## Install

```bash
yarn add @bedrock-core/config
```

If you already depend on `@bedrock-core/ui`, the facade entry is available with nothing extra to install:

```ts
import { ui } from '@bedrock-core/ui/config';
```

Peer dependencies: `@bedrock-core/server-runtime`, `@bedrock-core/ui-runtime`, `@bedrock-core/navigation`, `@bedrock-core/ore-styled`, `@bedrock-core/guides`, `@bedrock-core/i18n`, `@minecraft/server`.

## `ui(core, options?)`

```ts
function ui(core: Runtime, options?: UiOptions): void
```

Mount the shared UI on a runtime. **Call once, after `core.register()`.** It does exactly two things:

1. **Serves the `core:ui.open` RPC** — unconditionally. Whichever realm in the world runs the newest runtime renders for all of them, so every mounting realm has to be able to answer.
2. **Registers this addon's commands** — unless `commands: false`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `commands` | `boolean` | `true` | Register this addon's `:config` / `:configat` / `:guide` / `:list` commands |

`ui(core, { commands: false })` leaves the addon with **no commands at all** — the UI is then reachable only through another installed addon's commands.

## Commands

Every command lives under **your addon's own namespace** — `core.id`, i.e. `<creator>_<pack>`, e.g. `bt_gc_graves`.

| Command | Who | What |
| --- | --- | --- |
| `<ns>:config` | anyone | open this addon's config UI |
| `<ns>:config get <setting>` | anyone | read one of your own settings |
| `<ns>:config set <setting> <value>` | anyone | change one of your own settings (quote a list: `"a, b, c"`) |
| `<ns>:config add <setting> <item>` | anyone | append one item to one of your own **list** settings |
| `<ns>:config remove <setting> <item>` | anyone | take one item back out of one of your own **list** settings |
| `<ns>:configat get <scope.setting> [target]` | operator | read any setting, any scope |
| `<ns>:configat set <scope.setting> <value> [target]` | operator | change any setting, any scope |
| `<ns>:configat add <scope.setting> <item> [target]` | operator | append to any **list** setting, any scope |
| `<ns>:configat remove <scope.setting> <item> [target]` | operator | remove from any **list** setting, any scope |
| `<ns>:guide` | anyone | this addon's guide, with the list under it |
| `<ns>:list` | anyone | the addon list, with this addon selected |

Every command is `cheatsRequired: false`, so they work in a world with cheats off; authority comes from the permission level instead:

- **`:config`** is `CommandPermissionLevel.Any`, and its setting enum holds **only the runner's own player-scope settings** — a normal player cannot even autocomplete a server setting.
- **`:configat`** is `CommandPermissionLevel.Admin`, which keeps it out of a non-operator's command list entirely. The scope rides **inside** the setting key (`server.pricing.tax_rate`) rather than as a separate argument.

Every command's description **leads with the namespace**. Bedrock gives the first pack to register a name an unqualified alias for it, with no way to opt out, so a plain `/guide` reaches one arbitrary addon — the description is what tells the player which.

bedrock-core itself has a row in the addon list, with a built-in guide covering these commands.

### Generated enums

The verb and both setting enums are generated from the addon's config schema, so every verb and every setting autocomplete:

| Enum | Contents |
| --- | --- |
| `<ns>:verb` | `get`, `set`, `add`, `remove` |
| `<ns>:setting` | every **player-scope** key |
| `<ns>:scopedsetting` | `<scope>.<key>` for every key in every scope |

Nothing is held back from the key enums, `list` entries included. An entry whose `type` this build has never seen is offered too: it reads with `get` and refuses only on the write.

Commands degrade rather than fail. An addon with no player-scope settings gets a bare, parameter-less `:config` that still opens the UI; `:configat` is not registered at all when there is nothing to reach. A rejected registration is logged (`[config] '<name>' was not registered: …`) with a pointer at `core.id`, never thrown.

### Register your own commands under the same namespace

:::warning One addon, one namespace

If you mount this UI, **every other command your addon registers must use `core.id` too.** Minecraft allows a pack exactly one namespace — not two — and `ui(core)` has already spent yours on `:config`, `:configat`, `:guide`, `:list` and their enums. A command registered under a different prefix is your addon claiming a second namespace, which is not yours to claim.

:::

Read it once, at the top of your startup handler, and build every name from it:

```ts
import { system, CommandPermissionLevel } from '@minecraft/server';
import { core } from '@bedrock-core/server-runtime';
import { ui } from '@bedrock-core/config';

core.register({ creator: 'drav0011', pack: 'shop', packName: 'drav0011.shop.name', version: '1.0.0' });
ui(core);

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
    origin => { /* … */ },
  );
});
```

Three things that template gets right, and are worth copying:

- **`const ns = core.id`, not a string literal.** Rename the pack and every command follows; a literal silently keeps the old prefix and starts colliding with whatever else claimed it.
- **The description leads with the namespace.** Same reason as the built-in commands: the first pack to register `shop` also gets plain `/shop`, with no way to opt out and no way to detect it. The description is the only place a player can see which addon answered.
- **Enums are namespaced too.** `registerEnum('shopaction', …)` is a world-wide name; two addons doing that is a hard failure at startup.

### Changing your namespace

The namespace is not configurable on its own — it is derived, `${creator}_${pack}`, so you change it by changing those two fields in `core.register()`:

```ts
core.register({ creator: 'drav0011', pack: 'shop', /* … */ });   // drav0011_shop
core.register({ creator: 'dv',       pack: 'market', /* … */ }); // dv_market
```

Both halves must match `/^[a-z0-9_]+$/` — lowercase letters, digits and underscores. The convention is creator-then-pack (`bt_gc_graves` = Bedrock Tweaks, gameplay changes, graves), and shorter is better: the namespace is typed in front of every command.

:::danger Changing it after release orphans data

The namespace is the addon's identity **everywhere** — its sync transport id, its [replicated state](/docs/server/server-runtime/scoped-state) keys, its config storage, its guide, and the id peers name in `dependencies`. Changing it on a live world is a rename with no migration: existing settings and state stay filed under the old namespace and the addon comes up empty. Pick it before you ship, and keep the Minecraft pack namespace in your BP/RP identical to it.

:::

### Turning the commands off

`ui(core, { commands: false })` registers **none** of the four, and no enums. Reach for it when your addon has no config and you would rather not add names to the command list, or when you want to drive the UI entirely from your own command or an item:

```ts
ui(core, { commands: false });

world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
  if (itemStack.typeId !== `${core.id}:guide_book`) { return; }

  openUi(core, source, { kind: 'guide', addonId: core.id });
});
```

The UI itself stays fully available — `openUi` is the same funnel the commands go through, permission clamp included — and any *other* installed bedrock-core addon's `:list` still shows your row. It frees the four names, not the namespace: your own commands still belong under `core.id`.

`openUi` returns a `Promise<void>` that settles once the screen is handed to the renderer. From a ui-runtime presser, **return it** — `onPress={() => openUi(core, player, target)}` — so the handoff lands inside the press's interactive transaction: deterministic, flash-free, and no `useExit` call needed, because the renderer [swaps the running app out itself](../ui-runtime/api/render.md#one-ui-slot-per-player). Outside a presser (commands, events), `void openUi(...)` is fine — the promise never rejects.

## Permissions

Non-operators reach their **own player scope only**, enforced independently on both sides.

**Caller side** (this package):

```ts
function isOperator(player: Player): boolean
function allowedScopes(player: Player): readonly ConfigScope[]
function clampTarget(target: OpenTarget, player: Player, core: Runtime): OpenTarget
```

- `isOperator` reads the **readonly** `playerPermissionLevel`, never the script-writable `commandPermissionLevel`. `PlayerPermissionLevel.Custom` does **not** count as operator.
- `allowedScopes` returns all three scopes for an operator, `['player']` otherwise. The scope pickers filter through it, so the scope screens never enter a normal player's navigation stack.
- `clampTarget` silently *pins* rather than refusing: a non-operator's config target gets `scope: 'player'` and `scopeId: player.id`, which deep-links them straight onto their own settings.

**Owner side** ([`@bedrock-core/server-runtime`](/docs/server/server-runtime/config#authorization)): every read and write carries the viewing player as `actorId`, and the **owning** addon re-decides. A programmatic call with no actor is allowed; an operator is allowed anywhere; a non-operator is refused any non-player scope and any player scope that is not their own.

## Scopes

```ts
const CONFIG_SCOPES = ['server', 'dimension', 'player'] as const;
type ConfigScope = typeof CONFIG_SCOPES[number];
```

| Scope | Applies to | Target |
| --- | --- | --- |
| `server` | the whole world | none |
| `dimension` | one dimension | dimension id |
| `player` | one player | player id |

## Typed config schemas

:::caution Schemas are defined by the server runtime, not here
`@bedrock-core/config` **renders** schemas; it never defines them. The definition types live in [`@bedrock-core/server-runtime`](/docs/server/server-runtime/config#define). A field `type` this package does not know renders as "unsupported" rather than failing.
:::

You define a schema on the runtime, either inline in `core.register({ config })` or with `core.config.define(...)` (once):

```ts
core.register({
  creator: 'bt',
  pack: 'gc_graves',
  config: {
    server: {
      pricing: {
        tax_rate: { type: 'number', label: 'Tax rate', default: 5, min: 0, max: 100, step: 1 },
      },
      announce: { type: 'boolean', label: 'Announce deaths', default: true },
    },
    player: {
      theme: { type: 'enum', label: 'Theme', default: 'dark', options: ['dark', 'light'] as const },
    },
  },
});
```

Six field kinds:

| `type` | Extra fields | Rendered as |
| --- | --- | --- |
| `boolean` | — | toggle |
| `number` | `min`, `max` (**required**), `step?` | slider, or a text input when the range exceeds 100 |
| `string` | `maxLength?` | text input |
| `enum` | `options` | inline toggle-button segments up to **5 options**, a dropdown beyond that |
| `multiselect` | `options` | one checkbox per option |
| `list` | `itemType` (`'string' \| 'enum'`), `options?`, `maxItems?` | **no control** — a modal form has nothing to draw for it. It gets [a page of its own](#how-a-schema-becomes-screens) where there is room for a button, and falls back to showing its items plus the [command](#list-settings-from-a-command) where there is not |

Every entry takes `label` and an optional `description`.

:::tip Why enums switch at five
Segments show every choice at once and take one press to change; a dropdown hides them behind a press and a scroll. Past five the segments are too narrow to read, which is the point the dropdown starts winning. Nothing to configure — the count decides.
:::

Groups are nested objects, and may name themselves with [`$label` / `$description`](/docs/server/server-runtime/config#naming-a-group). Without them the UI derives a title from the key. `type` is reserved and cannot be a group name, and no key may start with `$`.

### How a schema becomes screens

The shape of the schema decides the shape of the UI, and one platform fact drives all of it: **a native modal form has exactly two controls, its submit and its dismiss.** There is no third control to navigate with, so a form can never offer "open this sub-section" or "edit this list".

That gives one rule, applied per level:

| The level holds | It renders as |
| --- | --- |
| only sub-groups and/or lists | a **screen of buttons** — one row per sub-group, one per list |
| at least one form field | a **form**, with any sub-groups drawn inline beneath it and indented |

Walking a schema shaped like the reference addon:

```ts
server: {
  economy: {                    // only groups     → screen of buttons
    balances: { /* fields */ }, //                 → form
    currency: { /* fields */ }, //                 → form
  },
  display: {                    // has fields      → form
    prefix: { /* … */ },
    advanced: { /* fields */ }, //                 → drawn INLINE, indented, inside display's form
  },
  moderation: {                 // only lists      → screen of buttons, one row per list
    blockedItems: { type: 'list', /* … */ },
  },
}
```

Depth is unbounded, and each level answers only for itself — a tree can be pure structure for three levels and then hold settings.

:::note A list is not a form field
Lists do not count toward "at least one form field". A list has no modal control either, so it never needed the form — which is why a level holding nothing but lists is a button screen, and each list opens a real editor there. A list stranded on a level that *does* have fields keeps the old read-only treatment, because there is genuinely no button to give it.
:::

### Editing a list in game

Reached from a button screen, a list opens its own editor: current items as rows, a press to remove one, and an **Add** button. Adding presents a native modal — a text field for `itemType: 'string'`, and a dropdown of the options **not already in the list** for `itemType: 'enum'`. `maxItems` disables Add and says why.

Edits stage locally and write on **Save**, the same as the settings form. Writing per press would be one write of the whole array per item touched, each replicated to everyone mid-edit.

What this package exposes is the **consumer-side** mirror, for code that reads a replicated schema:

```ts
type EntrySchema = {
  type: string;
  label: string;
  default: unknown;
  description?: string;
  min?: number; max?: number; step?: number;
  maxLength?: number;
  options?: readonly string[];
  maxItems?: number;
  itemType?: string;
};

type FlatSchemaLike = Record<string, EntrySchema>;
```

Note `type` is `string` and `default` is `unknown` here — wider than the definition types.

:::tip Array defaults are JSON on the wire
A `list` or `multiselect` default is a `readonly string[]` where you define it, but travels as a **JSON string** in the serialized schema. Anything reading a replicated schema must `JSON.parse` a string default for those two types.
:::

Group display strings arrive on their own map, keyed by dot-path exactly as the schema is:

```ts
type GroupMetaLike = { label?: string; description?: string };
type FlatGroupsLike = Record<string, GroupMetaLike>;
```

It is `{}` both for an addon that names no group and for one on a runtime older than the feature. The two are indistinguishable and mean the same thing to a reader — fall back to the key-derived title.

### List settings from a command

A `list` is the one entry type a form cannot draw a control for. The screen [edits it on a page of its own](#editing-a-list-in-game) where there is room for a button; the commands work everywhere, and all four verbs apply:

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
| `set` | replaces the whole list from one comma-separated argument, trimming whitespace around each item. **Quote it** — a comma-separated list contains spaces, and Bedrock would otherwise read only the first word. `set <key> ""` clears it |
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
| any item outside `options`, for `itemType: 'enum'` | `'netherite' is not one of: emerald, gold, diamond` |
| `add` / `remove` on a non-`list` key | `add only works on a list setting, and pricing.taxRate is not one.` |

Every one of these messages is an i18n key under `core.command.list.*`, resolved in the runner's own language and [overridable](../i18n/regolith-filter.md#overriding-a-library-string) like any other library string.

:::note Lists are one flat key
A list is stored as the `JSON.stringify` of its array under a single dot-path key, so a command patches it exactly like a scalar. See [lists](/docs/server/server-runtime/config#lists).
:::

### Command-argument validation

`:config set` / `:configat set` parse and validate against the entry before writing, with messages like `Unknown setting`, `Expected true or false`, `Expected a number`, `Minimum is 0`, `Maximum is 100`, `Expected one of: …`, and `Longer than the 32 character limit`. A `list` key takes the [list verbs](#list-settings-from-a-command) instead; an entry whose `type` this build does not know still refuses with `'<type>' settings cannot be changed from a command`.

The UI path is more forgiving: a number typed into a slider is **clamped** into range rather than rejected.

## Localization

Every string in this package is typed i18n resources under the `core` namespace, shipped inside the package and declared for the [i18n Regolith filter](../i18n/regolith-filter.md):

```jsonc
"bedrockCore": { "i18n": { "dir": "./src/i18n", "namespace": "core" } }
```

The filter folds them into **your** bundle and generated `.lang`, so they paint, measure and translate exactly like your own keys — and you can [override any of them](../i18n/regolith-filter.md#overriding-a-library-string) by authoring the same path:

```ts
// packs/data/i18n/en_US.ts
export default {
  core: { addons: { title: 'Mods' } },   // renames the list header for your pack
} as const;
```

### The world-resolver hook

The package exports its own no-argument `useTranslation` from the `./i18n/*` subpath:

```ts
import { useTranslation } from '@bedrock-core/config/i18n/index';

function Row() {
  const { t, key, display } = useTranslation();
  // …
}
```

:::caution Two different `useTranslation` functions
This one takes **no arguments** and is bound to the `core` resources. The runtime's [`useTranslation(instance)`](../ui-runtime/hooks/useTranslation.md) takes your addon's i18n instance. They are different functions with the same name — import deliberately.
:::

Its `resolve` is the *world* resolver — `core.translations.forPlayer(player)`, chaining every published bundle — so it localizes registry fields from any addon's bundle, not just `core`'s own strings, and an addon's override reaches native modal text as well as painted `.lang` keys.

Note that the exports map declares `./i18n/*`, not `./i18n` — `@bedrock-core/config/i18n` does not resolve; write `@bedrock-core/config/i18n/index`.

## API reference

| Export | Kind | Description |
| --- | --- | --- |
| `ui(core, options?)` | function | Mount the UI: serve the open RPC, register this addon's commands |
| `UiOptions` | type | `{ commands?: boolean }` |
| `App` | component | The UI's root screen stack — mount it yourself for a custom entry point |
| `AppProps` | type | `{ core, player, target, values? }` |
| `openUi(core, player, target)` | function | Open the UI from your own code; returns `Promise<void>` — return it from a presser for an in-transaction handoff |
| `registerAddonCommands(core, onOpen)` | function | Just the command registration, with your own open callback |
| `OpenCallback` | type | `(player, command, args) => void` |
| `isOperator(player)` | function | Readonly permission-level check |
| `allowedScopes(player)` | function | The scopes a player may reach |
| `clampTarget(target, player, core)` | function | Narrow a target to what the player may reach |
| `guideAudienceFor(player)` | function | `'op'` or `'player'` — which slice of a guide they read |
| `CONFIG_SCOPES` | const | `['server', 'dimension', 'player']` |
| `ConfigScope` | type | One of the above |
| `OpenCommand` | type | `'list' \| 'guide' \| 'config'` |
| `OpenTarget` | type | The parsed deep-link target |
| `AppRoutes`, `AppScreen` | types | The navigator's route map and screen props |
| `EntrySchema`, `FlatSchemaLike` | types | Consumer-side mirrors of the runtime's schema shapes |
