---
description: "The browse-screen row: leading thumbnail, title, one-line subtitle, and a trailing chevron, drawn on the dropdown-option face."
---
# MenuRow

The browse-screen row: leading thumbnail, title, one-line subtitle, and a trailing chevron, drawn on the dropdown-option face. Every list in the shared UI — addons, guide index, config scopes, entity rosters — is built from it, so lists read as one system.

![MenuRow](/img/ore-styled/MenuRow.png)

## Import

```tsx
import { MenuRow } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
function Row(): JSX.Element {
  const { navigate } = useNavigation();

  return (
    <MenuRow
      icon={'textures/items/diamond'}
      title={'Diamond'}
      subtitle={'A rare gem'}
      onPress={() => navigate('shop:details', { params: { id: 'diamond' } })}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title`<Req /> | [`DisplayText`](/docs/i18n/api#displaytext) | — | First line — the row's name |
| `subtitle` | `DisplayText` | — | Second line, rendered muted. Omit for a single-line row |
| `icon` | `string` | — | Leading thumbnail texture path. Omit for a text-only row |
| `iconSize` | `number` | the theme's row icon size | Thumbnail edge in px |
| `chevron` | `boolean` | `true` | Trailing `>` affordance. Set `false` for rows that select rather than navigate |
| `selected` | `boolean` | `false` | Whether this row is the list's current selection. For a selecting list, where one row stands after the press |
| `depth` | `number` | `0` | Indent level for nested index rows. Each step insets the row's whole box, not its contents, so a child row is visibly narrower than its section header |
| `onPress` | `(event: PressEvent) => unknown \| Promise<unknown>` | — | Press handler. Use `to` instead when the press opens another screen |
| `to` | `ScreenKey` | — | The screen this row opens, `<addon>:<name>`. A row with one is a [`<Link>`](/docs/ui/components/Link) |
| `replace` | `boolean` | `false` | With `to`: take the place of the screen this row is on rather than stacking over it |
| `titleMaxLength` | `number` | — | Characters the title reserves, for a title only known when the screen is shown |
| `subtitleMaxLength` | `number` | — | Characters the subtitle reserves. Setting it also keeps the subtitle line when the subtitle is empty, so the row has one shape |
| `enabled` | `boolean` | `true` | A disabled row keeps its face and greys its text |

Inherits [control props](/docs/ui/components/control-props). It sets `alignSelf: 'stretch'` rather than an explicit width, so do not hard-code a `width` alongside `depth`.

## An index other addons can show

A row with `to` is a link, so where it leads is data rather than a handler — which is what lets an index of rows be shown by an addon running none of this one's script. A row with `onPress` cannot be described that way, and does nothing in a foreign realm.

```tsx
<MenuRow icon={'textures/items/diamond'} title={'Diamond'} subtitle={'A rare gem'} to={'shop:diamond'} />
```

## Reserving room for live text

A compiled screen bakes a row's text unless told how long a live one may be. Give `titleMaxLength` — and `subtitleMaxLength` where there is a second line — for a row whose text comes from data:

```tsx
<MenuRow title={addon.name} titleMaxLength={24} subtitle={addon.version} subtitleMaxLength={12} to={key} />
```

## Localized labels

`title` and `subtitle` are `DisplayText`, so a row may carry a literal, a `.lang` key or a `RawMessage`:

```tsx
const { key, raw } = useTranslation(i18n);

<MenuRow
  title={key($ => $.shop.title)}
  subtitle={raw($ => $.shop.stock, { count })}
  onPress={() => navigate('shop:home')}
/>
```

:::caution Color prefixes only apply to literals
MenuRow colors its lines with a `§` prefix, and applies it **only** to literal strings — a `RawMessage`, or a string the active resolver recognizes as a key, passes through untouched in the label's own color.

If you need a specific color on localized text, bake the `§` code into the authored translation value instead of the call site.
:::

## Examples

### Text-only list

```tsx
<Panel flexDirection={'column'} gap={2}>
  <MenuRow title={'General'} onPress={() => open('general')} />
  <MenuRow title={'Economy'} onPress={() => open('economy')} />
  <MenuRow title={'Permissions'} onPress={() => open('permissions')} />
</Panel>
```

### Nested index

```tsx
<Panel flexDirection={'column'} gap={2}>
  <MenuRow title={'Getting started'} chevron={false} onPress={() => {}} />
  <MenuRow depth={1} title={'Installation'} onPress={() => open('installation')} />
  <MenuRow depth={1} title={'First screen'} onPress={() => open('first-screen')} />
  <MenuRow title={'Reference'} chevron={false} onPress={() => {}} />
  <MenuRow depth={1} title={'Components'} onPress={() => open('components')} />
</Panel>
```

### Selection rows

Drop the chevron for rows that pick a value rather than navigating deeper.

```tsx
{themes.map(name => (
  <MenuRow
    title={name}
    chevron={false}
    enabled={name !== current}
    onPress={() => setTheme(name)}
  />
))}
```

### With an icon and a disabled state

```tsx
<MenuRow
  icon={'textures/ui/config/config'}
  title={'Server settings'}
  subtitle={'Operators only'}
  enabled={isOperator}
  onPress={() => navigate('shop:server_config')}
/>
```

## Theme tokens

Read from `theme.components.menuRow`:

| Token | Default |
| --- | --- |
| `padding` | `4` |
| `gap` | `4` |
| `iconSize` | `16` |
| `textStyle.font` | `'mojangles'` |
| `textStyle.scale` | `1` |
| `textStyle.color` | `'§f'` |
| `textStyle.disabledColor` | `'§8'` |
| `textStyle.muted` | `'§7'` |
| `textStyle.mutedDisabled` | `'§8'` |
| `textures.background` | the dropdown option face |
| `textures.backgroundSelected` | the dropdown's selected option face |

## Notes

- Use `MenuRow` for every list in a screen rather than hand-rolling rows.
- Keep subtitles to one short line; both lines are clipped with an ellipsis at one line each.
- Use `depth` for hierarchy instead of nesting `Panel`s with padding — the inset box is what communicates the level.
- Set `chevron={false}` whenever pressing the row does not open another screen.
- Pair with [`Header`](./Header.md) above and a [`Scroll`](/docs/ui/components/Scroll) around the rows for a standard browse screen.
