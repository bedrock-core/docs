---
sidebar_position: 6
description: "The registry that maps a screen component to the title and key the build gave it, and the table a static screen ships as."
---
# Compiled screens

The registry the build writes into and `render()` reads out of.

## Import

```ts
import {
  addonReference,
  compiledKeyOf,
  compiledScreens,
  compiledSnapshotOf,
  compiledTitleOf,
  presentReference,
  registerCompiledScreen,
  registerStaticScreens,
  screenForKey,
} from '@bedrock-core/ui';
```

Most of this is called by the module the build generates, not by hand. It is documented because a host that shows screens it did not build reads the same records.

## Why the component is the key

The build knows a screen by its file; the runtime knows it by the function `render()` was handed. Nothing carries a name between the two on its own, and the alternatives are all worse: a function's `.name` does not survive a bundler faithfully, a string the author repeats at the call site is a second place for the truth to live, and stamping a name into the author's module is a build editing source it does not own.

So the build generates one module that imports each screen and registers it — the same shape as the i18n and guides bundles — and the addon imports that module once. The association is by component identity, which is what `render()` already has in hand.

## Registration

| Export | Kind | Description |
| --- | --- | --- |
| `registerCompiledScreen` | function | Records that a screen was compiled, with the key it is navigated by and the title it is drawn by |
| `registerStaticScreens` | function | Records the screens the build described in full, which ship as data rather than as components |

Registering one component twice with different titles throws: one component is one compiled screen, so render it twice rather than compiling it twice.

## Reading it back

| Export | Kind | Description |
| --- | --- | --- |
| `compiledTitleOf` | function | The title a screen's layout is picked by, or `undefined` when it was not compiled |
| `compiledKeyOf` | function | The `<addon>:<name>` key a screen is navigated by |
| `compiledSnapshotOf` | function | What the build baked: the shape fingerprint, the baked strings, and the carried-visible ordinals |
| `screenForKey` | function | The component a key names in this bundle, or `undefined` |
| `compiledScreens` | function | Every compiled screen this bundle registered, in registration order |

Both `compiledTitleOf` and `compiledKeyOf` accept a component or an element rendering one, because a compiled screen takes props that way — a generic screen filled per present, whose shape does not depend on them.

## The snapshot

```ts
interface CompiledSnapshot {
  readonly shape: string;
  readonly baked: readonly string[];
  readonly vis: readonly number[];
}
```

`vis` is load-bearing: it is how the runtime marks the same elements the build compiled bool carriers for, by position in the shared visible walk — stable because the shape is frozen. `shape` and `baked` serve [`render`'s `debug`](./render.md#debug): a present that disagrees with either is a liveness miss the build could not see.

## References

| Export | Kind | Description |
| --- | --- | --- |
| `addonReference` | function | Every static screen this bundle carries, as the record an addon publishes |
| `presentReference` | function | Shows a foreign screen and follows its links until a press leads nowhere |
| `isAddonReference` | function | Narrows a reference that arrived over the wire: the envelope |
| `isScreenReference` | function | Narrows one screen's reference |

A reference is the title, the value each entry is shown with, and where each press leads. That is all a realm needs to show a screen it did not build, because the prose, the textures and the layout are already in the pack every client holds.

Only a [static](../guides/navigation.md#static-screens) screen has one. A press running the owner's own handler cannot be described, so its target is `null` and it does nothing in a foreign realm — the screen still shows, and the presses that are links still work.

`presentReference` returns `'back'` when the player pressed back out of the first screen of the walk, and `'done'` when the walk simply ended. That is how whoever opened it knows whether to show what the player came from.
