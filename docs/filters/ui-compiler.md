---
sidebar_position: 7
description: "Compiles *.screen.tsx into static JSON UI, and registers every screen with the runtime that serves it."
---
# ui-compiler

Every `*.screen.tsx` under `BP/scripts` goes in; static JSON UI in the resource pack comes out, together with the module that tells the runtime which screens the pack holds.

A screen's layout is written into the pack once instead of being described to the client on every open. For a container screen that is the only way it exists at all — the chest screen has no string channel wide enough to carry a layout. For a form screen it is what makes a present cost only the values that changed.

## Install

```bash
regolith install ui-compiler
```

It runs after every filter that writes something a screen reads, and before the bundler that strips the sources:

```jsonc title="config.json"
{
  "regolith": {
    "profiles": {
      "default": {
        "filters": [
          { "filter": "guides" },
          { "filter": "i18n" },
          { "filter": "ui-compiler", "settings": { "namespace": "drav0011_shop" } },
          { "filter": "bundler" }
        ]
      }
    }
  }
}
```

`guides` first, because a guide's pages are screens this filter compiles. `i18n` second, so a localized `<Text>` is measured as the string the client will draw rather than as its key. `bundler` last, because it inlines the module this filter generates. [`core`](./core.md) runs the whole chain in that order as a single filter.

## Three kinds of screen

The root the author writes names the host, and there is no default. One file naming convention, one component set, three screens:

| Root | Screen | Where the layout is mounted | Opened with |
| --- | --- | --- | --- |
| `<Screen>` | an action form | the library's own container on the form screen | `render(Screen, player)` |
| `<Form>` | a native modal form | the same container, with the engine's fields in place | `render(Form, player)` |
| `<Container entity>` | a custom entity's chest screen | the vanilla chest, through a hook and a router | `createContainerScreen(Container)` |

A tree that starts with anything else is refused by the list of roots.

## Authoring

A screen is a module ending in `.screen.tsx`, anywhere under `BP/scripts`, that default-exports a component. Ordinary `.tsx` helpers sit beside one untouched — only the suffix marks a screen.

```tsx title="packs/BP/scripts/screens/counter.screen.tsx"
/** @jsxImportSource @bedrock-core/ui */
import { Button, Panel, Screen, Text, useState, type JSX } from '@bedrock-core/ui';

export default function Counter(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <Screen>
      <Panel padding={8} gap={6}>
        <Text maxLength={16}>{`count ${count}`}</Text>
        <Button enabled={count < 9} action={() => setCount(value => value + 1)}>{'+'}</Button>
      </Panel>
    </Screen>
  );
}
```

The build runs the component once to decide the **shape**; the runtime runs it again per viewer to decide the **values**, and the two walks line up position for position because a compiled screen's shape is fixed. Nothing about a screen is declared twice.

A container screen is the same file with `<Container>` at its root and an entity to open from:

```tsx title="packs/BP/scripts/screens/crafting_table.screen.tsx"
/** @jsxImportSource @bedrock-core/ui */
import { Container, Panel, Slot, Text, useState, type JSX } from '@bedrock-core/ui';

export default function CraftingTable(): JSX.Element {
  const [planks, setPlanks] = useState(0);

  return (
    <Container entity={'drav0011_shop:crafting_table'} padding={8} gap={6}>
      <Text maxLength={12}>{`planks ${planks}`}</Text>
      <Panel background={'textures/ui/slot_enabled'}>
        <Slot
          role={'both'}
          onInsert={({ stack }) => setPlanks(value => value + stack.amount)}
          onRemove={({ stack }) => setPlanks(value => value - stack.amount)}
        />
      </Panel>
    </Container>
  );
}
```

### Names and keys

A screen's **name** is its file name without the suffix: `counter.screen.tsx` is `counter`. With the addon's namespace it becomes the JSON UI namespace `<namespace>_counter`, the output file, and the key `<namespace>:counter` that `<Link to>` and `navigate()` take. The name has to be unique across the addon whatever directory the screen sits in.

### Live values are reserved, not discovered

A compiled screen is baked, so a string that changes has to say how much room to reserve for it:

```tsx
<Text maxLength={16}>{`count ${count}`}</Text>
```

The build renders the component with each state slot perturbed and fails on anything that moved without a reservation, naming the strings it saw and the `maxLength` each needs. The same probe fails a screen whose **shape** moved — a cell added, dropped or reordered — because the cells are numbered once, at build time.

### Conditionals become carried visibility

