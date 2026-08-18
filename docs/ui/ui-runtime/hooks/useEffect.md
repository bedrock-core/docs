---
sidebar_position: 5
---
# useEffect

Perform side effects in function components.

## Import

```tsx
import { useEffect } from '@bedrock-core/ui';
```

## Signature

```tsx
function useEffect(effect: () => (() => void)| void, deps?: any[]): void
```

### Parameters

#### `effect`
- Type: `() => (() => void) | void`
- Description: Function that contains the side effect logic. Can optionally return a cleanup function.

#### `deps` (optional)
- Type: `any[]`
- Description: Dependency array. Effect runs when dependencies change. Omit for every execution, empty array `[]` for mount only.

### Returns

`void`

## Usage

```tsx
import { system } from '@minecraft/server';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const runId = system.runInterval(() => {
      setSeconds(s => s + 1);
    }, 20); // Runs every 20 ticks (1 second)

    // Cleanup function
    return () => system.clearRun(runId);
  }, []); // Empty deps = run once on mount

  return (
    <Panel padding={10}>
      <Text>{`Time: ${seconds}s`}</Text>
    </Panel>
  );
}
```

## Dependency Array Behavior

| Deps | When Effect Runs |
|------|------------------|
| `undefined` | After every execution |
| `[]` | Once after initial execution (mount) |
| `[a, b]` | When `a` or `b` changes |

## Examples

### Run on State Change

```tsx
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length > 0) {
      console.log(`Searching for: ${query}`);
      setResults([`Result for ${query}`]);
    }
  }, [query]); // Runs when query changes

  return (
    <Panel padding={10} gap={4}>
      <Text>{`Search: ${query}`}</Text>
      {results.map((result, i) => (
        <Text key={i}>{result}</Text>
      ))}
    </Panel>
  );
}
```

### Multiple Effects

```tsx
function MultiEffect() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Player');

  // Effect 1: Log count changes
  useEffect(() => {
    console.log(`Count changed to: ${count}`);
  }, [count]);

  // Effect 2: Log name changes
  useEffect(() => {
    console.log(`Name changed to: ${name}`);
  }, [name]);

  // Effect 3: Run on every execution
  useEffect(() => {
    console.log('Component executed');
  });

  return (
    <Panel padding={10} gap={4}>
      <Text>{`Count: ${count}`}</Text>
      <Text>{`Name: ${name}`}</Text>
    </Panel>
  );
}
```

### Timer/Interval

```tsx
import { system } from '@minecraft/server';

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const runId = system.runInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 20); // Runs every 20 ticks (1 second)

    return () => system.clearRun(runId);
  }, [timeLeft]);

  return (
    <Panel padding={10}>
      <Text>{`Time Left: ${timeLeft}s`}</Text>
    </Panel>
  );
}
```

## Best Practices

### Cleanup Functions

Always clean up side effects to prevent memory leaks:

```tsx
import { system } from '@minecraft/server';

// ✅ Good - cleanup interval
useEffect(() => {
  const runId = system.runInterval(() => {}, 20);
  return () => system.clearRun(runId);
}, []);

// ❌ Bad - no cleanup
useEffect(() => {
  system.runInterval(() => {}, 20);
}, []);
```

### Dependency Array

Include all values used inside the effect:

```tsx
// ✅ Good - all dependencies listed
useEffect(() => {
  console.log(count, name);
}, [count, name]);

// ❌ Bad - missing dependencies
useEffect(() => {
  console.log(count, name);
}, []); // count and name should be in deps!
```

### Avoid Infinite Loops

```tsx
// ❌ Bad - infinite loop
useEffect(() => {
  setCount(count + 1); // Updates state, triggers update, runs effect again...
}, [count]);

// ✅ Good - condition or empty deps
useEffect(() => {
  if (count < 10) {
    setCount(count + 1);
  }
}, [count]);
```

### Split Unrelated Effects

```tsx
// ✅ Good - separate effects
useEffect(() => {
  // Effect for feature A
}, [depA]);

useEffect(() => {
  // Effect for feature B
}, [depB]);

// ❌ Bad - combined unrelated effects
useEffect(() => {
  // Effect for feature A
  // Effect for feature B
}, [depA, depB]);
```
