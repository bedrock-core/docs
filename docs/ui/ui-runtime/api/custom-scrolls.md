---
sidebar_position: 4
---
# Scrolls & Custom Scroll Layouts

A form renders into one or more **scrolls**. A scroll is a viewport rectangle on
screen with scrollable content along an axis. By default everything renders into a
single full-screen root scroll; use the [`<Scroll>`](../components/Scroll.md) component
to add more independent scroll regions (columns, rows, horizontal strips).

## The two-mode model

Behaviour depends on how many `<Scroll>`s you use:

- **No `<Scroll>` (mode 1).** Content not wrapped in any `<Scroll>` goes into a single
  full-screen vertical **root scroll** that wraps and scrolls everything.
  `render(<Panel/>, player)` needs nothing else; its scrollbar appears on overflow.
- **One or more `<Scroll>`s (mode 2).** The screen becomes **fixed**: region-0 content
  (anything not wrapped in a `<Scroll>`) is expected to fit without scrolling. The root
  scroll hides itself, the region-0 content is drawn by the pool's flat content panel, and
  each `<Scroll>` is an independent viewport drawn over the top, taking indices 1, 2, 3…
  in document order.

Up to **4** custom scrolls ship out of the box (indices 1–4) alongside the root, so a
form can have 5 scrolls total without any RP edits. They share a fixed pool of generic
JSON UI controls, so adding layouts costs no per-topology JSON and the always-mounted
factory count stays flat — this is what keeps large multi-scroll forms fast.

```tsx
import { render, Scroll, Panel, Text } from '@bedrock-core/ui';

// Two side-by-side scroll columns. Arrangement comes from the parent Panel's
// flexDirection (see "Arranging scrolls" below).
render(
  <Panel flexDirection="row" width="100%" height="100%" gap={4}>
    <Scroll><Panel flexDirection="column">{left}</Panel></Scroll>
    <Scroll><Panel flexDirection="column">{right}</Panel></Scroll>
  </Panel>,
  player,
);
```

## Arranging scrolls

Scroll **viewports** are laid out by the normal flex pass: a `<Scroll>` is a leaf box in
its parent container, so its position and size follow that container's `flexDirection`,
`gap`, `flexGrow`, etc. — exactly like any other element.

- **Side-by-side columns:** wrap the scrolls in `<Panel flexDirection="row">`.
- **Stacked rows:** `<Panel flexDirection="column">` (the default).
- **Fixed size:** set `width`/`height` on a `<Scroll>` so it keeps that size while
  siblings share the rest; otherwise an un-sized scroll grows to fill (`flexGrow: 1`).
- **Absolute:** set both `x` and `y` on a `<Scroll>` to position its viewport freely
  (removed from the flow); `width`/`height` then size it.
- **Axis:** `axis="y"` (default) scrolls vertically — content height is the scroll
  extent; `axis="x"` scrolls horizontally — content width is the extent. For horizontal
  scrolls give cells explicit widths so the extent is well-defined.

A scroll's extent floors to its viewport (short content doesn't scroll) and grows past
it when content overflows.

## How it works (protocol)

`render` encodes a flat scroll list into the form title (protocol `v0007`):

```
header(9) + s:'scrolls'(83) + per scroll [ axis, x, y, width, height, extent ] (6 × 83)
```

Scroll `i`'s block starts at offset `83 + 498·i` after the header. The RP mounts two
sibling controls in `core-ui/common/screen_container.json`, gated by scroll count so
exactly one of them renders the region-0 content:

- `scroll_root@core_ui_screens.scroll` — the **main scroll** (index 0). Shown only in
  single-scroll mode, where it scrolls all region-0 content (content height = the `extent`
  of block 0, offset 498). In pool mode it hides itself.
- `scroll_pool@core_ui_screens.scroll_pool` — the **pool**, shown only when there is ≥1
  custom scroll (block 1 present), so a single-scroll screen's pool can't intercept root
  input. It draws region-0 content with a flat `pool_content` panel and mounts
  `scroll_1`..`scroll_4` of one generic `pooled_scroll` over it, each decoding its own
  block for viewport geometry (`use_anchored_offset` + `#size_binding_*`).

Both gates bind the `visible` field to a property **literally named `#visible`** (computed
from the title: an empty block-1 axis means single mode). The `visible` field silently
ignores any other property name, so always use `#visible` when data-driving visibility.

All scrolls share the one `form_buttons` collection and filter to their own index. A
`collection_panel`'s factory **cannot** forward the panel's `$region_filter` into the
controls it instantiates, so each pooled scroll points its factory at a **per-region
router variant** — `button_router_rN` / `label_router_rN`, thin extensions that bake in
`$region_filter: N`. The whole `control_ids` object is passed per scroll as
`$factory_ids`. The root scroll uses the base routers (region 0).

## Adding a 5th custom scroll (`scroll_5`)

The pool size is fixed in the RP (factory count = lag), so growing it is a one-time RP
edit. To add index 5:

1. **Define the per-region routers.** In `core-ui/common/button_router.json` and
   `label_router.json`, add a variant that bakes in the region:

   ```json
   "button_router_r5@button_router": { "$region_filter": 5 }
   // and, in label_router.json:
   "label_router_r5@label_router": { "$region_filter": 5 }
   ```

2. **Mount the slot** in `core-ui/screens/scroll_pool.json`, under `scroll_pool.controls`:

   ```json
   {
     "scroll_5@core_ui_screens.pooled_scroll": {
       "$block_skip": 2573,
       "$factory_ids": {
         "button": "@core_ui_common.button_router_r5",
         "label": "@core_ui_common.label_router_r5",
         "header": "@core_ui_common.unused",
         "divider": "@core_ui_common.unused"
       }
     }
   }
   ```

   `$block_skip` is the byte offset of the block: `83 + 498·i` (i = 5 → `2573`). It is a
   **number** — the slice spec is built at runtime as `('%.' + $block_skip + 's')`.

3. Nothing else — the title already carries as many blocks as there are `<Scroll>`s, and
   `scroll_pool.json` / the routers are already registered in `_ui_defs.json`.

## Caveats

- **Horizontal scrolls** measure content at natural width; give cells explicit widths.
  The pooled scrollbar is currently vertical-only.
- **Pool vs. lag.** Every mounted slot is a permanent `collection_panel` factory; keep
  the pool only as large as you need.
- The payload format is versioned (`PROTOCOL_HEADER` / `VERSION` in `serializer.ts`);
  custom RP controls that decode it must track the version.
