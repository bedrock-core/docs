---
slug: /debounce
sidebar_position: 7
description: "debounce publishes the latest source value after a quiet period controlled by a caller-provided scheduler."
---

# debounce

`debounce` creates a read-only observable that publishes the latest source value after a quiet period controlled by a scheduler.

## Import

```ts
import { debounce } from '@bedrock-core/observable';
import type { Debounced, DebounceScheduler } from '@bedrock-core/observable';
```

Also exported from `@bedrock-core/server/observable`.

## Signature

```ts
debounce<T>(source: ReadonlyObservable<T>, schedule: DebounceScheduler, options?: ObservableOptions<T>): Debounced<T>
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `source` <Req /> | `ReadonlyObservable<T>` | — | Provides the initial value and subsequent changes |
| `schedule` <Req /> | `DebounceScheduler` | — | Defers one callback for the quiet period and returns its cancellation function |
| `options.equals` | `Equals<T>` | `Object.is` | Compares the incoming value with the last published value |
| `options.label` | `string` | — | Named in the log when a listener throws |

## Returns

```ts
type DebounceScheduler = (callback: () => void) => Unsubscribe;

interface Debounced<T> extends ReadonlyObservable<T> {
  dispose(): void;
}
```

The returned value starts at `source.get()`. Each source notification cancels the pending callback and schedules another. `get()` retains the last published value while waiting. Listeners receive the settled value and the previously published value as `(next, prev)`.

`dispose()` releases the source subscription and cancels pending delivery. The last published value remains readable.

## Usage

```ts
import { debounce, observable } from '@bedrock-core/observable';
import { afterTicks } from '@bedrock-core/observable/minecraft';

const query = observable('');
const settledQuery = debounce(query, afterTicks(5));

settledQuery.subscribe(next => console.warn(next));
query.set('stone');
query.set('stone bricks'); // publishes only this value after five quiet ticks
```

Call `settledQuery.dispose()` when its owner ends. [`afterTicks`](../minecraft/afterTicks.md) provides Minecraft tick scheduling and cancellation through the `/minecraft` entry. The main entry remains independent of Minecraft.

## Examples

### A computed value after settling

```ts
import { computed } from '@bedrock-core/observable';

const length = computed(() => settledQuery.get().length, [settledQuery]);
```

The computed reads the last published value and recomputes on a debounced notification.

## Notes

- The scheduler owns the delay and its units. It must defer the callback and return a cancellation function that does not throw.
- The source subscription is eager, so the value settles even when it has no downstream listeners.
- A source change that returns to the last published value produces no notification under the default equality check.
- A [`batch`](./batch.md) produces one source notification with its final value, so it schedules one delivery.
- Disposing twice is safe. Each downstream subscription still has its own unsubscribe function.
- Listeners are isolated using the same error reporting as [`observable`](./observable.md).
