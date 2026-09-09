---
sidebar_position: 2
description: "The root of an action form: buttons, decoration and the lists and scrolls between them, shown to one player with render()."
---
# Screen

The root of an action form: buttons, decoration and the lists and scrolls between them, shown to one player with [`render()`](../api/render.md).

## Import

```tsx
import { Screen } from '@bedrock-core/ui';
```

## Usage

```tsx
export default function Players() {
  return (
    <Screen>
      <Panel padding={10} gap={8}>
        <Text>{'Players online'}</Text>
        <Button onPress={() => console.log('pressed')}>
          <Text>{'Refresh'}</Text>
        </Button>
      </Panel>
    </Screen>
  );
}
```

A screen's root names its host, and there is no default. `<Screen>` makes it an action form the way [`<Form>`](./Form/Form.md) makes it a native modal and [`<Container>`](./Container.md) a compiled container screen. It has no box of its own: its children are laid out against the form canvas exactly as they would be at the top of the tree.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `JSX.Node` | — | The screen's content |

`Screen` takes no [control props](./control-props.md): it is a marker, not a panel. Put a `Panel` inside it for a background, padding or a direction.

## Rules

The build and `render()` enforce these, with a message naming the fix:

- **One root, at the top.** Providers and fragments above it are looked through. A tree that starts with anything else — a `Panel`, a `Card`, two elements side by side — is refused with the list of roots.
- **No root below the root.** A `<Form>` or a `<Container>` inside a `<Screen>` is refused: compose the inner part as a component, or give it a screen of its own.
- **A component library never renders one.** The root is the one element an author writes at the top of a `*.screen.tsx`; a component that is used inside screens returns what goes under the root.

## Examples

### An embedded page

A page drawn into an area another screen leaves is still a screen of its own, so it starts with `<Screen>`; the `Embed` inside it is what fills the area.

```tsx
export default function FrameworkPage() {
  return (
    <Screen>
      <AddonPage addon={{ packName: 'My addon', version: '1.0.0', creator: 'me' }} />
    </Screen>
  );
}
```
