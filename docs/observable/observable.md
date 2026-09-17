---
sidebar_position: 2
description: "observable creates a value with get, set and subscribe, delivering synchronously to listeners that are isolated from each other."
---

# observable

`observable` creates a value with `get`, `set` and `subscribe`, delivering to its listeners synchronously and isolating each from the others.

## Import

```ts
import { observable } from '@bedrock-core/observable';
import type { Observable, ReadonlyObservable, Listener, Unsubscribe, Equals, ObservableOptions } from '@bedrock-core/observable';
```

## Signature

```ts
observable<T>(initial: T, options?: ObservableOptions<T>): Observable<T>
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `initial` <Req /> | `T` | — | The value it starts with |
| `options.equals` | `Equals<T>` | `Object.is` | What counts as a change; a `set` to an equal value notifies nobody |
| `options.label` | `string` | — | Named in the log when a listener throws |

## Returns

```ts
interface ReadonlyObservable<T> {
  get(): T;
  subscribe(listener: Listener<T>): Unsubscribe;
}

interface Observable<T> extends ReadonlyObservable<T> {
  set(next: T | ((prev: T) => T)): void;
}

type Listener<T> = (next: T, prev: T) => void;
```

## Usage

```ts
const phase = observable<'lobby' | 'fight' | 'end'>('lobby');

phase.get();                                   // 'lobby'

const release = phase.subscribe((next, prev) => {
  console.warn(`${prev} -> ${next}`);
});

phase.set('fight');                            // listener runs here, before set returns
phase.set(prev => (prev === 'fight' ? 'end' : prev));

release();
```

## Examples

### An object value

`set` replaces; a listener sees the new object and the one before it. To change one field, build a new object.

```ts
const settings = observable({ volume: 50, muted: false });

settings.set(prev => ({ ...prev, muted: true }));
```

### A custom equality

```ts
const position = observable({ x: 0, y: 0 }, {
  equals: (a, b) => a.x === b.x && a.y === b.y,
  label: 'position',
});

position.set({ x: 0, y: 0 });   // equal: nobody is notified
```

## Notes

- **Synchronous.** A listener runs inside the `set` that changed the value. Inside a [`batch`](./batch.md), delivery waits for the batch to end and happens once per observable with the value it last saw.
- **Isolated.** A listener that throws is reported — `[observable] <label>: listener threw` — and skipped; the others still run.
- **Copy-on-write listeners.** `subscribe` and the release it returns replace the listener list, so removing a listener during delivery is safe and delivery allocates nothing.
- **A subscriber added during delivery** hears the next change, not the one in flight.
