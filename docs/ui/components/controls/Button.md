---
sidebar_position: 1
description: "A press. Its action is a handler, the form's submit, or the way out."
---
# Button

A press.

## Import

```tsx
import { Button } from '@bedrock-core/ui';
```

## Usage

```tsx
<Button action={() => console.warn('pressed')}>
  <Text>{'Press me'}</Text>
</Button>
```

Buttons are sized intrinsically from their content plus the button's built-in padding. Drop them inside a `Panel` and use flex props to lay them out.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `action` | `(event: PressEvent) => unknown \| Promise<unknown>` \| `'submit'` \| `'exit'` | — | What the press does; see below |
| `children` | `JSX.Node` | — | What the button shows — a `Text`, an `Image`, or a row of both |
| `backgroundHover` | `string` | `background` | Texture drawn while the player hovers |
| `backgroundPressed` | `string` | `background` | Texture drawn while the button is being pressed |
| `backgroundLocked` | `string` | `background` | Texture drawn while the button is disabled |

Inherits [control props](../control-props.md). Every state texture falls back to `background`, and `background` falls back to the blank-canvas placeholder, so one texture styles all four states.

## What the action is

`action` is the one prop a press is given, and it takes three kinds of thing.

| `action` | What happens | Where |
| --- | --- | --- |
| a handler | your function runs, with the player who pressed | [`<Screen>`](../roots/Screen.md) and [`<Container>`](../roots/Container.md) |
| `'submit'` | the native modal submits, and [`<Form onSubmit>`](../roots/Form.md) receives every value | [`<Form>`](../roots/Form.md) |
| `'exit'` | the screen is left — the modal's dismiss, or the way out of a container screen | `<Form>` and `<Container>` |

A handler is **script**: only this realm can run it, so the build cannot describe where the press leads. `'submit'` and `'exit'` are routed by the engine itself, so nothing reaches script for them at all.

When the press simply opens another screen, reach for [`<Link>`](./Link.md) instead — its destination is data the build reads off the tree, which is what lets a screen of presses be [described to another addon](../../guides/navigation.md#static-screens).

## What a press costs

What the press *is* depends on the [host](../../guides/hosts.md):

- On `<Screen>` it is a form entry the engine reports back by index.
- On `<Container>` it is an item taken and put straight back — which is also why `event.host` is the entity that owns the screen there, and why there is none on a form.
- On `<Form>` there is no generic press at all: a modal has its own two actions and nothing else, so a handler is refused there by name.

Every handler in the library takes one event object — see [Handler events](../../guides/handler-events.md).

## Examples

### A form's two actions

Exactly one `'submit'` is required, and at most one `'exit'` beside it.

```tsx
<Form onSubmit={({ values }) => apply(values)} onCancel={() => back(player)}>
  <Toggle name={'music'} defaultValue={true} />

  <Panel flexDirection={'row'} gap={4}>
    <Button action={'submit'} flex={2}>{'Save'}</Button>
    <Button action={'exit'} flex={1}>{'Cancel'}</Button>
  </Panel>
</Form>
```

### A row sharing the width

```tsx
<Panel flexDirection={'row'} padding={10} gap={8}>
  <Button flex={1} action={() => console.warn('cancel')}>
    <Text>{'Cancel'}</Text>
  </Button>
  <Button flex={1} action={() => console.warn('confirm')}>
    <Text>{'Confirm'}</Text>
  </Button>
</Panel>
```

### An icon

```tsx
<Button action={() => console.warn('pressed')}>
  <Image width={32} height={32} texture={'textures/items/diamond'} />
</Button>
```

### Disabled

```tsx
<Button enabled={false}>
  <Text>{'Disabled'}</Text>
</Button>
```

### Fully themed

```tsx
<Button
  background={'textures/ui/button_default'}
  backgroundHover={'textures/ui/button_hover'}
  backgroundPressed={'textures/ui/button_pressed'}
  backgroundLocked={'textures/ui/button_locked'}
  action={() => console.warn('pressed')}
>
  <Text>{'Themed'}</Text>
</Button>
```

## Notes

Let buttons size to their content rather than hardcoding `width` and `height`, unless the layout needs a specific footprint. Inside a row, `flex={1}` on each distributes the space evenly.

Disable a button when its action is unavailable rather than hiding it: a hidden control leaves its box behind on a compiled screen unless the row is a [`<Panel stack>`](../layout/Panel.md#stack).

A handler that returns a promise keeps the press's transaction open until it settles, which is what makes an async handoff flash-free. See [State](../../guides/state.md#one-ui-slot-per-player).

This is the primitive [`@bedrock-core/ore-styled`'s `Button`](/docs/ore-styled/Button) is built on.
