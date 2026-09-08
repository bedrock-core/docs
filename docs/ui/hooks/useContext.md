---
sidebar_position: 4
description: "Access context values from Context Providers."
---

# useContext

Access context values from Context Providers.

## Import

```tsx
import { useContext } from '@bedrock-core/ui';
```

## Signature

```tsx
function useContext<T>(context: Context<T>): T
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `context` | `Context<T>` | The context object created by `createContext()` |

### Returns

The current context value for the given context. The value is determined by the nearest `<Context>` above the component in the tree.

## Usage

```tsx
import { createContext, useContext } from '@bedrock-core/ui';

interface Theme {
  color: string;
  fontSize: number;
}

const ThemeContext = createContext<Theme>({
  color: '#ffffff',
  fontSize: 14,
});

function App() {
  return (
    <ThemeContext value={{ color: '#3498db', fontSize: 16 }}>
      <ThemedComponent />
    </ThemeContext>
  );
}

function ThemedComponent() {
  const theme = useContext(ThemeContext);

  return (
    <Panel padding={10}>
      <Text>{`Color: ${theme.color}, Size: ${theme.fontSize}`}</Text>
    </Panel>
  );
}
```

## Examples

### User context

```tsx
interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

const UserContext = createContext<User | null>(null);

function App() {
  const currentUser: User = {
    id: '123',
    name: 'Steve',
    role: 'admin',
  };

  return (
    <UserContext value={currentUser}>
      <Dashboard />
    </UserContext>
  );
}

function Dashboard() {
  const user = useContext(UserContext);

  if (!user) {
    return (
      <Panel padding={10}>
        <Text>{'Not logged in'}</Text>
      </Panel>
    );
  }

  return (
    <Panel padding={10} gap={4}>
      <Text>{`Welcome, ${user.name}!`}</Text>
      <Text>{`Role: ${user.role}`}</Text>
    </Panel>
  );
}
```
