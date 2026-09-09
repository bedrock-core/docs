---
sidebar_position: 6
description: "last turns an event into a value: the most recent payload from any signal with subscribe, undefined before the first."
---

# last

`last` turns an event into a value: the most recent payload from any signal with `subscribe`, `undefined` before the first.

## Import

```ts
import { last } from '@bedrock-core/observable';
import type { Last, Signal } from '@bedrock-core/observable';
```

## Signature

```ts
last<E, O = never>(signal: Signal<E, O>, options?: ObservableOptions<E | undefined> & { on?: O }): Last<E>
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `signal` <Req /> | `Signal<E, O>` | — | Anything with `subscribe(callback)` — an engine event signal, a `core.events` node, your own |
| `options.on` | `O` | — | Passed to `subscribe` as its second argument, for a signal that filters (the engine's `EntityEventOptions`) |
| `options.equals` | `Equals<E \| undefined>` | `Object.is` | What counts as a new payload |
| `options.label` | `string` | — | Named in the log when a listener throws |

```ts
interface Signal<E, O = never> {
  subscribe(callback: (event: E) => void, options?: O): unknown;
  unsubscribe?(callback: (event: E) => void): void;
}
```

## Returns

```ts
interface Last<E> extends ReadonlyObservable<E | undefined> {
  dispose(): void;   // stop following the signal; the last value stays readable
}
```

## Usage

```ts
import { world } from '@minecraft/server';

const spawn = last(world.afterEvents.playerSpawn);

spawn.get();                                            // undefined until someone spawns
spawn.subscribe(event => console.warn(event?.player.name));

const lastName = computed(() => spawn.get()?.player.name, [spawn]);

spawn.dispose();                                        // releases the engine subscription
```

## Examples

### A filtered engine event

```ts
const hurt = last(world.afterEvents.entityHurt, { on: { entityTypes: ['minecraft:player'] } });
```

### A peer's event as a value

```ts
const purchases = core.events.of<EconomyEvents>('drav0011_economy');
const lastPurchase = last(purchases.purchase);

effect(() => hud.setLastSale(lastPurchase.get()), [lastPurchase]);
```

## Notes

- **Eager.** The subscription is taken when `last` is called, so nothing is missed between creation and the first read; `dispose()` ends it.
- **Both signal shapes work.** The engine's `subscribe` returns the callback and releases through `unsubscribe(callback)`; the framework's returns a release function. `dispose` tells them apart by identity.
- **Use it on `afterEvents`, never `beforeEvents`.** A before-event payload is the event in flight; keeping it past the handler is a stale handle.
- A payload equal to the previous one — by `Object.is` unless `equals` says otherwise — notifies nobody. Engine payloads are fresh objects each time, so every event counts.
