---
sidebar_position: 5
description: "Re-render the component when an observable changes, optionally only on a selected slice."
---
# useObservable

Re-renders the component when an observable changes.

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
| `select` | `(value: T) => S` | — | Narrows what the component depends on, so it only re-renders when the slice changes |

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

[`@bedrock-core/observable`](/docs/observable)'s `ReadonlyObservable`, a [config](/docs/config) leaf, a [db](/docs/db) document and a query all have that shape. Matching on shape rather than on an import is what keeps the UI free of a dependency on the server framework.

## Usage

```tsx
const phase = useObservable(phaseObs);
```

## Examples

### Only re-render when the slice changes

```tsx
function PlayerCount(): JSX.Element {
  const count = useObservable(playersObs, players => players.size);

  return <Text maxLength={3}>{String(count)}</Text>;
}
```

A screen showing a count is not woken by every mutation of the collection behind it. Equality is `Object.is`, applied by the state slot, so a slice that reads equal schedules nothing.

### A config value

```tsx
function Currency(): JSX.Element {
  const symbol = useObservable(core.config.server.economy.currency);

  return <Text maxLength={4}>{symbol}</Text>;
}
```

## Notes

`select` is read through a ref rather than a dependency, so passing an inline arrow — the usual way to write one — does not resubscribe on every render. The subscription is keyed on the observable alone.

The value can move between a render and the subscription landing, so the hook reads once more before listening. An unchanged value costs nothing.

On a form, a change still does not repaint what the player is looking at: a form cannot be mutated while open, so the new value shows on their next press. See [State](../guides/state.md#a-form-change-is-a-new-present).
