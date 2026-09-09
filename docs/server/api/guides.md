---
sidebar_position: 10
description: "core.guides announces each addon's compiled guide as a reference, so the elected host can present every addon's guide without any addon importing another."
---

# core.guides

`core.guides` announces each addon's **compiled guide** across the world, so the [elected host](./host.md) can present every addon's guide — one in-game documentation browser for everything installed, without any addon importing another.

A guide is authored as MDX and compiled by the [`guides` filter](/docs/filters/guides) into screens baked into the addon's own pack, so every client already holds what the guide *says*. What the host needs to present it is small — per screen a compiled title, the entry values and where each press leads — and that is the **reference** an addon announces. `core.guides` is an [`Announcement<GuideReference>`](./announcement.md).

## Import

```ts
import { core } from '@bedrock-core/server';
import type { GuideReference, GuideManifest } from '@bedrock-core/server';
```

## Usage

```ts
import { guideReference } from '@bedrock-core/guides';

core.register({ manifest, guideReference: guideReference(core.id) });   // publish up front
core.guides.provide(guideReference(core.id));                           // or publish/replace later

core.guides.own();                  // this addon's reference
core.guides.of('drav0011_shop');    // another addon's, or undefined
core.guides.namespaces();           // every addon that published one
core.guides.subscribe((namespace) => { … });
```

## What travels

To the runtime a reference is an opaque payload with two known fields:

```ts
interface GuideReference {
  v: 1;
  ns: string;       // the owning addon's namespace
  pages: unknown;   // page id → screen reference, to the renderer
}
```

```
<your namespace>  →  core-guide/reference  →  GuideReference
```

The runtime never looks inside one. Reads verify only that the value is an object carrying `ns` and `pages`; narrow it with `isGuideReference` from `@bedrock-core/guides` before presenting.

## API

`provide`, `own`, `of`, `namespaces` and `subscribe` are the [`Announcement`](./announcement.md#members) members over the reference.

### `manifest`

```ts
core.guides.manifest: Announcement<GuideManifest>

interface GuideManifest {
  tree: unknown;    // sidebar entries in display order
  pages: unknown;   // page id → page data
}
```

The whole compiled manifest, announced under `core-guide/manifest`, for an addon that presents from one rather than from a reference. Declared with `register({ guide })`; read with `core.guides.manifest.of(addonId)`. A host that finds a reference presents from it and renders nothing of the manifest.

## Guides and the host election

Presenting is a job for exactly one realm, so the pattern is:

```ts
if (core.host.isHost) {
  for (const id of core.guides.namespaces()) {
    listGuide(id, core.guides.of(id));
  }
} else {
  void core.rpc.request(core.host.hostId, 'core:ui.open', { playerId: player.id, command: 'guide', args: [] });
}
```

Because the reference is announced rather than fetched, the host already has every guide's index in memory — there is nothing to await. See [HostElection](./host.md).
