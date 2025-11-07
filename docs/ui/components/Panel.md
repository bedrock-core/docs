---
sidebar_position: 2
---
# Panel

A container component for organizing and grouping other UI elements.

## Import

```tsx
import { Panel } from '@bedrock-core/ui';
```

## Usage

```tsx
function Example() {
  return (
    <Panel width={300} height={200}>
      <Text x={10} y={10} width={280} height={30} value="Content inside panel" />
    </Panel>
  );
}
```

## Props

### Component-Specific Props

#### `children`
- Type: `JSX.Node`
- Default: `undefined`
- Description: The children components inside the panel

### Control Props

Panel inherits all standard [control props](./control-props.md)

## Examples

### Basic Panel

```tsx
<Panel width={400} height={300}>
  <Text x={10} y={10} width={380} height={30} value="Simple panel content" />
</Panel>
```

### Nested Panels

```tsx
<Panel width={600} height={500}>
  <Panel 
    x={10}
    y={10}
    width={580} 
    height={100}
  >
    <Text x={10} y={10} width={560} height={30} value="Nested Panel Header" />
  </Panel>
  
  <Panel 
    x={10}
    y={130}
    width={580} 
    height={350}
  >
    <Text x={10} y={10} width={560} height={30} value="Nested Panel Content" />
  </Panel>
</Panel>
```

## Best Practices

- Use panels as containers to organize related UI elements
- Position child elements relative to the panel's origin (top-left corner)
