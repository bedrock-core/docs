---
description: "A translated text whose tags are components, presses and styles, drawn exactly where their text falls in whichever language the player reads it."
---
# Trans

A translated text whose tags are components, drawn exactly where their text falls in whichever language the player reads it. It follows react-i18next's `Trans`: the string carries named tags, and `components` says what each one is.

## Import

```tsx
import { Trans } from '@bedrock-core/ui';
```

## Usage

```ts
// packs/data/i18n/en_US.ts
help: { prices: 'See <shop>the shop</shop> for <gold>today</gold>\'s prices.' },
// packs/data/i18n/es_ES.ts
help: { prices: 'Mira los precios <gold>de hoy</gold> en <shop>la tienda</shop>.' },
```

```tsx
<Trans
  width={'100%'}
  i18nKey={key($ => $.help.prices)}
  components={{
    shop: <Link to={'shop'} background={'textures/ui/my_link'} backgroundHover={'textures/ui/my_link_hover'} />,
    gold: <Text color={[1, 0.8, 0]} />,
  }}
/>
```

The Spanish string puts the two tags in the other order. Components are matched by name, so each language keeps its own.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `i18nKey` | `string` | — | The key the text is written under, as [`key()`](/docs/i18n/api#the-three-verbs) returns it. The build reads it in every language the pack ships |
| `translations` | `Record<string, string>` | — | The text in every language, by locale, in place of `i18nKey`: for a tool that writes its own |
| `components` | `Record<string, JSX.Element> \| JSX.Element[]` | — | What each tag stands for, by name, or by index for `<0>`, `<1>` and so on |
| `font` | `'mojangles' \| 'minecraftTen'` | `'mojangles'` | Font of the whole text |
| `scale` | `number` | `1.0` | Scale of the whole text, as on [`<Text>`](./Text.md) |
| `shadow` | `boolean` | `false` | Draw a drop shadow behind the whole text |
| `color` | `[number, number, number]` | — | Glyph color of the whole text as RGB in `0..1` |

Inherits [control props](./control-props.md).

## Tags

| Tag | Draws its content |
| --- | --- |
| `<name>…</name>`, `name` a `<Text>` | in that text's `color` and `shadow` |
| `<name>…</name>`, `name` anything else | inside that component, as a press hugging the text: a `<Link>`, a `<Button>`, a styled button |
| `<strong>…</strong>` | bold |
| `<i>…</i>` | italic |
| `<br/>` | on a new line |

Tags nest, so a style inside a press is part of that press. A `<` followed by a name `components` does not have is text.

## How it is drawn

One label cannot make a few of its words pressable, and a press the build places over words it measured lands where those words fall in the build's language, not the player's. So the build breaks the text itself:

1. **Lines.** Every language is wrapped at the width the layout gives the text. Each gets the same number of lines, the most any of them needs. A language needing fewer spreads its last lines over them, so no language leaves a blank line.
2. **Pieces.** Each line is cut where a tag begins and ends. Each piece is one label, drawn through a key the build mints, with a string per language. A line holds a piece for every stretch any language draws on it, in an order every language fits. A language with nothing in a piece gets `§r`, which draws nothing and takes no width.
3. **Components.** The client packs each line at the widths it draws. A press is sized to its piece, so it covers exactly that text in the language shown, and a press that wraps is one press per line.

The formatting codes in effect where a piece starts are repeated at its start, so a style that crosses a line break stays on.

## Examples

### A press that runs a handler

```tsx
function Checkout({ buy }: { buy: (event: PressEvent) => void }): JSX.Element {
  const { key } = useTranslation(i18n);

  return (
    <Trans
      width={'100%'}
      i18nKey={key($ => $.shop.confirm)}
      components={{ buy: <Button onPress={buy} background={'textures/ui/my_link'} /> }}
    />
  );
}
```

A handler makes the screen non-static. The build records the pieces it laid out in the screen's snapshot, so the screen rendered at runtime draws the same presses in the same places, and each press runs its own handler.

### Numbered tags

```tsx
<Trans
  width={'100%'}
  translations={{ en_US: 'Read <0>setup</0> first.', es_ES: 'Lee <0>la instalacion</0> primero.' }}
  components={[<Link to={'setup'} />]}
/>
```

## Notes

- The text is composed at the width its box is laid out at, so give it one: `width={'100%'}` in a column. The build lays the screen out a second time with that width.
- Each language's pieces go into that language's `.lang`, under keys the build names after what the piece says in every language. A language the pack does not ship falls back to the default language's pieces, the way a missing key does.
- The key's own string ships in `.lang` too, tags and all. Only the pieces are drawn.
- Text with no tags is better drawn as [`<Text wordBreak={'break-word'}>`](./Text.md): one key the client wraps itself.

## Limits

- The text is composed at build, so it takes no values: a `{{placeholder}}` in the string fails the build.
- A `<Text>` component may set `color` and `shadow`. Anything that changes the text's width fails the build, and so does a press inside a press or a component that is neither a `<Text>` nor a press.
- A component standing alone, `<icon/>`, is not supported.
- A press needs an action form. A container screen cannot size a press to its text, so there a `Trans` can only style.
