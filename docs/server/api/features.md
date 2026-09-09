---
sidebar_position: 3
description: "core.features declares behavior that switches itself on when a condition becomes true and off when it stops being true."
---

# core.features

`core.features` declares behavior that switches itself on when a condition becomes true and off when it stops being true. It is how an addon reacts to `optionalDependencies` without writing its own bookkeeping.

The enabled flags are announced as one record under `core-feature/flags` — `core.features.flags` is the [`Announcement`](./announcement.md) — so other addons can read them with `ctx.feature()` or `core.features.of()`.

## Import

```ts
import { core } from '@bedrock-core/server';
import type { FeatureSpec, FeatureConditionContext, FeatureFlags, TypedFeatureAccessor } from '@bedrock-core/server';
```

## Usage

```ts
core.features.add('leaderboard-sync', {
  condition: ctx => ctx.registry.has('drav0011_leaderboard'),
  onEnable() { startSyncingScores(); },
  onDisable() { stopSyncingScores(); },
});
```

The condition is evaluated **immediately** when you call `add()`, and re-evaluated on **every** registry change and **every** mirror change. `onEnable` / `onDisable` are edge-triggered — they run only when the result flips.

## `FeatureSpec`

```ts
interface FeatureSpec {
  condition(ctx: FeatureConditionContext): boolean;
  onEnable(): void;
  onDisable(): void;
}
```

All three members are **required**. A feature that has nothing to tear down still needs an `onDisable` — write a no-op rather than omitting it.

:::caution `condition` receives a context object, not the registry
The callback's single argument is a `FeatureConditionContext`, so registry lookups read `ctx.registry.has(...)`. The context has no `has` method of its own — a bare `r => r.has(...)` can still compile and then throws at runtime.

```ts
// ✅ correct
condition: ctx => ctx.registry.has('drav0011_leaderboard')

// ❌ wrong — ctx is not the Registry
condition: r => r.has('drav0011_leaderboard')
```
:::

:::warning Conditions must be cheap and pure
Because a condition re-runs on every registry and mirror change — and mirror changes include every announcement and shared write in the world — it must be a fast predicate with no side effects. Do the work in `onEnable` / `onDisable`, never in `condition`.
:::

## `FeatureConditionContext`

```ts
interface FeatureConditionContext {
  registry: Registry;
  state: State;
  feature(addonId: string, featureId: string): boolean;
}
```

| Member | Use it for |
|---|---|
| `ctx.registry` | Peer presence — the full [`Registry`](./registry.md) API. |
| `ctx.state` | The raw [`State`](/docs/sync/state) mirror, for a value no typed surface covers (`ctx.state.get(ns, key)`). |
| `ctx.feature` | Another addon's feature flag, read from its announced record. |

### Another addon's feature flag

```ts
core.features.add('cross-pvp', {
  condition: ctx =>
    ctx.registry.has('drav0011_pvp')
    && ctx.feature('drav0011_pvp', 'arena-mode'),
  onEnable() { hookArenaRewards(); },
  onDisable() { unhookArenaRewards(); },
});
```

### A peer's shared value

```ts
const shop = core.shared.of<ShopShared>('drav0011_shop');

core.features.add('shop-integration', {
  condition: () => shop?.open.get() === true,
  onEnable() { showShopButton(); },
  onDisable() { hideShopButton(); },
});
```

The condition is re-run on every mirror change, so a [`core.shared`](./shared.md) read inside it is enough — no subscription needed.

## API

### `add`

```ts
core.features.add(id: string, spec: FeatureSpec): void
```

Declare a feature. Evaluated immediately, then on every registry or mirror change. Adding the same `id` twice replaces the previous spec and re-evaluates from a disabled baseline.

### `isEnabled`

```ts
core.features.isEnabled(id: string): boolean
```

Whether one of **your own** features is currently on. Unknown ids return `false`.

### `of`

```ts
core.features.of<T extends string = string>(addonId: string): TypedFeatureAccessor<T>

interface TypedFeatureAccessor<T extends string> {
  isEnabled(id: T): boolean;
}
```

A typed accessor for reading another addon's feature flags. Reads are synchronous, from the record it announced — no RPC.

```ts
type ShopFeatures = 'discount-mode' | 'leaderboard-sync';

const shop = core.features.of<ShopFeatures>('drav0011_shop');

shop.isEnabled('discount-mode');    // ✅ type-checked
shop.isEnabled('unknown-feature');  // ❌ TS error
```

Omit the type parameter for untyped access (`isEnabled(id: string)`). An addon that is offline, or that never declared the feature, reads as `false`.

### `flags`

```ts
core.features.flags: Announcement<FeatureFlags>

type FeatureFlags = Record<string, boolean>;
```

Every addon's flags as one record each, the [`Announcement`](./announcement.md) behind `of()` and `ctx.feature()`. Republished whole whenever one of this addon's features flips; a feature that has never been enabled is absent from it.

