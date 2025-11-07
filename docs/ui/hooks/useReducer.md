---
sidebar_position: 3
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

#### `reducer`
- Type: `(state: S, action: A) => S`
- Description: Function that takes current state and an action, returns new state

#### `initialState`
- Type: `S`
- Description: The initial state value

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
    <>
      <Text x={10} y={10} width={200} height={30} value={`Count: ${state.count}`} />
      <Button x={10} y={50} width={120} height={40} onPress={() => dispatch({ type: 'increment' })}>
        <Text x={10} y={10} width={100} height={20} value="+" />
      </Button>
      <Button x={140} y={50} width={120} height={40} onPress={() => dispatch({ type: 'decrement' })}>
        <Text x={10} y={10} width={100} height={20} value="-" />
      </Button>
      <Button x={270} y={50} width={120} height={40} onPress={() => dispatch({ type: 'reset' })}>
        <Text x={10} y={10} width={100} height={20} value="Reset" />
      </Button>
    </>
  );
}
```

## When to Use useReducer

✅ **Use useReducer when:**
- State has complex update logic
- Next state depends on previous state
- Multiple related state values
- State transitions follow predictable patterns
- Want to test state logic separately

❌ **Use useState when:**
- Simple independent state values
- State updates are straightforward
- No complex interdependencies

## Examples

### Todo List

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
        nextId: state.nextId + 1
      };
    case 'toggle':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        )
      };
    case 'delete':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
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
    <Panel width={400} height={500}>
      <Button 
        x={10} y={10} width={380} height={40}
        onPress={() => dispatch({ type: 'add', text: 'New task' })}
      >
        <Text x={10} y={10} width={360} height={20} value="Add Todo" />
      </Button>
      
      {state.todos.map((todo, index) => (
        <Text key={todo.id} x={10} y={60 + index * 30} width={380} height={20} value={`${todo.completed ? '✓' : '○'} ${todo.text}`} />
      ))}
      
      <Button 
        x={10} y={400} width={380} height={40}
        onPress={() => dispatch({ type: 'clear' })}
      >
        <Text x={10} y={10} width={360} height={20} value="Clear All" />
      </Button>
    </Panel>
  );
}
```

### Shopping Cart

```tsx
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'addItem'; item: Omit<CartItem, 'quantity'> }
  | { type: 'removeItem'; id: string }
  | { type: 'updateQuantity'; id: string; quantity: number }
  | { type: 'clear' };

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'addItem': {
      const existingItem = state.items.find(item => item.id === action.item.id);
      
      if (existingItem) {
        const items = state.items.map(item =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { items, total: calculateTotal(items) };
      }
      
      const items = [...state.items, { ...action.item, quantity: 1 }];
      return { items, total: calculateTotal(items) };
    }
    
    case 'removeItem': {
      const items = state.items.filter(item => item.id !== action.id);
      return { items, total: calculateTotal(items) };
    }
    
    case 'updateQuantity': {
      const items = state.items.map(item =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
      return { items, total: calculateTotal(items) };
    }
    
    case 'clear':
      return { items: [], total: 0 };
    
    default:
      return state;
  }
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  
  return (
    <Panel width={500} height={600}>
      <Text x={10} y={10} fontSize={20}>Shopping Cart</Text>
      
      {state.items.map((item, index) => (
        <Panel key={item.id} width={480} height={50} x={10} y={50 + index * 60}>
          <Text x={10} y={10}>{item.name} x{item.quantity}</Text>
          <Text x={10} y={30}>${item.price * item.quantity}</Text>
        </Panel>
      ))}
      
      <Text x={10} y={500} fontSize={18}>
        Total: ${state.total}
      </Text>
      
      <Button 
        x={10} y={540} width={230} height={40}
        onPress={() => dispatch({ type: 'clear' })}
      >
        Clear Cart
      </Button>
    </Panel>
  );
}
```

### Game State

```tsx
interface GameState {
  player: {
    health: number;
    mana: number;
    level: number;
    experience: number;
  };
  inventory: string[];
  quest: {
    active: boolean;
    progress: number;
  };
}

type GameAction =
  | { type: 'takeDamage'; amount: number }
  | { type: 'heal'; amount: number }
  | { type: 'useMana'; amount: number }
  | { type: 'gainExperience'; amount: number }
  | { type: 'addItem'; item: string }
  | { type: 'removeItem'; item: string }
  | { type: 'startQuest' }
  | { type: 'updateQuest'; progress: number }
  | { type: 'completeQuest' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'takeDamage':
      return {
        ...state,
        player: {
          ...state.player,
          health: Math.max(0, state.player.health - action.amount)
        }
      };
    
    case 'heal':
      return {
        ...state,
        player: {
          ...state.player,
          health: Math.min(100, state.player.health + action.amount)
        }
      };
    
    case 'gainExperience': {
      const newExp = state.player.experience + action.amount;
      const shouldLevelUp = newExp >= 100;
      
      return {
        ...state,
        player: {
          ...state.player,
          experience: shouldLevelUp ? newExp - 100 : newExp,
          level: shouldLevelUp ? state.player.level + 1 : state.player.level
        }
      };
    }
    
    case 'addItem':
      return {
        ...state,
        inventory: [...state.inventory, action.item]
      };
    
    case 'startQuest':
      return {
        ...state,
        quest: { active: true, progress: 0 }
      };
    
    case 'completeQuest':
      return {
        ...state,
        quest: { active: false, progress: 100 },
        player: {
          ...state.player,
          experience: state.player.experience + 50
        }
      };
    
    default:
      return state;
  }
}
```

## Best Practices

### Action Types

```tsx
// ✅ Good - string constants
const ADD_TODO = 'ADD_TODO';
type Action = { type: typeof ADD_TODO; text: string };

// ✅ Good - TypeScript discriminated unions
type Action =
  | { type: 'add'; text: string }
  | { type: 'delete'; id: number };

// ❌ Less ideal - magic strings everywhere
dispatch({ type: 'ad_tood', text: 'typo' }); // Error prone
```

### Immutable Updates

```tsx
// ✅ Good - create new objects
return {
  ...state,
  items: [...state.items, newItem]
};

// ❌ Bad - mutate existing state
state.items.push(newItem);
return state;
```

### Derived State

```tsx
// ✅ Good - calculate during execution
const total = state.items.reduce((sum, item) => sum + item.price, 0);

// ❌ Less ideal - store in state (can get out of sync)
{ items: [], total: 0 }
```

### Complex Logic

```tsx
// ✅ Good - helper functions
function addItem(state: State, item: Item): State {
  const existingItem = state.items.find(i => i.id === item.id);
  if (existingItem) {
    return updateItemQuantity(state, item.id, existingItem.quantity + 1);
  }
  return { ...state, items: [...state.items, item] };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'addItem':
      return addItem(state, action.item);
    // ...
  }
}
```

## useReducer vs useState

| Aspect | useReducer | useState |
|--------|------------|----------|
| Complexity | Complex state logic | Simple values |
| Updates | Centralized reducer | Scattered setter calls |
| Testing | Easy to test reducer | Harder to test component |
| Predictability | Explicit actions | Direct updates |
| Boilerplate | More setup code | Minimal |
