---
sidebar_position: 6
---
# useExit

Request the UI to be closed.

## Import

```tsx
import { useExit } from '@bedrock-core/ui';
```

## Signature

```tsx
function useExit(): () => void;
```

### Parameters

None

### Returns

- Type: `() => void`
- Description: A function that closes the UI when called

## Usage

```tsx
function CloseButton() {
  const exit = useExit();
  
  return (
    <Button 
      x={10} 
      y={10}
      width={200}
      height={40}
      onPress={() => exit()}
    >
      <Text x={10} y={10} width={180} height={20}>Close UI</Text>
    </Button>
  );
}
```

## Examples

### Basic Close Button

```tsx
function CloseUI() {
  const exit = useExit();
  
  return (
    <Button 
      x={10} 
      y={10}
      width={200}
      height={40}
      onPress={exit}
    >
      <Text x={10} y={10} width={180} height={20}>Close</Text>
    </Button>
  );
}
```

### Conditional Close

```tsx
function ConditionalClose() {
  const exit = useExit();
  const [isSaved, setIsSaved] = useState(false);
  
  return (
    <>
      <Text x={10} y={10} width={300} height={30}>{`Saved: ${isSaved ? 'Yes' : 'No'}`}</Text>
      <Button 
        x={10} 
        y={50}
        width={100}
        height={40}
        onPress={() => setIsSaved(true)}
      >
        <Text x={10} y={10} width={80} height={20}>Save</Text>
      </Button>
      <Button 
        x={120} 
        y={50}
        width={100}
        height={40}
        onPress={() => {
          if (isSaved) {
            exit();
          }
        }}
      >
        <Text x={10} y={10} width={80} height={20}>Exit</Text>
      </Button>
    </>
  );
}
```

### Conditional Exit in an Effect

Use `useExit` inside an effect to react to a state change and close the UI automatically when a condition becomes true.

```tsx
function ExitAfterSave() {
  const exit = useExit();
  const [isSaved, setIsSaved] = useState(false);

  // When isSaved flips to true, exit the UI
  useEffect(() => {
    if (isSaved) {
      exit();
    }
  }, [isSaved, exit]);

  return (
    <>
      <Text x={10} y={10} width={300} height={30}>{`Saved: ${isSaved ? 'Yes' : 'No'}`}</Text>
      <Button 
        x={10} 
        y={50}
        width={200}
        height={40}
        onPress={() => setIsSaved(true)}
      >
        <Text x={10} y={10} width={180} height={20}>Save and Close</Text>
      </Button>
    </>
  );
}
```
