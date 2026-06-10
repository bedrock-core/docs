---
sidebar_position: 11
---
# useScreen

Returns the screen descriptor currently in effect for the active build.

## Import

```tsx
import { useScreen } from '@bedrock-core/ui';
```

## Signature

```tsx
function useScreen(): ScreenDescriptor
```

### Parameters

None

### Returns

- Type: `ScreenDescriptor`
- Description: The screen descriptor that was set for the current build — either the baseline passed to `render()` or the value overridden by [`useSetScreen`](./useSetScreen.md) in the same build.

## Usage

```tsx
import { useScreen, Screen } from '@bedrock-core/ui';

function ScreenBadge() {
  const screen = useScreen();

  return (
    <Text>{`Layout: ${screen.type}`}</Text>
  );
}
```

### Conditional rendering based on screen type

```tsx
function LayoutHint() {
  const screen = useScreen();

  if (screen.type === 'scroll') {
    return <Text>{'Scroll down to see more'}</Text>;
  }

  return <Text>{'Everything fits on one page'}</Text>;
}
```

## See Also

- [`useSetScreen`](./useSetScreen.md) — override the screen descriptor for the current build
- [`render`](../api/render.md) — where the baseline screen descriptor is set
