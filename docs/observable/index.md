---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/observable provides reactive values, computed state, effects, batching and debounce with Minecraft tick scheduling."
---

# observable

`@bedrock-core/observable` is the reactive primitive the stack notifies through: a value with three verbs — `get` / `set` / `subscribe` — the same three a config leaf has, a shared key has, a db document has, and Minecraft's own data-driven UI observables have.

:::caution Beta
`@bedrock-core/observable` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## What is @bedrock-core/observable?

Every accessor in the server stack *is* one of these, so what you learn here applies to `config.server.taxRate`, `shared.price` and `balances.for(player)` alike, and the derived forms — `computed`, `effect`, `last`, `debounce` — compose with all of them.

Pure TypeScript. Nothing in the main entry imports the engine. Minecraft adapters live at `@bedrock-core/observable/minecraft`: [`afterTicks`](./minecraft/afterTicks.md) schedules deliveries in ticks, and [`toNative`](./minecraft/toNative.md) bridges data-driven UI observables.

## Install

<Install pkg="@bedrock-core/observable" />

Or reach it through the meta package, which pins a matching version:

```ts
import { observable, computed, effect, batch, last, debounce, afterTicks, toNative } from '@bedrock-core/server/observable';
```

The `/minecraft` entry imports `@minecraft/server` (`>=2.0.0`) and `@minecraft/server-ui` (`>=2.1.0`). Both are optional peer dependencies when using only the main entry.

## Usage

```ts
import { observable, computed, effect, batch, last } from '@bedrock-core/observable';

const phase = observable<'lobby' | 'fight' | 'end'>('lobby');
const alive = observable(new Set<string>());
const aliveCount = computed(() => alive.get().size, [alive]);

effect(() => bossBar.setTitle(phase.get()), [phase]);   // runs now and on every change
aliveCount.subscribe((next, prev) => scoreboard.set(next));

batch(() => {                                            // one notification per observable
  phase.set('end');
  alive.set(new Set());
});

const spawn = last(world.afterEvents.playerSpawn);       // undefined, then each payload
```

### Debounce in Minecraft ticks

```ts
import { debounce, observable } from '@bedrock-core/observable';
import { afterTicks } from '@bedrock-core/observable/minecraft';

const count = observable(0);
const settledCount = debounce(count, afterTicks(5));

settledCount.subscribe((next, prev) => console.warn(`${prev} -> ${next}`));
count.set(1);
count.set(2);
count.set(3);
```

Each change restarts the wait. After five quiet ticks, the listener receives `(3, 0)`. `count.get()` changes immediately; `settledCount.get()` retains the last published value until delivery. Call `settledCount.dispose()` when its owner ends to cancel pending delivery and release the source subscription.

## What you get

- **Synchronous by default** — a listener runs inside the `set` that changed the value. [`batch`](./api/batch.md) delivers at its end, in order; [`debounce`](./api/debounce.md) publishes a derived value after a scheduled quiet period.
- **Immutable values, `Object.is` by default** — `set` replaces; an observable of an object gets a new object. Pass `equals` to change what counts as a change, so a listener never fires for a value that did not.
- **Listed dependencies** — [`computed`](./api/computed.md) and [`effect`](./api/effect.md) take their dependencies explicitly: no proxy, no tracking, no cost on reads.
- **Isolated listeners** — one that throws is reported with the observable's `label` and skipped; the rest still run, so one screen's bug cannot stop another's update.
- **`ReadonlyObservable<T>`** — what `computed` returns and what anything exposing a value it owns hands out, so a consumer cannot `set` what is not theirs.
- **[`last`](./api/last.md)** — an event as a value: the most recent payload, `undefined` before the first, from any signal with `subscribe`.
- **[`debounce`](./api/debounce.md)** — the latest source value after a quiet period, with caller-provided scheduling and cancellation.

## Next steps

- [`observable`](./api/observable.md) — a value with `get`, `set` and `subscribe`
- [`computed`](./api/computed.md) — a read-only value derived from others
- [`effect`](./api/effect.md) — run something now and whenever a dependency changes
- [`batch`](./api/batch.md) — several writes, one notification each
- [`last`](./api/last.md) — an event's most recent payload as a value
- [`debounce`](./api/debounce.md) — publish the latest value after a quiet period
- [`afterTicks`](./minecraft/afterTicks.md) — schedule delivery in Minecraft ticks
- [`toNative`](./minecraft/toNative.md) — bind one to a data-driven form's own observable
