---
sidebar_position: 4
---

# TranslationContext

The context carrying how localized text resolves for a component subtree.

## Import

```tsx
import { TranslationContext } from '@bedrock-core/ui';
import type { TranslationResolver } from '@bedrock-core/ui';
```

## Type

```ts
const TranslationContext: Context<TranslationResolver | null>;

type TranslationResolver = (key: string) => string | undefined;
```

A resolver maps a **real `.lang` key** — `key()` output, a registry display field, a vanilla key — to its display string, or `undefined` when the source does not carry it. It is a lazy lookup, each call reads the bundle's own objects and converts the one template it needs.

## You usually do not need this

`render()` provides it at **every** root:

```ts
// BP/scripts/i18n.ts — this call registers the addon's default translation source
export const i18n = createI18n(bundle);
```

```tsx
render(App, player);   // injects that instance's resolver, bound to this player
```

The injected value is re-derived on **every build pass**, so a `setLocale` override — or a later `createI18n` call — is picked up on the next render rather than frozen at mount.

A key nothing resolves measures and paints as the literal key string, mirroring Bedrock, which renders an unmatched key as-is.

## When to provide it

Providing a value **shadows** the injected one for that subtree. Two legitimate reasons:

### 1. Resolving beyond your own bundle

A host that renders other addons' strings needs a resolver over every published bundle. That is what [`@bedrock-core/config`](../../config/config.md) does — it renders every registered addon's display fields, so it provides the world resolver:

```tsx
<TranslationContext value={core.translations.forPlayer(player)}>
  <App />
</TranslationContext>
```

### 2. A subtree pinned to custom data

Previewing a specific locale, or resolving against a table that is not the addon's bundle:

```tsx
function SpanishPreview({ children }: { children?: JSX.Node }) {
  return (
    <TranslationContext value={i18n.forLocale('es_ES').resolve}>
      {children}
    </TranslationContext>
  );
}
```

## Usage

```tsx
import { TranslationContext } from '@bedrock-core/ui';

function App() {
  const player = usePlayer();

  return (
    <TranslationContext value={core.translations.forPlayer(player)}>
      <AddonList />
    </TranslationContext>
  );
}
```

Read it with [`useTranslationResolver()`](../hooks/useTranslationResolver.md), which is sugar over `useContext(TranslationContext)` and returns `null` outside a fiber:

```tsx
const resolver = useTranslationResolver();
const text = resolver?.(someKey) ?? someKey;
```

## A resolver of your own

Any `(key: string) => string | undefined` works — nothing requires it to come from `@bedrock-core/i18n`:

```tsx
const overrides: Record<string, string> = {
  'drav0011_shop.shop.title': 'Black Market',
};

<TranslationContext value={key => overrides[key]}>
  <ShopScreen />
</TranslationContext>
```

:::caution Returning a value makes a string a key
`Text` treats a string child as a key **when the active resolver returns something for it**. A resolver that answers for every string would localize literals too. Return `undefined` for anything you do not own — that is how a miss falls back to painting literally.
:::

## What the resolver affects

| Affected | Not affected |
| --- | --- |
| Whether a `Text` string child is treated as a key | What the client ultimately paints |
| Layout metrics — wrapping, ellipsis, `maxLines` | Whether a key exists in the world's `.lang` |
| Wrap routing for localized text | |
| Components that build display strings themselves ([`Header`](../../ore-styled/Header.md), [`MenuRow`](../../ore-styled/MenuRow.md)) | |

The client always makes its own resolution attempt, so a resolver miss on a key the world *does* publish still paints correctly — only its server-side wrap metrics are approximate.

## Related

- [useTranslationResolver](../hooks/useTranslationResolver.md) — reading the active resolver
- [useTranslation](../hooks/useTranslation.md) — typed verbs bound to the viewing player
- [createContext](./createContext.md) — how context works in general
- [i18n](../../i18n/i18n.md) — where resolvers come from
