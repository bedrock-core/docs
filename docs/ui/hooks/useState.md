---
sidebar_position: 2
---
# useState

Manage component state with reactive updates.

## Import

```tsx
import { useState } from '@bedrock-core/ui';
```

## Signature

```tsx
function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void]
```

### Parameters

#### `initial`
- Type: `T | (() => T)` (generic)
- Description: The initial value for the state variable, or a function that returns the initial value (lazy initialization)

### Returns

An array with two elements:

1. **Current state value** (`T`) - The current value of the state
2. **State setter function** (`(value: T | ((prev: T) => T)) => void`) - Function to update the state. Can accept a new value directly or a function that receives the previous state and returns the new state


## Usage

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <Text x={10} y={10} width={200} height={30}>{`Count: ${count}`}</Text>
      <Button 
        x={10} 
        y={50}
        width={150}
        height={40}
        onPress={() => setCount(count + 1)}
      >
        <Text x={10} y={10} width={130} height={20}>Increment</Text>
      </Button>
    </>
  );
}
```

## Examples

### Toggle

```tsx
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  return (
    <Button 
      x={10} 
      y={10}
      width={200}
      height={40}
      onPress={() => setIsOn(!isOn)}
    >
      <Text x={10} y={10} width={180} height={20}>{isOn ? 'ON' : 'OFF'}</Text>
    </Button>
  );
}
```

### Multiple State Variables

```tsx
function MultiState() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Player');
  const [isActive, setIsActive] = useState(false);
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30}>{`Count: ${count}`}</Text>
      <Text x={10} y={40} width={380} height={30}>{`Name: ${name}`}</Text>
      <Text x={10} y={70} width={380} height={30}>{`Active: ${isActive ? 'Yes' : 'No'}`}</Text>
      
      <Button 
        x={10} y={110} width={380} height={40}
        onPress={() => {
          setCount(count + 1);
          setIsActive(true);
        }}
      >
        <Text x={10} y={10} width={360} height={20}>Update Multiple States</Text>
      </Button>
    </Panel>
  );
}
```

### Object State

```tsx
interface PlayerStats {
  health: number;
  mana: number;
  level: number;
}

function StatsDisplay() {
  const [stats, setStats] = useState<PlayerStats>({
    health: 100,
    mana: 50,
    level: 1
  });
  
  const heal = () => {
    setStats({ ...stats, health: Math.min(stats.health + 10, 100) });
  };
  
  const levelUp = () => {
    setStats({ ...stats, level: stats.level + 1 });
  };
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30}>{`Health: ${stats.health}`}</Text>
      <Text x={10} y={40} width={380} height={30}>{`Mana: ${stats.mana}`}</Text>
      <Text x={10} y={70} width={380} height={30}>{`Level: ${stats.level}`}</Text>
      
      <Button x={10} y={110} width={180} height={40} onPress={heal}>
        <Text x={10} y={10} width={160} height={20}>Heal (+10)</Text>
      </Button>
      <Button x={200} y={110} width={180} height={40} onPress={levelUp}>
        <Text x={10} y={10} width={160} height={20}>Level Up</Text>
      </Button>
    </Panel>
  );
}
```

### Array State

```tsx
function TodoList() {
  const [todos, setTodos] = useState<string[]>(['First task']);
  
  const addTodo = () => {
    setTodos([...todos, `Task ${todos.length + 1}`]);
  };
  
  const removeLast = () => {
    setTodos(todos.slice(0, -1));
  };
  
  return (
    <Panel width={400} height={400}>
      {todos.map((todo, index) => (
        <Text key={index} x={10} y={10 + (index * 30)} width={380} height={30}>{`${index + 1}. ${todo}`}</Text>
      ))}
      
      <Button 
        x={10} 
        y={300} 
        width={180} 
        height={40}
        onPress={addTodo}
      >
        <Text x={10} y={10} width={160} height={20}>Add Todo</Text>
      </Button>
      <Button 
        x={200} 
        y={300} 
        width={180} 
        height={40}
        onPress={removeLast}
        enabled={todos.length > 0}
      >
        <Text x={10} y={10} width={160} height={20}>Remove Last</Text>
      </Button>
    </Panel>
  );
}
```

## Best Practices

### State Updates

- **Always use the setter function** - Never mutate state directly
- **Treat state as immutable** - Create new objects/arrays instead of modifying
- **Use functional updates for dependent changes** - When new state depends on old state

### Object and Array Updates

```tsx
// ✅ Correct - Create new object
setStats({ ...stats, health: 100 });

// ❌ Wrong - Mutates existing object
stats.health = 100;
setStats(stats);

// ✅ Correct - Create new array
setItems([...items, newItem]);

// ❌ Wrong - Mutates existing array
items.push(newItem);
setItems(items);
```

### Initial State

- Keep initial state simple and minimal
- Don't compute expensive values in initial state
- Initialize with appropriate default values

### State Organization

- Use multiple `useState` calls for unrelated state
- Group related state into objects
- Keep state as local as possible

## Rules of Hooks

1. **Only call at the top level** - Don't call inside loops, conditions, or nested functions
2. **Consistent order** - Hooks must be called in the same order on every render
3. **Only in function components** - Don't call in regular functions

```tsx
// ✅ Correct
function MyComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  // ...
}

// ❌ Wrong - conditional hook
function MyComponent({ condition }) {
  if (condition) {
    const [count, setCount] = useState(0); // Error!
  }
}

// ❌ Wrong - hook in loop
function MyComponent() {
  for (let i = 0; i < 3; i++) {
    const [state, setState] = useState(0); // Error!
  }
}
```

## Performance Considerations

- Batch multiple state updates when possible
- Use object/array spreading carefully with large data structures
- Consider `useReducer` for complex state logic

## Common Patterns

### Derived State

```tsx
function FilteredList() {
  const [items] = useState(['Apple', 'Banana', 'Cherry']);
  const [filter, setFilter] = useState('');
  
  // Derive filtered list from state
  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <>
      {/* UI using filteredItems */}
    </>
  );
}
```

### Controlled Components

```tsx
function ControlledToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  
  return (
    <Button
      x={10} y={10} width={200} height={40}
      enabled={isEnabled}
      onPress={() => setIsEnabled(!isEnabled)}
    >
      <Text x={10} y={10} width={180} height={20}>{isEnabled ? 'Enabled' : 'Disabled'}</Text>
    </Button>
  );
}
```
