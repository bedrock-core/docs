---
sidebar_position: 4
description: "Publishing this addon's screens and page, and resolving a key it never compiled."
---

# References

A key for a screen nobody in this realm compiled still resolves, because every client already holds the pack that draws it. What has to travel is small: per screen the compiled title, the value each entry carries and where each press leads.

An addon that installs any app gets all of this done for it by [`uiOf(core)`](./realm.md). Reach for these directly in a bundle that wants its screens navigable without mounting an app.

## Import

```ts
import { addonPageReference, pages, pageTargeted, provideReferences, screens } from '@bedrock-core/navigation';
```

## provideReferences

```ts
provideReferences(lookup: (key: string) => ScreenReference | undefined, crossRealm?: CrossRealm): void
```

Installs what resolves a key this bundle did not compile. Called once:

```ts
provideReferences(key => screens(core).find(key));
```

Until it is called, a foreign key warns and shows nothing. A key this bundle **did** compile never reaches the lookup; its own component is rendered.

A screen shown from a reference is **shown, not rendered**: there is no component in this realm, so the walk drives the client directly, title, values and the key and params each press leads to, for as long as the presses are links. A press that ran the owner's own handler cannot be described, so such a screen needs its owner's script. Pass `crossRealm` to reach it: `ask(owner, key, player, params)` sends the player there, and `sendBack(address, rest, player)` returns them. Without one, such a key warns exactly as an unknown key does.

## screens

```ts
screens(core: Runtime): ScreensRegistry
```

One registry per runtime, created on the first call and kept, so every caller in a realm reads and writes the same feed. It announces under `ui/reference`.

| Member | Description |
| --- | --- |
| `provide(reference)` | Publish this addon's screens, from `uiReference()` in `@bedrock-core/generated/ui` |
| `find(key)` | The reference for one key, from whichever addon published it |
| `of(namespace)` | Everything one addon published |
| `namespaces()` | Every addon that has published screens |

```ts
import { screens } from '@bedrock-core/navigation';
import { uiReference } from '@bedrock-core/generated/ui';

screens(core).provide(uiReference());
```

`find` searches rather than parsing the key. A key's first half is the owner's UI namespace, which an addon may set apart from the namespace it syncs under, so the published records are the only reliable answer.

## pages

```ts
pages(core: Runtime): PagesRegistry
```

The same shape for an addon's page in the [catalog](/docs/catalog/page), announced under `addon/page`. Every addon publishes one, whether or not it installed a catalog: the page follows from the manifest, the build compiles it, and the realm announces it on the first tick.

| Member | Description |
| --- | --- |
| `provide(reference)` | Publish this addon's page |
| `of(addonId)` | What another addon published |

Where a press on the page leads is the **name of an app**, `config` or `guide`, not a screen: the page is drawn in one realm and answered in another, and only the owning realm knows what its config screen looks like.

```ts
addonPageReference(Page: FunctionComponent): AddonPageReference   // the reference of a page screen
pageTargeted(app: string): TargetedPress                          // a press that names the app it opens
```

`addonPageReference` builds a page's reference the way the compile built the screen, reading each entry's value off the tree and each press's target off its handler. `pageTargeted` marks a press with the app it opens; its body is empty on purpose, because the page's own script never runs.

## Types

```ts
import type { AddonPageReference, AddonScreens, PageTarget, TargetedPress } from '@bedrock-core/navigation';
```

`AddonScreens` is an envelope: the version, the owner's UI namespace, and the screens as `unknown`. The renderer owns the real shape and narrows it at the point of use, which is what keeps this package free of the screen format. `AddonPageReference` is `{ v: 1, values: string[], targets: (PageTarget | null)[] }`. `isAddonScreens` and `isAddonPageReference` are the envelope checks.

## Notes

Both registries extend `Announcement` from `@bedrock-core/server-runtime`, so they behave like every other cross-addon feed: published once at startup, readable by every realm, and re-read when an addon joins.
