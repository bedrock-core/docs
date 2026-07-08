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
- [**`<Scroll>`**](./Scroll.md) — independent scroll regions (columns, rows, horizontal strips).
- [**`<Fragment>`**](./Fragment.md) — group multiple children without a wrapper node (`<>...</>`).

## Form

Atomic modal form. `<Form>` renders one native `ModalFormData` — every field is shown at once, and every value arrives together, keyed by `name`, on submit.

- [**`<Form>`**](./Form.md) — the root component; wraps the whole modal.
- [**`<Form.Toggle>`**](./FormToggle.md) — boolean on/off field.
- [**`<Form.Slider>`**](./FormSlider.md) — numeric field within a range.
- [**`<Form.Dropdown>`**](./FormDropdown.md) — select one option from a popup.
- [**`<Form.InlineSelect>`**](./FormInlineSelect.md) — same selection model as `Form.Dropdown`, rendered inline with no popup.
- [**`<Form.Option>`**](./FormOption.md) — one selectable entry for `Form.Dropdown` / `Form.InlineSelect`.
- [**`<Form.Input>`**](./FormInput.md) — single-line text field.
- [**`<Form.Button>`**](./FormButton.md) — the form's submit/exit action buttons.

## Form Fields (Legacy)

:::note
`Input`, `Dropdown`, and `Slider` below are the legacy one-modal-per-field pattern — for new screens use [`<Form>`](./Form.md) instead. They're kept for existing screens.
:::

Modal-backed input components. Native `ActionFormData` can't take typed input, so each renders as a `Button` that opens a single-control `ModalFormData` on press. They share [**Modal Field Props**](./modal-field-props.md).

- [**`<Input>`**](./Input.md) — single-line text field.
- [**`<Dropdown>`**](./Dropdown.md) — select one option from a fixed list.
- [**`<Slider>`**](./Slider.md) — pick a number within a range.

## Experimental Components

:::caution
These components are experimental and may change or be removed. They have known limitations in multi-addon worlds — read each component's page before use.
:::

- [**`<ItemRenderer>`**](./ItemRenderer.md) — render an item icon. Requires a manual `ItemAuxContext` wrapping the tree.

## Control Props

All components support [**Control Props**](./control-props.md) for layout and visibility, including flexbox props and manual `x`/`y` positioning.

## Next Steps

- [Hooks](../hooks/hooks.md) — add state and effects to your components
- [API](../api/api.md) — top-level APIs for rendering and context
