# render

Display a UI component tree to a player.

## Import

```tsx
import { render } from '@bedrock-core/ui';
```

## Signature

```tsx
function render(player: Player, element: JSX.Element): void
```

## Usage

```tsx
import { render, Panel, Text } from '@bedrock-core/ui';
import { world } from '@minecraft/server';

function MyUI() {
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10}>Hello, Minecraft!</Text>
    </Panel>
  );
}

// Render to a player
world.afterEvents.playerSpawn.subscribe((event) => {
  render(event.player, <MyUI />);
});
```

## Parameters

### `player`
- Type: `Player` (from `@minecraft/server`)
- Description: The player who will see the UI

### `element`
- Type: `JSX.Element`
- Description: The root component to render

## How It Works

1. **Serialization**: Converts the JSX element tree into a compact binary protocol
2. **Form Creation**: Creates an `ActionFormData` from `@minecraft/server-ui`
3. **Payload Injection**: Injects serialized data into the form's label
4. **Display**: Shows the form to the player
5. **Decoding**: Resource Pack JSON UI decodes and renders the UI

## Examples

### Basic Render

```tsx
import { render, Text } from '@bedrock-core/ui';

function showWelcome(player: Player) {
  render(player, <Text x={10} y={10}>Welcome!</Text>);
}
```

### Render with State

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <Panel width={300} height={200}>
      <Text x={10} y={10}>Count: {count}</Text>
      <Button 
        x={10} y={50} width={280} height={40}
        onPress={() => setCount(count + 1)}
      >
        Increment
      </Button>
    </Panel>
  );
}

// Render interactive component
render(player, <Counter />);
```

### Render on Event

```tsx
import { world } from '@minecraft/server';

world.afterEvents.playerSpawn.subscribe((event) => {
  render(event.player, <WelcomeScreen />);
});

world.afterEvents.itemUse.subscribe((event) => {
  if (event.itemStack.typeId === 'minecraft:compass') {
    render(event.source, <MapUI />);
  }
});
```

### Render from Command

```tsx
import { world } from '@minecraft/server';

world.beforeEvents.chatSend.subscribe((event) => {
  if (event.message === '!menu') {
    event.cancel = true;
    render(event.sender, <MainMenu />);
  }
});
```

### Conditional Rendering

```tsx
function showUI(player: Player) {
  if (player.hasTag('admin')) {
    render(player, <AdminPanel />);
  } else {
    render(player, <PlayerUI />);
  }
}
```

### Render with Props

```tsx
interface GreetingProps {
  playerName: string;
  message: string;
}

function Greeting({ playerName, message }: GreetingProps) {
  return (
    <Panel width={400} height={200}>
      <Text x={10} y={10}>Hello, {playerName}!</Text>
      <Text x={10} y={50}>{message}</Text>
    </Panel>
  );
}

render(player, <Greeting playerName={player.name} message="Welcome back!" />);
```

### Multiple Renders

```tsx
// Each render call replaces the previous UI
render(player, <Screen1 />);

// Later...
render(player, <Screen2 />); // Screen1 is replaced

// Players can have independent UIs
render(player1, <UI1 />);
render(player2, <UI2 />); // Different UIs per player
```

### Render with Context

```tsx
const UserContext = createContext({ name: 'Guest', level: 1 });

function App() {
  return (
    <UserContext value={{ name: player.name, level: 5 }}>
      <Dashboard />
    </UserContext>
  );
}

render(player, <App />);
```

### Error Handling

```tsx
function safeRender(player: Player, element: JSX.Element) {
  try {
    render(player, element);
  } catch (error) {
    console.error('Failed to render UI:', error);
    player.sendMessage('§cFailed to open UI');
  }
}
```

### Delayed Render

```tsx
function delayedRender(player: Player) {
  player.sendMessage('§aOpening UI in 2 seconds...');
  
  setTimeout(() => {
    render(player, <MyUI />);
  }, 2000);
}
```

### Render Cycles

```tsx
function NavigationApp() {
  const [screen, setScreen] = useState<'home' | 'settings'>('home');
  
  return (
    <>
      {screen === 'home' ? (
        <Panel width={400} height={300}>
          <Text x={10} y={10}>Home Screen</Text>
          <Button 
            x={10} y={50} width={380} height={40}
            onPress={() => setScreen('settings')}
          >
            Go to Settings
          </Button>
        </Panel>
      ) : (
        <Panel width={400} height={300}>
          <Text x={10} y={10}>Settings Screen</Text>
          <Button 
            x={10} y={50} width={380} height={40}
            onPress={() => setScreen('home')}
          >
            Back to Home
          </Button>
        </Panel>
      )}
    </>
  );
}

