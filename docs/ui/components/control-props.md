---
sidebar_position: 8
---
# Control Props

Common layout and styling properties shared by all components.

## Available Props

### Layout Props

#### `width`
- Type: `number`
- Required: Yes
- Description: Width of the component in pixels

#### `height`
- Type: `number`
- Required: Yes
- Description: Height of the component in pixels

#### `x`
- Type: `number`
- Default: `0`
- Description: Horizontal position from parent's left edge

#### `y`
- Type: `number`
- Default: `0`
- Description: Vertical position from parent's top edge

#### `position`
- Type: `'absolute' | 'relative'`
- Default: `'relative'`
- Description: Positioning mode relative to parent 'relative' or to screen origin 'absolute'

### Visibility Props

#### `visible`
- Type: `boolean`
- Default: `true`
- Description: Whether the component is visible

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the component is enabled and interactive

## Usage Examples

### Basic Positioning

```tsx
<Text 
  x={50} 
  y={100}
  width={200}
  height={30}
  value="Positioned text"
/>
```

### Visibility Control

```tsx
function ConditionalUI({ showButton }) {
  return (
    <>
      <Text x={10} y={10} value="Some text" />
      <Button 
        x={10} 
        y={50}
        width={200}
        height={40}
        visible={showButton}
      >
        <Text value="Optional Button" />
      </Button>
    </>
  );
}
```

### Disabled State

```tsx
<Button 
  x={10} 
  y={10}
  width={200}
  height={40}
  enabled={false}
>
  <Text value="Disabled Button" />
</Button>
```

### Positioning Modes

```tsx
<>
  <Panel x={0} y={100} width={200} height={100}>
    {/* Relative positioning - positioned from parent origin */}
    <Text x={10} y={10} width={180} height={30} position="relative" value="Relative position" />

    {/* Absolute positioning - positioned from screen origin */}
    <Text x={10} y={10} width={180} height={30} position="absolute" value="Absolute position" />
  </Panel>
</>
```

## Layout Coordinate System

The coordinate system follows standard screen coordinates:

```
(0,0) ────────────► X
 │
 │     Component at (x, y)
 │          ┌─────────┐
 │          │         │
 │          │         │
 │          └─────────┘
 │               width × height
 ▼
 Y
```

- Origin (0, 0) is at the top-left corner of the parent
- X increases to the right
- Y increases downward
- All values are in pixels

## Best Practices

### Positioning

- Prefer relative position
- Consider parent's coordinate system when positioning children
- Leave adequate spacing between interactive elements

### Sizing

- Set explicit `width` and `height`
- Use consistent sizing for similar components (buttons, inputs)
- Test on different screen resolutions

### Visibility

- Use `visible={false}` to hide components in JSON UI while keeping the component instance and code execution active
- Use conditional rendering (`{condition && <Component />}`) to completely remove the component instance from TypeScript, stopping code execution
- Use `enabled={false}` to provide visual feedback for disabled states and block execution of actions (ex: button press)
- Note: `visible` and `enabled` props cascade to children - if a parent is invisible or disabled, all children inherit that state

## TypeScript Interface

```tsx
interface ControlProps {
  width: number;
  height: number;
  x?: number;
  y?: number;
  position?: 'absolute' | 'relative';
  visible?: boolean;
  enabled?: boolean;
}
```

## Serialization

Control props are serialized in a fixed block at the start of every component's payload to ensure consistent parsing in JSON UI decoders.
