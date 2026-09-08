---
sidebar_position: 7
description: "Compiles *.screen.tsx into static JSON UI and routes the chest screen to it."
---
# ui-compile

The build half of [container screens](/docs/ui/guides/container-screens). It compiles every `*.screen.tsx` under `BP/scripts` into static JSON UI, and prepares everything the runtime needs to drive them: the router that puts a compiled layout on the vanilla chest screen, the character table live text decodes through, and the entity each screen opens from.

A server form is serialized per player at runtime. A container screen cannot be — the chest screen has no string channel wide enough to carry a layout — so the layout is baked at build time and only state travels at runtime, through the container's own slots. This filter is the baking.

## Installation

```bash
regolith install github.com/bedrock-core/regolith-filters/ui-compile
```

Add it to `config.json` **before** the `bundler` filter — it reads the screen sources the bundler strips — and **after** `i18n` if you use it, so the character table is not carried into the translation bundle:

```jsonc title="config.json"
{
  "regolith": {
    "profiles": {
      "default": {
        "filters": [
          { "filter": "guides" },
          { "filter": "i18n" },
          { "filter": "ui-compile" },
          { "filter": "bundler" }
        ]
      }
    }
  }
}
```

No settings are required.

## Authoring

A screen is a script module ending in `.screen.tsx`, anywhere under `BP/scripts`, that default-exports a component rendering a [`<Container>`](/docs/ui/components/Container) at its root:

```tsx title="packs/BP/scripts/screens/furnace.screen.tsx"
/** @jsxImportSource @bedrock-core/ui */
import { Container, Slot, Text, useState } from '@bedrock-core/ui';

export default function Furnace() {
  const [count, setCount] = useState(0);

  return (
    <Container entity={'core:furnace'} padding={8} gap={6}>
      <Text maxLength={12}>{`smelted ${count}`}</Text>
      <Slot role={'input'} onInsert={() => setCount(value => value + 1)} />
    </Container>
  );
}
```

The same module is imported by the behavior pack and handed to `createContainerScreen`. The filter compiles it against the **project's own** copy of `@bedrock-core/ui` and `@bedrock-core/ui-compile` — it bundles the screen together with the compiler from your `node_modules` — so a screen is always compiled against the library version the addon actually ships.

### How a screen is discovered

Every `**/*.screen.tsx` under `BP/scripts`, sorted by path. Ordinary `.tsx` helpers can sit beside a screen; only the suffix marks one.

A screen's **name** is its file name without the suffix — `furnace.screen.tsx` is `furnace`. It becomes the screen's output file and part of its JSON UI namespace, `<namespace>_furnace`, so it has to be unique across the addon whatever directory the screen sits in. The **namespace** is the addon's own — the `namespace` setting, or the `creator_pack` from `core.register()` — so a screen carries your name, not the library's.

A screen's **layout key** — the number the router picks it by and the build stamps on its entity — is derived from its JSON UI namespace, `<namespace>_<name>`, by a hash folded into 1..3969. Nothing is handed out in sequence: two addons built apart never claim the same key for their first screens, a rebuild never moves a key, and an entity placed in a world keeps opening the screen it was stamped with. Two screens of one addon hashing to the same key is a build failure naming both; rename one.

### The one rule

:::caution A screen module — and everything it imports — must not touch the world at import time
The filter evaluates the module once, on the build machine, with `@minecraft/server` and `@minecraft/server-ui` replaced by a stub that answers any name with nothing. Hooks are fine: the compiler renders the component with its initial state. What breaks is module-scope code that reaches for the game — `world.afterEvents.*.subscribe(...)`, `system.run(...)`, a dynamic property read next to an `import`. Keep that in the module that calls `createContainerScreen`; a screen's handlers and effects only ever run in game.
:::

## What it generates

The screen module is the only file you own; the bundler inlines it and strips the sources like any other script.

