---
sidebar_position: 1
---

# ui-runtime

`@bedrock-core/ui-runtime` is the core rendering and component system for building Bedrock UI.

It provides the JSX component primitives, hook system, and the API surface used to mount and manage your UI trees.

## Sections

| Section | Description |
|---|---|
| [**Components**](./components/components.md) | Primitive building blocks: `Panel`, `Text`, `Button`, `Image`, `Fragment` |
| [**Hooks**](./hooks/hooks.md) | Reactive state and lifecycle: `useState`, `useEffect`, `useEvent`, `useReducer`, and more |
| [**API**](./api/api.md) | Top-level functions: `render`, `createContext` |

## Experimental APIs

:::caution
The following exports are experimental and may change or be removed. They have known limitations in multi-addon worlds.
:::

| Export | Description |
|---|---|
| [`ItemRenderer`](./components/ItemRenderer.md) | Renders an item icon. Requires a manual `ItemAuxContext` wrapping the component tree. |
| [`ItemAuxContext`](./components/ItemRenderer.md#requirements) | Context that supplies the `typeId → packed-aux` map consumed by `ItemRenderer`. |
| [`ItemAuxMap`](./components/ItemRenderer.md#requirements) | Type alias for `Record<string, number>` — the map you build and provide. |
