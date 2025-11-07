---
sidebar_position: 2
---


# createContext

Create a context object for sharing data across component trees without prop drilling.

## Import

```tsx
import { createContext } from '@bedrock-core/ui';
```

## Signature

```tsx
function createContext<T>(defaultValue: T): Context<T>
```

## Usage

```tsx
import { createContext } from '@bedrock-core/ui';

interface ThemeContextValue {
  primaryColor: string;
  backgroundColor: string;
}

const ThemeContext = createContext<ThemeContextValue>({
  primaryColor: '#ffffff',
  backgroundColor: '#000000'
});

// Use with Provider
function App() {
  return (
    <ThemeContext value={{ primaryColor: '#3498db', backgroundColor: '#2c3e50' }}>
      <ThemedComponent />
    </ThemeContext>
  );
}

// Consume in child components
function ThemedComponent() {
  const theme = useContext(ThemeContext);
  
  return (
    <Text x={10} y={10} color={theme.primaryColor}>
      Themed Text
    </Text>
  );
}
```

## Parameters

### `defaultValue`
- Type: `T` (generic)
- Description: The default value used when a component doesn't have a matching Provider above it in the tree

## Returns

A `Context<T>` object with the following properties:

### `Context`
- Type: `FunctionComponent<ContextProps<T>>`
- Description: Provider component that supplies the context value to descendants

### Provider Props

```tsx
interface ContextProps<T> {
  value: T;
  children?: JSX.Element | JSX.Element[];
}
```

## Context Object

```tsx
interface Context<T> {
  Provider: FunctionComponent<ContextProps<T>>;
  defaultValue: T;
  id: string;
}
```

## Examples

### Simple Theme Context

```tsx
interface Theme {
  color: string;
  fontSize: number;
}

const ThemeContext = createContext<Theme>({
  color: '#ffffff',
  fontSize: 14
});

function App() {
  return (
    <ThemeContext value={{ color: '#3498db', fontSize: 16 }}>
      <Panel width={400} height={300}>
        <ThemedText />
        <ThemedButton />
      </Panel>
    </ThemeContext>
  );
}

function ThemedText() {
  const theme = useContext(ThemeContext);
  return (
    <Text x={10} y={10} color={theme.color} fontSize={theme.fontSize}>
      Themed Text
    </Text>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <Button x={10} y={50} width={200} height={40} backgroundColor={theme.color}>
      Themed Button
    </Button>
  );
}
```

### User Authentication Context

```tsx
interface User {
  id: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});

function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);
  
  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    login,
    logout
  };
  
  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
}

function LoginButton() {
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  
  return (
    <Button 
      x={10} y={10} width={200} height={40}
      onPress={() => {
        if (isAuthenticated) {
          logout();
        } else {
          login({ id: '1', name: 'Steve', role: 'user' });
        }
      }}
    >
      {isAuthenticated ? 'Logout' : 'Login'}
    </Button>
  );
}

function UserProfile() {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated || !user) {
    return <Text x={10} y={10}>Not logged in</Text>;
  }
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10}>Name: {user.name}</Text>
      <Text x={10} y={40}>Role: {user.role}</Text>
    </Panel>
  );
}

// Usage
function App() {
  return (
    <AuthProvider>
      <Panel width={400} height={400}>
        <LoginButton />
        <UserProfile />
      </Panel>
    </AuthProvider>
  );
}
```

### Settings Context

```tsx
interface Settings {
  volume: number;
  brightness: number;
  language: string;
}

interface SettingsContextValue extends Settings {
  updateSettings: (partial: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  volume: 50,
  brightness: 80,
  language: 'en',
  updateSettings: () => {}
});

function SettingsProvider({ children }: { children: JSX.Element }) {
  const [settings, setSettings] = useState<Settings>({
    volume: 50,
    brightness: 80,
    language: 'en'
  });
  
  const updateSettings = (partial: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };
  
  return (
    <SettingsContext value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext>
  );
}

function VolumeControl() {
  const { volume, updateSettings } = useContext(SettingsContext);
  
  return (
    <>
      <Text x={10} y={10}>Volume: {volume}%</Text>
      <Button 
        x={10} y={50} width={120} height={40}
        onPress={() => updateSettings({ volume: Math.min(volume + 10, 100) })}
      >
        Volume +
      </Button>
      <Button 
        x={140} y={50} width={120} height={40}
        onPress={() => updateSettings({ volume: Math.max(volume - 10, 0) })}
      >
        Volume -
      </Button>
    </>
  );
}
```

### Multiple Contexts

```tsx
const ThemeContext = createContext({ color: '#fff' });
const UserContext = createContext({ name: 'Guest' });
const LanguageContext = createContext({ lang: 'en' });

function App() {
  return (
    <ThemeContext value={{ color: '#3498db' }}>
      <UserContext value={{ name: 'Steve' }}>
        <LanguageContext value={{ lang: 'es' }}>
          <MultiContextComponent />
        </LanguageContext>
      </UserContext>
    </ThemeContext>
  );
}

function MultiContextComponent() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const language = useContext(LanguageContext);
  
  const greeting = language.lang === 'es' ? 'Hola' : 'Hello';
  
  return (
    <Text x={10} y={10} color={theme.color}>
      {greeting}, {user.name}!
    </Text>
  );
}
```

