---
sidebar_position: 4
description: "effect runs a function now and again whenever one of its listed dependencies changes."
---

# effect

`effect` runs a function now and again whenever one of its listed dependencies changes.

## Import

```ts
import { effect } from '@bedrock-core/observable';
```

## Signature

```ts
effect(run: () => void, deps: readonly ReadonlyObservable<unknown>[], options?: { label?: string }): Unsubscribe
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `run` <Req /> | `() => void` | — | The side effect; runs once now, then on every dependency change |
| `deps` <Req /> | `readonly ReadonlyObservable<unknown>[]` | — | What it reacts to — anything with `get` and `subscribe` |
| `options.label` | `string` | `'effect'` | Named in the log when `run` throws |

## Returns

An `Unsubscribe` that stops the effect. It does not run `run` again.

## Usage

```ts
const phase = observable<'lobby' | 'fight' | 'end'>('lobby');

const stop = effect(() => {
  bossBar.setTitle(phase.get());   // runs now with 'lobby', then on every change
}, [phase]);

stop();
```

## Examples

### Keeping engine state in step with a value

```ts
effect(() => {
  world.gameRules.pvp = config.server.pvp.get();
}, [config.server.pvp]);
```

### Several dependencies

```ts
effect(() => {
  hud.render(shared.event.get(), aliveCount.get());
}, [shared.event, aliveCount]);
```

## Notes

- **Dependencies are listed, not tracked.** A read inside `run` of an observable not in `deps` does not re-run the effect.
- **A `run` that throws** is reported under `label`; the effect stays subscribed.
- **Inside a [`batch`](./batch.md)**, an effect whose dependencies both changed runs exactly once, at the end.
- `effect` is [`computed`](./computed.md) without a value: the same scheduling, no result.
