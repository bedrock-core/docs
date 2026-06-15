---
sidebar_position: 10
---
# useSetScreen

Override the screen layout for the current render build.

## Import

```tsx
import { useSetScreen, Screen } from '@bedrock-core/ui';
```

## Signature

```tsx
function useSetScreen(screen: ScreenDescriptor): void
```

### Parameters

#### `screen`
- Type: `ScreenDescriptor`
- Description: The screen descriptor to use for this build, overriding the baseline passed to `render()`.

### Returns

`void`

## Description

`useSetScreen` lets a component inside the tree select which Resource Pack screen layout activates for the current render build, overriding the baseline `screen` argument passed to `render()`.

**Rules:**
- Call at component render time — **not** inside `useEffect` or event callbacks.
- The hook applies per-build (each press of a button triggers a new build). It does not persist across builds.
- Navigators must **never** call `useSetScreen`. It is the screen component's own responsibility.

The intended pattern is a screen component declaring its own layout requirement:

```tsx
function MyScreen() {
  useSetScreen(Screen.Scroll);
  return <Panel>...</Panel>;
}
```

> `Screen.Scroll` is currently the only built-in descriptor (so this hook is effectively a no-op today). The hook and the descriptor system are kept so upcoming screen types can opt in without API changes.

## Screen Descriptors

| Descriptor | `type` | Description |
|------------|--------|-------------|
| `Screen.Scroll` | `'scroll'` | Default scrolling form layout — scrolls on overflow, no scrollbar when content fits. Currently the only built-in type. |

## Usage

```tsx
import { useSetScreen, Screen, Panel, Text } from '@bedrock-core/ui';
import { ItemRenderer } from '@bedrock-core/ui';
import { ItemStack } from '@minecraft/server';

interface ItemDetailProps {
  item: ItemStack;
}

function ItemDetail({ item }: ItemDetailProps) {
  // Declare this screen's layout (Scroll is the only type today)
  useSetScreen(Screen.Scroll);

  return (
    <Panel padding={8} gap={4}>
      <ItemRenderer item={item} width={32} height={32} />
      <Text>{item.typeId}</Text>
    </Panel>
  );
}
```

## See Also

- [`render`](../api/render.md) — the `screen` baseline parameter
- [`ItemRenderer`](../components/ItemRenderer.md) — renders item icons
