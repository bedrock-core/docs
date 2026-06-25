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
- [**`<Scroll>`**](./Scroll.md) — independent scroll regions (columns, rows, horizontal strips).
- [**`<Fragment>`**](./Fragment.md) — group multiple children without a wrapper node (`<>...</>`).

## Form Fields

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
