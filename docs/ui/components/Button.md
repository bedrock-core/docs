---
sidebar_position: 4
---
# Button

Interactive button component that responds to player interactions.

## Import

```tsx
import { Button } from '@bedrock-core/ui';
```

## Usage

```tsx
<Button 
  x={10} 
  y={10} 
  width={200} 
  height={40}
  onPress={() => console.log('Button clicked!')}
>
  <Text x={10} y={10} width={180} height={20} value="Click Me" />
</Button>
```

## Props

### Component-Specific Props

#### `onPress`
- Type: `() => void`
- Default: `undefined`
- Description: Callback function executed when button is pressed

#### `children`
- Type: `JSX.Node`
- Required: No
- Description: Child components (typically a Text component)

### Control Props

Button inherits all standard [control props](./control-props.md).

## Examples

### Basic Button

```tsx
<Button 
  x={10} 
  y={10} 
  width={200} 
  height={40}
  onPress={() => console.log('Clicked')}
>
  <Text x={10} y={10} width={180} height={20} value="Click Me" />
</Button>
```

### Button with State

```tsx
function ToggleButton() {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <Button
      x={10}
      y={10}
      width={200}
      height={40}
      onPress={() => setIsActive(!isActive)}
    >
      <Text x={10} y={10} width={180} height={20} value={isActive ? 'Active' : 'Inactive'} />
    </Button>
  );
}
```

### Disabled Button

```tsx
<Button 
  x={10} 
  y={10}
  width={200}
  height={40}
  enabled={false}
>
  <Text x={10} y={10} width={180} height={20} value="Disabled" />
</Button>
```

## Best Practices

- Space buttons adequately to prevent accidental clicks
- Use descriptive button labels that clearly indicate the action
- Disable buttons when actions are unavailable rather than hiding them