render(player, <NavigationApp />);
```

### Render with Async Data

```tsx
function AsyncDataUI() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);
  
  if (loading) {
    return <Text x={10} y={10}>Loading...</Text>;
  }
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10}>Data: {data}</Text>
    </Panel>
  );
}

render(player, <AsyncDataUI />);
```

## Input Locking

The render function automatically manages input locks to prevent players from opening multiple UIs simultaneously:

- When a UI is shown, the player is locked from receiving new UIs
- Lock is released when the player closes or dismisses the UI
- Subsequent `render()` calls while locked are queued or ignored

## Lifecycle

1. **Mount**: Component functions are called, hooks are initialized
2. **Serialize**: Component tree is serialized into binary protocol
3. **Present**: Form is shown to player via `ActionFormData`
4. **Interact**: Player interacts with UI elements
5. **Update**: State changes trigger re-serialization and re-presentation
6. **Unmount**: Player closes UI, cleanup callbacks run

## Performance Considerations

- **Serialization cost**: Large component trees take longer to serialize
- **Re-renders**: State changes cause full re-serialization
- **Network payload**: Larger payloads take longer to transmit
- **JSON UI parsing**: Complex UIs take longer for Resource Pack to decode

### Optimization Tips

```tsx
// ✅ Good - small, focused components
function SmallUI() {
  return <Panel width={300} height={200}>...</Panel>;
}

// ⚠️ Caution - very large component trees
function MassiveUI() {
  return (
    <Panel>
      {Array.from({ length: 100 }).map((_, i) => (
        <Text key={i} x={10} y={10 + i * 30}>Item {i}</Text>
      ))}
    </Panel>
  );
}
```

## Best Practices

### 1. Render at Appropriate Times

```tsx
// ✅ Good - render on user action
world.afterEvents.itemUse.subscribe((event) => {
  render(event.source, <UI />);
});

// ❌ Bad - render every tick
system.runInterval(() => {
  render(player, <UI />); // Too frequent!
});
```

### 2. Handle Player Validity

```tsx
// ✅ Good - check if player is valid
function safeRender(player: Player | undefined, element: JSX.Element) {
  if (!player || !player.isValid()) {
    return;
  }
  render(player, element);
}
```

### 3. One Render Call Per UI

```tsx
// ✅ Good - single render with full tree
render(player, <App />);

// ❌ Bad - multiple renders (last one wins)
render(player, <Header />);
render(player, <Body />);  // Replaces Header
render(player, <Footer />); // Replaces Body
```

### 4. Use Keys for Lists

```tsx
// ✅ Good - unique keys
{items.map(item => (
  <Text key={item.id} x={10} y={10}>
    {item.name}
  </Text>
))}

// ❌ Bad - index as key
{items.map((item, index) => (
  <Text key={index} x={10} y={10}>
    {item.name}
  </Text>
))}
```

## Common Patterns

### Render Manager

```tsx
class UIManager {
  static show(player: Player, screen: 'home' | 'settings' | 'shop') {
    switch (screen) {
      case 'home':
        render(player, <HomeScreen />);
        break;
      case 'settings':
        render(player, <SettingsScreen />);
        break;
      case 'shop':
        render(player, <ShopScreen />);
        break;
    }
  }
}

// Usage
UIManager.show(player, 'home');
```

### Render with Permissions

```tsx
function renderWithPermission(player: Player, requiredTag: string, element: JSX.Element) {
  if (player.hasTag(requiredTag)) {
    render(player, element);
  } else {
    render(player, <Text x={10} y={10} color="#e74c3c">Access Denied</Text>);
  }
}
```

### Render Queue

```tsx
const renderQueue = new Map<string, JSX.Element[]>();

function queueRender(player: Player, element: JSX.Element) {
  const queue = renderQueue.get(player.id) || [];
  queue.push(element);
  renderQueue.set(player.id, queue);
}

function processQueue(player: Player) {
  const queue = renderQueue.get(player.id);
  if (queue && queue.length > 0) {
    const next = queue.shift()!;
    render(player, next);
  }
}
```

## Troubleshooting

### UI Not Showing

- Verify Resource Pack is installed and linked in manifest
- Check JSON UI files are correctly placed in `packs/RP/ui/`
- Ensure `_ui_defs.json` includes all component definitions
- Confirm player object is valid

### UI Shows Blank/Broken

- Check serialization protocol version matches Resource Pack
- Verify component props are within serialization limits
- Look for TypeScript/JavaScript errors in console
- Test with simpler components first

### Performance Issues

- Reduce component tree size
- Minimize state changes
- Avoid rendering in tight loops
- Profile serialization time
