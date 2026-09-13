---
sidebar_position: 1
description: "A flex container for grouping other elements, optionally a stack that reflows hidden children."
---
# Panel

A flex container for grouping and laying out other elements.

## Import

```tsx
import { Panel } from '@bedrock-core/ui';
```

## Usage

```tsx
<Panel padding={10} gap={6}>
  <Text>{'Content inside panel'}</Text>
</Panel>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `stack` | `boolean` | `false` | Draw the column as a stack, so a hidden child takes no space and the children after it move up |
| `children` | `JSX.Node` | — | What the panel contains |

Inherits [control props](../control-props.md), including the full set of flex container properties (`flexDirection`, `justifyContent`, `alignItems`, `gap`, `padding`, …) and flex item properties (`flex`, `flexGrow`, `flexShrink`, …).

## stack

A compiled screen's boxes are solved before anyone is looking at them, so a child hidden at show time normally leaves the space it was given — three optional rows with the middle one missing leave a gap in the middle.

A stack is the one thing the engine reflows on its own, which is what makes the rows pack:

```tsx
<Panel background={'textures/ui/panel'}>
  <Panel stack gap={2}>
    <Text visible={hasWarning}>{'Warning'}</Text>
    <Text>{'Always shown'}</Text>
  </Panel>
</Panel>
```

The cost is a background. A stack has nowhere to draw one, so put it on a panel around this one — which is what the example above does.

[`<List>`](../compiled/List.md) and [`<Disclosure>`](../compiled/Disclosure.md) are built on the same reflow.

## Examples

### Vertical stack (the default direction)

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

### Two columns

```tsx
<Panel flexDirection={'row'} gap={6}>
  <Panel flex={1} padding={6}>
    <Text>{'Left column'}</Text>
  </Panel>
  <Panel flex={1} padding={6}>
    <Text>{'Right column'}</Text>
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
    <Text>{'Close'}</Text>
  </Panel>
</Panel>
```

## Notes

Compose layouts by nesting panels with `flexDirection`, `gap` and `padding`, and let [`@bedrock-core/flexbox`](/docs/flexbox) compute positions and sizes. Reach for `position={'absolute'}` only for overlays and pinned UI that must escape the flow, and use `flex` or `flexGrow` on children to share the remaining space along the main axis.
