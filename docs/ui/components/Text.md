---
sidebar_position: 3
description: "Display text content in your UI."
---
# Text

Display text content in your UI.

## Import

```tsx
import { Text } from '@bedrock-core/ui';
```

## Usage

```tsx
<Text>{'Hello, Minecraft!'}</Text>
```

`Text` is sized intrinsically from its content. Place it inside a `Panel` and use the panel's `gap`/`padding`/`flexDirection` to control layout.

## Props

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | [`DisplayText`](/docs/i18n#displaytext) (`string \| RawMessage`) | — | The text to display. A single child only — arrays throw. Strings are auto-detected as keys or literals; `RawMessage` values are always localized. See [One text channel](#one-text-channel) |
| `font` | `'mojangles' \| 'minecraftTen'` | `'mojangles'` | Font selection |
| `scale` | `number` | `1.0` | Scale multiplier relative to the standard "normal" glyph size. Values below `1.0` produce smaller text; values above `1.0` produce larger text |
| `wordBreak` | `'normal' \| 'break-word'` | — | When set to `'break-word'`, text automatically wraps at word boundaries (with hyphens for mid-word breaks). Width comes from the container — no explicit `maxWidth` needed |
| `overflow` | `'ellipsis'` | — | When set, text that overflows its container is truncated with `…` |
| `maxLines` | `number` | — | Limit rendered text to N lines. The last line is always ellipsized when content overflows |
| `maxLength` | `number` | — | The most characters the text will ever need. In a [container screen](../guides/container-screens.md) this is what makes the text **live**: a compiled layout cannot grow, so a string that changes at runtime reserves its cells before the build knows what it will say — one container slot per character, decoded through a 64-glyph table (space, `A–Z`, `a–z`, `0–9`, `.`; anything else, formatting codes included, draws as a blank). Leave it off for text that never changes, which is baked and may use any character at all. In a server form the text is live anyway; a literal string is cut to this length so the two backends agree on what fits, while keys and `RawMessage`s the client resolves are left whole |
| `shadow` | `boolean` | `false` | Draw a drop shadow behind the glyphs. Purely visual — it does not affect layout or text metrics |
| `color` | `[number, number, number]` | — | Glyph colour as RGB in `0..1`. For text a `§` code cannot colour: a localization key, whose value the client resolves. Compiled screens only |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Where the glyphs sit in the label's box. Only shows when the box is wider than the text: give the text a `width`, or let it grow. Compiled screens only |
| `offsetX` / `offsetY` | `number` | `0` | Fine-tune the pixel nudge of the rendered label inside its layout box. The box itself does not move |

### Control props

Text inherits all standard [control props](./control-props.md).

## Examples

### Multi-line layout

```tsx
<Panel padding={10} gap={6}>
  <Text>{'§b§lTitle'}</Text>
  <Text>{'§2Subtitle text'}</Text>
  <Text>{'Body content goes here'}</Text>
</Panel>
```

### Dynamic text with state

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Panel padding={10} gap={8}>
      <Text>{`Count: ${count}`}</Text>
      <Button onPress={() => setCount(count + 1)}>
        <Text>{'Increment'}</Text>
      </Button>
    </Panel>
  );
}
```

### Localized text

```tsx
import { Panel, Text, useTranslation } from '@bedrock-core/ui';
import { i18n } from './i18n';