`{cond && <X/>}` has already collapsed to `false` by the time any renderer sees it, and nothing can tell which element went missing. So the build rewrites the source text of every `.screen.tsx` before executing it, and ships the same rewrite to the runtime:

| Written | Compiled as |
| --- | --- |
| `{cond && <X/>}` | `<X visible={cond} liveVisible={true}/>` |
| `{cond ? <A/> : <B/>}` | `<A visible={cond} liveVisible/><B visible={!(cond)} liveVisible/>` |
| `{cond ? <A/> : null}` | `<A visible={cond} liveVisible/>` |

An element that already carries `visible` keeps it, joined with `&&`. Only branches that are single elements are rewritten; a string, fragment or call in a branch is left alone — wrap it in an element to make it compilable. A form carries visibility on an entry; a chest screen bakes it, so a chest screen whose `visible` moves is a build error.

### Static screens

A screen is **static** when every string it shows is baked and every press is a `<Link>` or the way out. Nothing about it can differ between one present and the next, so the build already knows everything showing it takes — the title, the value each entry carries, the key each press leads to — and the addon ships that table instead of the component that would recompute it.

`<Screen static>` is the assertion, not the mechanism: a qualifying screen is detected either way, and declaring it makes the build fail the moment the screen stops qualifying.

```tsx title="packs/BP/scripts/screens/menu.screen.tsx"
/** @jsxImportSource @bedrock-core/ui */
import { Link, Panel, Screen, Text, type JSX } from '@bedrock-core/ui';

export default function Menu(): JSX.Element {
  return (
    <Screen static>
      <Panel flexDirection={'column'} padding={6} gap={4}>
        <Text>{'Menu'}</Text>
        <Link to={'shop'}><Text>{'Shop'}</Text></Link>
        <Link to={'drav0011_economy:balance'}><Text>{'Balance'}</Text></Link>
      </Panel>
    </Screen>
  );
}
```

A key with no `<addon>:` in front of it is one of this bundle's own, named as its file is; a key that names another addon resolves through the reference that addon published.

A modal never qualifies — its fields are built per present — and neither does anything with a live value or a handler of its own.

### The one rule

:::caution A screen module, and everything it imports, must not touch the world at import time
The filter evaluates the module once, on the build machine, with `@minecraft/server` and `@minecraft/server-ui` replaced by stubs that answer every name the packages declare and do nothing. Hooks are fine: the compiler renders the component with its initial state. What breaks is module-scope code that reaches for the game — `world.afterEvents.*.subscribe(...)`, `system.run(...)`, a dynamic property read next to an `import`. Keep that in the module that opens the screen; a screen's handlers and effects only ever run in game.
:::

### Library screens

A screen can also come from a module whose default export is a record of components, named by its keys. The `screens` setting lists such modules:

```jsonc title="config.json"
{ "filter": "ui-compiler", "settings": { "screens": ["@bedrock-core/config/compiled"] } }
```

An addon that calls `core.register()` gets [`@bedrock-core/config`](/docs/config)'s screens without asking: declaring is what asks for them. The filter reads the register call in `BP/scripts/main.ts` or `BP/scripts/index.ts`, and compiles a config screen per section of the declared schema plus the addon's page in the shared addon list, both shaped for what the declaration says. An addon that names its own `page` keeps that one.

## What it generates

Everything lands in Regolith's temp workspace except the one declaration file, which is written back into the project for the editor's sake. The screen module is the only file you own.

| Output | Where | Commit it? |
| --- | --- | --- |
| `RP/ui/core-ui/screens/<namespace>/<name>.json` | workspace | ❌ |
| `RP/ui/core-ui/screens/<namespace>/faces.json` | workspace | ❌ |
| `RP/ui/core-ui/screens/<namespace>_forms.json` | workspace | ❌ |
| `RP/ui/server_form.json` | workspace | ❌ |
| `RP/ui/core-ui/screens/<namespace>_router.json` | workspace | ❌ |
| `RP/ui/chest_screen.json` | workspace | ❌ |
| `RP/ui/_ui_defs.json` | workspace, edited or created | ❌ |
| `RP/texts/<locale>.lang` | workspace, appended | ❌ |
| `BP/entities/<file>.json` | workspace, edited | ❌ |
| `data/ui/ui.generated.ts` | workspace | ❌ |
| `data/ui/declared.screens.ts` | workspace | ❌ |
| `<dataPath>/ui/screens.generated.d.ts` | the project | ✅ |
| `RP/ui/core-ui/screens/<namespace>/<name>.preview.json` | workspace, `gallery` only | ❌ |
| `RP/ui/core-ui/screens/<namespace>/gallery.json` | workspace, `gallery` only | ❌ |
| `RP/ui/core-ui/screens/<namespace>/core_build.json` and `RP/ui/hud_screen.json` | workspace, `stamp` only | ❌ |

