---
sidebar_position: 2
description: "Opening a screen by key, the way back, and how a static screen is shown by a realm that did not build it."
---
# Navigation

A screen is opened by **key**, not by component. The component that draws a screen lives in the bundle that built it, which is exactly what another addon does not have; the key is what every addon has.

## Screen keys

Every compiled form screen has a key, `<addon>:<name>`: the addon's namespace and the screen's file name without the `.screen.tsx` suffix. The build writes the keys into `@bedrock-core/generated/ui` and augments the `ScreenKeys` interface, so the editor offers this addon's keys while still accepting another addon's — resolving one of those is the point.

A key with no `<addon>:` in front of it is one of this bundle's own, which is how a screen links to a sibling without repeating a namespace it does not choose.

A container screen has **no key**. A chest is entered by walking up to an entity or interacting with a placed block, not by a press somewhere else, so there is nothing for a key to open.

## navigate and back

```ts
navigate(key: ScreenKey, player: Player, options?: NavigateOptions): boolean
back(player: Player, options?: Omit<NavigateOptions, 'replace'>): boolean
openScreen(key: string, player: Player, options?: NavigateOptions): boolean
closeUi(player: Player): void
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `params` | `Record<string, unknown>` | — | Props the target screen is rendered with; they fill what the layout already reserved and can never add or drop a cell. A static screen takes none |
| `replace` | `boolean` | `false` | Show the screen in place of the current one, so `back()` returns past it |
| `debug` | `boolean` | `false` | Diff every present against the snapshot the build recorded and warn on drift |

`navigate` goes through whatever navigator is installed; `openScreen` is the half that needs nothing but this bundle's own registry, and returns false for a key it does not know.

`closeUi(player)` is how code outside a screen closes what a player is looking at, and it forgets where they have been. [`useExit()`](../hooks/useExit.md) is how a screen closes itself.

Returning `false` means nothing resolved the key — a screen that did not compile, an addon nobody in this realm runs, or a typo. It is warned about where it is decided, never thrown.

## Link

[`<Link>`](../components/Link.md) is the same thing as data. The destination is a prop on the element rather than a closure, so the build can read it straight off the tree — which is what lets a screen of links be described to another addon.

```tsx
<Link to={'shop:catalog'}><Text>{'Catalog'}</Text></Link>
<Link back><Text>{'Back'}</Text></Link>
```

`<Link back>` is the way back, the one direction a walk cannot infer: a screen closing and a press that does nothing look identical from outside.

## Who resolves a key

`setNavigator()` installs what turns a key into a shown screen. The default resolves this bundle's own screens and warns on anything else. [`@bedrock-core/navigation`](/docs/navigation) installs one that keeps a per-player stack of keys and falls back to replicated references, which is wired up with one call:

```ts
import { provideReferences, screens } from '@bedrock-core/navigation';

provideReferences(key => screens(core).find(key));
```

An addon that installs any of the [apps](/docs/catalog) gets this, and the publishing below, done for it by [`uiOf(core)`](/docs/navigation/realm); writing either again is harmless but redundant.

The stack holds keys, not trees. Going back means showing that screen again, drawn from its own initial state — the state of the screen being returned to went with its fibers.

## Static screens

A screen is **static** when every string it shows is baked and every press is a `<Link>` or the way out. Nothing about it can differ between one present and the next, so the build already knows the title, the value each entry carries and where each press leads, and the addon ships that table instead of the component.

```tsx
<Screen static>
```

`static` is the assertion, not the mechanism: a qualifying screen is detected either way, and declaring it fails the build the moment the screen stops qualifying.

The same table is what an addon publishes so other realms can show its screens. The prose, the textures and the layout are already in the pack every client holds; a reference adds the title, the entry values and one target per entry.

```ts title="packs/BP/scripts/main.ts"
import { core } from '@bedrock-core/server';
import { screens } from '@bedrock-core/navigation';
import { uiReference } from '@bedrock-core/generated/ui';

core.register({ manifest });
screens(core).provide(uiReference());
```

Publishing is the UI's, not the runtime's: `screens(core)` is the registry [`@bedrock-core/navigation`](/docs/navigation) builds over the realm's shared state, and `screens(core).find(key)` is what resolves a foreign key back into a reference.

A press running the owner's own handler cannot be described, so its target is `null` and it does nothing in a foreign realm. The screen still shows, and the presses that are links still work.

## Next steps

- [State](./state.md) — what happens to a screen's state when the player moves on
- [`<Link>`](../components/Link.md) — the component reference
- [Compiled screens](../api/compiled-screens.md) — the registry a key resolves through
- [`@bedrock-core/navigation`](/docs/navigation) — the per-player stack