function Greeting() {
  const { t, key, raw } = useTranslation(i18n);

  return (
    <Panel padding={10} gap={6}>
      {/* key(): the string is a real .lang key — the CLIENT resolves it. */}
      <Text>{key($ => $.ui.screen.title)}</Text>

      {/* A vanilla key works the same, without shipping it in your pack. */}
      <Text>{key($ => $.vanilla.item.apple.name)}</Text>

      {/* raw(): translate + with, resolved and filled CLIENT-side. */}
      <Text>{raw($ => $.ui.shop.bought, { item: 'Apple', price: 64 })}</Text>

      {/* t(): resolved to a plain string SERVER-side, in this player's language. */}
      <Text>{t($ => $.ui.shop.subtitle)}</Text>
    </Panel>
  );
}
```

:::tip Which verb?
`key()` and `raw()` keep resolution on the client, so each player reads the text in their own language. `t()` resolves server-side in the player's currently resolved locale — reach for it when you need to compose the string yourself (concatenating formatting codes, building a template). Full write-up in [The three verbs](/docs/i18n#the-three-verbs).
:::

### Wrapped & truncated text

```tsx
<Panel width={120} padding={6}>
  <Text wordBreak={'break-word'} maxLines={3} overflow={'ellipsis'}>
    {'This long string will wrap at word boundaries and ellipsize after three lines.'}
  </Text>
</Panel>
```

Wrapping works for localized children too — a localized child wraps against its control box, so the client wraps its own resolved string.

### Scaled heading

```tsx
<Text font={'minecraftTen'} scale={1.5}>{'§eBig Title'}</Text>
```

### Text with a shadow

```tsx
<Text shadow>{'§eBig Title'}</Text>
```

### Live text in a container screen

```tsx
function Furnace() {
  const [held, setHeld] = useState('nothing');

  return (
    <Container entity={'core:furnace'} padding={8} gap={6}>
      {/* Baked into the layout: any character, any formatting code. */}
      <Text>{'§fBEDROCK CORE'}</Text>

      {/* Live: 24 cells reserved, one container slot each. */}
      <Text maxLength={24}>{`holding ${held}`}</Text>

      <Slot role={'input'} onInsert={({ stack }) => setHeld(stack.typeId)} />
    </Container>
  );
}
```

## Notes

- Don't hardcode `width`/`height` — let `Text` size to its content and rely on the parent panel's `gap`/`padding`.
- Prefer `key()` / `raw()` over `t()` for player-facing copy: the client resolves them, so one screen serves every language at once.
- Use Minecraft formatting codes for styling: https://minecraft.wiki/w/Formatting_codes

## Limits

- One child only. `<Text>{a}{b}</Text>` throws — compose inside a `RawMessage`, or use sibling `<Text>` elements.
- Word wrapping is opt-in via `wordBreak={'break-word'}`; by default a `Text` renders on a single line.
- Server-side metrics for a key the world does not publish fall back to measuring the key string itself, so wrapping is approximate until the key is in your bundle. The client still paints its own resolution.

## One text channel

`Text` takes a **single** child of type [`DisplayText`](/docs/i18n#displaytext) — `string | RawMessage`. Literal text and localized text ride the same channel, and which one you get is detected rather than declared.

- A **`string`** is auto-detected. If the active translation resolver knows it as a key (a `key()` result, a registry display field, any published `.lang` key), it is localized — the client resolves it in its own language. If nothing resolves it, it paints literally, which is exactly how Bedrock treats an unmatched key anyway.
- A **`RawMessage`** (a `raw()` result) is always localized. The **client** resolves and fills it — its own language, no length cap, `score`/`selector` parts included.

Rendered text is not length-capped. Server-side resolution only feeds **layout metrics** and wrap routing; what actually paints is always the client's own resolution attempt.

:::note Localization needs an i18n instance
Localized children resolve through [`@bedrock-core/i18n`](/docs/i18n). Creating your addon's instance is the whole setup — it registers the default translation source, and `render()` injects it (bound to the viewing player) at every root, so `<Text>` measures localized children with no further wiring:

```tsx
import bundle from '@bedrock-core/generated/i18n';
import { createI18n } from '@bedrock-core/i18n';

export const i18n = createI18n(bundle);
```

Inside components, bind [the typed verbs](/docs/i18n#the-three-verbs) with [`useTranslation(i18n)`](../hooks/useTranslation.md); outside them, use `i18n.forPlayer(player)` / `i18n.forLocale(locale)`.

The bundle comes from the [i18n filter](/docs/filters/i18n); a [CLI](/docs/cli) scaffold has both wired.
:::
