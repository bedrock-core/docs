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
      <Text x={10} y={10} width={180} height={20} value="Close UI" />
    </Button>
  );
}
```

## Parameters

None

## Returns

- Type: `() => void`
- Description: A function that closes the UI when called

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
      <Text x={10} y={10} width={180} height={20} value="Close" />
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
      <Text x={10} y={10} width={300} height={30} value={`Saved: ${isSaved ? 'Yes' : 'No'}`} />
      <Button 
        x={10} 
        y={50}
        width={100}
        height={40}
        onPress={() => setIsSaved(true)}
      >
        <Text x={10} y={10} width={80} height={20} value="Save" />
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
        <Text x={10} y={10} width={80} height={20} value="Exit" />
      </Button>
    </>
  );
}
```


## Limitations

- Currently only works inside a button callback