---
sidebar_position: 1
---
# Components

Built-in JSX components for layout, text, and interactivity.

## Components

- [**`<Panel>`**](./Panel.md) — basic container with optional background and flexbox layout.
- [**`<Text>`**](./Text.md) — display text with Minecraft formatting codes, font, and scale.
- [**`<Button>`**](./Button.md) — interactive button with an `onPress` callback.
- [**`<Image>`**](./Image.md) — display a texture from your resource pack.
- [**`<Background>`**](./Background.md) — full-screen texture drawn behind all form content.
- [**`<Scroll>`**](./Scroll.md) — independent vertical scroll regions, arranged with flex (side-by-side or stacked).
- [**`<Fragment>`**](./Fragment.md) — group multiple children without a wrapper node (`<>...</>`).

## Form

Atomic modal form. `<Form>` renders one native `ModalFormData` — every field is shown at once, and every value arrives together, keyed by `name`, on submit.

- [**`<Form>`**](./Form/Form.md) — the root component; wraps the whole modal.
- [**`<Form.Toggle>`**](./Form/FormToggle.md) — boolean on/off field.
- [**`<Form.Slider>`**](./Form/FormSlider.md) — numeric field within a range.
- [**`<Form.Dropdown>`**](./Form/FormDropdown.md) — select one option from a popup.
- [**`<Form.InlineSelect>`**](./Form/FormInlineSelect.md) — same selection model as `Form.Dropdown`, rendered inline with no popup.
- [**`<Form.Option>`**](./Form/FormOption.md) — one selectable entry for `Form.Dropdown` / `Form.InlineSelect`.
- [**`<Form.Input>`**](./Form/FormInput.md) — single-line text field.
- [**`<Form.Button>`**](./Form/FormButton.md) — the form's submit/exit action buttons.

## Container screens

The same components on a second backend: a custom entity's chest screen, compiled at build time and driven through container slots. See [container screens](../../container-screens/container-screens.md).

- [**`<Container>`**](./Container.md) — the root; names the entity the screen opens from and is the screen's own panel.
- [**`<Slot>`**](./Slot.md) — a real container cell, with a role and handlers for what moves through it.
- [**`<PlayerInventory>`**](./PlayerInventory.md) — the player's 9 × 3 inventory grid.
- [**`<Hotbar>`**](./Hotbar.md) — the player's hotbar.

## Form Fields (Legacy)

:::note
`Input`, `Dropdown`, and `Slider` below are the legacy one-modal-per-field pattern — for new screens use [`<Form>`](./Form/Form.md) instead. They're kept for existing screens.
:::

Modal-backed input components. Native `ActionFormData` can't take typed input, so each renders as a `Button` that opens a single-control `ModalFormData` on press. They share [**Modal Field Props**](./modal-field-props.md).

- [**`<Input>`**](./Input.md) — single-line text field.
- [**`<Dropdown>`**](./Dropdown.md) — select one option from a fixed list.
- [**`<Slider>`**](./Slider.md) — pick a number within a range.

## Handler events

Every handler in the library takes **one event object**, never a positional argument list:

```tsx
<Button onPress={({ player }) => player.sendMessage('hi')} />
<Slot onInsert={({ stack, host }) => count(host, stack)} />
<Form onSubmit={({ values }) => save(values)} />
```

| Type | Fields | Used by |
| --- | --- | --- |
| `UiEvent` | `player`, `host?` | `Form.onCancel` |
| `PressEvent` | `player`, `host?` | `Button.onPress` |
| `ContainerEvent` | `player`, `host` | `Container.onOpen` / `onClose` |
| `SlotEvent` | `player`, `host`, `stack` | `Slot.onInsert` / `onRemove` |
| `SubmitEvent` | `player`, `values` | `Form.onSubmit` |

`player` is always the player the event is about: the viewer on a form, and on a container screen the player who moved the item. `host` is the entity that owns the screen, so it is present exactly on screens an entity owns — always on a container screen, never on a form. What a handler receives can gain a field without breaking a single call site, which is why it is an object rather than arguments.

## Control Props

All components support [**Control Props**](./control-props.md) for layout, background, and visibility — the flexbox properties plus `position={'absolute'}` with `top`/`right`/`bottom`/`left` for out-of-flow placement.

## Next Steps

- [Hooks](../hooks/hooks.md) — add state and effects to your components
- [API](../api/api.md) — top-level APIs for rendering and context
