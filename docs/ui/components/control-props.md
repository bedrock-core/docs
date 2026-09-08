---
sidebar_position: 15
description: "Common layout and styling properties shared by all components."
---
# Control Props

Common layout and styling properties shared by all components.

The library uses a **flexbox-based layout system**. You compose UIs by nesting `Panel` containers and letting the engine compute positions and sizes from `flexDirection`, `gap`, `padding`, `flex`, etc. To overlay an element use `position={'absolute'}` with `top` / `left` / `right` / `bottom`.

## Props

### Sizing

| Prop | Type | Description |
| --- | --- | --- |
| `width` | `number \| Percent` (e.g. `200` or `'50%'`) | Width in pixels or as a percentage of the parent's content box. Omit to derive from content / flex rules |
| `height` | `number \| Percent` | Height in pixels or as a percentage of the parent's content box. Omit to derive from content / flex rules |
| `minWidth` / `minHeight` / `maxWidth` / `maxHeight` | `number \| Percent` | Lower / upper bounds the layout engine will respect when sizing the element |
| `aspectRatio` | `number` (width ÷ height) | Derives whichever axis you left auto from the one that is definite. Ignored when both `width` and `height` are set |

### Positioning

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `'absolute' \| 'relative'` | `'relative'` | `'relative'` participates in flex flow. `'absolute'` is removed from flow and positioned with `top` / `left` / `right` / `bottom` relative to the nearest positioned parent |
| `top` / `right` / `bottom` / `left` | `number` (texels) | — | Edge offsets used when `position={'absolute'}`. Setting both `left` and `right` without an explicit `width` stretches the element horizontally; same for `top` + `bottom` and height |
| `zIndex` | `number` | `0` | Draw order, in a **container screen** only. There it becomes the control's baked `layer`, so a higher `zIndex` draws on top. A **server form** has no per-element layer — JSON UI cannot bind one, and its cells draw in fixed per-kind bands (a background below, a `Button` above it, `Text` above that) — so `zIndex` has no effect in a form |
| `display` | `'flex' \| 'none'` | `'flex'` | `'none'` removes the element from layout entirely — siblings collapse to fill the gap. Different from `visible={false}` which hides the element but keeps its space |

### Flex container props

These apply to a component that **contains** children.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `flexDirection` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'` | `'column'` | Main axis direction for child layout |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | `'nowrap'` | Whether children wrap onto multiple lines |
| `justifyContent` | `'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `'flex-start'` | Alignment of children along the main axis |
| `alignItems` | `'flex-start' \| 'flex-end' \| 'center' \| 'stretch'` | `'stretch'` | Alignment of children along the cross axis |
| `alignContent` | `'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'space-between' \| 'space-around'` | — | Alignment of multiple lines when `wrap` is enabled |
| `gap` / `rowGap` / `columnGap` | `number \| Percent` | — | Space between children. `gap` sets both axes |

### Flex item props

These apply to a component **as a child** inside a flex container.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `flex` | `number` | — | Shorthand for `flexGrow` |
| `flexGrow` | `number` | `0` | How much of the remaining space the item claims |
| `flexShrink` | `number` | `1` | How much the item shrinks when space is tight |
| `flexBasis` | `number \| Percent \| 'auto'` | `'auto'` | Initial size before flex growing/shrinking |
| `alignSelf` | `'auto' \| 'flex-start' \| 'flex-end' \| 'center' \| 'stretch'` | `'auto'` | Overrides the parent's `alignItems` for this item only |

### Spacing

| Prop | Type | Description |
| --- | --- | --- |
| `padding` / `paddingTop` / `paddingRight` / `paddingBottom` / `paddingLeft` | `number \| Percent` | Inner spacing in texels or as a percentage of the parent's content-box width |
| `margin` / `marginTop` / `marginRight` / `marginBottom` / `marginLeft` | `number \| Percent` | Outer spacing in texels or as a percentage of the parent's content-box width |

### Appearance

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `background` | `string` (resource-pack texture path, e.g. `'textures/ui/my_panel'`) | none — nothing is drawn behind the element | Resource-pack texture drawn behind the element, filling its computed layout box. It sits below the element's own content and its children, so a plain `Panel` can be given a surface without wrapping it in a themed component. Left unset, no background layer is drawn at all |

:::note Stateful surfaces
Interactive primitives (`Button`, the `Form.*` fields) extend `background` with per-state variants — `backgroundHover`, `backgroundPressed`, `backgroundLocked`. Each falls back to `background`, which itself falls back to the unstyled placeholder texture, so those components always draw *something*. See the individual component pages for the state props they support.
:::

### Visibility props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Whether the element is drawn. `false` removes it and its children entirely, but keeps the space it was laid out in. Use `display={'none'}` to remove it from layout too |
| `enabled` | `boolean` | `true` | Whether the control accepts input. Set per element |

## Examples

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

### Visibility control

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

### Absolute positioning

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
import type { ControlProps, LayoutProps } from '@bedrock-core/ui';
```

`LayoutProps` carries the flex layout properties; `ControlProps` extends it with `visible`, `enabled`, and `background`. Every built-in component's props type extends `ControlProps`. Individual types are also exported:

```tsx
import type {
  FlexDirection, FlexSize, FlexWrap,
  JustifyContent, AlignItems, AlignContent, AlignSelf,
  Display, Position, Spacing,
} from '@bedrock-core/ui';
```

The underlying primitives (`Percent`, `FlexStyle`, …) live in the flexbox entry point:

```tsx
import type { Percent, FlexStyle } from '@bedrock-core/ui/flexbox';
```
