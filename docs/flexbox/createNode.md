---
sidebar_position: 2
description: "Create a LayoutNode ready to be passed to computeLayout."
---

# createNode

Create a `LayoutNode` ready to be passed to [`computeLayout`](./computeLayout.md).

## Import

```ts
import { createNode } from '@bedrock-core/flexbox';
```

## Signature

```ts
function createNode(
  style?: FlexStyle,
  children?: LayoutNode[],
  measure?: MeasureFunc,
): LayoutNode
```

### Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `style` | `FlexStyle` | `{}` | Flex style properties for this node. See the [FlexStyle reference](#flexstyle-reference) below |
| `children` | `LayoutNode[]` | `[]` | Child nodes. Their layout is computed relative to this node's content box |
| `measure` | `MeasureFunc` — `(availableWidth: number) => { width: number; height: number }` | — | Content measure for **leaf** nodes whose intrinsic size depends on the width they are granted (wrapping text is the canonical case: a narrower box means more lines means a taller node). Omit it for nodes sized by their children or by explicit `width`/`height` |

### Returns

A `LayoutNode` with `layout` zeroed out. Layout values are populated only after `computeLayout()` runs.

```ts
interface LayoutNode {
  style: FlexStyle;
  children: LayoutNode[];
  layout: ComputedLayout;  // zeroed until computeLayout() runs
  measure?: MeasureFunc;   // width-dependent content sizing, leaves only
}
```

## MeasureFunc

`computeLayout()` calls a node's `measure` twice: first with `Infinity`, then with the width it actually granted — your function must handle both. Explicit `style.width` / `style.height` always win over the measured size, and a `measure` takes precedence over child-derived sizing.

```ts
import { createNode, type MeasureFunc, type MeasuredSize } from '@bedrock-core/flexbox';

const measureLabel: MeasureFunc = (availableWidth): MeasuredSize => {
  const lines = wrapToWidth(text, availableWidth);

  return { width: widestLine(lines), height: lines.length * LINE_HEIGHT };
};

const label = createNode({ flexShrink: 1 }, [], measureLabel);
```

## ComputedLayout

After `computeLayout()`, each node's `layout` field holds the resolved geometry. All values are rounded integers (no sub-pixel fractions).

```ts
interface ComputedLayout {
  x: number;       // left edge, in texels, from screen origin
  y: number;       // top edge, in texels, from screen origin
  width: number;   // in texels
  height: number;  // in texels
  zIndex: number;  // resolved z-order (inherited from parent when not set)
}
```

## FlexStyle reference

All properties are optional. Defaults mirror CSS flexbox where applicable.

### Sizing

| Prop | Type | Description |
| --- | --- | --- |
| `width` / `height` | `number \| Percent` (e.g. `200` or `'50%'`) | Explicit size in texels or as a percentage of the parent's content-box width/height. Omit to derive from content or flex rules |
| `minWidth` / `maxWidth` / `minHeight` / `maxHeight` | `number \| Percent` | Clamps the resolved size to a lower or upper bound |
| `aspectRatio` | `number` (width ÷ height) | Derives the auto axis from the definite one. An explicit `width` drives the height, an explicit `height` drives the width, and with both auto the width drives (the axis the parent or flex growth resolves first). Ignored when both axes are explicit — matching CSS — and when the node has a `measure`, since the measure owns both dimensions there |

### Positioning

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `'relative' \| 'absolute'` | `'relative'` | `'relative'` participates in flex flow. `'absolute'` is removed from flow and positioned with `top` / `left` / `right` / `bottom` relative to its parent's content box |
| `top` / `right` / `bottom` / `left` | `number` | — | Edge offsets used when `position: 'absolute'`. Providing both `left` and `right` without an explicit `width` stretches the node horizontally. Same applies to `top` + `bottom` for height |
| `zIndex` | `number` | — | Z-order layer. Inherited from parent when not set. Higher values render on top |
| `display` | `'flex' \| 'none'` | `'flex'` | `'none'` removes the node from layout entirely — it takes no space and is invisible to siblings |

### Flex container props

These affect how **children** are laid out inside this node.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `flexDirection` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'` | `'column'` | Main axis direction |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | `'nowrap'` | Whether children wrap onto multiple lines when they overflow the main axis |
| `justifyContent` | `'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `'flex-start'` | Distribution of children along the main axis |
| `alignItems` | `'flex-start' \| 'flex-end' \| 'center' \| 'stretch'` | `'stretch'` | Alignment of children along the cross axis. `'stretch'` makes children fill the cross dimension |
| `alignContent` | `'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'space-between' \| 'space-around'` | `'stretch'` | Alignment of flex lines when `wrap` is enabled and there are multiple lines |
| `gap` | `number \| Percent` | — | Space between children on both axes. Use `rowGap` / `columnGap` to set axes independently |
| `rowGap` / `columnGap` | `number \| Percent` | — | Space between rows / columns when `wrap` is enabled. `rowGap` also applies between children in a `column` container |
| `padding` | `number \| Percent` | — | Inner spacing on all four sides. Use `paddingTop` / `paddingRight` / `paddingBottom` / `paddingLeft` for per-side control. Percentage values resolve against the **parent's content-box width** for all sides |

### Flex item props

These affect how **this node** is sized and positioned inside its parent flex container.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `flex` | `number` | — | Shorthand for `flexGrow` when `flexGrow` is not explicitly set |
| `flexGrow` | `number` | `0` | Proportion of remaining free space this node claims. `flex: 1` on siblings shares space equally |
| `flexShrink` | `number` | `1` | How much this node shrinks relative to siblings when the container overflows. Set to `0` to prevent shrinking |
| `flexBasis` | `number \| Percent \| 'auto'` | `'auto'` | Hypothetical main-axis size before growing / shrinking is applied. `'auto'` uses `width` / `height` (depending on `flexDirection`) |
| `alignSelf` | `'auto' \| 'flex-start' \| 'flex-end' \| 'center' \| 'stretch'` | `'auto'` | Overrides the parent's `alignItems` for this specific node |
| `margin` | `number \| Percent` | — | Outer spacing on all four sides. Use `marginTop` / `marginRight` / `marginBottom` / `marginLeft` for per-side control. Percentage values resolve against the **parent's content-box width** for all sides |
