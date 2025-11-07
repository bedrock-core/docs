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
function useState<T>(initialState: T): [T, (newState: T) => void]
```

## Usage

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <Text x={10} y={10} width={200} height={30} value={`Count: ${count}`} />
      <Button 
        x={10} 
        y={50}
        width={150}
        height={40}
        onPress={() => setCount(count + 1)}
      >
        <Text x={10} y={10} width={130} height={20} value="Increment" />
      </Button>
    </>
  );
}
```

## Parameters

### `initialState`
- Type: `T` (generic)
- Description: The initial value for the state variable

## Returns

An array with two elements:

1. **Current state value** (`T`) - The current value of the state
2. **State setter function** (`(newState: T) => void`) - Function to update the state

## Examples

### Counter

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <Panel width={300} height={200}>
      <Text x={10} y={10} width={280} height={30} value={`Count: ${count}`} />
      <Button 
        x={10} y={50} width={130} height={40}
        onPress={() => setCount(count + 1)}
      >
        <Text x={10} y={10} width={110} height={20} value="Increment" />
      </Button>
      <Button 
        x={150} y={50} width={130} height={40}
        onPress={() => setCount(count - 1)}
      >
        <Text x={10} y={10} width={110} height={20} value="Decrement" />
      </Button>
      <Button 
        x={10} y={100} width={270} height={40}
        onPress={() => setCount(0)}
      >
        <Text x={10} y={10} width={250} height={20} value="Reset" />
      </Button>
    </Panel>
  );
}
```

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
      <Text x={10} y={10} width={180} height={20} value={isOn ? 'ON' : 'OFF'} />
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
      <Text x={10} y={10} width={380} height={30} value={`Count: ${count}`} />
      <Text x={10} y={40} width={380} height={30} value={`Name: ${name}`} />
      <Text x={10} y={70} width={380} height={30} value={`Active: ${isActive ? 'Yes' : 'No'}`} />
      
      <Button 
        x={10} y={110} width={380} height={40}
        onPress={() => {
          setCount(count + 1);
          setIsActive(true);
        }}
      >
        <Text x={10} y={10} width={360} height={20} value="Update Multiple States" />
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
      <Text x={10} y={10} width={380} height={30} value={`Health: ${stats.health}`} />
      <Text x={10} y={40} width={380} height={30} value={`Mana: ${stats.mana}`} />
      <Text x={10} y={70} width={380} height={30} value={`Level: ${stats.level}`} />
      
      <Button x={10} y={110} width={180} height={40} onPress={heal}>
        <Text x={10} y={10} width={160} height={20} value="Heal (+10)" />
      </Button>
      <Button x={200} y={110} width={180} height={40} onPress={levelUp}>
        <Text x={10} y={10} width={160} height={20} value="Level Up" />
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
        <Text key={index} x={10} y={10 + (index * 30)} width={380} height={30} value={`${index + 1}. ${todo}`} />
      ))}
      
      <Button 
        x={10} 
        y={300} 
        width={180} 
        height={40}
        onPress={addTodo}
      >
        <Text x={10} y={10} width={160} height={20} value="Add Todo" />
      </Button>
      <Button 
        x={200} 
        y={300} 
        width={180} 
        height={40}
        onPress={removeLast}
        enabled={todos.length > 0}
      >
        <Text x={10} y={10} width={160} height={20} value="Remove Last" />
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
      <Text x={10} y={10} width={180} height={20} value={isEnabled ? 'Enabled' : 'Disabled'} />
    </Button>
  );
}
```
