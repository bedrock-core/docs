---
sidebar_position: 4
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

#### `context`
- Type: `Context<T>`
- Description: The context object created by `createContext()`

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

### User Context

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

## Best Practices

### Provide Default Values

```tsx
// ✅ Good - meaningful default
const ThemeContext = createContext({
  color: '#000000',
  fontSize: 14,
});

// ❌ Less ideal
const ThemeContext = createContext(null);
```

### Use Custom Hooks

```tsx
// ✅ Good - encapsulate context logic
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
const theme = useTheme();
```

### Type Safety

```tsx
// ✅ Good - typed context
interface AppSettings {
  darkMode: boolean;
  language: string;
}

const SettingsContext = createContext<AppSettings>({
  darkMode: false,
  language: 'en',
});
```

## Common Patterns

### Provider Composition

```tsx
function AppProviders({ children }: { children: JSX.Element }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

## Context vs Props

| Aspect | Context | Props |
|--------|---------|-------|
| When to use | Deeply nested data | Direct parent-child |
| Clarity | Good for global state | More explicit data flow |
| Boilerplate | Less prop drilling | More verbose |
