---
sidebar_position: 7
---
# Suspense

A component for handling asynchronous operations with loading states.

## Import

```tsx
import { Suspense } from '@bedrock-core/ui';
```

## Usage

```tsx
<Suspense fallback={<Text x={10} y={10} width={200} height={20} value="Loading..." />}>
  <AsyncContent />
</Suspense>
```

## Props

### `fallback`
- Type: `JSX.Element`
- Default: `undefined`
- Description: Fallback UI to show while waiting for children to resolve their state

### `awaitTimeout`
- Type: `number`
- Default: `20` (ticks)
- Description: Maximum time in ticks to wait for child state resolution. After timeout, shows main UI regardless of state resolution status.

### `children`
- Type: `JSX.Node`
- Required: Yes
- Description: Child nodes to be wrapped by the Suspense boundary

## How It Works

`Suspense` manages the rendering lifecycle by:

1. **Displaying fallback UI** - While a timeout has not been reached OR while child components have not resolved
2. **Logic separation** - All logic runs in the background while only snapshots are displayed (the UI cannot be mutated)
3. **State resolution** - Children are considered "resolved" when their state changes from the default value to a different value
4. **Batch rendering** - The framework waits for all Suspense boundaries to resolve, then displays a new snapshot of the UI


## Examples

### Basic Loading State

```tsx
function App() {
  return (
    <Panel x={0} y={0} width={400} height={300}>
      <Suspense 
        fallback={<Text x={10} y={10} width={200} height={20} value="Loading data..." />}
        awaitTimeout={20}
      >
        <DataDisplay />
      </Suspense>
    </Panel>
  );
}
```

### Multiple Suspense Boundaries

```tsx
function Dashboard() {
  return (
    <Panel x={0} y={0} width={600} height={500}>
      <Text x={10} y={10} width={200} height={30} value="Dashboard" />
      
      {/* User info section */}
      <Suspense 
        fallback={<Text x={10} y={50} width={200} height={20} value="Loading user..." />}
        awaitTimeout={20}
      >
        <UserProfile />
      </Suspense>
      
      {/* Stats section */}
      <Suspense 
        fallback={<Text x={10} y={200} width={200} height={20} value="Loading stats..." />}
        awaitTimeout={20}
      >
        <Statistics />
      </Suspense>
    </Panel>
  );
}
```

### Nested Suspense

```tsx
function App() {
  return (
    <Suspense 
      fallback={<Text x={10} y={10} width={200} height={20} value="Loading app..." />}
      awaitTimeout={20}
    >
      <Panel x={0} y={0} width={600} height={400}>
        <Suspense 
          fallback={<Text x={10} y={10} width={200} height={20} value="Loading header..." />}
          awaitTimeout={15}
        >
          <Header />
        </Suspense>
        
        <Suspense 
          fallback={<Text x={10} y={100} width={200} height={20} value="Loading content..." />}
          awaitTimeout={15}
        >
          <MainContent />
        </Suspense>
      </Panel>
    </Suspense>
  );
}
```

### With Error Boundaries (Pattern)

```tsx
function SafeContent() {
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <Text x={10} y={10} width={300} height={20} value={`Error: ${error}`} />
    );
  }
  
  return (
    <Suspense 
      fallback={<Text x={10} y={10} width={200} height={20} value="Loading..." />}
      awaitTimeout={20}
    >
      <AsyncData onError={setError} />
    </Suspense>
  );
}
```

## Best Practices

- **Set appropriate timeout values** - Balance between allowing time for state resolution and responsiveness (default: 20 ticks)
- **Provide meaningful fallback UI** - Clearly indicate what is loading with specific messages
- **Use multiple boundaries strategically** - Place Suspense around independent async operations for granular loading states
- **Keep fallback UI simple** - Avoid complex components in fallback to ensure quick rendering
- **Match fallback dimensions** - Ensure fallback has similar size to actual content to prevent layout shifts
- **Logic-presentation separation** - Remember that all logic runs in the background;

## Limitations

- `awaitTimeout` is measured in ticks (20 ticks = 1 second)
- State resolution only triggers when a child's state changes from its default value
