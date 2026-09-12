---
sidebar_position: 6
description: "A press, textured per state, with an onPress handler."
---
# Button

A press.

## Import

```tsx
import { Button } from '@bedrock-core/ui';
```

## Usage

```tsx
<Button onPress={() => console.warn('pressed')}>
  <Text>{'Press me'}</Text>
</Button>
```

Buttons are sized intrinsically from their content plus the button's built-in padding. Drop them inside a `Panel` and use flex props to lay them out.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onPress` | `(event: PressEvent) => unknown \| Promise<unknown>` | — | Runs when the player presses the button |
| `children` | `JSX.Node` | — | What the button shows, typically a `Text` or an `Image` |
| `backgroundHover` | `string` | `background` | Texture drawn while the player hovers |
| `backgroundPressed` | `string` | `background` | Texture drawn while the button is being pressed |
| `backgroundLocked` | `string` | `background` | Texture drawn while the button is disabled |

Inherits [control props](./control-props.md). Every state texture falls back to `background`, and `background` falls back to the blank-canvas placeholder, so one texture styles all four states.

This is the primitive [`@bedrock-core/ore-styled`'s `Button`](/docs/ore-styled/Button) is built on.

## What a press is

`event.player` is who pressed. On a [container screen](../guides/container-screens.md) `event.host` is the entity that owns the screen; on a form there is none. Every handler in the library takes one event object — see [Handler events](../guides/handler-events.md).

What the press *costs* depends on the [host](../guides/hosts.md): a form entry the engine reports back by index on an action form, an item taken and put straight back on a container screen. A native modal has no generic button at all — use [`<Form.Button>`](./Form/FormButton.md) there.

When the destination is another screen rather than a handler, reach for [`<Link>`](./Link.md): its target is data the build can read, which is what makes the screen describable to other addons.

## Examples

### With state

```tsx
function ToggleButton(): JSX.Element {
  const [isActive, setIsActive] = useState(false);

  return (
    <Button onPress={() => setIsActive(!isActive)}>
      <Text>{isActive ? '§aActive' : '§7Inactive'}</Text>
    </Button>
  );
}
```

### Disabled

```tsx
<Button enabled={false}>
  <Text>{'Disabled'}</Text>
</Button>
```

### A row sharing the width

```tsx
<Panel flexDirection={'row'} padding={10} gap={8}>
  <Button flex={1} onPress={() => console.warn('cancel')}>
    <Text>{'Cancel'}</Text>
  </Button>
  <Button flex={1} onPress={() => console.warn('confirm')}>
    <Text>{'Confirm'}</Text>
  </Button>
</Panel>
```

### An icon

```tsx
<Button onPress={() => console.warn('pressed')}>
  <Image width={32} height={32} texture={'textures/items/diamond'} />
</Button>
```

### Fully themed

```tsx
<Button
  background={'textures/ui/button_default'}
  backgroundHover={'textures/ui/button_hover'}
  backgroundPressed={'textures/ui/button_pressed'}
  backgroundLocked={'textures/ui/button_locked'}
  onPress={() => console.warn('pressed')}
>
  <Text>{'Themed'}</Text>
</Button>
```

## Notes

Let buttons size to their content rather than hardcoding `width` and `height`, unless the layout needs a specific footprint. Inside a row, `flex={1}` on each button distributes the space evenly.

Disable a button when its action is unavailable rather than hiding it: a hidden control leaves its box behind on a compiled screen unless the row is a [`<Panel stack>`](./Panel.md#stack).

An `onPress` that returns a promise keeps the press's transaction open until it settles, which is what makes an async handoff flash-free. See [State](../guides/state.md#one-ui-slot-per-player).
