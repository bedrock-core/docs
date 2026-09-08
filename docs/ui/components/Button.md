---
sidebar_position: 4
description: "Interactive button component that responds to player interactions."
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

### Component-Specific props

| Prop | Type | Description |
| --- | --- | --- |
| `onPress` | `(event: PressEvent) => unknown \| Promise<unknown>` | Runs when the player presses the button. `event.player` is who pressed; on a [container screen](../guides/container-screens.md) `event.host` is the entity that owns the screen, and on a form there is none. Every handler in the library takes one event object — see [Handler events](../guides/handler-events.md) |
| `children` | `JSX.Node` | Child components — typically a `Text` (label) or `Image` (icon) |
| `backgroundHover` | `string` | Texture path used while the player hovers over the button |
| `backgroundPressed` | `string` | Texture path used while the button is being pressed |
| `backgroundLocked` | `string` | Texture path used when the button is disabled (`enabled={false}`) |

Combine these with `background` (from control props) to fully texture the button across every state. This is the foundation that [`@bedrock-core/ore-styled`'s `Button`](/docs/ore-styled/Button) builds on top of.

### Control props

Button inherits all standard [control props](./control-props.md).

## Examples

### Basic button

```tsx
<Button onPress={() => console.log('Clicked')}>
  <Text>{'Click Me'}</Text>
</Button>
```

### Button with state

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

### Disabled button

```tsx
<Button enabled={false}>
  <Text>{'Disabled'}</Text>
</Button>
```

### Row of buttons

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

### Icon button

```tsx
<Button onPress={() => console.log('clicked icon')}>
  <Image width={32} height={32} texture={'textures/items/diamond'} />
</Button>
```

### Fully themed button

```tsx
<Button
  background={'textures/ui/button_default'}
  backgroundHover={'textures/ui/button_hover'}
  backgroundPressed={'textures/ui/button_pressed'}
  backgroundLocked={'textures/ui/button_locked'}
  onPress={() => console.log('themed')}
>
  <Text>{'Themed'}</Text>
</Button>
```

## Notes

- Don't hardcode `width`/`height` — let buttons size to their content unless you need a specific footprint.
- Inside a row, use `flex={1}` on each button to distribute the space evenly.
- Use descriptive labels that clearly indicate the action.
- Disable buttons when an action is unavailable rather than hiding them.