| Output | Why |
| --- | --- |
| `RP/ui/core-ui/screens/<name>.json` | the compiled screen — one JSON UI namespace, `<namespace>_<name>`, per screen. It references only the library's own definitions (`core_ui_container.*`, shipped as static files under `RP/ui/core-ui/container/`) and its own |
| `RP/ui/core-ui/screens/<namespace>_router.json` | the addon's router — one gated host per screen, gathered under the addon's root — see [The router](#the-router) |
| `RP/ui/chest_screen.json` | the hook: the addon's copy of vanilla's chest file, one `modifications` entry inserting the addon's root into the chest top half the chest root mounts on both UI profiles. Nothing is defined in it |
| `RP/ui/_ui_defs.json` | the three above registered, or the game never loads them — written from scratch when the pack had none |
| `RP/texts/<locale>.lang` | the character table `<Text maxLength>` decodes through; only written when a screen has live text |
| `BP/entities/<file>.json` | the entity each screen names: `minecraft:inventory` sized to the layout, and a `core:ui_layout` property carrying the screen's key — see [Entities](#entities) |

No `tsconfig` alias is needed: a screen is imported by its path like any other module, and `@bedrock-core/ui/container` is where `createContainerScreen` lives.

## The router

One router covers every screen. A marker item in the container's slot 0 carries a protocol key (is this chest a compiled screen at all?) and a layout key (which one?), and the router shows the layout whose key matches. A vanilla chest has no marker, fails the first check and renders untouched — so a world with the render pack and an ordinary chest looks exactly as it did.

Every edit to vanilla is made in a copy of vanilla's own `chest_screen.json`, at vanilla's own path: that is the one file the engine stacks across packs, in whatever order they sit. Nothing of vanilla's is removed or re-emitted.

- **The render pack's copy**, static, does two things. It re-declares the chest screen with a different `$screen_content` — the way vanilla's own shulker-box and barrel screens point theirs elsewhere — namely the **chest root**, `core_ui_router.chest_root` / `chest_root_pocket` in the static `RP/ui/core-ui/container/router.json`. The root holds vanilla's chest panel, referenced by name and untouched, behind a gate that opens only when no compiled layout claims the chest; behind the opposite gate sit the library's chrome (key routes, touch take-progress, the held-item icon, the controller pointer) and a second reference to vanilla's chest top half, the panel every addon's root is inserted into. And it gives that top half's two children — the title label and the 9 × 3 grid, both chest-only definitions — a visibility binding on the protocol key, so in that second reference nothing but the roots shows. A `modifications` entry cannot switch the content: `variables` is not an array modifications reach, and a `controls` insert on the screen creates an array that shadows the one the screen inherits from `common.base_screen`, emptying every chest.
- **The addon's copy**, generated, inserts the addon's root into `chest.small_chest_panel_top_half` — one `modifications` entry, defining nothing. That definition declares its own `controls`, so the inserts from packs built apart all land; the chest root mounts it on both UI profiles, so one hook covers desktop and pocket.
- **The addon's router**, `RP/ui/core-ui/screens/<namespace>_router.json` (namespace `core_ui_router`, every definition prefixed with the addon's namespace), holds that root: one gated host per screen. Its path and its names carry the addon's namespace, so no addon's file overwrites another's.

Everything a compiled screen draws — item cells, slot buttons, the scrolling region, the transport-hiding renderer — is the library's own, in the static `core_ui_container` files the render pack ships. A compiled screen and a router reference no vanilla definition; the chest root references exactly three, the two chest panels it shows for an ordinary chest and the top half it mounts the roots in.

## Entities

A screen names the entity it opens from. The filter finds that entity's definition under `BP/entities` by its `identifier` — a screen naming an entity that is not there fails the build — and edits the workspace copy:

```jsonc
"description": {
  "properties": {
    // The runtime reads this when a player opens the entity, to pick the screen.
    "core:ui_layout": { "type": "int", "range": [0, 3969], "default": 1094 }
  }
},
"components": {
  "minecraft:inventory": {
    "container_type": "container", // the only type that routes to the chest screen
    "inventory_size": 75,          // drawn slots + live channels; a hand-written value is overwritten
    "private": false               // `true` stops the player opening it at all
  }
}
```

Nobody keeps `inventory_size` in step with a layout by hand — the failure mode of that is a screen that silently draws cells the container does not have. Everything else on the entity is yours: its geometry, its behavior, whether it can be pushed or hurt. The demo entity in the reference pack is an invulnerable, gravity-less body with vanilla armor-stand art.

One entity opens one screen: two screens naming the same entity is a build error.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `namespace` | `string` | scanned | The addon's namespace, prefixing every screen's JSON UI namespace as `<namespace>_<name>`. Left unset, it is read from the `creator_pack` in your `core.register()`, the way the other filters resolve it; set it to override |

`namespace` is the only setting. Everything else the filter needs is a fixed addon path Minecraft requires — screens under `BP/scripts`, entities under `BP/entities`, the router at vanilla's `RP/ui/chest_screen.json`, texts under `RP/texts` — none of which is optional, so none is a setting.

## What the build checks

No `*.screen.tsx` under `BP/scripts` is an info-level no-op. Everything else stops the build with a message naming the fix — the compiler's own message, relayed unchanged:

| Check | What fails |
| --- | --- |
| **Root** | A screen without exactly one `<Container>` at its root, or one without an `entity` |
| **Backend** | `<Form>`, any `Form.*` field, `<Scroll>`, or a nested `<Container>` — a container has no native form and cannot scroll |
| **Canvas** | Content laid out past 320 × 210 — the message gives the size it found |
| **Live text** | `<Text maxLength>` inside a `<Button>`, whose children are baked into its face |
| **Entity** | An `entity` with no definition under `BP/entities`; two screens naming the same entity |
| **Names** | Two screens with the same file name |
| **Import time** | A module that reaches for the game while being evaluated — see [The one rule](#the-one-rule) |
