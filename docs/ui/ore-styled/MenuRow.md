---
sidebar_position: 3.2
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
<MenuRow
  icon={'textures/items/diamond'}
  title={'Diamond'}
  subtitle={'A rare gem'}
  onPress={() => navigation.navigate('Details', { id: 'diamond' })}
/>
```

## Props

### Component-Specific Props

#### `title`
- Type: [`DisplayText`](../i18n/i18n.md#displaytext) (`string | RawMessage`)
- Required
- Description: First line — the row's name.

#### `subtitle`
- Type: `DisplayText`
- Description: Second line, rendered muted. Omit for a single-line row.

#### `icon`
- Type: `string`
- Description: Leading thumbnail texture path. Omit for a text-only row.

#### `iconSize`
- Type: `number`
- Default: `16` (the theme's row icon size)
- Description: Thumbnail edge in px.

#### `chevron`
- Type: `boolean`
- Default: `true`
- Description: Trailing `>` affordance. Set `false` for rows that **select** rather than navigate.

#### `depth`
- Type: `number`
- Default: `0`
- Description: Indent level for nested index rows. Each step insets the row's whole **box** by `theme.tokens.spacing.lg` (12 px), not just its contents, so a child row is visibly narrower than its section header.

#### `onPress`
- Type: `() => unknown | Promise<unknown>`
- Description: Press handler.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: A disabled row keeps its face and greys its text instead.

### Control Props

MenuRow inherits all standard [control props](../ui-runtime/components/control-props.md). It sets `alignSelf: 'stretch'` rather than an explicit width, so don't hard-code a `width` alongside `depth`.

## Localized labels

`title` and `subtitle` are `DisplayText`, so a row may carry a literal, a `.lang` key or a `RawMessage`:

```tsx
const { key, raw } = useTranslation(i18n);

<MenuRow
  title={key($ => $.shop.title)}
  subtitle={raw($ => $.shop.stock, { count })}
  onPress={() => navigation.navigate('Shop')}
/>
```

:::caution Colour prefixes only apply to literals
MenuRow colours its lines with a `§` prefix, and applies it **only** to literal strings — a `RawMessage`, or a string the active resolver recognises as a key, passes through untouched in the label's own colour.

If you need a specific colour on localized text, bake the `§` code into the authored translation value instead of the call site.
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
  onPress={() => navigation.navigate('ServerConfig')}
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

## Best Practices

- Use `MenuRow` for every list in a screen rather than hand-rolling rows.
- Keep subtitles to one short line; both lines are clipped with an ellipsis at one line each.
- Use `depth` for hierarchy instead of nesting `Panel`s with padding — the inset box is what communicates the level.
- Set `chevron={false}` whenever pressing the row does not open another screen.
- Pair with [`Header`](./Header.md) above and a [`Scroll`](../ui-runtime/components/Scroll.md) around the rows for a standard browse screen.
