---
sidebar_position: 9
---
# useEvent

Subscribe to global Minecraft events within your UI components.

## Import

```tsx
import { useEvent } from '@bedrock-core/ui';
```

## Signature

```tsx
function useEvent<T, O = Record<string, unknown>>(
  signal: { 
    subscribe(cb: (e: T) => void, options?: O): (e: T) => void
    unsubscribe(cb: (e: T) => void): void 
  },
  callback: (event: T) => void,
  options?: O,
  deps?: readonly unknown[]
): void
```

### Parameters

#### `signal`
- Type: Signal object with `subscribe()` and `unsubscribe()` methods
- Description: The event signal to subscribe to. Signals are typically found in Minecraft's `world.afterEvents` or `world.beforeEvents` objects (e.g., `world.afterEvents.playerJoin`, `world.afterEvents.buttonPush`). 

#### `callback`
- Type: `(event: T) => void`
- Description: The callback function that will be called when the event is emitted

#### `options` (optional)
- Type: `O` (generic, defaults to `Record<string, unknown>`)
- Description: Additional options to pass to the subscribe method

#### `deps` (optional)
- Type: `readonly unknown[]`
- Description: Dependency array. If provided, the hook will re-subscribe when dependencies change. If omitted, dependencies will automatically include signal, callback, and options

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
    <Text x={10} y={10} width={300} height={30} value={`Last event: ${lastEvent}`} />
  );
}
```

## Examples

### Player Join Notification

```tsx
import { world } from '@minecraft/server';
import { useEvent } from '@bedrock-core/ui';

function PlayerJoinNotification() {
  const [recentPlayers, setRecentPlayers] = useState<string[]>([]);
  
  useEvent(
    world.afterEvents.playerJoin,
    (event) => {
      setRecentPlayers(prev => [...prev, event.playerName].slice(-5));
    }
  );
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30} value="Recent Joins" />
      {recentPlayers.map((name, index) => (
        <Text key={index} x={10} y={50 + index * 30} width={380} height={30} value={name} />
      ))}
    </Panel>
  );
}
```

### Item Use Counter

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
    <>
      <Text x={10} y={10} width={300} height={30} value={`Item uses: ${useCount}`} />
      <Text x={10} y={40} width={300} height={30} value={`Last used: ${lastItem}`} />
    </>
  );
}
```

### Multiple Event Listeners

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
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30} value="Event Log" />
      {eventLog.map((log, index) => (
        <Text key={index} x={10} y={50 + index * 30} width={380} height={30} value={log} />
      ))}
    </Panel>
  );
}
```

## Best Practices

### Manage Dependencies Correctly

```tsx
// ✅ Good - provide explicit dependencies
function EventHandler() {
  const player = usePlayer();
  
  useEvent(
    signal,
    (event) => {
      // Use player
    },
    undefined
    [player]
  );
}

// ⚠️ Caution - hook manages dependencies automatically if not provided
function EventHandler() {
  useEvent(signal, (event) => {
    // Hook will auto-include callback in dependencies
  });
}
```

### Type Event Payloads

```tsx
// ✅ Good - typed event
interface PlayerJoinEvent {
  player: Player;
  timestamp: number;
}

useEvent<PlayerJoinEvent>(signal, (event) => {
  // event is properly typed
});

// ❌ Less ideal - untyped
useEvent(signal, (event) => {
  // event is 'any' type
});
```

### Avoid Heavy Operations in Handlers

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

## Common Patterns

### Event Counter

```tsx
const [count, setCount] = useState(0);

useEvent(signal, () => setCount(c => c + 1));
```

### Latest Event Value

```tsx
const [latest, setLatest] = useState<T | null>(null);

useEvent<T>(signal, (event) => setLatest(event));
```

### Event with Options

```tsx
interface EventOptions {
  debounce?: number;
  throttle?: number;
}

useEvent<T, EventOptions>(
  signal,
  (event) => {
    // Handle event
  },
  { debounce: 300 } // Pass options
);
```
