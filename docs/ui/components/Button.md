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
<Button onPress={() => console.log('Button clicked!')}>
  <Text>{'Click Me'}</Text>
</Button>
```

Buttons are sized intrinsically from their content plus the button's built-in padding. Drop them inside a `Panel` and use flex props (`flex`, `flexDirection`, `gap`, …) to lay them out.

## Props

### Component-Specific Props

#### `onPress`
- Type: `() => void | Promise<void>`
- Description: Callback invoked when the player presses the button.

#### `children`
- Type: `JSX.Node`
- Description: Child components — typically a `Text` (label) or `Image` (icon).

### Control Props

Button inherits all standard [control props](./control-props.md).

## Examples

### Basic Button

```tsx
<Button onPress={() => console.log('Clicked')}>
  <Text>{'Click Me'}</Text>
</Button>
```

### Button with State

```tsx
function ToggleButton() {
  const [isActive, setIsActive] = useState(false);

  return (
    <Button onPress={() => setIsActive(!isActive)}>
      <Text>{isActive ? '§aActive' : '§7Inactive'}</Text>
    </Button>
  );
}
```

### Disabled Button

```tsx
<Button enabled={false}>
  <Text>{'Disabled'}</Text>
</Button>
```

### Row of Buttons

```tsx
<Panel flexDirection={'row'} padding={10} gap={8}>
  <Button flex={1} onPress={() => console.log('cancel')}>
    <Text>{'Cancel'}</Text>
  </Button>
  <Button flex={1} onPress={() => console.log('confirm')}>
    <Text>{'Confirm'}</Text>
  </Button>
</Panel>
```

### Icon Button

```tsx
<Button onPress={() => console.log('clicked icon')}>
  <Image width={32} height={32} texture={'textures/items/diamond'} />
</Button>
```

## Best Practices

- Don't hardcode `width`/`height` — let buttons size to their content unless you need a specific footprint.
- Inside a row, use `flex={1}` on each button to distribute the space evenly.
- Use descriptive labels that clearly indicate the action.
- Disable buttons when an action is unavailable rather than hiding them.