The screens sit under a folder named for the addon because a resource pack file is replaced, not merged, by a higher pack's file at the same path: two addons that both compiled a `guide_home` would otherwise shadow each other's namespace. Every UI file is registered in `_ui_defs.json`, or the game never loads it.

### faces.json

A **face** is one look with its static props — a button's four textures, a label's font and scale, a cell frame — carrying no bindings at all. Faces are deduplicated by a signature over the props that reach JSON UI, so a look is one definition however many screens draw it, and they live in the addon's own file rather than in the render pack: a styled layer other than [`ore-styled`](/docs/ore-styled) ships its own with nothing added to the pack.

### The generated module

`data/ui/ui.generated.ts` is reached from scripts as `@bedrock-core/generated/ui`, the way the [i18n](./i18n.md) and [guides](./guides.md) bundles are. Importing it is what associates a component with the layout compiled from it — the build knows a screen by its file, the runtime by the component it is handed — so the filter adds the import to the workspace copy of the script entry. Without it `render()` refuses every screen.

| Export | Kind | Description |
| --- | --- | --- |
| `SCREEN_KEYS` | `readonly string[]` | Every screen this addon compiled, by the key it is navigated with |
| `ScreenKey` | type | One of `SCREEN_KEYS` |
| `UI_NAMESPACE` | `string` | The namespace the build wrote into every key and title |
| `UI_REFERENCE` | table | The static screens as rows: key, title, entry values, press targets |
| `uiReference()` | function | The same table as the `AddonReference` an addon publishes |
| `openGallery(player, options?)` | function | Opens the gallery; warns and returns `false` in a build without one |

The module also augments `ScreenKeys`, so `navigate()` and `<Link to>` autocomplete this addon's keys while still accepting another addon's — resolving one of those is the point. `<dataPath>/ui/screens.generated.d.ts` is the same declaration written back into the project, because the generated module only ever exists inside a Regolith run and the editor never sees one.

Publishing the reference once at startup is what lets a realm running none of this addon's script show its static screens:

```ts title="packs/BP/scripts/main.ts"
import { core } from '@bedrock-core/server';
import { uiReference } from '@bedrock-core/generated/ui';

core.register({ manifest, screens: uiReference() });
```

## How a screen reaches the screen it is drawn on

Both hosts are reached the same way: one gated definition per screen under a root named for the addon, and one insert putting that root where the screen can see it. A gate compares the whole of what identifies the screen, so two screens can never both match.

- **Form screens** gate on the form's title, which carries the protocol header and the screen's namespaced name. The library's own container is already gated on that header, so a compiled form needs no vanilla edit: the addon's root is inserted into the mount. The pack that *defines* the mount lists its root in the definition directly; every other pack inserts through `RP/ui/server_form.json`.
- **Container screens** gate on a layout key. A marker item in the container's first two slots carries a protocol key — is this chest a compiled screen at all? — and the layout key as two stack sizes, and the router shows the layout whose key matches. A vanilla chest has no marker, fails the first check and renders untouched.

A screen's layout key is a hash of `<namespace>_<name>` folded into 1..3969. It depends on nothing but the screen's own name, so a rebuild never moves a key and an entity placed in a world keeps opening the screen it was stamped with; two addons built apart never claim the same key for their first screens. Two screens of one addon hashing alike is a build failure naming both.

Every edit to a vanilla file is one `modifications` entry defining nothing, at vanilla's own path. That is the one kind of edit the engine stacks across packs in whatever order they sit — a definition in a vanilla file would replace vanilla's and every other pack's instead of joining them. The insert target declares its own `controls`, because an insert on a definition that merely inherits the array creates one that shadows it.

## Entities

A container screen names the entity it opens from. The filter finds that entity's definition under `BP/entities` by its `identifier` — a screen naming an entity that is not there fails the build — and stamps the workspace copy:

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

Nobody keeps `inventory_size` in step with a layout by hand — the failure mode of that is a screen that silently draws cells the container does not have. Everything else on the entity is yours: its geometry, its behavior, whether it can be pushed or hurt.

One entity opens one screen: two screens naming the same entity is a build error.

## The character table

