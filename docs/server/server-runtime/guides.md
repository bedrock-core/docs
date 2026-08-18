---
sidebar_position: 8
---

# GuidesRegistry

`core.guides` replicates each addon's **compiled guide manifest** across the world, so the [elected host](./host.md) can list and render every addon's guide locally — one in-game documentation browser for everything installed, without any addon importing another.

## Import

```ts
import { core } from '@bedrock-core/server-runtime';
import type { GuideManifest, GuidesChangeListener } from '@bedrock-core/server-runtime';
```

## Usage

```ts
import guides from '@bedrock-core/generated/guides';

core.register({ /* …identity… */, guide: guides });   // publish up front
core.guides.provideManifest(guides);                   // or publish/replace later

core.guides.own();                  // this addon's manifest
core.guides.of('drav0011_shop');    // another addon's manifest, or undefined
core.guides.has('drav0011_shop');   // boolean
core.guides.addonsWithGuides();     // every namespace that published one
core.guides.subscribe(() => { /* … */ });
```

---

## What a manifest is

A guide is authored as Markdown and compiled by the `guides` Regolith filter into `@bedrock-core/generated/guides`. To the runtime it is an opaque payload with two known fields:

```ts
interface GuideManifest {
  tree: unknown;    // sidebar entries in display order
  pages: unknown;   // page id → page data
}
```

The framework stores and replicates manifests **without ever looking inside one**. The detailed intermediate representation belongs to the renderer, `@bedrock-core/guides`, which is the only code that interprets it.

Extra fields the filter emits (`v`, `ns`, `defaultLocale`, `locales`) ride along unmentioned and untouched.

```
<your namespace>  →  core-guide/manifest  →  GuideManifest
```

Each addon publishes under its own namespace, so an addon that loads late still receives every guide.

Reads verify only that the value is an object carrying `tree` and `pages`. Narrow it properly with `isGuideManifest` from `@bedrock-core/guides` before rendering.

---

## API

### `provideManifest`

```ts
core.guides.provideManifest(manifest: GuideManifest): void
```

Publish this addon's compiled manifest so peers can render it without an RPC round trip. Usually declared up front through `register({ guide })`; call this directly to publish late or replace it.

### `own`

```ts
core.guides.own(): GuideManifest | undefined
```

This addon's own manifest, or `undefined` if it never published one.

### `of`

```ts
core.guides.of(addonId: string): GuideManifest | undefined
```

Another addon's manifest. Local-mirror read — synchronous, no RPC.

### `has`

```ts
core.guides.has(addonId: string): boolean
```

Whether the given addon published a guide.

### `addonsWithGuides`

```ts
core.guides.addonsWithGuides(): string[]
```

Every namespace that published a manifest. Cached and rebuilt on change.

```ts
for (const id of core.guides.addonsWithGuides()) {
  const addon = core.registry.get(id);

  console.warn(`${addon?.packName ?? id} ships a guide`);
}
```

### `subscribe`

```ts
core.guides.subscribe(listener: GuidesChangeListener): Unsubscribe

type GuidesChangeListener = () => void;
```

Fires when **any** addon's published guide changes. Coarse and payload-free — re-read through `of()` / `addonsWithGuides()`.

---

## Guides and the host election

Rendering is a job for exactly one realm, so the pattern is:

```ts
if (core.host.isHost) {
  // We run the newest runtime in this world — render every published guide ourselves.
  for (const id of core.guides.addonsWithGuides()) {
    listGuide(id, core.guides.of(id));
  }
} else {
  // Forward to whoever is hosting.
  void core.rpc.request(core.host.hostId, 'core:ui.open', { playerId: player.id, command: 'guide', args: [] });
}
```

Because the manifest is replicated rather than fetched, the host already has every guide in memory — there is nothing to await. See [HostElection](./host.md).
