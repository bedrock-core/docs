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

### Parameters

#### `defaultValue`
- Type: `T` (generic)
- Description: The default value used

### Returns

A `Context<T>` object that can be used as a Provider component

## Usage

```tsx
import { createContext, useContext } from '@bedrock-core/ui';

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
      <ThemedComponent />
    </ThemeContext>
  );
}

function ThemedComponent() {
  const theme = useContext(ThemeContext);
  
  return (
    <Text x={10} y={10} width={300} height={30}>{`Color: ${theme.color}, Size: ${theme.fontSize}`}</Text>
  );
}
```

## Examples

### Simple Theme Context

```tsx
interface Theme {
  primaryColor: string;
  backgroundColor: string;
}

const ThemeContext = createContext<Theme>({
  primaryColor: '#ffffff',
  backgroundColor: '#000000'
});

function App() {
  return (
    <ThemeContext value={{ primaryColor: '#3498db', backgroundColor: '#2c3e50' }}>
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
    <Text x={10} y={10} width={380} height={30}>{`Primary: ${theme.primaryColor}`}</Text>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  
  return (
    <Button x={10} y={50} width={380} height={40} onPress={() => {}}>
      <Text x={10} y={10} width={360} height={20}>Styled Button</Text>
    </Button>
  );
}
```

### User Authentication Context

```tsx
interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

const AuthContext = createContext<User | null>(null);

function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);
  
  return (
    <AuthContext value={user}>
      {children}
    </AuthContext>
  );
}

function Dashboard() {
  const user = useContext(AuthContext);
  
  if (!user) {
    return <Text x={10} y={10} width={300} height={30}>Not logged in</Text>;
  }
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30}>{`Welcome, ${user.name}!`}</Text>
      <Text x={10} y={50} width={380} height={30}>{`Role: ${user.role}`}</Text>
    </Panel>
  );
}
```

### Settings Context with Updates

```tsx
interface Settings {
  volume: number;
  brightness: number;
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: { volume: 50, brightness: 80 },
  updateSettings: () => {}
});

function SettingsProvider({ children }: { children: JSX.Element }) {
  const [settings, setSettings] = useState<Settings>({
    volume: 50,
    brightness: 80
  });
  
  const updateSettings = (partial: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };
  
  return (
    <SettingsContext value={{ settings, updateSettings }}>
      {children}
    </SettingsContext>
  );
}

function VolumeControl() {
  const { settings, updateSettings } = useContext(SettingsContext);
  
  return (
    <>
      <Text x={10} y={10} width={300} height={30}>{`Volume: ${settings.volume}%`}</Text>
      <Button x={10} y={50} width={180} height={40} onPress={() => updateSettings({ volume: Math.min(settings.volume + 10, 100) })}>
        <Text x={10} y={10} width={160} height={20}>Volume +</Text>
      </Button>
      <Button x={200} y={50} width={180} height={40} onPress={() => updateSettings({ volume: Math.max(settings.volume - 10, 0) })}>
        <Text x={10} y={10} width={160} height={20}>Volume -</Text>
      </Button>
    </>
  );
}
```

## Best Practices

### Provide Meaningful Defaults

```tsx
// ✅ Good - meaningful default values
const ThemeContext = createContext({
  color: '#000000',
  fontSize: 14
});

// ❌ Less ideal
const ThemeContext = createContext(null);
```

### Type Your Contexts

```tsx
// ✅ Good - typed context
interface Theme {
  color: string;
  fontSize: number;
}

const ThemeContext = createContext<Theme>({
  color: '#000000',
  fontSize: 14
});
```

### Create Provider Components

```tsx
// ✅ Good - dedicated provider
function ThemeProvider({ children }: { children: JSX.Element }) {
  const [theme, setTheme] = useState(defaultTheme);
  
  return (
    <ThemeContext value={theme}>
      {children}
    </ThemeContext>
  );
}
```

### Split Contexts by Concern

```tsx
// ✅ Good - separate concerns
const ThemeContext = createContext({});
const AuthContext = createContext({});
const SettingsContext = createContext({});
```

