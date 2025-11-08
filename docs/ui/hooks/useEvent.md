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
function useEvent<T, O>(
  signal: { 
    subscribe(callback: (event: T) => void, options?: O): (event: T) => void
    unsubscribe(callback: (event: T) => void): void 
  },
  callback: (event: T) => void,
  options?: O,
  deps?: any[]
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
- Type: `O` (generic)
- Description: Additional options to pass to the subscribe method

#### `deps` (optional)
- Type: `any[]`
- Description: Dependency array. If provided, the hook will re-subscribe when dependencies change.

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
    <Text x={10} y={10} width={300} height={30}>{`Last event: ${lastEvent}`}</Text>
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
      <Text x={10} y={10} width={380} height={30}>Recent Joins</Text>
      {recentPlayers.map((name, index) => (
        <Text key={index} x={10} y={50 + index * 30} width={380} height={30}>{name}</Text>
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
      <Text x={10} y={10} width={300} height={30}>{`Item uses: ${useCount}`}</Text>
      <Text x={10} y={40} width={300} height={30}>{`Last used: ${lastItem}`}</Text>
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
      <Text x={10} y={10} width={380} height={30}>Event Log</Text>
      {eventLog.map((log, index) => (
        <Text key={index} x={10} y={50 + index * 30} width={380} height={30}>{log}</Text>
      ))}
    </Panel>
  );
}
```

## Best Practices

### Manage Dependencies Correctly

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
      console.log(`${event.playerName} joined`);
    }
    // deps not needed
  );
}
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
