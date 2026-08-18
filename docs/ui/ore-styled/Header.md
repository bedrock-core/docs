---
sidebar_position: 3.1
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
<Header
  title={'Settings'}
  breadcrumbs={['Server', 'Pricing']}
  onBack={() => navigation.goBack()}
  onClose={() => close()}
/>
```

Renders as `Settings > Server > Pricing`, centred between the two icon buttons.

## Props

### Component-Specific Props

#### `title`
- Type: [`DisplayText`](../i18n/i18n.md#displaytext) (`string | RawMessage`)
- Required
- Description: The screen's own name, first in the trail.

#### `breadcrumbs`
- Type: `DisplayText[]`
- Default: `[]`
- Description: The trail after the title — scope and entity labels, for example — joined as `title > … > …`.

#### `onBack`
- Type: `() => void`
- Description: Press handler for the back control. **Omit to hide it** — the slot keeps its width, so the title stays centred.

#### `onClose`
- Type: `() => void`
- Description: Press handler for the close control. Omit to hide it.

### Control Props

Header inherits all standard [control props](../ui-runtime/components/control-props.md). It already sets `marginTop`, `marginLeft` and `marginRight` to `1` and takes the theme's header background; spreading your own layout props overrides them.

## Localized titles

`title` and every breadcrumb segment are `DisplayText`, so each may be a literal string, a `.lang` key, or a `RawMessage`:

```tsx
const { key, raw } = useTranslation(i18n);

<Header
  title={key($ => $.settings.title)}
  breadcrumbs={[raw($ => $.settings.forPlayer, { name: player.name })]}
  onBack={() => navigation.goBack()}
/>
```

Segments resolve through the active [`TranslationContext`](../ui-runtime/api/TranslationContext.md) **up front**; a key nothing resolves falls back to the key itself.

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
  onBack={() => navigation.goBack()}
  onClose={() => close()}
/>
```

### As a fixed screen header

Pair it with a [`Scroll`](../ui-runtime/components/Scroll.md) so the header stays put while the content moves.

```tsx
<Panel flexDirection={'column'} width={'100%'} height={'100%'}>
  <Header title={'Shop'} onBack={() => navigation.goBack()} />
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

## Best Practices

- Use the same `Header` on every screen of a stack so the chrome never jumps.
- Keep the title short and put context in `breadcrumbs` — the trail is what gets clipped first when the row runs out of room.
- Omit `onBack` rather than passing a no-op on a root screen; the layout already accounts for the missing control.
- Prefer `key()` output over pre-resolved strings so each player reads the trail in their own language.
- Pair with [`MenuRow`](./MenuRow.md) for the list below it — the two are designed as one browse screen.
