---
sidebar_position: 1
description: "Built-in JSX components for layout, text, and interactivity."
---
# Components

Built-in JSX components for layout, text, and interactivity.

## Roots

A screen's root names its host, and there is no default: a tree that starts with anything else is refused with the list of roots.

- [**`<Screen>`**](./Screen.md) — an action form: buttons, decoration, lists and scrolls, shown with `render()`.
- [**`<Form>`**](./Form/Form.md) — a native modal form, shown with `render()`.
- [**`<Container>`**](./Container.md) — a compiled container screen, served with `createContainerScreen()`.

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

The same components on a second backend: a custom entity's chest screen, compiled at build time and driven through container slots. See [container screens](../guides/container-screens.md).

- [**`<Container>`**](./Container.md) — the root; names the entity the screen opens from and is the screen's own panel.
- [**`<Slot>`**](./Slot.md) — a real container cell, with a role and handlers for what moves through it.
- [**`<PlayerInventory>`**](./PlayerInventory.md) — the player's 9 × 3 inventory grid.
- [**`<Hotbar>`**](./Hotbar.md) — the player's hotbar.

## Deprecated

[`Input`](./deprecated/Input.md), [`Dropdown`](./deprecated/Dropdown.md) and [`Slider`](./deprecated/Slider.md) are one-modal-per-field components kept until the code removes them; new screens use [`Form`](./Form/Form.md).

## Handler events

Every handler takes one event object — see [Handler events](../guides/handler-events.md) for the fields each event carries.

## Control props

All components support [**Control Props**](./control-props.md) for layout, background, and visibility — the flexbox properties plus `position={'absolute'}` with `top`/`right`/`bottom`/`left` for out-of-flow placement.

## Next steps

- [Hooks](../hooks/hooks.md) — add state and effects to your components
- [API](../api/api.md) — top-level APIs for rendering and context