### Nested Providers

```tsx
const CountContext = createContext(0);

function App() {
  return (
    <Panel width={400} height={300}>
      <CountContext value={1}>
        <Display />
        
        <CountContext value={2}>
          <Display />
          
          <CountContext value={3}>
            <Display />
          </CountContext>
        </CountContext>
      </CountContext>
    </Panel>
  );
}

function Display() {
  const count = useContext(CountContext);
  return <Text x={10} y={10}>Count: {count}</Text>;
}
```

### Context with Reducer

```tsx
interface State {
  count: number;
  items: string[];
}

type Action =
  | { type: 'increment' }
  | { type: 'addItem'; item: string }
  | { type: 'reset' };

interface AppContextValue {
  state: State;
  dispatch: (action: Action) => void;
}

const AppContext = createContext<AppContextValue>({
  state: { count: 0, items: [] },
  dispatch: () => {}
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'addItem':
      return { ...state, items: [...state.items, action.item] };
    case 'reset':
      return { count: 0, items: [] };
    default:
      return state;
  }
}

function AppProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(reducer, { count: 0, items: [] });
  
  return (
    <AppContext value={{ state, dispatch }}>
      {children}
    </AppContext>
  );
}

function Counter() {
  const { state, dispatch } = useContext(AppContext);
  
  return (
    <>
      <Text x={10} y={10}>Count: {state.count}</Text>
      <Button 
        x={10} y={50} width={200} height={40}
        onPress={() => dispatch({ type: 'increment' })}
      >
        Increment
      </Button>
    </>
  );
}
```

### Custom Hook Pattern

```tsx
const ThemeContext = createContext({ color: '#fff', fontSize: 14 });

// Custom hook for better ergonomics
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function ThemedText() {
  const theme = useTheme(); // Cleaner than useContext(ThemeContext)
  
  return (
    <Text x={10} y={10} color={theme.color} fontSize={theme.fontSize}>
      Themed Text
    </Text>
  );
}
```

## Best Practices

### 1. Provide Meaningful Defaults

```tsx
// ✅ Good - meaningful default values
const ThemeContext = createContext({
  color: '#000000',
  fontSize: 14,
  backgroundColor: '#ffffff'
});

// ❌ Less ideal - no defaults
const ThemeContext = createContext(null);
```

### 2. Type Your Contexts

```tsx
// ✅ Good - typed context
interface ThemeContextValue {
  color: string;
  fontSize: number;
}

const ThemeContext = createContext<ThemeContextValue>({
  color: '#000000',
  fontSize: 14
});
```

### 3. Split Large Contexts

```tsx
// ✅ Good - separate concerns
const ThemeContext = createContext({});
const UserContext = createContext({});
const SettingsContext = createContext({});

// ❌ Less ideal - one massive context
const AppContext = createContext({
  theme: {},
  user: {},
  settings: {},
  // ... everything
});
```

### 4. Use Provider Components

```tsx
// ✅ Good - dedicated provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);
  
  return (
    <ThemeContext value={{ theme, setTheme }}>
      {children}
    </ThemeContext>
  );
}

// Usage
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 5. Avoid Frequent Changes

```tsx
// ⚠️ Caution - frequent context updates trigger all consumers to re-render
import { system } from '@minecraft/server';
const [value, setValue] = useState(0);

useEffect(() => {
  const runId = system.runInterval(() => {
    setValue(v => v + 1); // All context consumers re-render every 20 ticks
  }, 20);
  
  return () => system.clearRun(runId);
}, []);
```

## Performance Considerations

- Context changes trigger re-renders for **all** consumers
- Split contexts by update frequency
- Memoize context values to prevent unnecessary re-renders
- Use context for relatively static data

```tsx
// Optimize context value
function Provider({ children }) {
  const [state, setState] = useState(initialState);
  
  // Memoize to prevent unnecessary re-renders
  const value = useMemo(() => ({ state, setState }), [state]);
  
  return (
    <Context value={value}>
      {children}
    </Context>
  );
}
```

## When to Use Context

✅ **Use Context for:**
- Theme configuration
- User authentication state
- Language/localization settings
- Global app state
- Configuration that rarely changes

❌ **Don't Use Context for:**
- Frequently changing values
- Props that only go one level deep
- Local component state
- Performance-critical updates

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

// Usage
<AppProviders>
  <App />
</AppProviders>
```

### Conditional Provider

```tsx
function ConditionalProvider({ useCustom, children }) {
  const value = useCustom ? customValue : defaultValue;
  
  return (
    <Context value={value}>
      {children}
    </Context>
  );
}
```

