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

### Reading the screen type

`screen.type` is `'scroll'` today — it's the only built-in screen type. The value is
exposed so components can branch on it once more screen types are added:

```tsx
function LayoutHint() {
  const screen = useScreen();

  // Future-proofing: branch on screen.type as new types land
  return <Text>{`Layout: ${screen.type}`}</Text>;
}
```

## See Also

- [`useSetScreen`](./useSetScreen.md) — override the screen descriptor for the current build
- [`render`](../api/render.md) — where the baseline screen descriptor is set
