---
sidebar_position: 2
---

# ui-compile Regolith filter

The build half of [container screens](./container-screens.md). It compiles every `*.screen.tsx` under `BP/scripts` into static JSON UI, and prepares everything the runtime needs to drive them: the router that puts a compiled layout on the vanilla chest screen, the character table live text decodes through, and the entity each screen opens from.

A server form is serialized per player at runtime. A container screen cannot be — the chest screen has no string channel wide enough to carry a layout — so the layout is baked at build time and only state travels at runtime, through the container's own slots. This filter is the baking.

## Installation

```bash
regolith install github.com/bedrock-core/regolith-filters/ui-compile
```

Add it to `config.json` **before** the `bundler` filter — it reads the screen sources the bundler strips — and **after** `i18n` if you use it, so the character table is not carried into the translation bundle:

```jsonc
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

A screen is a script module ending in `.screen.tsx`, anywhere under `BP/scripts`, that default-exports a component rendering a [`<Container>`](../ui-runtime/components/Container.md) at its root:

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

A screen's position in the sorted list is its **layout key**, the number the router picks it by. Sorting keeps the key stable across builds: an entity keeps the key it was stamped with, so a key that moved would leave every already-placed entity in a world opening the wrong screen. Name a new screen so it sorts after the ones you already ship.

### The one rule

:::caution A screen module — and everything it imports — must not touch the world at import time
The filter evaluates the module once, on the build machine, with `@minecraft/server` and `@minecraft/server-ui` replaced by a stub that answers any name with nothing. Hooks are fine: the compiler renders the component with its initial state. What breaks is module-scope code that reaches for the game — `world.afterEvents.*.subscribe(...)`, `system.run(...)`, a dynamic property read next to an `import`. Keep that in the module that calls `createContainerScreen`; a screen's handlers and effects only ever run in game.
:::

## What it generates

The screen module is the only file you own; the bundler inlines it and strips the sources like any other script.

| Output | Why |
| --- | --- |
| `RP/ui/core-ui/screens/<name>.json` | the compiled screen — one JSON UI namespace, `<namespace>_<name>`, per screen |
| `RP/ui/chest_screen.json` | the router, gating every compiled layout onto the vanilla chest screen — see [The router](#the-router) |
| `RP/ui/_ui_defs.json` | both of the above registered, or the game never loads them |
| `RP/texts/<locale>.lang` | the character table `<Text maxLength>` decodes through; only written when a screen has live text |
| `BP/entities/<file>.json` | the entity each screen names: `minecraft:inventory` sized to the layout, and a `core:ui_layout` property carrying the screen's key — see [Entities](#entities) |

No `tsconfig` alias is needed: a screen is imported by its path like any other module, and `@bedrock-core/ui/container` is where `createContainerScreen` lives.

## The router

One router covers every screen. A marker item in the container's slot 0 carries a protocol key (is this chest a compiled screen at all?) and a layout key (which one?), and the router shows the layout whose key matches. A vanilla chest has no marker, fails the first check and renders untouched — so a world with the render pack and an ordinary chest looks exactly as it did.

The router is written to `RP/ui/chest_screen.json`, **vanilla's own path** — that is why it is fixed, not a setting. JSON UI resolves a definition from the file that owns it: a replacement of `chest.small_chest_panel` declared in any other file — same namespace or not — is silently ignored, and the ordinary chest renders.

## Entities

A screen names the entity it opens from. The filter finds that entity's definition under `BP/entities` by its `identifier` — a screen naming an entity that is not there fails the build — and edits the workspace copy:

```jsonc
"description": {
  "properties": {
    // The runtime reads this when a player opens the entity, to pick the screen.
    "core:ui_layout": { "type": "int", "range": [0, 2000], "default": 1 }
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

Nobody keeps `inventory_size` in step with a layout by hand — the failure mode of that is a screen that silently draws cells the container does not have. Everything else on the entity is yours: its geometry, its behaviour, whether it can be pushed or hurt. The demo entity in the reference pack is an invulnerable, gravity-less body with vanilla armor-stand art.

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
