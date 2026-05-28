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
    <Button onPress={() => exit()}>
      <Text>{'Close UI'}</Text>
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
    <Button onPress={exit}>
      <Text>{'Close'}</Text>
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
    <Panel padding={10} gap={8}>
      <Text>{`Saved: ${isSaved ? 'Yes' : 'No'}`}</Text>
      <Panel flexDirection={'row'} gap={8}>
        <Button flex={1} onPress={() => setIsSaved(true)}>
          <Text>{'Save'}</Text>
        </Button>
        <Button
          flex={1}
          onPress={() => {
            if (isSaved) {
              exit();
            }
          }}
        >
          <Text>{'Exit'}</Text>
        </Button>
      </Panel>
    </Panel>
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
    <Panel padding={10} gap={8}>
      <Text>{`Saved: ${isSaved ? 'Yes' : 'No'}`}</Text>
      <Button onPress={() => setIsSaved(true)}>
        <Text>{'Save and Close'}</Text>
      </Button>
    </Panel>
  );
}
```
