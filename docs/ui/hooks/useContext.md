---
sidebar_position: 4
---
# useContext

Access context values from Context Providers.

## Import

```tsx
import { useContext, createContext } from '@bedrock-core/ui';
```

## Signature

```tsx
function useContext<T>(context: Context<T>): T
```

## Usage

```tsx
// Create context
const ThemeContext = createContext({ color: '§1' });

// Provider component
function App() {
  return (
    <ThemeContext value={{ color: '§2' }}>
      <ThemedComponent />
    </ThemeContext>
  );
}

// Consumer component
function ThemedComponent() {
  const theme = useContext(ThemeContext);
  
  return (
    <Text x={10} y={10} width={200} height={30} value={`${theme.color}Themed Text`} />
  );
}
```

## Parameters

### `context`
- Type: `Context<T>`
- Description: The context object created by `createContext()`

## Returns

The current context value for the given context. The value is determined by the nearest `<Context>` above the component in the tree.

## Examples

### Theme Context

```tsx
interface Theme {
  primaryColor: string;
  backgroundColor: string;
}

const ThemeContext = createContext<Theme>({
  primaryColor: '§f',
  backgroundColor: '§0'
});

function App() {
  const darkTheme: Theme = {
    primaryColor: '§b',
    backgroundColor: '§0'
  };
  
  return (
    <ThemeContext value={darkTheme}>
      <Panel width={400} height={300}>
        <ThemedButton />
        <ThemedText />
      </Panel>
    </ThemeContext>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  
  return (
    <Button 
      x={10} 
      y={10}
      width={200}
      height={40}
    >
      <Text x={10} y={10} width={180} height={20} value={`${theme.backgroundColor}Themed Button`} />
    </Button>
  );
}

function ThemedText() {
  const theme = useContext(ThemeContext);
  
  return (
    <Text 
      x={10} 
      y={70}
      width={200}
      height={30}
      value={`${theme.primaryColor}Themed Text`}
    />
  );
}
```

### User Context

```tsx
interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

const UserContext = createContext<User | null>(null);

function App() {
  const currentUser: User = {
    id: '123',
    name: 'Steve',
    isAdmin: true
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
    return <Text x={10} y={10} width={200} height={30} value="Please log in" />;
  }
  
  return (
    <>
      <Text x={10} y={10} width={200} height={30} value={`Welcome, ${user.name}!`} />
      {user.isAdmin && (
        <Button x={10} y={50} width={200} height={40}>
          <Text x={10} y={10} width={180} height={20} value="Admin Panel" />
        </Button>
      )}
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
    <Text x={10} y={10} width={300} height={30} value={`${greeting}, ${user.name}!`} />
  );
}
```

### Nested Providers

```tsx
const CountContext = createContext(0);

function App() {
  return (
    <CountContext value={1}>
      <Text x={10} y={10} width={300} height={30} value={`Count: ${useContext(CountContext)}`} />
      
      <CountContext value={2}>
        <Text x={10} y={40} width={300} height={30} value={`Count: ${useContext(CountContext)}`} />
        
        <CountContext value={3}>
          <Text x={10} y={70} width={300} height={30} value={`Count: ${useContext(CountContext)}`} />
        </CountContext>
      </CountContext>
    </CountContext>
  );
}
```

### Context with State

```tsx
interface Settings {
  volume: number;
  setVolume: (v: number) => void;
}

const SettingsContext = createContext<Settings>({
  volume: 50,
  setVolume: () => {}
});

function SettingsProvider({ children }) {
  const [volume, setVolume] = useState(50);
  
  return (
    <SettingsContext value={{ volume, setVolume }}>
      {children}
    </SettingsContext>
  );
}

function VolumeControl() {
  const { volume, setVolume } = useContext(SettingsContext);
  
  return (
    <>
      <Text x={10} y={10} width={300} height={30} value={`Volume: ${volume}%`} />
      <Button 
        x={10} y={50} width={120} height={40}
        onPress={() => setVolume(Math.min(volume + 10, 100))}
      >
        <Text x={10} y={10} width={100} height={20} value="Increase" />
      </Button>
      <Button 
        x={140} y={50} width={120} height={40}
        onPress={() => setVolume(Math.max(volume - 10, 0))}
      >
        <Text x={10} y={10} width={100} height={20} value="Decrease" />
      </Button>
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <Panel width={400} height={300}>
        <VolumeControl />
      </Panel>
    </SettingsProvider>
  );
}
```

### Custom Hook with Context

```tsx
const AuthContext = createContext<{ isLoggedIn: boolean; login: () => void } | null>(null);

// Custom hook
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const login = () => setIsLoggedIn(true);
  
  return (
    <AuthContext value={{ isLoggedIn, login }}>
      {children}
    </AuthContext>
  );
}

function LoginButton() {
  const { isLoggedIn, login } = useAuth();
  
  return (
    <Button 
      x={10} y={10}
      width={200}
      height={40}
      enabled={!isLoggedIn}
      onPress={login}
    >
      <Text x={10} y={10} width={180} height={20} value={isLoggedIn ? '§aLogged In' : '§cLogin'} />
    </Button>
  );
}
```

## Best Practices

### Provide Default Values

```tsx
// ✅ Good - meaningful default
const ThemeContext = createContext({
  color: '#000000',
  fontSize: 14
});

// ❌ Less ideal - no defaults
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

### Split Large Contexts

```tsx
// ✅ Good - separate concerns
const ThemeContext = createContext({});
const UserContext = createContext({});

// ❌ Less ideal - too much in one context
const AppContext = createContext({
  theme: {},
  user: {},
  settings: {},
  // ... everything
});
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
  language: 'en'
});
```

## Common Patterns

### Provider Composition

```tsx
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </UserProvider>
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

