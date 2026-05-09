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
<Text>{'Hello, Minecraft!'}</Text>
```

`Text` is sized intrinsically from its content. Place it inside a `Panel` and use the panel's `gap`/`padding`/`flexDirection` to control layout.

## Props

### Component-Specific Props

#### `children`
- Type: `string`
- Required: Yes
- Description: The text content to display
- Constraints: Max length is 80 characters — prefer translation keys for long copy.

#### `font`
- Type: `'mojangles' | 'minecraft-ten'`
- Description: Optional font selection.

### Control Props

Text inherits all standard [control props](./control-props.md).

## Examples

### Basic Text

```tsx
<Text>{'Simple text'}</Text>
```

### Multi-line Layout

```tsx
<Panel padding={10} gap={6}>
  <Text>{'§b§lTitle'}</Text>
  <Text>{'§2Subtitle text'}</Text>
  <Text>{'Body content goes here'}</Text>
</Panel>
```

### Dynamic Text with State

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Panel padding={10} gap={8}>
      <Text>{`Count: ${count}`}</Text>
      <Button onPress={() => setCount(count + 1)}>
        <Text>{'Increment'}</Text>
      </Button>
    </Panel>
  );
}
```

## Best Practices

- Don't hardcode `width`/`height` — let `Text` size to its content and rely on the parent panel's `gap`/`padding`.
- Keep strings concise to fit within the serialization limit, or use translation keys for longer copy.
- Use Minecraft formatting codes for styling: https://minecraft.wiki/w/Formatting_codes

## Limitations

- Single line of text per component (no automatic line wrapping yet).
- Maximum text length determined by serialization protocol (80 bytes).
