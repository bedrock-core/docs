---
sidebar_position: 11
---
# useTranslationResolver

Read the translation resolver that is active for this part of the tree.

## Import

```tsx
import { useTranslationResolver } from '@bedrock-core/ui';
```

## Signature

```tsx
function useTranslationResolver(): TranslationResolver | null
```

```ts
type TranslationResolver = (key: string) => string | undefined;
```

### Parameters

None

### Returns

- Type: `TranslationResolver | null`
- Description: A lookup from a **real `.lang` key** to its display string in the viewing player's locale, or `undefined` when nothing carries that key. `null` when there is no resolver at all — no i18n instance was created, or the component was invoked outside a fiber (tests, build tooling).

It is sugar over `useContext(TranslationContext)`, with the out-of-fiber case returning `null` instead of throwing, so a component invoked as a plain function still works — strings simply measure and paint literally.

## What it is for

The runtime already resolves localized [`Text`](../components/Text.md) children for you. This hook is for components that **build display strings themselves** and therefore have to know whether a string is a key before they touch it:

- [`Header`](../../ore-styled/Header.md) joins breadcrumb segments into one string, so every segment must be resolved first.
- [`MenuRow`](../../ore-styled/MenuRow.md) prefixes its lines with a `§` colour code, which would break key resolution — so it only colours strings the resolver does **not** recognise.

## Usage

```tsx
import { Text, useTranslationResolver } from '@bedrock-core/ui';
import { resolveDisplay, type DisplayText } from '@bedrock-core/i18n';

function Banner({ label }: { label: DisplayText }) {
  const resolver = useTranslationResolver();

  // Literal strings pass through; keys and RawMessages become their display strings.
  return <Text>{`§e${resolveDisplay(resolver, label)}`}</Text>;
}
```

## Examples

### Detecting a key

A resolver **hit** means the world publishes this string as a key.

```tsx
function Line({ source, color }: { source: DisplayText; color: string }) {
  const resolver = useTranslationResolver();
  const literal = typeof source === 'string' && (source === '' || resolver?.(source) === undefined);

  // Only colour literals — a § prefix on a key would stop it resolving.
  return <Text>{literal ? `${color}${source}` : source}</Text>;
}
```

### Measuring localized text yourself

```tsx
function Truncated({ keyText }: { keyText: string }) {
  const resolver = useTranslationResolver();
  const display = resolver?.(keyText) ?? keyText;

  return <Text>{display.length > 40 ? `${display.slice(0, 40)}…` : keyText}</Text>;
}
```

## Where the resolver comes from

`render()` wraps every root so the resolver is always populated: the addon's default i18n instance — the last `createI18n(bundle)` call that did not opt out — bound to the viewing player through the full locale chain, and **re-derived on every build pass** so a `setLocale` override is picked up on the next render rather than frozen at mount.

A [`TranslationContext`](../api/TranslationContext.md) provider inside the tree shadows it for that subtree.

## Best Practices

### Guard for `null`

```tsx
// ✅ Good — optional call, literal fallback
const text = resolver?.(candidate) ?? candidate;

// ❌ Bad — throws in trees with no i18n instance
const text = resolver!(candidate);
```

### Prefer `resolveDisplay` over hand-rolling

`resolveDisplay(resolver, value)` from `@bedrock-core/i18n` already handles all three `DisplayText` shapes, including filling a `RawMessage`'s `with` parameters. Reach for the raw resolver only when you specifically need the key/literal **distinction**.

### Don't use it to fetch your own strings

For an addon's own text, [`useTranslation(i18n)`](./useTranslation.md) gives fully typed verbs. This hook is untyped by design — it takes a real key string, because it exists to resolve keys that came from somewhere else.

## Related

- [useTranslation](./useTranslation.md) — typed verbs bound to the viewing player
- [TranslationContext](../api/TranslationContext.md) — providing a different resolver for a subtree
- [i18n](../../i18n/i18n.md) — `resolve()`, `display()` and the `DisplayText` union
