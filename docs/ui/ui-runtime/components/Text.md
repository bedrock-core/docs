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
- Type: `string`
- Required: One of `children` or `localizationKey` must be provided.
- Description: Raw text content to display.
- Constraints: Max 80 UTF-8 bytes — use `localizationKey` for longer copy.

#### `font`
- Type: `'mojangles' | 'minecraftTen'`
- Description: Optional font selection. Defaults to `'mojangles'`.

#### `scale`
- Type: `number`
- Default: `1.0`
- Description: Scale multiplier relative to the standard "normal" glyph size. Values below `1.0` produce smaller text; values above `1.0` produce larger text.

#### `localizationKey`
- Type: `string`
- Description: Minecraft translation key (e.g. `'ui.myscreen.title'`). The key must exist in your pack's `.lang` files and in the generated `translationKeys.generated.json`. Requires the `translation-keys` Regolith filter to be installed and a `TranslationKeysContext` provided at the root of the UI. Takes priority over `children` when both are present.

#### `wordBreak`
- Type: `'normal' | 'break-word'`
- Description: When set to `'break-word'`, text automatically wraps at word boundaries (with hyphens for mid-word breaks). Width comes from the container — no explicit `maxWidth` needed.

#### `overflow`
- Type: `'ellipsis'`
- Description: When set, text that overflows its container is truncated with `…`.

#### `maxLines`
- Type: `number`
- Description: Limit rendered text to N lines. The last line is always ellipsized when content overflows.

### Control Props

Text inherits all standard [control props](./control-props.md).

## Examples

### Basic Text

```tsx
<Text>{'Simple text'}</Text>
```

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
<TranslationKeysContext value={translationKeys}>
  <Text localizationKey={'ui.myscreen.title'} />
</TranslationKeysContext>
```

### Wrapped & Truncated Text

```tsx
<Panel width={120} padding={6}>
  <Text wordBreak={'break-word'} maxLines={3} overflow={'ellipsis'}>
    {'This long string will wrap at word boundaries and ellipsize after three lines.'}
  </Text>
</Panel>
```

### Scaled Heading

```tsx
<Text font={'minecraftTen'} scale={1.5}>{'§eBig Title'}</Text>
```

## Best Practices

- Don't hardcode `width`/`height` — let `Text` size to its content and rely on the parent panel's `gap`/`padding`.
- Keep raw strings under 80 UTF-8 bytes; reach for `localizationKey` once copy gets longer or needs translating.
- Use Minecraft formatting codes for styling: https://minecraft.wiki/w/Formatting_codes

## Limitations

- Raw `children` is capped at 80 UTF-8 bytes by the serialization protocol — use `localizationKey` to bypass it.
- Word wrapping is opt-in via `wordBreak={'break-word'}`; by default a `Text` renders on a single line.
