---
sidebar_position: 1
description: "State and effects management for your components."
---
# Hooks

State and effects management for your components.

## Built-in hooks

### State management

- [`useState`](./useState.md) — Manage component state.
- [`useReducer`](./useReducer.md) — Manage complex state logic with a reducer function.
- [`useContext`](./useContext.md) — Access context values from Context.

### Effects & lifecycle

- [`useEffect`](./useEffect.md) — Perform side effects in function components with cleanup support.
- [`useExit`](./useExit.md) — Request the UI to be closed.

### References

- [`useRef`](./useRef.md) — Create a mutable reference that is persisted across executions.

### Minecraft specific

- [`usePlayer`](./usePlayer.md) — Access the current player who is viewing the UI.
- [`useEvent`](./useEvent.md) — Subscribe to global Minecraft events within your UI components.

### Localization

- [`useTranslation`](./useTranslation.md) — Bind an addon's typed translation verbs to the viewing player.
- [`useTranslationResolver`](./useTranslationResolver.md) — Read the translation resolver active for this part of the tree.

## Next steps

- [Components](../components/components.md) — Built-in components that you can use in your JSX
- [API](../api/api.md) — APIs that are useful for defining components
