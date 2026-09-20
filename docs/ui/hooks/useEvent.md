---
sidebar_position: 10
description: "Subscribe to global Minecraft events within your UI components."
---
# useEvent

Subscribe to global Minecraft events within your UI components.

## Import

```tsx
import { useEvent } from '@bedrock-core/ui';
```

## Signature

```tsx
function useEvent<T, O>(
  signal: { 
    subscribe(callback: (event: T) => void, options?: O): (event: T) => void
    unsubscribe(callback: (event: T) => void): void 
  },
  callback: (event: T) => void,
  options?: O,
  deps?: unknown[]
): void
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `signal` | Signal object with `subscribe()` and `unsubscribe()` methods | The event signal to subscribe to. Signals are typically found in Minecraft's `world.afterEvents` or `world.beforeEvents` objects (e.g., `world.afterEvents.playerJoin`, `world.afterEvents.buttonPush`) |
| `callback` | `(event: T) => void` | The callback function that will be called when the event is emitted |
| `options` | `O` (generic) | Additional options to pass to the subscribe method |
| `deps` | `any[]` | Dependency array. If provided, the hook will re-subscribe when dependencies change |

### Returns

`void`

## Usage

```tsx
import { world } from '@minecraft/server';
import { useEvent } from '@bedrock-core/ui';

function EventListener() {
  const [lastEvent, setLastEvent] = useState('None');

  useEvent(
    world.afterEvents.playerJoin,
    (event) => {
      setLastEvent(event.playerName);
    }
  );

  return (
    <Panel padding={10}>
      <Text>{`Last event: ${lastEvent}`}</Text>
    </Panel>
  );
}
```

## Examples

### Item use counter

```tsx
import { world } from '@minecraft/server';
import { useEvent } from '@bedrock-core/ui';

function ItemUseTracker() {
  const [useCount, setUseCount] = useState(0);
  const [lastItem, setLastItem] = useState('None');

  useEvent(
    world.afterEvents.itemUse,
    (event) => {
      setUseCount(prev => prev + 1);
      setLastItem(event.itemStack.typeId);
    }
  );

  return (
    <Panel padding={10} gap={4}>
      <Text>{`Item uses: ${useCount}`}</Text>
      <Text>{`Last used: ${lastItem}`}</Text>
    </Panel>
  );
}
```

### Multiple event listeners

```tsx
import { world } from '@minecraft/server';
import { useEvent } from '@bedrock-core/ui';

function MultiEventTracker() {
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEvent(
    world.afterEvents.playerJoin,
    (event) => {
      setEventLog(prev => [...prev, `${event.playerName} joined`].slice(-5));
    }
  );

  useEvent(
    world.afterEvents.playerLeave,
    (event) => {
      setEventLog(prev => [...prev, `${event.playerName} left`].slice(-5));
    }
  );

  return (
    <Panel padding={10} gap={4}>
      <Text>{'§lEvent Log'}</Text>
      {eventLog.map((log, index) => (
        <Text key={index}>{log}</Text>
      ))}
    </Panel>
  );
}
```

## Notes

### Manage dependencies correctly

```tsx
// ✅ Good - include dependencies used inside the callback
function EventHandler() {
  const player = usePlayer();

  useEvent(
    world.afterEvents.entityHealthChanged,
    (event) => {
      // Using player inside - add to deps
      if (event.entity.id === player.id) {
        handleHealthChange(event);
      }
    },
    undefined,
    [player]
  );
}

// ✅ Good - no external dependencies needed
function EventHandler() {
  useEvent(
    world.afterEvents.playerJoin,
    (event) => {
      // No external dependencies used
      console.warn(`${event.playerName} joined`);
    }
    // deps not needed
  );
}
```

### Avoid heavy operations in handlers

```tsx
// ✅ Good - update state, process elsewhere
useEvent(signal, (event) => {
  setData(event.data);
});

// ❌ Bad - heavy computation in handler
useEvent(signal, (event) => {
  const result = expensiveOperation(event.data);
  setData(result);
});
```
