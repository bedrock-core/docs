---
sidebar_position: 6
description: "Every handler takes one event object; which fields each event carries."
---
# Handler events

Every handler in the library takes **one event object**, never a positional argument list:

```tsx
<Button onPress={({ player }) => player.sendMessage('hi')} />
<Slot onInsert={({ stack, host }) => count(host, stack)} />
<Form onSubmit={({ values }) => save(values)} />
```

| Type | Fields | Used by |
| --- | --- | --- |
| `UiEvent` | `player`, `host?`, `container?` | `Form.onCancel` |
| `PressEvent` | `player`, `host?`, `container?` | `Button.onPress` |
| `ContainerEvent` | `player`, `host`, `container` | `Container.onOpen` / `onClose` |
| `SlotEvent` | `player`, `host`, `container`, `stack` | `Slot.onInsert` / `onRemove` |
| `SubmitEvent` | `player`, `values` | `Form.onSubmit` |

`player` is always the player the event is about: the viewer on a form, and on a container screen the player who moved the item. `host` is the entity or block that owns the screen, so it is present exactly on screens a host owns — always on a container screen, never on a form. `container` travels with `host`: it is that screen's own cells as the engine's own [`Container`](https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/container), addressed by index or by name, so a handler written inside the component reaches them without importing the screen object — see [Reaching the cells](./container-screens.md#reaching-the-cells). What a handler receives can gain a field without breaking a single call site, which is why it is an object rather than arguments.

## Next steps

- [`Button`](../components/Button.md) — `onPress` and the press event
- [`Form`](../components/Form.md) — `onSubmit` and `onCancel`
- [Container screens](./container-screens.md) — where `host` comes from
