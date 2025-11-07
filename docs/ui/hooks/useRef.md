---
sidebar_position: 7
---
# useRef

Create a mutable reference that persists across executions

## Import

```tsx
import { useRef } from '@bedrock-core/ui';
```

## Signature

```tsx
function useRef<T>(initialValue: T): { current: T }
```

### Parameters

#### `initialValue`
- Type: `T` (generic)
- Description: The initial value for the ref's `current` property

### Returns

A ref object with a single property:
- `current` - The current value (mutable)

## Usage

```tsx
import { system } from '@minecraft/server';

function Timer() {
  const intervalRef = useRef<number | null>(null);
  const [count, setCount] = useState(0);
  
  const startTimer = () => {
    intervalRef.current = system.runInterval(() => {
      setCount(c => c + 1);
    }, 20); // Runs every 20 ticks (1 second)
  };
  
  const stopTimer = () => {
    if (intervalRef.current !== null) {
      system.clearRun(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  return (
    <>
      <Text x={10} y={10} width={200} height={30} value={`Count: ${count}`} />
      <Button x={10} y={50} width={120} height={40} onPress={startTimer}>
        <Text x={10} y={10} width={100} height={20} value="Start" />
      </Button>
      <Button x={140} y={50} width={120} height={40} onPress={stopTimer}>
        <Text x={10} y={10} width={100} height={20} value="Stop" />
      </Button>
    </>
  );
}
```

## Key Characteristics

- **Mutable** - You can change `.current` directly
- **Persistent** - Value persists across executions
- **Same reference** - Returns the same ref object on every execution

## Examples

### Store Previous Value

```tsx
function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);
  
  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);
  
  return (
    <>
      <Text x={10} y={10} width={200} height={30} value={`Current: ${count}`} />
      <Text x={10} y={40} width={200} height={30} value={`Previous: ${prevCountRef.current}`} />
      <Button 
        x={10} y={80} width={200} height={40}
        onPress={() => setCount(count + 1)}
      >
        <Text x={10} y={10} width={180} height={20} value="Increment" />
      </Button>
    </>
  );
}
```

### Store Timeout/Interval ID

```tsx
function DelayedMessage() {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<number | null>(null);
  
  const scheduleMessage = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setMessage('Hello after 2 seconds!');
    }, 2000);
  };
  
  const cancelMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setMessage('Cancelled');
    }
  };
  
  return (
    <>
      <Text x={10} y={10} width={300} height={30} value={message || 'No message'} />
      <Button x={10} y={50} width={180} height={40} onPress={scheduleMessage}>
        <Text x={10} y={10} width={160} height={20} value="Schedule Message" />
      </Button>
      <Button x={200} y={50} width={180} height={40} onPress={cancelMessage}>
        <Text x={10} y={10} width={160} height={20} value="Cancel" />
      </Button>
    </>
  );
}
```

### Track Execution Count

```tsx
function ExecutionCounter() {
  const executionCount = useRef(0);
  const [state, setState] = useState(0);
  
  // Increment on every execution (doesn't cause re-executions)
  executionCount.current += 1;
  
  return (
    <>
      <Text x={10} y={10} width={200} height={30} value={`State: ${state}`} />
      <Text x={10} y={40} width={200} height={30} value={`Executions: ${executionCount.current}`} />
      <Button 
        x={10} y={80} width={200} height={40}
        onPress={() => setState(state + 1)}
      >
        <Text x={10} y={10} width={180} height={20} value="Update State" />
      </Button>
    </>
  );
}
```

### Cache Expensive Computation Result

```tsx
function ExpensiveComponent({ data }) {
  const cacheRef = useRef<Map<string, any>>(new Map());
  
  const getProcessedData = (key: string) => {
    if (cacheRef.current.has(key)) {
      return cacheRef.current.get(key);
    }
    
    // Expensive computation
    const result = expensiveOperation(data, key);
    cacheRef.current.set(key, result);
    return result;
  };
  
  return <Text x={10} y={10}>{getProcessedData('key1')}</Text>;
}
```

### Track First Execution

```tsx
function FirstExecutionDetector() {
  const isFirstExecution = useRef(true);
  
  useEffect(() => {
    if (isFirstExecution.current) {
      console.log('First execution!');
      isFirstExecution.current = false;
    } else {
      console.log('Subsequent execution');
    }
  });
  
  return <Text x={10} y={10} width={300} height={30} value="Check console" />;
}
```

### Store Complex Object

```tsx
interface PlayerData {
  id: string;
  name: string;
  lastSeen: number;
}

function PlayerTracker() {
  const playerDataRef = useRef<Map<string, PlayerData>>(new Map());
  
  const addPlayer = (player: Player) => {
    playerDataRef.current.set(player.id, {
      id: player.id,
      name: player.name,
      lastSeen: Date.now()
    });
  };
  
  const getPlayer = (id: string) => {
    return playerDataRef.current.get(id);
  };
  
  return <Text x={10} y={10}>Tracking {playerDataRef.current.size} players</Text>;
}
```

### Debounce with Ref

```tsx
function DebouncedInput() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const debounceTimerRef = useRef<number | null>(null);
  
  const handleChange = (newValue: string) => {
    setValue(newValue);
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, 500);
  };
  
  return (
    <>
      <Text x={10} y={10}>Value: {value}</Text>
      <Text x={10} y={40}>Debounced: {debouncedValue}</Text>
    </>
  );
}
```

## useRef vs useState

| Aspect | useRef | useState |
|--------|---------|----------|
| Re-executions | No | Yes |
| Mutability | Mutable `.current` | Immutable, use setter |
| Use case | Store mutable data | Manage component state |
| Persistence | Across executions | Across executions |
| Initial value | Directly assigned | Via initializer |

```tsx
// useState - triggers re-executions
const [count, setCount] = useState(0);
setCount(1); // Re-executes component

// useRef - no re-executions
const countRef = useRef(0);
countRef.current = 1; // No re-executions
```

## Best Practices

### When to Use useRef

✅ **Use useRef when:**
- Storing timer/interval IDs for cleanup
- Tracking previous values
- Caching computed values
- Storing mutable data that doesn't affect execution
- Avoiding stale closures in event handlers

❌ **Don't use useRef when:**
- The value should trigger a re-execution (use `useState`)
- You need to trigger effects when value changes (use `useState`)

### Mutation Guidelines

```tsx
// ✅ Good - mutate .current directly
const ref = useRef(0);
ref.current = 1;

// ❌ Bad - trying to reassign ref itself
const ref = useRef(0);
ref = { current: 1 }; // Error!

// ✅ Good - use in effect cleanup
import { system } from '@minecraft/server';

useEffect(() => {
  const runId = system.runInterval(() => {}, 20);
  timerRef.current = runId;
  return () => system.clearRun(timerRef.current);
}, []);
```

### Type Safety

```tsx
// Specify type for better TypeScript support
const timerRef = useRef<number | null>(null);
const dataRef = useRef<PlayerData | undefined>(undefined);
const mapRef = useRef<Map<string, any>>(new Map());
```

## Common Patterns

### Cleanup Pattern

```tsx
const resourceRef = useRef<Resource | null>(null);

useEffect(() => {
  resourceRef.current = createResource();
  
  return () => {
    resourceRef.current?.cleanup();
    resourceRef.current = null;
  };
}, []);
```

### Latest Value Pattern

```tsx
const latestPropsRef = useRef(props);
latestPropsRef.current = props;

// Use latestPropsRef.current in callbacks to avoid stale closures
```
