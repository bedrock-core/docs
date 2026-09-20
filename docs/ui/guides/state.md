---
sidebar_position: 3
description: "Where a screen's hook state lives, how long it lasts, and when the player sees a change."
---
# State

A screen holds state the way a React component does — [`useState`](../hooks/useState.md), [`useReducer`](../hooks/useReducer.md), [`useRef`](../hooks/useRef.md), [`useEffect`](../hooks/useEffect.md) — and the build and the runtime render the *same* component. The build runs it once to decide the shape; the runtime runs it per viewer to decide the values, and the two walks line up position for position because a compiled screen's shape is frozen.

## One UI slot per player

Each player has a single live UI session. A second `render()` for that player does not stack a second one — it swaps the new tree into the running session:

- The old tree unmounts first: its effect cleanups run, its hook state is discarded, and any form it has on screen is closed programmatically. That close is not the player dismissing, so a modal's `onCancel` does not fire for it.
- The new tree presents with fresh, mount-phase state.

That makes handoff from a press safe with no `useExit()` call — the swap replaces the running UI by itself:

```tsx
function SettingsButton(): JSX.Element {
  const player = usePlayer();

  return (
    <Button onPress={() => render(SettingsApp, player)}>
      <Text>{'Settings'}</Text>
    </Button>
  );
}
```

When the handoff goes through an async opener, **return the promise from `onPress`** so the swap lands inside the press's transaction. Fired and forgotten it still converges; worst case the screen re-locks for a frame.

## A form change is a new present

`@minecraft/server-ui` forms cannot be mutated while open, so a state change never repaints a form on its own. The component logic keeps running in the background; the player sees a new snapshot **when they press**.

A container screen has no such limit: a handler renders and the slots settle in the same tick.

## A container screen's state belongs to its entity or block

One layout serves every viewer of a container screen. Its state is written to the host after each render and read back at the next open, so it outlives every viewer — and effects run exactly while somebody is looking, because the fibers exist exactly then.

That is also why a container screen has no `usePlayer()`: one compiled layout serves everyone, and the screen learns who is looking from `onOpen` instead.

## Reacting to something outside the screen

[`useObservable`](../hooks/useObservable.md) reads an observable into a component: a config leaf, a db document, a query, or anything else shaped like `@bedrock-core/observable`'s `ReadonlyObservable`.

A change lands the way a state change does. A form keeps it and shows it on the player's next press; a container screen updates its live values at once.

```tsx
const count = useObservable(playersObs, p => p.size);
```

With a `select` only a change to the selected slice counts, so a screen showing a count is not woken by every mutation of the collection behind it.

## What a value costs

A compiled screen's shape is frozen, so anything that varies has to reserve room for itself before the build knows what it will hold.

| Varies | Declared as | Reserves |
| --- | --- | --- |
| A string | [`maxLength`](../components/Text.md) on a `<Text>` | its width, and on the chest one slot per character |
| A row count | [`max`](../components/List.md) on a `<List>` | `max` copies of the row, plus one int |
| A branch | `visible` on the control | a carried bool |
| A texture | [`live`](../components/Image.md) on an `<Image>` | one entry on a form |

Everything else is baked. A baked string fed from data that changes is silently wrong, which is what `render(screen, player, { debug: true })` reports.

## Next steps

- [Hooks](../hooks/hooks.md) — the reference for each hook
- [Hosts](./hosts.md) — what each screen can carry a live value on
- [Handler events](./handler-events.md) — the event object every handler takes
