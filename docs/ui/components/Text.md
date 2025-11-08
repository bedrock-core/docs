---
sidebar_position: 3
---
# Text

Display text content in your UI.

## Import

```tsx
import { Text } from '@bedrock-core/ui';
```

## Usage

```tsx
<Text x={10} y={10} width={200} height={20} value="Hello, Minecraft!" />
```

## Props

### Component-Specific Props

#### `value`
- Type: `string`
- Required: Yes
- Description: The text content to display
- Constrains: Max length is 80 characters, prefer to use translations strings when possible

### Control Props

Text inherits all standard [control props](./control-props.md).

## Examples

### Basic Text

```tsx
<Text x={0} y={0} width={200} height={20} value="Simple text" />
```

### Multi-line Layout

```tsx
<>
  <Text x={10} y={10} width={300} height={30} value="§b§1Title" />
  <Text x={10} y={40} width={300} height={25} value="§2Subtitle text" />
  <Text x={10} y={70} width={300} height={40} value="Body content goes here" />
</>
```

### Dynamic Text with State

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <Text x={10} y={10} width={200} height={30} value={`Count: ${count}`} />
      <Button 
        x={10} 
        y={50} 
        width={200} 
        height={40}
        onPress={() => setCount(count + 1)}
      >
        <Text x={10} y={10} width={180} height={20} value="Increment" />
      </Button>
    </>
  );
}
```

## Best Practices

- Position text with adequate padding from container edges
- Keep text concise to fit within serialization limits or prefer to use translation keys when possible
- Use formatting codes for styling https://minecraft.wiki/w/Formatting_codes

## Limitations

- Single line of text per component (no automatic line wrapping yet)
- Maximum text length determined by serialization protocol (80 bytes)

