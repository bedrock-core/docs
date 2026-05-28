---
sidebar_position: 2
---
# Panel

A flex container for organizing and grouping other UI elements.

## Import

```tsx
import { Panel } from '@bedrock-core/ui';
```

## Usage

```tsx
function Example() {
  return (
    <Panel padding={10} gap={6}>
      <Text>{'Content inside panel'}</Text>
    </Panel>
  );
}
```

## Props

### Component-Specific Props

#### `children`
- Type: `JSX.Node`
- Description: The children components inside the panel

### Control Props

Panel inherits all standard [control props](./control-props.md), including the full set of flex container properties (`flexDirection`, `justifyContent`, `alignItems`, `gap`, `padding`, …) and flex item properties (`flex`, `flexGrow`, `flexShrink`, …).

## Examples

### Vertical stack (default)

```tsx
<Panel padding={10} gap={6}>
  <Text>{'First line'}</Text>
  <Text>{'Second line'}</Text>
  <Text>{'Third line'}</Text>
</Panel>
```

### Horizontal row

```tsx
<Panel flexDirection={'row'} padding={10} gap={8}>
  <Button flex={1}>
    <Text>{'Cancel'}</Text>
  </Button>
  <Button flex={1}>
    <Text>{'Confirm'}</Text>
  </Button>
</Panel>
```

### Nested layout

```tsx
<Panel padding={10} gap={10}>
  <Panel padding={6} gap={4}>
    <Text>{'§lHeader'}</Text>
    <Text>{'Subtitle'}</Text>
  </Panel>

  <Panel flexDirection={'row'} gap={6}>
    <Panel flex={1} padding={6}>
      <Text>{'Left column'}</Text>
    </Panel>
    <Panel flex={1} padding={6}>
      <Text>{'Right column'}</Text>
    </Panel>
  </Panel>
</Panel>
```

### Centered content

```tsx
<Panel width={320} height={200} justifyContent={'center'} alignItems={'center'}>
  <Text>{'Centered'}</Text>
</Panel>
```

### Overlay with absolute positioning

```tsx
<Panel width={300} height={120}>
  <Text>{'Main content'}</Text>
  <Panel position={'absolute'} top={4} right={4}>
    <Text>{'✕'}</Text>
  </Panel>
</Panel>
```

## Best Practices

- Compose layouts by nesting panels with `flexDirection`, `gap`, and `padding` — let the engine compute positions and sizes.
- Reach for `position={'absolute'}` only for overlays / pinned UI that must escape the flex flow.
- Use `flex` (or `flexGrow`) on children to share remaining space along the main axis.
