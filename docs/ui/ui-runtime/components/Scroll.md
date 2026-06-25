# Scroll

`<Scroll>` declares an independent scroll region. Arrange a group of scrolls with a
concrete `<Panel flexDirection>` wrapper. See [Custom Scrolls](../api/custom-scrolls.md)
for the full model.

## Import

```tsx
import { Scroll } from '@bedrock-core/ui';
```

## `<Scroll>`

Each `<Scroll>` becomes its own scroll viewport (index 0 is the root). Content not
wrapped in any `<Scroll>` falls into a single full-screen root scroll, so simple UIs
need none.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `axis` | `'x' \| 'y'` | `'y'` | Scroll direction. `'y'` = content height is the extent; `'x'` = content width is the extent. |
| `width` | `number \| "NN%"` | — | Viewport width override; otherwise sized by the outer flow. |
| `height` | `number \| "NN%"` | — | Viewport height override; otherwise sized by the outer flow. |
| `x` | `number` | — | Absolute viewport left. Set with `y` to position the viewport freely. |
| `y` | `number` | — | Absolute viewport top. Set with `x` to position the viewport freely. |

```tsx
// Two side-by-side scroll columns — arrangement comes from the parent Panel.
<Panel flexDirection="row" gap={4}>
  <Scroll>{left}</Scroll>
  <Scroll>{right}</Scroll>
</Panel>

// Horizontal strip
<Scroll axis="x">
  <Panel flexDirection="row">{cells}</Panel>
</Scroll>
```

## Notes

- Up to 5 scrolls ship by default (root + 4); see [Custom Scrolls](../api/custom-scrolls.md)
  to add more.
- For horizontal scrolls, give cells explicit widths so the scroll extent is defined.

## See Also

- [Custom Scrolls](../api/custom-scrolls.md) — the model, protocol, and pool sizing
- [`render`](../api/render.md) — display a component tree to a player
