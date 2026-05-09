---
sidebar_position: 8
---
# Control Props

Common layout and styling properties shared by all components.

The library uses a **flexbox-based layout system**. You compose UIs by nesting `Panel` containers and letting the engine compute positions and sizes from `flexDirection`, `gap`, `padding`, `flex`, etc. To overlay an element use `position={'absolute'}` with `top` / `left` / `right` / `bottom`.

## Available Props

### Sizing

#### `width`
- Type: `number | Percent` (e.g. `200` or `'50%'`)
- Description: Width in pixels or as a percentage of the parent's content box. Omit to derive from content / flex rules.

#### `height`
- Type: `number | Percent`
- Description: Height in pixels or as a percentage of the parent's content box. Omit to derive from content / flex rules.

#### `minWidth` / `minHeight` / `maxWidth` / `maxHeight`
- Type: `number | Percent`
- Description: Lower / upper bounds the layout engine will respect when sizing the element.

### Positioning

#### `position`
- Type: `'absolute' | 'relative'`
- Default: `'relative'`
- Description: `'relative'` participates in flex flow. `'absolute'` is removed from flow and positioned with `top` / `left` / `right` / `bottom` relative to the nearest positioned parent.

#### `top` / `right` / `bottom` / `left`
- Type: `number | Percent`
- Description: Edge offsets used when `position={'absolute'}`.

#### `zIndex`
- Type: `number`
- Description: Z-order. Higher values render on top.

#### `display`
- Type: `'flex' | 'none'`
- Default: `'flex'`
- Description: `'none'` removes the element from layout entirely — siblings collapse to fill the gap. Different from `visible={false}` which hides the element but keeps its space.

### Flex Container Props

These apply to a component that **contains** children.

#### `flexDirection`
- Type: `'row' | 'row-reverse' | 'column' | 'column-reverse'`
- Default: `'column'`
- Description: Main axis direction for child layout.

#### `wrap`
- Type: `'nowrap' | 'wrap' | 'wrap-reverse'`
- Default: `'nowrap'`
- Description: Whether children wrap onto multiple lines.

#### `justifyContent`
- Type: `'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'`
- Default: `'flex-start'`
- Description: Alignment of children along the main axis.

#### `alignItems`
- Type: `'flex-start' | 'flex-end' | 'center' | 'stretch'`
- Default: `'stretch'`
- Description: Alignment of children along the cross axis.

#### `alignContent`
- Type: `'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around'`
- Description: Alignment of multiple lines when `wrap` is enabled.

#### `gap` / `rowGap` / `columnGap`
- Type: `number | Percent`
- Description: Space between children. `gap` sets both axes.

### Flex Item Props

These apply to a component **as a child** inside a flex container.

#### `flex`
- Type: `number`
- Description: Shorthand for `flexGrow`.

#### `flexGrow`
- Type: `number`
- Default: `0`
- Description: How much of the remaining space the item claims.

#### `flexShrink`
- Type: `number`
- Default: `1`
- Description: How much the item shrinks when space is tight.

#### `flexBasis`
- Type: `number | Percent | 'auto'`
- Default: `'auto'`
- Description: Initial size before flex growing/shrinking.

#### `alignSelf`
- Type: `'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch'`
- Default: `'auto'`
- Description: Overrides the parent's `alignItems` for this item only.

### Spacing

#### `padding` / `paddingTop` / `paddingRight` / `paddingBottom` / `paddingLeft`
- Type: `number | Percent`
- Description: Inner spacing in texels or as a percentage of the parent's content-box width.

#### `margin` / `marginTop` / `marginRight` / `marginBottom` / `marginLeft`
- Type: `number | Percent`
- Description: Outer spacing in texels or as a percentage of the parent's content-box width.

### Visibility Props

#### `visible`
- Type: `boolean`
- Default: `true`
- Description: Whether the component is visible. The element still occupies space in the layout. Use `display={'none'}` to remove it from layout entirely.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the component is enabled and interactive. Cascades to children.

## Usage Examples

### Stacked column

```tsx
<Panel padding={10} gap={8}>
  <Text>{'Title'}</Text>
  <Text>{'Body text'}</Text>
</Panel>
```

### Row of buttons

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

### Centered content

```tsx
<Panel width={300} height={200} justifyContent={'center'} alignItems={'center'}>
  <Text>{'Centered'}</Text>
</Panel>
```

### Visibility Control

```tsx
function ConditionalUI({ showButton }: { showButton: boolean }) {
  return (
    <Panel padding={10} gap={8}>
      <Text>{'Some text'}</Text>
      <Button visible={showButton}>
        <Text>{'Optional Button'}</Text>
      </Button>
    </Panel>
  );
}
```

### Display None vs Visible

```tsx
{/* visible={false} keeps the space reserved */}
<Button visible={false}>
  <Text>{'Hidden'}</Text>
</Button>

{/* display={'none'} removes from layout — siblings collapse */}
<Button display={'none'}>
  <Text>{'Removed'}</Text>
</Button>
```

### Absolute Positioning

```tsx
<Panel width={300} height={200}>
  <Text>{'Main content'}</Text>
  {/* Pinned to top-right, outside normal flow */}
  <Panel position={'absolute'} top={4} right={4}>
    <Text>{'✕'}</Text>
  </Panel>
</Panel>
```

## Visibility vs Display

| | `visible={false}` | `display={'none'}` |
|---|---|---|
| Space reserved | Yes | No |
| Children executed | Yes | No |
| Use case | Hide visually | Remove from layout |

## TypeScript

```tsx
import type { LayoutProps } from '@bedrock-core/ui';
```

`LayoutProps` extends `FlexStyle` and is available on all built-in components. Individual types are also exported:

```tsx
import type {
  FlexDirection, FlexSize, FlexWrap,
  JustifyContent, AlignItems, AlignContent, AlignSelf,
  Display, Position, Spacing, Percent,
} from '@bedrock-core/ui';
```
