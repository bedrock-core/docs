---
sidebar_position: 1
---
# API

Core functions and utilities for building and displaying UI.

## Functions

- [`render(root, player)`](./render.md) — Entry point for all UI. Displays a component tree to a player.
- [`createContext(defaultValue)`](./createContext.md) — Create a context object for passing values down the component tree without prop drilling.

## Contexts

- [`TranslationContext`](./TranslationContext.md) — The context carrying how localized text resolves for a component subtree. `render()` provides it at every root, so you rarely provide it yourself.

## Advanced

- [Custom Native Components](./custom-native-components.md) — register your own native component `type` that the runtime serializes and your resource pack's JSON UI decodes. Requires JSON UI **and** serialization knowledge.

## Next Steps

- [Components](../components/components.md) - Built-in components that you can use in your JSX
- [Hooks](../hooks/hooks.md) - Add state and effects to your components
