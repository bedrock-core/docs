---
sidebar_position: 3
description: "Manage complex state logic with a reducer function."
---
# useReducer

Manage complex state logic with a reducer function.

## Import

```tsx
import { useReducer } from '@bedrock-core/ui';
```

## Signature

```tsx
function useReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S
): [S, (action: A) => void]
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `reducer` | `(state: S, action: A) => S` | Function that takes current state and an action, returns new state |
| `initialState` | `S` | The initial state value |

### Returns

An array with two elements:

1. **Current state** (`S`) - The current state value
2. **Dispatch function** (`(action: A) => void`) - Function to dispatch actions

## Usage

```tsx
interface State {
  count: number;
}

type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <Panel padding={10} gap={8}>
      <Text>{`Count: ${state.count}`}</Text>
      <Panel flexDirection={'row'} gap={8}>
        <Button flex={1} onPress={() => dispatch({ type: 'increment' })}>
          <Text>{'+'}</Text>
        </Button>
        <Button flex={1} onPress={() => dispatch({ type: 'decrement' })}>
          <Text>{'-'}</Text>
        </Button>
        <Button flex={1} onPress={() => dispatch({ type: 'reset' })}>
          <Text>{'Reset'}</Text>
        </Button>
      </Panel>
    </Panel>
  );
}
```

## Examples

### Todo list

```tsx
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface State {
  todos: Todo[];
  nextId: number;
}

type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'delete'; id: number }
  | { type: 'clear' };

function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        todos: [...state.todos, { id: state.nextId, text: action.text, completed: false }],
        nextId: state.nextId + 1,
      };
    case 'toggle':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case 'delete':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id),
      };
    case 'clear':
      return { todos: [], nextId: 1 };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, { todos: [], nextId: 1 });

  return (
    <Panel padding={10} gap={8}>
      <Button onPress={() => dispatch({ type: 'add', text: 'New task' })}>
        <Text>{'Add Todo'}</Text>
      </Button>
      {state.todos.map(todo => (
        <Text key={todo.id}>{`${todo.completed ? '✓' : '○'} ${todo.text}`}</Text>
      ))}
      <Button onPress={() => dispatch({ type: 'clear' })}>
        <Text>{'Clear All'}</Text>
      </Button>
    </Panel>
  );
}
```
