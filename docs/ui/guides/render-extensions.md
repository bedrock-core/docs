---
sidebar_position: 8
description: "Compose expanded trees, retain portable build data and observe generic render lifecycle."
---
# Extend rendering

Build component libraries around the shared renderer's tree, compilation data and session lifecycle.

## Compose expanded content

[`TreeBoundary`](../components/TreeBoundary.md) gives a library fully expanded children before layout and host allocation. The transform returns the controls to compile and render. Keep hooks in the component that owns the boundary and keep its transformation pure.

[`SelectionPanel`](../components/SelectionPanel.md) retains fixed content under native selection gates. These controls provide composition without owning routes or a destination stack.

## Retain compilation data

| Export | Kind | Description |
| --- | --- | --- |
| `withCompileData(element, key, data)` | function | Attach portable library data to a control without changing its layout |
| `useCompiledData(key)` | hook | Read that key from the current host's compiled snapshot |
| `childElements(children)` | function | Read element children while composing a control tree |

```tsx
import { Panel, TreeBoundary, withCompileData, type JSX } from '@bedrock-core/ui';

function IndexedContent({ children }: { children?: JSX.Node }): JSX.Element {
  return <TreeBoundary transform={expanded => withCompileData(
    <Panel>{[...expanded]}</Panel>,
    'my-library:content',
    { childCount: expanded.length },
  )}>{children}</TreeBoundary>;
}
```

Compilation data must be portable plain data. Duplicate keys within a host are rejected. Give independently composed instances distinct keys when each needs its own data.

`useCompiledData(key)` returns `unknown`, or `undefined` when absent, including during the build. Validate its shape before using it. Library data accompanies the compiled snapshot and does not replace the normal component props or reserved live channels.

## Read render ownership

`useRenderOwner()` identifies the current render:

| `kind` | Available data |
| --- | --- |
| `'build'` | Build identity |
| `'player'` | `id` and `player` |
| `'entity'` | `id` and `entity` shared by the container's viewers |
| `'block'` | `id` and `block` shared by the container's viewers |

Check the discriminant before using host-specific data. A container owner does not identify one acting player; handlers receive that player separately.

## Observe and refresh sessions

[`observeRenderLifecycle()`](../api/render.md#observe-render-sessions) reports immutable server session starts, replacements and endings. Late subscribers can request active-session replay. A start does not acknowledge client paint, and a local native selection emits no lifecycle event.

[`refreshRender(player)`](../api/render.md#refresh-an-open-form) re-presents the current form while retaining fibers. [`endRender(player, options?)`](../api/render.md#end-a-render-session) releases a session, including a handoff that leaves the destination's form open.

## Navigation libraries

[`@bedrock-core/navigation/runtime`](/docs/navigation/api/createNavigatorFactory) provides custom factories with shared stack or tab behavior and destination-host support. Route reducers, context planning and caller history belong to that package. The UI renderer remains responsible for controls, hosts and generic lifecycle facts.

## Next steps

- [TreeBoundary](../components/TreeBoundary.md) — expanded child composition
- [Compiled screens](../api/compiled-screens.md) — snapshots and local metadata
- [Navigator factories](/docs/navigation/api/createNavigatorFactory) — custom layouts and host support
