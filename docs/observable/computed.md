---
sidebar_position: 3
description: "computed derives a read-only value from other observables, recomputing when any of its listed dependencies changes."
---

# computed

`computed` derives a read-only value from other observables, recomputing when any of its listed dependencies changes.

## Import

```ts
import { computed } from '@bedrock-core/observable';
import type { Computed } from '@bedrock-core/observable';
```

## Signature

```ts
computed<T>(compute: () => T, deps: readonly ReadonlyObservable<unknown>[], options?: ObservableOptions<T>): Computed<T>
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `compute` <Req /> | `() => T` | — | Produces the value; runs once now, then on every dependency change |
| `deps` <Req /> | `readonly ReadonlyObservable<unknown>[]` | — | What it depends on — anything with `get` and `subscribe` |
| `options.equals` | `Equals<T>` | `Object.is` | What counts as a change of the derived value |
| `options.label` | `string` | `'computed'` | Named in the log when `compute` or a listener throws |

## Returns

```ts
interface Computed<T> extends ReadonlyObservable<T> {
  dispose(): void;   // stop following the dependencies; the last value stays readable
}
```

## Usage

```ts
const alive = observable(new Set<string>());
const aliveCount = computed(() => alive.get().size, [alive]);

aliveCount.get();                                   // 0
aliveCount.subscribe(n => scoreboard.set(n));

alive.set(new Set(['steve']));                      // recomputes; listeners hear 1

aliveCount.dispose();
```

## Examples

### Over a config leaf and a shared key

Every accessor in the stack is a `ReadonlyObservable`, so dependencies mix freely:

```ts
const total = computed(
  () => shared.price.get() * config.server.taxRate.get(),
  [shared.price, config.server.taxRate],
);
```

### A derived value that rarely changes

`equals` on the result keeps downstream listeners quiet when the input moved but the answer did not:

```ts
const tier = computed(() => (balance.get() > 1000 ? 'gold' : 'iron'), [balance]);
```

The default `Object.is` already does this for a primitive; pass `equals` when the result is an object.

## Notes

- **Dependencies are listed, not tracked.** A read inside `compute` of an observable not in `deps` is a stale read: it will not trigger a recompute.
- **A `compute` that throws** is reported under `label` and the previous value is kept.
- **Inside a [`batch`](./batch.md)**, a computed whose dependencies both changed recomputes exactly once, at the end.
- **`dispose()`** releases the dependency subscriptions. The computed's own listeners are not released — the value simply stops changing.
