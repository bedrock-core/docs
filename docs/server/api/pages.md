---
sidebar_position: 11
description: "core.pages announces an addon's page in the shared addon list, as a reference the elected host draws from."
---

# core.pages

`core.pages` announces an addon's page in the shared addon list — the screen a player reaches by pressing the addon's row — as a reference the [elected host](./host.md) draws from.

The page is a compiled screen baked into the addon's own pack, so every client already holds it. What the host needs to draw it into the list is small: per reserved entry, the value it is shown with and where a press leads. `core.pages` is an [`Announcement<AddonPageReference>`](./announcement.md) over exactly that.

## Import

```ts
import { core } from '@bedrock-core/server';
import type { AddonPageReference } from '@bedrock-core/server';
```

## Usage

```ts
import { addonPageReference } from '@bedrock-core/config/compiled';
import AddonPage from './screens/addon.screen';

core.register({ manifest, page: addonPageReference(AddonPage) });   // publish up front
core.pages.provide(addonPageReference(AddonPage));                  // or publish/replace later

core.pages.of('drav0011_shop');                                     // a peer's, or undefined
```

## What travels

```ts
interface AddonPageReference {
  v: 1;
  values: unknown;    // per reserved entry, the value it is shown with; string[] to the renderer
  targets: unknown;   // per reserved entry, where a press leads
}
```

```
<your namespace>  →  core-addon/page  →  AddonPageReference
```

The runtime never looks inside a reference; [`@bedrock-core/config`](/docs/config) owns the shape and narrows it at the point of use. Reads verify only that the value is an object carrying `values` and `targets`.

## API

`provide`, `own`, `of`, `namespaces` and `subscribe` — the [`Announcement`](./announcement.md#members) members.
