---
sidebar_position: 1
---
# API

Core functions and utilities for building and displaying UI.

## Functions

- [`render(root, player, screen)`](./render.md) — Entry point for all UI. Displays a component tree to a player.
- [`createContext(defaultValue)`](./createContext.md) — Create a context object for passing values down the component tree without prop drilling.

## Advanced

- [Custom Native Components](./custom-native-components.md) — register your own native component `type` that the runtime serializes and your resource pack's JSON UI decodes. Requires JSON UI **and** serialization knowledge.

## Screen Descriptors

- `Screen.Scroll` — Default scrolling form layout; scrolls with the view.
- `Screen.Fixed` — Single non-scrolling page.

## Next Steps

- [Components](../components/components.md) - Built-in components that you can use in your JSX
- [Hooks](../hooks/hooks.md) - Add state and effects to your components