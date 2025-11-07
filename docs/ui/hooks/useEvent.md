---
sidebar_position: 9
---
# useEvent

Subscribe to global Minecraft events within your UI components.

## Import

```tsx
import { useEvent, EventSignal } from '@bedrock-core/ui';
```

## Signature

```tsx
function useEvent<T>(eventKey: string): EventSignal<T>
```

## Usage

```tsx
function EventListener() {
  const playerJoin = useEvent('playerJoin');
  const [lastPlayer, setLastPlayer] = useState('None');
  
  useEffect(() => {
    const unsubscribe = playerJoin.subscribe((event) => {
      setLastPlayer(event.player.name);
    });
    
    return unsubscribe;
  }, [playerJoin]);
  
  return (
    <Text x={10} y={10}>
      Last player joined: {lastPlayer}
    </Text>
  );
}
```

## Parameters

### `eventKey`
- Type: `string`
- Description: Unique identifier for the event to subscribe to

## Returns

- Type: `EventSignal<T>`
- Description: An event signal object with `subscribe()` and `unsubscribe()` methods

### EventSignal Interface

```tsx
interface EventSignal<T> {
  subscribe(callback: (event: T) => void): () => void;
  unsubscribe(callback: (event: T) => void): void;
  emit(event: T): void;
}
```

## Examples

### Player Join Notification

```tsx
function PlayerJoinNotification() {
  const playerJoin = useEvent<{ player: Player }>('playerJoin');
  const [recentPlayers, setRecentPlayers] = useState<string[]>([]);
  
  useEffect(() => {
    return playerJoin.subscribe((event) => {
      setRecentPlayers(prev => [...prev, event.player.name].slice(-5));
    });
  }, [playerJoin]);
  
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
function ItemUseTracker() {
  const itemUse = useEvent<{ itemStack: ItemStack }>('itemUse');
  const [useCount, setUseCount] = useState(0);
  const [lastItem, setLastItem] = useState('None');
  
  useEffect(() => {
    return itemUse.subscribe((event) => {
      setUseCount(prev => prev + 1);
      setLastItem(event.itemStack.typeId);
    });
  }, [itemUse]);
  
  return (
    <>
      <Text x={10} y={10} width={300} height={30} value={`Item uses: ${useCount}`} />
      <Text x={10} y={40} width={300} height={30} value={`Last used: ${lastItem}`} />
    </>
  );
}
```

### Block Break Statistics

```tsx
interface BlockBreakEvent {
  block: Block;
  player: Player;
}

function BlockBreakStats() {
  const blockBreak = useEvent<BlockBreakEvent>('blockBreak');
  const [blockCount, setBlockCount] = useState<Record<string, number>>({});
  
  useEffect(() => {
    return blockBreak.subscribe((event) => {
      const blockType = event.block.typeId;
      setBlockCount(prev => ({
        ...prev,
        [blockType]: (prev[blockType] || 0) + 1
      }));
    });
  }, [blockBreak]);
  
  const topBlocks = Object.entries(blockCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30} value="Top Blocks Broken" />
      {topBlocks.map(([block, count], index) => (
        <Text key={block} x={10} y={50 + index * 30} width={380} height={30} value={`${block}: ${count}`} />
      ))}
    </Panel>
  );
}
```

### Chat Message Logger

```tsx
interface ChatEvent {
  sender: Player;
  message: string;
}

function ChatLog() {
  const chatEvent = useEvent<ChatEvent>('chat');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  
  useEffect(() => {
    return chatEvent.subscribe((event) => {
      setMessages(prev => [
        ...prev,
        { sender: event.sender.name, text: event.message }
      ].slice(-10)); // Keep last 10 messages
    });
  }, [chatEvent]);
  
  return (
    <Panel width={500} height={400}>
      <Text x={10} y={10} width={480} height={30} value="Chat Log" />
      {messages.map((msg, index) => (
        <Text key={index} x={10} y={50 + index * 30} width={480} height={30} value={`${msg.sender}: ${msg.text}`} />
      ))}
    </Panel>
  );
}
```

### Health Change Monitor

