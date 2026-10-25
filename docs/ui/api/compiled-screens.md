---
sidebar_position: 6
description: "The registry that maps a screen component to the title and key the build gave it, and the table a static screen ships as."
---
# Compiled screens

The registry the build writes into and `render()` reads out of.

## Import

```ts
import {
  compiledKeyOf, compiledScreens, compiledSnapshotOf, compiledTitleOf,
  compiledValuesOf, FLAG_OFF, FLAG_ON, registerCompiledScreen,
  registerScreenMetadata, registerStaticScreens, screenForKey,
  screenMetadata, screenMetadataFor, showCompiledTitle,
} from '@bedrock-core/ui';
```

Most of this is called by the module the build generates, not by hand. It is documented because a host that shows screens it did not build reads the same records.

## Why the component is the key

The build knows a screen by its file; the runtime knows it by the function `render()` was handed. Nothing carries a name between the two on its own, and the alternatives are all worse: a function's `.name` does not survive a bundler faithfully, a string the author repeats at the call site is a second place for the truth to live, and stamping a name into the author's module is a build editing source it does not own.

Builder generates a module that imports each screen and registers it, then loads that module from the built script entry. The association is by component identity, which is what `render()` already has in hand.

## Registration

| Export | Kind | Description |
| --- | --- | --- |
| `registerCompiledScreen` | function | Records that a screen was compiled, with the key it is navigated by and the title it is drawn by |
| `registerStaticScreens` | function | Records the screens the build described in full, which ship as data rather than as components |
| `registerScreenMetadata` | function | Records the public key, host kind and optional runtime parameter contract for every compiled host |

Registering one component twice with different titles throws: one component is one compiled screen, so render it twice rather than compiling it twice.

## Reading it back

| Export | Kind | Description |
| --- | --- | --- |
| `compiledTitleOf` | function | The title a screen's layout is picked by, or `undefined` when it was not compiled |
| `compiledKeyOf` | function | The `<addon>:<name>` key a screen is navigated by |
| `compiledSnapshotOf` | function | What the build baked: the shape fingerprint, the baked strings, and the carried-visible ordinals |
| `screenForKey` | function | The component a key names in this bundle, or `undefined` |
| `compiledScreens` | function | Registered component-backed form screens, in registration order |
| `screenMetadata` | function | Metadata for all registered screens, including static forms and native containers |
| `screenMetadataFor` | function | Metadata by exact key, or an unambiguous local bare name |

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

## Showing a screen by title

A title picks the layout, and a list of entry values fills it. Both `render()` and the navigation library's reference walker use this rendering operation.

| Export | Kind | Description |
| --- | --- | --- |
| `compiledValuesOf` | function | Walks a screen's own tree and returns its entries with the value each is shown with — the same walk `render()` runs internally |
| `showCompiledTitle` | function | Shows a title with a list of entry values, and resolves to which one was pressed, or `undefined` when the player dismissed it |

```ts
function showCompiledTitle(player: Player, title: string, values: readonly DisplayText[]): Promise<number | undefined>
```

Nothing of the screen's own script runs: the client draws whatever layout its pack holds for that title. That is what lets a realm holding only a static screen's title and its published values — a guide's replicated reference — show it without the addon that built it. `compiledValuesOf` is how a screen derives those values from its own tree in the first place; a realm relaying someone else's already has them.

A carried `visible` and a press's `enabled` both write through the same two-letter alphabet:

| Export | Value | Means |
| --- | --- | --- |
| `FLAG_ON` | `'t'` | Visible, or enabled |
| `FLAG_OFF` | `'f'` | Hidden, or disabled |

Letters rather than digits: a compiled control reads its entry with string arithmetic, and the engine types a `'0'` that arithmetic produces as a number — never equal to the `'0'` a gate compares it against.

## Static layouts and action metadata

`registerStaticScreens()` stores each static layout's `key`, `title`, `values` and `actions`. Action metadata is opaque to the renderer: the library that authored a control interprets its entries. The rendering registry does not resolve destinations or maintain history.

The navigation library converts its static action metadata into portable references and follows their destinations. See [screen references](/docs/navigation/references) for reference lookup and [navigation](/docs/navigation/references#compiled-references) for static screen behavior.
