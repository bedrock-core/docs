---
description: "A press: a handler on a screen or a container screen. A form's own submit and exit are Form.Button."
---
# Button

A press.

## Import

```tsx
import { Button } from '@bedrock-core/ui';
```

## Usage

```tsx
<Button onPress={() => console.warn('pressed')}>
  <Text>{'Press me'}</Text>
</Button>
```

Buttons are sized intrinsically from their content plus the button's built-in padding. Drop them inside a `Panel` and use flex props to lay them out.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onPress` | `(event: PressEvent) => unknown \| Promise<unknown>` | — | Runs on the press, with the player who pressed; see below |
| `children` | `JSX.Node` | — | What the button shows — a `Text`, an `Image`, or a row of both |
| `backgroundHover` | `string` | `background` | Texture drawn while the player hovers |
| `backgroundPressed` | `string` | `background` | Texture drawn while the button is being pressed |
| `backgroundLocked` | `string` | `background` | Texture drawn while the button is disabled |
| `hug` | `boolean` | `false` | Draw the press around what its children draw rather than in the box the layout solved, so it covers exactly the glyphs the client shows. For a press in a line of hugging text, which is what [`<Trans>`](./Trans.md) draws. Action forms only |

Inherits [control props](./control-props.md). Every state texture falls back to `background`, and `background` falls back to the blank-canvas placeholder, so one texture styles all four states.

## What a press does

A press is one of three things, and each is its own component.

| Component | What happens | Where |
| --- | --- | --- |
| `<Button onPress>` | your handler runs, with the player who pressed | [`<Screen>`](./Screen.md) and [`<Container>`](./Container.md) |
| `<Form.Button type={'submit'}>` | the native modal submits, and [`<Form onSubmit>`](./Form.md) receives every value | [`<Form>`](./Form.md) |
| `<Form.Button type={'exit'}>` | the screen is left: the modal's dismiss, or the way out of a container screen | `<Form>` and `<Container>` |

A handler is **script**: only this realm can run it, so the build cannot describe where the press leads. The form's two controls are routed by the engine itself, so nothing reaches script for them at all.

When the press simply opens another screen, reach for [`<Link>`](./Link.md) instead — its destination is data the build reads off the tree, which is what lets a screen of presses be [described to another addon](../guides/navigation.md#static-screens).

## What a press costs

What the press *is* depends on the [host](../guides/hosts.md):

- On `<Screen>` it is a form entry the engine reports back by index.
- On `<Container>` it is an item taken and put straight back — which is also why `event.host` is the entity or block that owns the screen there, and why there is none on a form.
- On `<Form>` there is no generic press at all: a modal has its own two actions and nothing else, so a handler is refused there by name.

Every handler in the library takes one event object — see [Handler events](../guides/handler-events.md).

## Examples

### A form's two actions

Exactly one `'submit'` is required, and at most one `'exit'` beside it.

```tsx
<Form onSubmit={({ values }) => apply(values)} onCancel={() => back(player)}>
  <Toggle name={'music'} defaultValue={true} />

  <Panel flexDirection={'row'} gap={4}>
    <Form.Button type={'submit'} flex={2}>{'Save'}</Form.Button>
    <Form.Button type={'exit'} flex={1}>{'Cancel'}</Form.Button>
  </Panel>
</Form>
```

### A row sharing the width

```tsx
<Panel flexDirection={'row'} padding={10} gap={8}>
  <Button flex={1} onPress={() => console.warn('cancel')}>
    <Text>{'Cancel'}</Text>
  </Button>
  <Button flex={1} onPress={() => console.warn('confirm')}>
    <Text>{'Confirm'}</Text>
  </Button>
</Panel>
```

### An icon

```tsx
<Button onPress={() => console.warn('pressed')}>
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
  onPress={() => console.warn('pressed')}
>
  <Text>{'Themed'}</Text>
</Button>
```

## Notes

Let buttons size to their content rather than hardcoding `width` and `height`, unless the layout needs a specific footprint. Inside a row, `flex={1}` on each distributes the space evenly.

Disable a button when its action is unavailable rather than hiding it: a hidden control leaves its box behind on a compiled screen unless the row is a [`<Panel stack>`](./Panel.md#stack).

A handler that returns a promise keeps the press's transaction open until it settles, which is what makes an async handoff flash-free. See [State](../guides/state.md#one-ui-slot-per-player).

This is the primitive [`@bedrock-core/ore-styled`'s `Button`](/docs/ore-styled/Button) is built on.
