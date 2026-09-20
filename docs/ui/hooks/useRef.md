---
sidebar_position: 8
description: "Create a mutable reference that persists across executions"
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

| Parameter | Type | Description |
| --- | --- | --- |
| `initialValue` | `T` (generic) | The initial value for the ref's `current` property |

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

## Examples

### Store previous value

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

### Track execution count

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

### Track first execution

```tsx
function FirstExecutionDetector() {
  const isFirstExecution = useRef(true);

  useEffect(() => {
    if (isFirstExecution.current) {
      console.warn('First execution!');
      isFirstExecution.current = false;
    } else {
      console.warn('Subsequent execution');
    }
  });

  return (
    <Panel padding={10}>
      <Text>{'Check console'}</Text>
    </Panel>
  );
}
```
