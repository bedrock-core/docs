---
sidebar_position: 5
description: "Read an observable into a component and keep it current, the way a state change is kept."
---
# useObservable

Reads an observable, and keeps the component's copy of it current. A change lands the way a [`useState`](./useState.md) change does.

## Import

```tsx
import { useObservable } from '@bedrock-core/ui';
```

## Signature

```ts
function useObservable<T>(source: ObservableLike<T>): T;
function useObservable<T, S>(source: ObservableLike<T>, select: (value: T) => S): S;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `source`<Req /> | `ObservableLike<T>` | — | Anything with `get()` and `subscribe(listener)` |
| `select` | `(value: T) => S` | — | Narrows what the component depends on, so only a change to the slice counts |

## Returns

The current value, or the selected slice of it.

## What counts as an observable

`ObservableLike<T>` is structural: `get()` for the current value, `subscribe(listener)` for the next ones, returning an unsubscribe.

```ts
interface ObservableLike<T> {
  get(): T;
  subscribe(listener: (next: T, prev: T) => void): () => void;
}
```

[`@bedrock-core/observable`](/docs/observable)'s `ReadonlyObservable`, a [config](/docs/config) leaf, a [db](/docs/db) document and a query all have that shape.

## Usage

```tsx
const phase = useObservable(phaseObs);
```

## Examples

### Only react to a slice

```tsx
function PlayerCount(): JSX.Element {
  const count = useObservable(playersObs, players => players.size);

  return <Text maxLength={3}>{String(count)}</Text>;
}
```

A change to the collection that leaves its size alone schedules nothing. Equality is `Object.is`, applied by the state slot.

### A config value

With `config` the accessor `register()` handed back:

```tsx
function Currency(): JSX.Element {
  const symbol = useObservable(config.server.economy.currency);

  return <Text maxLength={4}>{symbol}</Text>;
}
```

## Notes

A change from the observable is a state change, so when the player sees it depends on the screen:

| Screen | A change |
| --- | --- |
| Form | Is kept, and shows on the next screen the player's press brings up: an open form cannot change |
| Container screen | Updates the screen's live values at once: a `maxLength` text, a `<List>` count, a carried `visible` |

What the build baked stays as the build drew it on both. See [State](../guides/state.md#a-form-change-is-a-new-present).

`select` is read through a ref rather than a dependency, so passing an inline arrow — the usual way to write one — does not resubscribe on every render. The subscription is keyed on the observable alone.

The value can move between a render and the subscription landing, so the hook reads once more before listening. An unchanged value costs nothing.
