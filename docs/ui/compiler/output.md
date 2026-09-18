---
sidebar_position: 3
description: "Where a compiled screen is mounted, how the client picks its layout, what the build stamps onto an entity or block, and the text it writes per language."
---
# What the build writes

A compiled screen reaches the client as JSON UI in the addon's resource pack: one gated definition per screen, an insert that routes it onto the vanilla screen it is drawn on, and for a container screen, a stamp on the entity or block that opens it.

## Roots and mounts

The root the author writes names the host, and there is no default: `<Screen>` for an action form, `<Form>` for a native modal, `<Container>` for a container screen — naming either `entity` or `block`. One file naming convention, one component set, three roots:

| Root | Screen | Where the layout is mounted | Opened with |
| --- | --- | --- | --- |
| `<Screen>` | an action form | the library's own container on the form screen | `render(Screen, player)` |
| `<Form>` | a native modal form | the same container, with the engine's fields in place | `render(Form, player)` |
| `<Container entity>` | a custom entity's container screen | the vanilla chest, through a hook and the addon's router | `createContainerScreen(Container)` |
| `<Container block>` | a custom block's container screen | the vanilla data-driven container, through a second hook and the same router | `createContainerScreen(Container)` |

A tree that starts with anything else — or a `<Container>` naming neither `entity` nor `block`, or both — is refused by the list of roots. [Hosts](../guides/hosts.md) covers what each screen can carry.

## Routing

Both hosts are reached the same way: one gated definition per screen under a root named for the addon, and one insert putting that root where the screen can see it. A gate compares the whole of what identifies the screen, so two screens can never both match.

- **Form screens** gate on the form's title, which carries the protocol header and the screen's namespaced name. The library's own container is already gated on that header, so a compiled form needs no vanilla edit: the addon's root is inserted into the mount. The pack that *defines* the mount lists its root in the definition directly; every other pack inserts through `RP/ui/server_form.json`.
- **Container screens** gate on a layout key. A marker item in the container's first slot carries a protocol key — is this container a compiled screen at all? — as its max durability, and the layout key as its current durability, and the router shows the layout whose key matches. An entity-hosted screen inserts the addon's root into `RP/ui/chest_screen.json`, at vanilla's `chest.small_chest_panel_top_half`; a block-hosted screen inserts the same root into `RP/ui/data_driven_container_screen.json`, at `data_driven_container.panel_top_half`. A vanilla chest or data-driven container has no marker, fails the first check and renders untouched.

A screen's layout key is a hash of `<namespace>_<name>` folded into 1..3969. It depends on nothing but the screen's own name, so a rebuild never moves a key and an entity placed in a world keeps opening the screen it was stamped with; two addons built apart never claim the same key for their first screens. Two screens of one addon hashing alike is a build failure naming both.

Every edit to a vanilla file is one `modifications` entry defining nothing, at vanilla's own path. That is the one kind of edit the engine stacks across packs in whatever order they sit — a definition in a vanilla file would replace vanilla's and every other pack's instead of joining them. The insert target declares its own `controls`, because an insert on a definition that merely inherits the array creates one that shadows it.

## Host definitions

A container screen names the entity or the block it opens from. The filter finds that host's definition under `BP/entities` or `BP/blocks` by its `identifier` — a screen naming a host that is not there fails the build — and stamps the workspace copy.

### An entity (`<Container entity={'core:furnace'}>`)

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

### A block (`<Container block={'core:workbench'}>`)

```jsonc
"description": {
  "states": {
    // A string, not a number: the engine stores an integer state by its value in the block's
    // state bits, and a layout key does not fit them. The key is the default; `none` is there
    // because a one-value state needs zero bits, which the engine logs as out of range.
    "core:ui_layout": ["1094", "none"]
  }
},
"components": {
  "minecraft:block_entity": {
    "container": { "slot_count": 35 }, // drawn slots + live channels, 1..54
    "dynamic_properties": true         // where the screen's state is kept
  }
}
```

`minecraft:block_entity` cannot vary per permutation and cannot be combined with `minecraft:crafting_table` — the filter refuses a block that declares one, since a compiled screen needs the block entity for its own container. A block container holds 54 slots at most, the whole of a screen's allocation: the routing sentinel, every `<Slot>` and `Button`, and one bank slot per character of every live `<Text maxLength>`. A screen that outgrows it either sheds cells or moves to an entity, whose inventory has no cap.

Nobody keeps a container size or a layout key in step with a layout by hand — the failure mode of that is a screen that silently draws cells the container does not have, or a host that opens the wrong screen. Everything else on the entity or block is yours: its geometry, its behavior, whether it can be pushed or hurt.

One host opens one screen: two screens naming the same entity, or the same block, is a build error.

## Text composed per language

Some text takes its shape from what it says: a baked breadcrumb trail collapses to its room, a [`<Trans>`](../components/Trans.md) breaks into lines. The filter builds every screen with the strings of each language `RP/texts/languages.json` lists, as the filters before it left them, so the build composes that text once per language.

What the screens composed is written into each `RP/texts/<locale>.lang`, in a marked block, under keys named after what the text says in every language. Two screens composing the same text share one key. A screen that is not static also carries each `<Trans>` as laid out, in the snapshot it is registered with, so a render at runtime draws the same pieces and emits a press among them in the same place.

## The character table

A container slot publishes no text, so a live string crosses one character per slot: each cell reads its slot's stack size and localizes a key built from it. The table that turns those codes back into glyphs is appended to every `RP/texts/<locale>.lang`, in a marked block, and only when a container screen actually has live text. It comes from the runtime the project ships rather than from the filter, because it is the contract between the compiler and the runtime — they encode against the same list or nothing renders.

## Next steps

- [Faces and hosts](./passes.md) — the passes that produce each screen document
- [Build checks](./checks.md) — everything that stops a build, and what fails it
- [Container screens](../guides/container-screens.md) — serving a screen an entity or a block owns
