---
description: "Ore-styled header bar: icon-only back button, a breadcrumb trail, and a close button."
---
# Header

Ore-styled header bar: icon-only back button, a breadcrumb trail, and a close button. Every screen in a stack wears one, so the chrome does not shift as the player moves between screens.

![Header](/img/ore-styled/Header.png)

## Import

```tsx
import { Header } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
function Settings(): JSX.Element {
  const { back } = useNavigation();

  return (
    <Header
      title={'Settings'}
      breadcrumbs={['Server', 'Pricing']}
      onBack={() => back()}
      onClose={() => closeUi(player)}
    />
  );
}
```

Renders as `Settings > Server > Pricing`, centered between the two icon buttons.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | [`DisplayText`](/docs/i18n/api#displaytext) | — | The screen's own name, first in the trail. Baked, with `breadcrumbs` |
| `breadcrumbs` | `DisplayText[]` | `[]` | The trail after the title, joined as `title > ... > ...`. Baked, with `title` |
| `trail` | [`DisplayText`](/docs/i18n/api#displaytext) | — | The whole [trail](./Trail.md) as one composed value, in place of `title` and `breadcrumbs`, for a trail only known when the screen is shown |
| `onBack` | `(event: PressEvent) => unknown` | — | Press handler for the back control. Omit to hide it — the slot keeps its width, so the title stays centered |
| `backTo` | `ScreenKey` | — | The screen the back control returns to, in place of `onBack`: a link rather than a handler |
| `back` | `boolean` | `false` | A back control that returns wherever the player came from, without naming it |
| `cancel` | `string` | — | The back control as a modal's labeled dismiss. Only inside a `<Form>` |
| `onClose` | `(event: PressEvent) => unknown` | — | Press handler for the close control. Omit to hide it |

Inherits [control props](/docs/ui/components/control-props). It already sets `marginTop`, `marginLeft` and `marginRight` to `1` and takes the theme's header background; your own layout props override them.

## Which back control

Three ways out, and which one you can use depends on what the screen knows about where it came from.

| Prop | The press is | Use it when |
| --- | --- | --- |
| `onBack` | script | the screen is only ever reached one way, from code you own |
| `backTo` | a link to a named screen | the destination is fixed, and the screen should be backable out of even when another addon shows it |
| `back` | a link to the player's stack | the screen is reachable from several places, or opened by another addon entirely |

`backTo` and `back` are data the build reads, so a screen shown from its [reference](/docs/ui/guides/navigation#static-screens) can still be left. An `onBack` handler cannot be described, so it does nothing in a foreign realm.

## Inside a modal

A modal has two controls of its own, its submit and its dismiss, and the dismiss is the only one left to leave the screen with. `cancel` puts it in the back slot with a word on it, since leaving a form abandons what was typed into it:

```tsx
<Header title={'Settings'} cancel={'Cancel'} />
```

The labeled dismiss is wider than the icon back, so a header wearing one leaves its [trail](./Trail.md) less room — which is what `trailText(segments, resolve, { back: 'cancel' })` is told.

## A trail only known at show time

`title` and `breadcrumbs` are composed by the build in every language, collapsed to the room the bar leaves. Where the trail is decided per player — the addon selected, the entity being edited — compose it instead and pass it as `trail`, which travels as one form entry:

```tsx
<Header
  trail={trailText([addonName, scopeLabel, entityName], core.translations.forPlayer(player))}
  onBack={() => back()}
  onClose={() => close()}
/>
```

Pass `trail` on every render, empty included: the entry it reserves is part of the screen's shape, and a shape that comes and goes moves every entry after it.

## Localized titles

`title` and every breadcrumb segment are `DisplayText`, so each may be a literal string, a `.lang` key, or a `RawMessage`:

```tsx
const { key, raw } = useTranslation(i18n);

<Header
  title={key($ => $.settings.title)}
  breadcrumbs={[raw($ => $.settings.forPlayer, { name: player.name })]}
  onBack={() => back()}
/>
```

Segments resolve through the active [`TranslationContext`](/docs/ui/api/TranslationContext) **up front**; a key nothing resolves falls back to the key itself.

## Examples

### Root screen — close only

Omit `onBack` on the first screen of a stack. The slot still reserves its width, so the title lands in the same place on every screen.

```tsx
<Header title={'My Addon'} onClose={() => close()} />
```

### Nested screen with a deep trail

```tsx
<Header
  title={'Config'}
  breadcrumbs={['Server', 'Economy', 'Tax rate']}
  onBack={() => back()}
  onClose={() => close()}
/>
```

### As a fixed screen header

Pair it with a [`Scroll`](/docs/ui/components/Scroll) so the header stays put while the content moves.

```tsx
<Panel flexDirection={'column'} width={'100%'} height={'100%'}>
  <Header title={'Shop'} onBack={() => back()} />
  <Scroll flexGrow={1} gap={4} padding={8}>
    {items.map(item => (
      <MenuRow title={item.name} subtitle={item.price} onPress={() => buy(item)} />
    ))}
  </Scroll>
</Panel>
```

## Theme tokens

Read from `theme.components.header`:

| Token | Default |
| --- | --- |
| `padding` | `4` |
| `gap` | `4` |
| `iconSize` | `15` |
| `textStyle.font` | `'minecraftTen'` |
| `textStyle.scale` | `1.2` |
| `textStyle.color` | `'§0'` |
| `textStyle.separator` | `'§8'` |

## Notes

- Use the same `Header` on every screen of a stack so the chrome never jumps.
- Keep the title short and put context in `breadcrumbs` — a composed trail gives its middle up first when the row runs out of room.
- Omit `onBack` rather than passing a no-op on a root screen; the layout already accounts for the missing control.
- Prefer `key()` output over pre-resolved strings so each player reads the trail in their own language.
- Pair with [`MenuRow`](./MenuRow.md) for the list below it — the two are designed as one browse screen.
