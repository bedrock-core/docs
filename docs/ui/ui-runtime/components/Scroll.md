# Scroll

`<Scroll>` declares an independent scroll region. Arrange a group of scrolls with a
concrete `<Panel flexDirection>` wrapper. A form supports up to 2 of them.

## Import

```tsx
import { Scroll } from '@bedrock-core/ui';
```

Each `<Scroll>` becomes its own scroll viewport (index 0 is the root) and scrolls
vertically. Content not wrapped in any `<Scroll>` falls into a single full-screen root
scroll, so simple UIs need none.

## Props

#### `children`
- Type: `JSX.Node`
- Description: The content laid out inside this scroll's viewport.

### Control Props

`<Scroll>` inherits all standard [control props](./control-props.md) and they size and
position its **viewport** in the parent's flex flow, exactly like a `<Panel>`. An un-sized,
non-absolute scroll defaults to `flexGrow: 1` so bare `<Scroll>`s share the parent's space;
`width`/`height` override that, and `position="absolute"` + `top`/`left` take it out of the flow.

`visible`, `enabled`, and `background` are accepted (they come with `ControlProps`) but are
**not** applied to the scroll viewport.

```tsx
// Two side-by-side scroll columns — arrangement comes from the parent Panel.
<Panel flexDirection="row" gap={4}>
  <Scroll width="30%">{left}</Scroll>
  <Scroll>{right}</Scroll>
</Panel>

// A fixed header above a scrolling body (stacked column).
<Panel flexDirection="column" height="100%">
  <Panel height={30}>{header}</Panel>
  <Scroll>{body}</Scroll>
</Panel>
```

## Notes

- A form supports at most **2 custom `<Scroll>`s** (3 total with the root scroll). Rendering
  more **throws a `ScrollLimitError`** during layout.
- Scrolls cost engine time on big screens. Use one only where you genuinely need an
  independent scrolling region; reach for a plain `<Panel>` when the single root scroll
  will do.
- **Using any `<Scroll>` fixes the screen to the canonical viewport size.** Without scrolls the
  whole tree lives in the root scroll, which grows and scrolls when content overflows. As soon
  as you add a `<Scroll>`, the screen itself becomes a fixed-size canvas: content outside a
  scroll must fit within it, and only the content *inside* each `<Scroll>` scrolls. Size the
  outer layout to the screen (e.g. `height="100%"`) and let each `<Scroll>` absorb overflow.
- Scrolls are vertical. Horizontal scrolling isn't exposed yet.

## See Also

- [`render`](../api/render.md) — display a component tree to a player
