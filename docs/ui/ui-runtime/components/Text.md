---
sidebar_position: 3
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

### Component-Specific Props

#### `children`
- Type: [`DisplayText`](../../i18n/i18n.md#displaytext) (`string | RawMessage`)
- Required: No
- Description: The text to display. A single child only — arrays throw. Strings are auto-detected as keys or literals; `RawMessage` values are always localized. See [One text channel](#one-text-channel).

#### `font`
- Type: `'mojangles' | 'minecraftTen'`
- Default: `'mojangles'`
- Description: Font selection.

#### `scale`
- Type: `number`
- Default: `1.0`
- Description: Scale multiplier relative to the standard "normal" glyph size. Values below `1.0` produce smaller text; values above `1.0` produce larger text.

#### `wordBreak`
- Type: `'normal' | 'break-word'`
- Description: When set to `'break-word'`, text automatically wraps at word boundaries (with hyphens for mid-word breaks). Width comes from the container — no explicit `maxWidth` needed.

#### `overflow`
- Type: `'ellipsis'`
- Description: When set, text that overflows its container is truncated with `…`.

#### `maxLines`
- Type: `number`
- Description: Limit rendered text to N lines. The last line is always ellipsized when content overflows.

#### `shadow`
- Type: `boolean`
- Default: `false`
- Description: Draw a drop shadow behind the glyphs. Purely visual — it does not affect layout or text metrics.

#### `offsetX` / `offsetY`
- Type: `number`
- Default: `0`
- Description: Fine-tune the pixel nudge of the rendered label inside its layout box. The box itself does not move.

### Control Props

Text inherits all standard [control props](./control-props.md).

## Examples

### Multi-line Layout

```tsx
<Panel padding={10} gap={6}>
  <Text>{'§b§lTitle'}</Text>
  <Text>{'§2Subtitle text'}</Text>
  <Text>{'Body content goes here'}</Text>
</Panel>
```

### Dynamic Text with State

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

### Localized Text

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
`key()` and `raw()` keep resolution on the client, so each player reads the text in their own language. `t()` resolves server-side in the player's currently resolved locale — reach for it when you need to compose the string yourself (concatenating formatting codes, building a template). Full write-up in [The three verbs](../../i18n/i18n.md#the-three-verbs).
:::

### Wrapped & Truncated Text

```tsx
<Panel width={120} padding={6}>
  <Text wordBreak={'break-word'} maxLines={3} overflow={'ellipsis'}>
    {'This long string will wrap at word boundaries and ellipsize after three lines.'}
  </Text>
</Panel>
```

Wrapping works for localized children too — a localized child wraps against its control box, so the client wraps its own resolved string.

### Scaled Heading

```tsx
<Text font={'minecraftTen'} scale={1.5}>{'§eBig Title'}</Text>
```

### Text with a Shadow

```tsx
<Text shadow>{'§eBig Title'}</Text>
```

## Best Practices

- Don't hardcode `width`/`height` — let `Text` size to its content and rely on the parent panel's `gap`/`padding`.
- Prefer `key()` / `raw()` over `t()` for player-facing copy: the client resolves them, so one screen serves every language at once.
- Use Minecraft formatting codes for styling: https://minecraft.wiki/w/Formatting_codes

## Limitations

- One child only. `<Text>{a}{b}</Text>` throws — compose inside a `RawMessage`, or use sibling `<Text>` elements.
- Word wrapping is opt-in via `wordBreak={'break-word'}`; by default a `Text` renders on a single line.
- Server-side metrics for a key the world does not publish fall back to measuring the key string itself, so wrapping is approximate until the key is in your bundle. The client still paints its own resolution.

## One text channel

`Text` takes a **single** child of type [`DisplayText`](../../i18n/i18n.md#displaytext) — `string | RawMessage`. Literal text and localized text ride the same channel, and which one you get is detected rather than declared.

- A **`string`** is auto-detected. If the active translation resolver knows it as a key (a `key()` result, a registry display field, any published `.lang` key), it is localized — the client resolves it in its own language. If nothing resolves it, it paints literally, which is exactly how Bedrock treats an unmatched key anyway.
- A **`RawMessage`** (a `raw()` result) is always localized. The **client** resolves and fills it — its own language, no length cap, `score`/`selector` parts included.

Rendered text is not length-capped. Server-side resolution only feeds **layout metrics** and wrap routing; what actually paints is always the client's own resolution attempt.

:::note Localization needs an i18n instance
Localized children resolve through [`@bedrock-core/i18n`](../../i18n/i18n.md). Creating your addon's instance is the whole setup — it registers the default translation source, and `render()` injects it (bound to the viewing player) at every root, so `<Text>` measures localized children with no further wiring:

```tsx
import bundle from '@bedrock-core/generated/i18n';
import { createI18n } from '@bedrock-core/i18n';

export const i18n = createI18n(bundle);
```

Inside components, bind [the typed verbs](../../i18n/i18n.md#the-three-verbs) with [`useTranslation(i18n)`](../hooks/useTranslation.md); outside them, use `i18n.forPlayer(player)` / `i18n.forLocale(locale)`.

The easiest way to get a project with the bundle and filter already wired is to scaffold with the **CLI**:

```bash
npx @bedrock-core/cli
```
:::
