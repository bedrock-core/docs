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
  
  return <Text x={10} y={10} value={`Time: ${seconds}s`} />;
}
```

## Dependency Array Behavior

| Deps | When Effect Runs |
|------|------------------|
| `undefined` | After every execution |
| `[]` | Once after initial execution (mount) |
| `[a, b]` | When `a` or `b` changes |

## Examples

### Run Once on Mount

```tsx
function DataLoader() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    console.log('Component mounted, loading data...');
    // Load data logic here
    setData('Loaded data');
  }, []); // Empty array = run once
  
  return <Text x={10} y={10} width={300} height={30} value={data || 'Loading...'} />;
}
```

### Run on State Change

```tsx
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (query.length > 0) {
      console.log(`Searching for: ${query}`);
      // Perform search
      setResults([`Result for ${query}`]);
    }
  }, [query]); // Runs when query changes
  
  return (
    <>
      <Text x={10} y={10} width={300} height={30} value={`Search: ${query}`} />
      {results.map((result, i) => (
        <Text key={i} x={10} y={40 + i * 30} width={300} height={30} value={result} />
      ))}
    </>
  );
}
```

### Cleanup Function

```tsx
import { system } from '@minecraft/server';

function EventListener() {
  useEffect(() => {
    const runId = system.runTimeout(() => {
      console.log('Timeout executed');
    }, 100); // Execute after 100 ticks (~5 seconds)
    
    // Cleanup: cancel timeout when component unmounts
    return () => {
      system.clearRun(runId);
    };
  }, []);
  
  return <Text x={10} y={10} width={300} height={30} value="Timeout scheduled..." />;
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
    <>
      <Text x={10} y={10} width={200} height={30} value={`Count: ${count}`} />
      <Text x={10} y={40} width={200} height={30} value={`Name: ${name}`} />
    </>
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
    <Text x={10} y={10} width={200} height={30} value={`Time Left: ${timeLeft}s`} />
  );
}
```

### Fetch Data on Mount

```tsx
function PlayerStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const player = usePlayer();
  
  useEffect(() => {
    // Simulate async data fetch
    setLoading(true);
    
    setTimeout(() => {
      setStats({
        health: player.health,
        level: player.level
      });
      setLoading(false);
    }, 1000);
  }, []); // Load once on mount
  
  if (loading) {
    return <Text x={10} y={10} width={300} height={30} value="Loading stats..." />;
  }
  
  return (
    <>
      <Text x={10} y={10} width={300} height={30} value={`Health: ${stats?.health}`} />
      <Text x={10} y={40} width={300} height={30} value={`Level: ${stats?.level}`} />
    </>
  );
}
```

### Dependent Effects

```tsx
function DependentEffects() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Effect 1: Load user when userId changes
  useEffect(() => {
    console.log(`Loading user ${userId}...`);
    // Fetch user data
    setUser({ id: userId, name: `User ${userId}` });
  }, [userId]);
  
  // Effect 2: Load posts when user changes
  useEffect(() => {
    if (user) {
      console.log(`Loading posts for ${user.name}...`);
      // Fetch posts
      setPosts([`Post 1 by ${user.name}`]);
    }
  }, [user]);
  
  return (
    <>
      <Text x={10} y={10} width={300} height={30} value={user?.name || 'Loading...'} />
      {posts.map((post, i) => (
        <Text key={i} x={10} y={40 + i * 30} width={300} height={30} value={post} />
      ))}
    </>
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

## Common Pitfalls

1. **Forgetting cleanup** - Causes memory leaks with event listeners, timers
2. **Missing dependencies** - Leads to stale closures and bugs
3. **Too many dependencies** - Effect runs too often
4. **State updates in effects without conditions** - Can cause infinite loops
