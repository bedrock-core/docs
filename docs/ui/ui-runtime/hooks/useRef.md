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

  const startTimer = (): void => {
    intervalRef.current = system.runInterval(() => {
      setCount(c => c + 1);
    }, 20); // Runs every 20 ticks (1 second)
  };

  const stopTimer = (): void => {
    if (intervalRef.current !== null) {
      system.clearRun(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <Panel padding={10} gap={8}>
      <Text>{`Count: ${count}`}</Text>
      <Panel flexDirection={'row'} gap={8}>
        <Button flex={1} onPress={startTimer}>
          <Text>{'Start'}</Text>
        </Button>
        <Button flex={1} onPress={stopTimer}>
          <Text>{'Stop'}</Text>
        </Button>
      </Panel>
    </Panel>
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
    <Panel padding={10} gap={8}>
      <Text>{`Current: ${count}`}</Text>
      <Text>{`Previous: ${prevCountRef.current}`}</Text>
      <Button onPress={() => setCount(count + 1)}>
        <Text>{'Increment'}</Text>
      </Button>
    </Panel>
  );
}
```

### Store Timeout/Interval ID

```tsx
function DelayedMessage() {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<number | null>(null);

  const scheduleMessage = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setMessage('Hello after 2 seconds!');
    }, 2000);
  };

  const cancelMessage = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setMessage('Cancelled');
    }
  };

  return (
    <Panel padding={10} gap={8}>
      <Text>{message || 'No message'}</Text>
      <Panel flexDirection={'row'} gap={8}>
        <Button flex={1} onPress={scheduleMessage}>
          <Text>{'Schedule'}</Text>
        </Button>
        <Button flex={1} onPress={cancelMessage}>
          <Text>{'Cancel'}</Text>
        </Button>
      </Panel>
    </Panel>
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
    <Panel padding={10} gap={8}>
      <Text>{`State: ${state}`}</Text>
      <Text>{`Executions: ${executionCount.current}`}</Text>
      <Button onPress={() => setState(state + 1)}>
        <Text>{'Update State'}</Text>
      </Button>
    </Panel>
  );
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

  return (
    <Panel padding={10}>
      <Text>{'Check console'}</Text>
    </Panel>
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
