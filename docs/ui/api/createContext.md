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

### Simple Theme Context

```tsx
interface Theme {
  primaryColor: string;
  backgroundColor: string;
}

const ThemeContext = createContext<Theme>({
  primaryColor: '#ffffff',
  backgroundColor: '#000000',
});

function App() {
  return (
    <ThemeContext value={{ primaryColor: '#3498db', backgroundColor: '#2c3e50' }}>
      <Panel padding={10} gap={8}>
        <ThemedText />
        <ThemedButton />
      </Panel>
    </ThemeContext>
  );
}

function ThemedText() {
  const theme = useContext(ThemeContext);

  return (
    <Text>{`Primary: ${theme.primaryColor}`}</Text>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <Button onPress={() => {}}>
      <Text>{'Styled Button'}</Text>
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

  const login = (newUser: User): void => setUser(newUser);
  const logout = (): void => setUser(null);

  return (
    <AuthContext value={user}>
      {children}
    </AuthContext>
  );
}

function Dashboard() {
  const user = useContext(AuthContext);

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
  updateSettings: () => {},
});

function SettingsProvider({ children }: { children: JSX.Element }) {
  const [settings, setSettings] = useState<Settings>({
    volume: 50,
    brightness: 80,
  });

  const updateSettings = (partial: Partial<Settings>): void => {
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
    <Panel padding={10} gap={8}>
      <Text>{`Volume: ${settings.volume}%`}</Text>
      <Panel flexDirection={'row'} gap={8}>
        <Button
          flex={1}
          onPress={() => updateSettings({ volume: Math.min(settings.volume + 10, 100) })}
        >
          <Text>{'Volume +'}</Text>
        </Button>
        <Button
          flex={1}
          onPress={() => updateSettings({ volume: Math.max(settings.volume - 10, 0) })}
        >
          <Text>{'Volume -'}</Text>
        </Button>
      </Panel>
    </Panel>
  );
}
```

## Best Practices

### Provide Meaningful Defaults

```tsx
// ✅ Good - meaningful default values
const ThemeContext = createContext({
  color: '#000000',
  fontSize: 14,
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
  fontSize: 14,
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
