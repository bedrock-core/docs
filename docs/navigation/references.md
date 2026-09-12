---
sidebar_position: 4
description: "Publishing this addon's screens and resolving a key it never compiled."
---
# References

A key for a screen nobody in this realm compiled still resolves, because every client already holds the pack that draws it. What has to travel is small: per screen the compiled title, the value each entry carries and where each press leads.

## Import

```ts
import { pages, provideReferences, screens } from '@bedrock-core/navigation';
```

## provideReferences

```ts
provideReferences(lookup: (key: string) => ScreenReference | undefined): void
```

Installs what resolves a key this bundle did not compile. Called once:

```ts
provideReferences(key => screens(core).find(key));
```

Until it is called, a foreign key warns and shows nothing. A key this bundle **did** compile never reaches the lookup — its own component is rendered.

A screen shown from a reference is **shown, not rendered**: there is no component in this realm, so the walk drives the client directly — title, values, and the key each press leads to — for as long as the presses are links. A press that ran the owner's own handler cannot be described, so it does nothing there, and the walk ends.

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

The same shape for an addon's page in the shared addon list, announced under `addon/page`. The page follows from the manifest, so the build compiles one and [`ui(core)`](/docs/config) announces it — an addon that mounts the config UI needs none of this by hand.

| Member | Description |
| --- | --- |
| `provide(reference)` | Publish this addon's page |
| `of(addonId)` | What another addon published |

## Types

```ts
import type { AddonPageReference, AddonScreens } from '@bedrock-core/navigation';
```

Both are envelopes: the version, the owner, and the payload as `unknown`. The renderer owns the real shape and narrows it at the point of use, which is what keeps this package free of the screen format. `isAddonScreens` and `isAddonPageReference` are the envelope checks.

## Notes

Both registries extend `Announcement` from `@bedrock-core/server-runtime`, so they behave like every other cross-addon feed: published once at startup, readable by every realm, and re-read when an addon joins.

An addon that calls `ui(core)` gets both the publishing and the lookup done for it. Write these yourself for a bundle that wants its screens navigable without mounting the config UI.
