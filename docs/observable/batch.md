---
sidebar_position: 5
description: "batch runs several writes and delivers every notification they caused once, afterwards, in order."
---

# batch

`batch` runs several writes and delivers every notification they caused once, afterwards, in order.

## Import

```ts
import { batch } from '@bedrock-core/observable';
```

## Signature

```ts
batch(fn: () => void): void
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `fn` <Req /> | `() => void` | — | The writes to group; runs immediately |

## Returns

Nothing. Every listener the writes affected has run by the time `batch` returns.

## Usage

```ts
const phase = observable('fight');
const alive = observable(new Set(['steve', 'alex']));

batch(() => {
  phase.set('end');
  alive.set(new Set());
});
// phase's listeners ran once with ('end', 'fight'); alive's ran once
```

## Examples

### A value that changes and changes back

```ts
batch(() => {
  volume.set(0);
  volume.set(50);   // back to what listeners last saw
});
// nobody is notified
```

### A computed over two changed inputs

```ts
const total = computed(() => price.get() * quantity.get(), [price, quantity]);

batch(() => {
  price.set(10);
  quantity.set(3);
});
// total recomputed once, from (10, 3)
```

## Notes

- **Nested batches flush at the outermost.** A `batch` inside a `batch` is part of the outer one.
- **Order is preserved.** Notifications are delivered in the order the observables were first written.
- **A flush is itself a batching window.** A listener that sets another observable during delivery queues it behind the current one instead of interleaving, and it is delivered in the same synchronous pass.
- Outside a batch, delivery is synchronous inside `set`; `batch` is the only thing that defers.
