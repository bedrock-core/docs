---
sidebar_position: 1
description: "State, effects, and the hooks that reach the player, the host and the world."
---
# Hooks

State and effects for your components, plus the few that reach outside them.

## State

- [`useState`](./useState.md) — component state
- [`useReducer`](./useReducer.md) — state through a reducer
- [`useContext`](./useContext.md) — read a context value
- [`useObservable`](./useObservable.md) — read an observable

## Effects and lifecycle

- [`useEffect`](./useEffect.md) — side effects with cleanup
- [`useExit`](./useExit.md) — close the screen from inside it

## References

- [`useRef`](./useRef.md) — a mutable value that survives re-renders

## Minecraft

- [`usePlayer`](./usePlayer.md) — the player looking at this screen
- [`useEvent`](./useEvent.md) — subscribe to a Minecraft event signal for as long as the screen is mounted

## Hosts

- [`useMechanism`](./useMechanism.md) — what this kind of component becomes on the screen it is drawn on

## Localization

- [`useTranslation`](./useTranslation.md) — bind an addon's typed translation verbs to the viewing player
- [`useTranslationResolver`](./useTranslationResolver.md) — read the resolver active for this part of the tree
- [`useComposed`](./useComposed.md) — compose a string in every language the pack ships, at the width the layout gives a box

## Where the state lives

A form cannot be mutated while open, so a state change never repaints what the player is looking at — they see a new snapshot when they press. A container screen's state belongs to its entity or block and outlives every viewer. Both are covered in [State](../guides/state.md).

`usePlayer()` has no answer on a container screen: one compiled layout serves everyone, so the screen learns who is looking from `<Container onOpen>` instead.

## Next steps

- [State](../guides/state.md) — the model behind all of these
- [Components](../components/components.md) — what the hooks drive
- [API](../api/api.md) — `render()`, contexts and the compiled-screen registry