A container slot publishes no text, so a live string crosses one character per slot: each cell reads its slot's stack size and localizes a key built from it. The table that turns those codes back into glyphs is appended to every `RP/texts/<locale>.lang`, in a marked block, and only when a container screen actually has live text. It comes from the runtime the project ships rather than from the filter, because it is the contract between the compiler and the runtime — they encode against the same list or nothing renders.

## The gallery

With `gallery: true` the build writes each screen twice: the served screen, and the same screen as **faces alone** under its own namespace, gated on its own title. A `gallery` screen lists every preview, and a press opens one. That is where a screen is looked at before any host attaches a channel to it — a preview has no entity, no entry and no channel, and shows reference strings, reference visibility and fields as static twins.

```ts
import type { Player } from '@minecraft/server';
import { openGallery } from '@bedrock-core/generated/ui';

export const showGallery = (player: Player): void => {
  openGallery(player);
};
```

For a development profile only, the way a component storybook is. A build without it exports an `openGallery` that warns and shows nothing.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `namespace` | `string` | declared | The addon's namespace, lowercase `a-z`, `0-9` and `_`; it prefixes every screen's JSON UI namespace and names the router file and the output folder. Left unset, it is the `creator` and `pack` of the manifest the addon declared |
| `stamp` | `boolean` | `false` | Draw a build stamp at the HUD's top left — a short hash over everything under `RP/ui` plus the build clock — so what a running client is rendering is never in question |
| `gallery` | `boolean` | `false` | Write every screen's preview and the gallery screen that opens them, and export a working `openGallery` |
| `screens` | `string[]` | `[]` | Modules whose default export is a record of screens to compile besides the addon's own, each export key naming one |

Every path is what the game needs, so none of them is a setting: screens under `BP/scripts`, entities under `BP/entities`, output under `RP/ui/core-ui/screens`, texts under `RP/texts`, and the hooks at vanilla's own paths.

## Checks

No screen to compile and no `screens` setting is an info-level no-op. Everything else stops the build with the compiler's own message, relayed unchanged, because those messages already name the fix.

| Check | What fails |
| --- | --- |
| Root | A tree that starts with something other than `<Screen>`, `<Form>` or `<Container>`; more than one element at a form's root; a `<Container>` with no `entity` |
| Shape | A screen that adds, drops or reorders a cell when its state changes |
| Live text | A `<Text>` whose string changes with no `maxLength`; the message names each string it saw and the length it needs |
| Carried visibility | A `visible` that moves on a container screen, which bakes it |
| Static | `<Screen static>` on a screen that carries a live value or runs a handler of its own, naming which |
| Canvas | Content laid out past 320 × 210, with the size it measured |
| Mechanism | A component the screen's host has no mechanism for — a slider or a dropdown outside a modal, a slot outside a container screen |
| Unsupported | A control with no compiled form at all, listing what is supported |
| Face rules | A face carrying a binding that reads a host, an image without `keep_ratio: false`, a label that does not say whether it localizes, two siblings of one name, a reference or `source_control_name` that resolves to nothing |
| Placement | A host that moved a control while standing its mechanism in, with the face's rect and the host's |
| Shared faces | A control that changes at runtime, or one needing a definition of its own, baked inside a button's face |
| Names | Two screens with the same name; a name or namespace outside letters, digits, `_` and `-` |
| Face collision | Two screens of one addon sharing a face name with different contents |
| Entity | An `entity` with no definition under `BP/entities`; two screens naming the same entity |
| Namespace | No `namespace` setting and no `manifest: { creator, pack }` in the register call |
| Import time | A module that reaches for the game while being evaluated |

An entry that throws on the way to its `core.register()` call is a warning, not a failure: the addon gets none of the screens that follow from declaring, and the reason is printed rather than leaving a pack that builds clean with no config screen in it.

## Notes

The pipeline runs inside the bundle the filter builds, so `@bedrock-core/ui-runtime` and `@bedrock-core/ui-compiler` resolve from the **project's** `node_modules`. A screen is always compiled against the library version the addon actually ships, and the filter cannot drift from it. Every value the emitted JSON UI shares with the runtime — the character table, the layout property, the highest layout key — is read off that bundle for the same reason.

The compiler itself and its layers are in [Faces and hosts](/docs/ui/compiler/passes), its programmatic entry points in [`@bedrock-core/ui-compiler`](/docs/ui/compiler/api), and what serves a compiled screen in game is [`@bedrock-core/ui`](/docs/ui).
