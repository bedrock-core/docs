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
    <Panel padding={10} gap={8}>
      <Text>{`Count: ${count}`}</Text>
      <Button onPress={() => setCount(count + 1)}>
        <Text>{'Increment'}</Text>
      </Button>
    </Panel>
  );
}
```

## Examples

### Toggle

```tsx
function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <Button onPress={() => setIsOn(!isOn)}>
      <Text>{isOn ? '§aON' : '§7OFF'}</Text>
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
    <Panel padding={10} gap={8}>
      <Text>{`Count: ${count}`}</Text>
      <Text>{`Name: ${name}`}</Text>
      <Text>{`Active: ${isActive ? 'Yes' : 'No'}`}</Text>
      <Button
        onPress={() => {
          setCount(count + 1);
          setIsActive(true);
        }}
      >
        <Text>{'Update Multiple States'}</Text>
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
    level: 1,
  });

  const heal = (): void => {
    setStats({ ...stats, health: Math.min(stats.health + 10, 100) });
  };

  const levelUp = (): void => {
    setStats({ ...stats, level: stats.level + 1 });
  };

  return (
    <Panel padding={10} gap={8}>
      <Text>{`Health: ${stats.health}`}</Text>
      <Text>{`Mana: ${stats.mana}`}</Text>
      <Text>{`Level: ${stats.level}`}</Text>
      <Panel flexDirection={'row'} gap={8}>
        <Button flex={1} onPress={heal}>
          <Text>{'Heal (+10)'}</Text>
        </Button>
        <Button flex={1} onPress={levelUp}>
          <Text>{'Level Up'}</Text>
        </Button>
      </Panel>
    </Panel>
  );
}
```

### Array State

```tsx
function TodoList() {
  const [todos, setTodos] = useState<string[]>(['First task']);

  const addTodo = (): void => {
    setTodos([...todos, `Task ${todos.length + 1}`]);
  };

  const removeLast = (): void => {
    setTodos(todos.slice(0, -1));
  };

  return (
    <Panel padding={10} gap={4}>
      {todos.map((todo, index) => (
        <Text key={index}>{`${index + 1}. ${todo}`}</Text>
      ))}
      <Panel flexDirection={'row'} gap={8}>
        <Button flex={1} onPress={addTodo}>
          <Text>{'Add Todo'}</Text>
        </Button>
        <Button flex={1} onPress={removeLast} enabled={todos.length > 0}>
          <Text>{'Remove Last'}</Text>
        </Button>
      </Panel>
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
function MyComponent({ condition }: { condition: boolean }) {
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
    <Panel padding={10} gap={4}>
      {filteredItems.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </Panel>
  );
}
```

### Controlled Components

```tsx
function ControlledToggle() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Button
      enabled={isEnabled}
      onPress={() => setIsEnabled(!isEnabled)}
    >
      <Text>{isEnabled ? 'Enabled' : 'Disabled'}</Text>
    </Button>
  );
}
```
