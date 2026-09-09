---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/observable is the reactive primitive the stack notifies through: a value with get, set and subscribe, plus computed, effect, batch and last."
---

# observable

`@bedrock-core/observable` is the reactive primitive the stack notifies through: a value with three verbs — `get` / `set` / `subscribe` — the same three a config leaf has, a shared key has, a db document has, and Minecraft's own data-driven UI observables have.

:::caution Pre-1.0
`@bedrock-core/observable` is under active development. Breaking changes can still land until `1.0.0` — pin exact versions and read the release notes before upgrading.
:::

## What is @bedrock-core/observable?

Every accessor in the server stack *is* one of these, so what you learn here applies to `config.server.taxRate`, `shared.price` and `balances.for(player)` alike, and the derived forms — `computed`, `effect`, `last` — compose with all of them.

Pure TypeScript. Nothing in the main entry imports the engine, so it runs in vitest exactly as it runs in a realm. The one bridge to `@minecraft/server-ui` is a separate entry, `@bedrock-core/observable/minecraft`.

## Install

<Install pkg="@bedrock-core/observable" />

Or reach it through the meta package, which pins a matching version:

```ts
import { observable, computed, effect, batch, last, toNative } from '@bedrock-core/server/observable';
```

`@minecraft/server-ui` (`>=2.1.0`) is an optional peer dependency, needed only by [`toNative`](./toNative.md).

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

## What you get

- **Synchronous** — a listener runs inside the `set` that changed the value, in the same tick, so what you read after a write is what every listener has already seen. [`batch`](./batch.md) is the only thing that defers, and it delivers at its end, in order.
- **Immutable values, `Object.is` by default** — `set` replaces; an observable of an object gets a new object. Pass `equals` to change what counts as a change, so a listener never fires for a value that did not.
- **Listed dependencies** — [`computed`](./computed.md) and [`effect`](./effect.md) take their dependencies explicitly: no proxy, no tracking, no cost on reads.
- **Isolated listeners** — one that throws is reported with the observable's `label` and skipped; the rest still run, so one screen's bug cannot stop another's update.
- **`ReadonlyObservable<T>`** — what `computed` returns and what anything exposing a value it owns hands out, so a consumer cannot `set` what is not theirs.
- **[`last`](./last.md)** — an event as a value: the most recent payload, `undefined` before the first, from any signal with `subscribe`.

## Next steps

- [`observable`](./observable.md) — a value with `get`, `set` and `subscribe`
- [`computed`](./computed.md) — a read-only value derived from others
- [`effect`](./effect.md) — run something now and whenever a dependency changes
- [`batch`](./batch.md) — several writes, one notification each
- [`last`](./last.md) — an event's most recent payload as a value
- [`toNative`](./toNative.md) — bind one to a data-driven form's own observable
