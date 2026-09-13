---
sidebar_position: 1
description: "The root of an action form: buttons, decoration and the lists and scrolls between them, shown to one player with render()."
---
# Screen

The root of an action form: buttons, decoration and the lists and scrolls between them, shown to one player with [`render()`](../../api/render.md).

## Import

```tsx
import { Screen } from '@bedrock-core/ui';
```

## Usage

```tsx title="packs/BP/scripts/players.screen.tsx"
export default function Players(): JSX.Element {
  return (
    <Screen>
      <Panel padding={10} gap={8}>
        <Text>{'Players online'}</Text>
        <Button action={() => console.warn('pressed')}>
          <Text>{'Refresh'}</Text>
        </Button>
      </Panel>
    </Screen>
  );
}
```

A screen's root names its [host](../../guides/hosts.md), and there is no default. `<Screen>` makes it an action form the way [`<Form>`](./Form.md) makes it a native modal and [`<Container>`](./Container.md) a container screen. It has no box of its own: its children are laid out against the form canvas exactly as they would be at the top of the tree.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `static` | `boolean` | `false` | Declare that the screen carries no live value and no press of its own |
| `children` | `JSX.Node` | — | The screen's content |

`Screen` takes no [control props](../control-props.md): it is a marker, not a panel. Put a `Panel` inside it for a background, padding or a direction.

## static

A screen is static when every string it shows is baked and every press is a [`<Link>`](../controls/Link.md) or the way out. Such a screen needs nothing at runtime — the build already knows its title, the value each entry is shown with, and where each press leads — so the addon ships that table instead of the component, and any realm can show it. See [static screens](../../guides/navigation.md#static-screens).

Setting `static` both asks for that and **proves** it. A qualifying screen is detected either way; declaring it fails the build the moment the screen starts carrying live text, a carried `visible`, or a handler the build cannot read.

```tsx
<Screen static>
  <Link to={'guide:intro'}><Text>{'Intro'}</Text></Link>
  <Link back><Text>{'Back'}</Text></Link>
</Screen>
```

## Rules

The build and `render()` enforce these, with a message naming the fix.

- **One root, at the top.** Providers and fragments above it are looked through. A tree that starts with anything else — a `Panel`, a `Card`, two elements side by side — is refused with the list of roots.
- **No root below the root.** A `<Form>` or a `<Container>` inside a `<Screen>` is refused: compose the inner part as a component, or give it a screen of its own.
- **A component library never renders one.** The root is the one element an author writes at the top of a `*.screen.tsx`; a component used inside screens returns what goes under the root.

## Examples

### An embedded page

A page drawn into an area another screen leaves is still a screen of its own, so it starts with `<Screen>`; the [`<Embed>`](../cross-pack/Embed.md) inside it is what fills the area.

```tsx
export default function FrameworkPage(): JSX.Element {
  return (
    <Screen>
      <AddonPage addon={{ packName: 'My addon', version: '1.0.0', creator: 'me' }} />
    </Screen>
  );
}
```

## Notes

A screen file is a `*.screen.tsx` under `BP/scripts` with a default export. That is what the [`ui-compiler` filter](/docs/filters/ui-compiler) compiles, and the filename without the suffix is the screen's [key](../../guides/navigation.md#screen-keys).
