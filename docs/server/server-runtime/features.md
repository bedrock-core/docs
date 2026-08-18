---
sidebar_position: 3
---

# FeatureManager

`core.features` declares behaviour that switches itself on when a condition becomes true and off when it stops being true. It is how an addon reacts to `optionalDependencies` without writing its own bookkeeping.

Each feature's enabled flag is published to replicated state automatically, under the [reserved `core-` prefix](./scoped-state.md#reserved-keys), so other addons can read it with `ctx.feature()` or `core.features.of()`.

## Import

```ts
import { core } from '@bedrock-core/server-runtime';
import type { FeatureSpec, FeatureConditionContext, TypedFeatureAccessor } from '@bedrock-core/server-runtime';
```

## Usage

```ts
core.features.add('leaderboard-sync', {
  condition: ctx => ctx.registry.has('drav0011_leaderboard'),
  onEnable() { startSyncingScores(); },
  onDisable() { stopSyncingScores(); },
});
```

The condition is evaluated **immediately** when you call `add()`, and re-evaluated on **every** registry change and **every** replicated-state change. `onEnable` / `onDisable` are edge-triggered — they run only when the result flips.

---

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
Because a condition re-runs on every registry and state change — and state changes include every config-schema, translation and guide broadcast in the world — it must be a fast predicate with no side effects. Do the work in `onEnable` / `onDisable`, never in `condition`.
:::

---

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
| `ctx.state` | Any addon's published values, via the raw [`State`](../sync/state.md) mirror (`ctx.state.get(ns, key)`). |
| `ctx.feature` | Another addon's feature flag, read straight from the state mirror. |

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

### A raw state value

```ts
core.features.add('shop-integration', {
  condition: ctx => ctx.state.get('drav0011_shop', 'shopOpen') === true,
  onEnable() { showShopButton(); },
  onDisable() { hideShopButton(); },
});
```

---

## API

### `add`

```ts
core.features.add(id: string, spec: FeatureSpec): void
```

Declare a feature. Evaluated immediately, then on every registry or state change. Adding the same `id` twice replaces the previous spec and re-evaluates from a disabled baseline.

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

A typed accessor for reading another addon's feature flags. Reads are synchronous, straight from the in-memory state mirror — no RPC.

```ts
type ShopFeatures = 'discount-mode' | 'leaderboard-sync';

const shop = core.features.of<ShopFeatures>('drav0011_shop');

shop.isEnabled('discount-mode');    // ✅ type-checked
shop.isEnabled('unknown-feature');  // ❌ TS error
```

Omit the type parameter for untyped access (`isEnabled(id: string)`). An addon that is offline, or that never declared the feature, reads as `false`.