```tsx
interface HealthChangeEvent {
  player: Player;
  oldValue: number;
  newValue: number;
}

function HealthMonitor() {
  const healthChange = useEvent<HealthChangeEvent>('healthChange');
  const player = usePlayer();
  const [warnings, setWarnings] = useState<string[]>([]);
  
  useEffect(() => {
    return healthChange.subscribe((event) => {
      if (event.player.id === player.id && event.newValue < 5) {
        setWarnings(prev => [...prev, `Low health: ${event.newValue}`].slice(-3));
      }
    });
  }, [healthChange, player]);
  
  return (
    <Panel width={400} height={200}>
      <Text x={10} y={10} width={380} height={30} value="Health Warnings" />
      {warnings.map((warning, index) => (
        <Text key={index} x={10} y={50 + index * 30} width={380} height={30} value={warning} />
      ))}
    </Panel>
  );
}
```

### Multiple Event Listeners

```tsx
function MultiEventTracker() {
  const playerJoin = useEvent<{ player: Player }>('playerJoin');
  const playerLeave = useEvent<{ player: Player }>('playerLeave');
  const [eventLog, setEventLog] = useState<string[]>([]);
  
  useEffect(() => {
    const unsubJoin = playerJoin.subscribe((event) => {
      setEventLog(prev => [...prev, `${event.player.name} joined`].slice(-5));
    });
    
    const unsubLeave = playerLeave.subscribe((event) => {
      setEventLog(prev => [...prev, `${event.player.name} left`].slice(-5));
    });
    
    return () => {
      unsubJoin();
      unsubLeave();
    };
  }, [playerJoin, playerLeave]);
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30} value="Event Log" />
      {eventLog.map((log, index) => (
        <Text key={index} x={10} y={50 + index * 30} width={380} height={30} value={log} />
        </Text>
      ))}
    </Panel>
  );
}
```

### Custom Event Emitter

```tsx
// In your main script
import { world } from '@minecraft/server';
import { render } from '@bedrock-core/ui';

const customEvent = useEvent('customEvent');

// Emit custom event
customEvent.emit({ data: 'Hello', timestamp: Date.now() });

// In component
function CustomEventListener() {
  const customEvent = useEvent<{ data: string; timestamp: number }>('customEvent');
  const [lastData, setLastData] = useState('None');
  
  useEffect(() => {
    return customEvent.subscribe((event) => {
      setLastData(event.data);
    });
  }, [customEvent]);
  
  return <Text x={10} y={10}>Last: {lastData}</Text>;
}
```

### Debounced Event Handler

```tsx
function DebouncedEventListener() {
  const itemUse = useEvent('itemUse');
  const [count, setCount] = useState(0);
  const debounceRef = useRef<number | null>(null);
  
  useEffect(() => {
    return itemUse.subscribe(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        setCount(prev => prev + 1);
      }, 500);
    });
  }, [itemUse]);
  
  return <Text x={10} y={10}>Debounced count: {count}</Text>;
}
```

## Best Practices

### Always Unsubscribe

```tsx
// ✅ Good - cleanup in useEffect return
useEffect(() => {
  const unsubscribe = event.subscribe(handler);
  return unsubscribe; // Cleanup
}, [event]);

// ❌ Bad - no cleanup
useEffect(() => {
  event.subscribe(handler);
}, [event]); // Memory leak!
```

### Use Event Dependencies

```tsx
// ✅ Good - include event in dependencies
useEffect(() => {
  return event.subscribe(handler);
}, [event]);

// ❌ Bad - missing dependency
useEffect(() => {
  return event.subscribe(handler);
}, []); // Stale closure!
```

### Type Event Payloads

```tsx
// ✅ Good - typed event
interface PlayerJoinEvent {
  player: Player;
  timestamp: number;
}

const event = useEvent<PlayerJoinEvent>('playerJoin');

// ❌ Less ideal - untyped
const event = useEvent('playerJoin'); // 'any' type
```

### Avoid Heavy Operations in Handlers

```tsx
// ✅ Good - update state, process elsewhere
event.subscribe((e) => {
  setData(e.data);
});

// ❌ Bad - heavy computation in handler
event.subscribe((e) => {
  const result = expensiveOperation(e.data);
  setData(result);
});
```

## Common Patterns

### Event Counter

```tsx
const event = useEvent('someEvent');
const [count, setCount] = useState(0);

useEffect(() => {
  return event.subscribe(() => setCount(c => c + 1));
}, [event]);
```

### Latest Event Value

```tsx
const event = useEvent<T>('someEvent');
const [latest, setLatest] = useState<T | null>(null);

useEffect(() => {
  return event.subscribe((e) => setLatest(e));
}, [event]);
```

### Event Filtering

```tsx
const event = useEvent<{ type: string }>('someEvent');

useEffect(() => {
  return event.subscribe((e) => {
    if (e.type === 'important') {
      handleImportant(e);
    }
  });
}, [event]);
```
