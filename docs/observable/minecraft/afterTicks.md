---
slug: /afterTicks
sidebar_position: 1
description: "afterTicks creates a reusable Minecraft tick scheduler for debounce, with cancellation through system.clearRun."
---

# afterTicks

`afterTicks` creates a reusable Minecraft tick scheduler for [`debounce`](../api/debounce.md).

## Import

```ts
import { afterTicks } from '@bedrock-core/observable/minecraft';
import type { DebounceScheduler } from '@bedrock-core/observable';
```

Also exported from `@bedrock-core/server/observable`. The `/minecraft` entry imports both `@minecraft/server` and `@minecraft/server-ui`; declare both modules in the behavior pack manifest.

## Signature

```ts
afterTicks(ticks: number): DebounceScheduler
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `ticks` <Req /> | `number` | — | A non-negative safe integer specifying the delay in Minecraft ticks |

Invalid delays throw `RangeError` when `afterTicks` is called, before a timer is scheduled.

## Returns

```ts
type DebounceScheduler = (callback: () => void) => Unsubscribe;
```

Creating the scheduler starts no timer. Each invocation schedules a separate `system.runTimeout` and returns a cancellation function that calls `system.clearRun` with that invocation's run ID.

## Usage

```ts
import { debounce, observable } from '@bedrock-core/observable';
import { afterTicks } from '@bedrock-core/observable/minecraft';

const query = observable('');
const settledQuery = debounce(query, afterTicks(5));

settledQuery.subscribe(next => console.warn(next));
query.set('stone');
query.set('stone bricks');
```

Each change restarts the five-tick wait. The debounced observable publishes only the latest value after the quiet period. Call `settledQuery.dispose()` when its owner ends to cancel pending delivery and release the source subscription.

## Examples

### Reuse a delay

```ts
const settle = afterTicks(10);
const settledPrice = debounce(price, settle);
const settledStock = debounce(stock, settle);
```

Each observable owns its timer; resetting or disposing one does not cancel the other.

## Notes

- Tick timing follows Minecraft's [`system.runTimeout`](https://learn.microsoft.com/minecraft/creator/documents/scripting/system-run-guide#the-systemruntimeout-method) semantics. A zero delay means the current tick or as soon as possible.
- The main `@bedrock-core/observable` entry remains independent of Minecraft. Tick scheduling is exposed through `/minecraft`.
