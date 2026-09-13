---
sidebar_position: 6
description: "Every handler takes one event object; which fields each event carries."
---
# Handler events

Every handler in the library takes **one event object**, never a positional argument list:

```tsx
<Button action={({ player }) => player.sendMessage('hi')} />
<Slot onInsert={({ stack, host }) => count(host, stack)} />
<Form onSubmit={({ values }) => save(values)} />
```

| Type | Fields | Used by |
| --- | --- | --- |
| `UiEvent` | `player`, `host?` | `Form.onCancel` |
| `PressEvent` | `player`, `host?` | `Button.action` as a handler |
| `ContainerEvent` | `player`, `host` | `Container.onOpen` / `onClose` |
| `SlotEvent` | `player`, `host`, `stack` | `Slot.onInsert` / `onRemove` |
| `SubmitEvent` | `player`, `values` | `Form.onSubmit` |

`player` is always the player the event is about: the viewer on a form, and on a container screen the player who moved the item. `host` is the entity that owns the screen, so it is present exactly on screens an entity owns — always on a container screen, never on a form. What a handler receives can gain a field without breaking a single call site, which is why it is an object rather than arguments.

## Next steps

- [`Button`](../components/controls/Button.md) — `action` and the press event
- [`Form`](../components/roots/Form.md) — `onSubmit` and `onCancel`
- [Container screens](./container-screens.md) — where `host` comes from
