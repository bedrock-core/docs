---
sidebar_position: 4
description: "The three verbs, locale resolution, createI18n and every runtime export of @bedrock-core/i18n."
---

# API reference

## The three verbs

The core idea: prefer the client, fall back to the server. The client resolves `.lang` keys per player for free; the server only resolves when your code needs the string *now*.

| Verb | Returns | Resolved by | Use for |
| --- | --- | --- | --- |
| `key()` | namespaced key string | client | `Text` children, registry display fields — no arguments |
| `raw()` | `RawMessage` (`translate` + `with`) | client | interpolated text the client should localize |
| `t()` | plain string | server | layout math, chat, composing strings |

`key()` and `raw()` never spell the namespace — they prepend it at runtime from the bundle's metadata, so renaming your addon's namespace never touches a call site.

### Every verb, and what it produces

Given `shop.title = 'Shop'` and `shop.bought = 'You bought {{item}} for {{price}} emeralds.'` in an addon whose namespace is `drav0011_shop`:

| Call | Produces | The player sees | Reach for it when |
| --- | --- | --- | --- |
| `key($ => $.shop.title)` | `'drav0011_shop.shop.title'` | `Shop` | passing text somewhere the **client** resolves it: a `Text` child, a `MenuRow` label, a registry display field. No arguments possible. |
| `raw($ => $.shop.bought, { item: 'Apple', price: 5 })` | `{ translate: 'drav0011_shop.shop.bought', with: ['Apple', '5'] }` | `You bought Apple for 5 emeralds.` | the same, but with **arguments**. Still client-resolved, so still per-player and uncapped. |
| `raw($ => $.shop.title)` | `{ translate: 'drav0011_shop.shop.title' }` | `Shop` | argless `raw()` collapses to the bare key — identical to `key()`, just typed as a `RawMessage`. |
| `raw($ => $.shop.bought, { item: raw($ => $.vanilla.item.apple.name), price: 5 })` | `{ translate: '…shop.bought', with: { rawtext: [{ translate: 'item.apple.name' }, { text: '5' }] } }` | `You bought Apple for 5 emeralds.` | an argument that is **itself** a translation — the client resolves both, so the item name follows the player's language too. |
| `t($ => $.shop.bought, { item: 'Apple', price: 5 })` | `'You bought Apple for 5 emeralds.'` | *(you decide)* | you need the **string right now**, server-side: `sendMessage`, string concatenation, comparisons, or anything that takes no `RawMessage`. |
| `display(key($ => $.shop.title))` | `'Shop'` | *(you decide)* | you hold a `DisplayText` of unknown shape — a literal, a key, or a `RawMessage` — and need a plain string. Accepts all three. |
| `resolve('drav0011_shop.shop.title')` | `'Shop'` \| `undefined` | *(you decide)* | you have a **real `.lang` key** already, not a path — measurement, or bridging another addon's key. |

The split that matters: `key()` and `raw()` **defer** to the client, so each player sees their own language and nothing is capped; `t()`, `display()` and `resolve()` **resolve now**, on the server, and give you one string for whichever locale you bound to.

:::tip A key nothing resolves comes back literally
`display()` and `resolve()` mirror Bedrock: an unknown key returns as itself rather than throwing or emptying. If you see a raw `drav0011_shop.shop.title` in game, the key exists at the call site but not in the built `.lang`.
:::

### Two call shapes, one type

Every verb takes a **selector** or the equivalent **dot string**. Both autocomplete, both are checked identically:

```ts
t($ => $.shop.bought, { item: 'Apple', price: 5 });
t('shop.bought',      { item: 'Apple', price: 5 });
```

An unknown path is a compile error in both forms. Prefer the selector form on projects with the vanilla branch enabled — the dot-string union over ~10k vanilla keys is only instantiated when you actually use a string.

At a call site the tree is rooted at your own keys, with two branches grafted in by the filter:

```ts
t($ => $.shop.bought, { item, price });   // yours — packs/data/i18n
t($ => $.core.addons.title);              // a library's strings
t($ => $.vanilla.item.apple.name);        // vanilla Minecraft
```

## Interpolation

`{{var}}` placeholders in the authored template become **required, closed** properties on the argument object:

```ts
// en_US.ts ->  bought: 'You bought {{item}} for {{price}} emeralds.'

t($ => $.shop.bought, { item: 'Apple', price: 5 });  // ✅

t($ => $.shop.bought);                                // ❌ arguments are required
t($ => $.shop.bought, { item: 'Apple' });             // ❌ missing variable: price
t($ => $.shop.bought, { item: 'Apple', price: 5, cost: 1 }); // ❌ unknown variable: cost
t($ => $.shop.title, { item: 'x' });                  // ❌ template has no variables
```

Values are `string | number`.

`raw()` widens what an argument accepts: any `RawMessage` part — a nested `raw()`, a `score`, a `selector` — is allowed, and the moment one appears the whole `with` array travels as rawtext parameters so the **client** resolves every part in its own language:

```ts
raw($ => $.shop.bought, { item: raw($ => $.vanilla.item.apple.name), price: 5 });
// {
//   translate: 'drav0011_shop.shop.bought',
//   with: { rawtext: [{ translate: 'item.apple.name' }, { text: '5' }] },
// }
```

`raw()` orders its `with` array by the argument order the filter recorded at build time. See [Argument order](./authoring.md#argument-order) for how that order is chosen.

### Vanilla keys take positional arguments

Vanilla strings are not literal-typed (they come from Mojang's `.lang`, not your source), so their leaves accept an optional loose record **or** a positional array matching the client's `%1$s` slots:

```ts
raw($ => $.vanilla.multiplayer.player.joined, [player.name]);
// { translate: 'multiplayer.player.joined', with: ['Steve'] }
```

## Plurals

Author `_one` / `_other` variants (see [Plurals](./authoring.md#plurals) for authoring them). They **collapse into a single leaf** that takes `count`:

```ts
// en_US.ts
//   stock_one:   '{{count}} left in stock',
//   stock_other: '{{count}} left in stock',

t($ => $.shop.stock, { count: 1 });  // '1 left in stock'
t($ => $.shop.stock, { count: 3 });  // '3 left in stock'

t($ => $.shop.stock, {});            // ❌ count is required on a plural leaf
t($ => $.shop.stock_one, { count: 1 }); // ❌ suffixed variants are hidden
```

Bedrock `.lang` has no plural mechanism, so the suffix is **always** chosen server-side — even for `key()` and `raw()`, where the already-suffixed key is what travels to the client:

```ts
key($ => $.shop.stock, { count: 1 });  // 'drav0011_shop.shop.stock_one'
key($ => $.shop.stock, { count: 9 });  // 'drav0011_shop.shop.stock_other'
```

:::caution Pluralized leaves need a bound verb set
Which suffix wins depends on the *target language's* plural rules, so a plural call only makes sense against a resolved locale. Use `i18n.forPlayer(player)` (or [`useTranslation`](/docs/ui/hooks/useTranslation) in a component) rather than the unbound top-level verbs, which are pinned to the default locale.
:::

Categories come from a built-in CLDR rule table (`Intl.PluralRules` is not available in Bedrock's script engine) covering the locales the Bedrock client ships:

| Language | Categories |
| --- | --- |
| `ja`, `ko`, `zh`, `id` | `other` only |
| `fr` | `one` (i = 0 or 1) / `other` |
| `cs`, `sk` | `one` / `few` (2–4) / `other` |
| `pl` | `one` / `few` / `many` |
| `ru`, `uk` | `one` / `few` / `many` |
| everything else (`en`, `de`, `es`, `it`, `pt`, `nl`, `sv`, `tr`, …) | `one` (n = 1) / `other` |

Lookup falls back `_<category>` → `_other`, so a category a locale never authored never strands a string.

## DisplayText

```ts
type DisplayText = string | RawMessage;
```

`DisplayText` is **the** player-facing text union — every channel that shows a player something shares it: [`Text`](/docs/ui/components/Text) children, [`Header`](/docs/ore-styled/Header) and [`MenuRow`](/docs/ore-styled/MenuRow) labels, registry display fields, `display()` input.

Which shape a string is — a literal or a `.lang` key — is decided **lazily by the active resolver**, never declared:

```tsx
<Text>{'Hello'}</Text>                      {/* nothing resolves it -> literal */}
<Text>{key($ => $.shop.title)}</Text>       {/* the resolver knows it -> localized */}
<Text>{raw($ => $.shop.bought, { item, price })}</Text>  {/* always localized */}
```

A key nothing resolves paints literally — which is exactly what Bedrock does with an unmatched `.lang` key, so a foreign addon's key still resolves on the *client* even when your server has never seen it.

## Locale resolution

`t()` needs a locale. The chain, first hit wins:

1. **Per-player override** — `setLocale(player, 'es_ES')`, persisted in a dynamic property so it survives rejoin. `clearLocale(player)` removes it.
2. **The player's client language** — `player.clientSystemInfo.locale`.
3. **A sibling region of that language** — a player on unauthored `es_MX` gets the Spanish written for Spain rather than English.
4. The addon's `defaultLocale`, then any locale the bundle carries.

```ts
t($ => $.shop.title);                        // defaultLocale — no player in sight

const { t: tp } = i18n.forPlayer(player);    // bound through the chain above
const { t: es } = i18n.forLocale('es_ES');   // pinned, e.g. for logs or broadcasts

i18n.setLocale(player, 'es_ES');             // persisted override
i18n.clearLocale(player);                    // client language takes over again
```

`forPlayer` and `forLocale` return the **full bound verb set** (`locale`, `t`, `key`, `raw`, `resolve`, `display`) — binding matters for plurals even on the client-resolved verbs, as noted above. Bound sets are cached per locale, so calling `forPlayer` on every render is cheap.

The override is stored under the dynamic property `bedrock_core:i18n_locale`, exported as `LOCALE_PROPERTY`.

## resolve() and display()

Two lookups sit alongside the verbs on every bound set.

### `resolve(realKey)`

```ts
type TranslationResolver = (key: string) => string | undefined;
```

Resolves a **real `.lang` key** — `key()` output, a registry display field, a vanilla key, a `.lang` passthrough entry — to its display string, or `undefined` when this bundle does not carry it.

This is the measurement contract the UI runtime uses. You rarely call it directly; you pass it around ([`TranslationContext`](/docs/ui/api/TranslationContext) carries exactly this type).

### `display(value)`

```ts
display(value: DisplayText): string
```

Any `DisplayText` to a plain string, server-side, in this locale — for the places a key must **become** text: breadcrumb trails, native modal headings, chat prefixes. Literal strings pass through, key strings resolve, `RawMessage`s resolve and fill their `with` parameters (nested translates resolve one level; `score`/`selector` parts have no server value and fill as `''`). A key nothing resolves comes back literally.

```ts
const { display } = i18n.forPlayer(player);

display('Plain text');                                  // 'Plain text'
display(key($ => $.shop.title));                        // 'Shop'
display(raw($ => $.shop.bought, { item: 'Apple', price: 5 }));
// 'You bought Apple for 5 emeralds.'
```

The free function `resolveDisplay(resolve, value)` is the same logic over any resolver you already hold — that is what `Header` and `MenuRow` use.

## Cross-addon sharing

Publish the bundle itself through the server runtime's registration:

```ts
core.register({ manifest });
core.translations.provide(bundle);
```

The runtime replicates the bundle — objects, templates and recorded argument order intact — and serves two lazy views: `core.translations.of(addonId)` gives verbs over a peer's strings, and `core.translations.forPlayer(player)` gives one resolver chaining every published bundle, later registrations winning collisions. Registry display fields (`packName`, `description`, `creatorName`) are translation keys so that this works.

## Without the filter

`createResourceBundle` builds the same bundle shape from nested resource modules at runtime — full typed verbs, no build step:

```ts
import { createI18n, createResourceBundle } from '@bedrock-core/i18n';
import en_US from './i18n/en_US';
import es_ES from './i18n/es_ES';

const bundle = createResourceBundle('core', { en_US, es_ES });

export const i18n = createI18n(bundle, { asDefault: false });
```

```ts
function createResourceBundle<T extends ResourceTree>(
  namespace: string,
  locales: Readonly<Record<string, ResourceTree>> & { readonly en_US: T },
  options?: ResourceBundleOptions,
): I18nBundle & { readonly resources?: T }
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultLocale` | `string` | `'en_US'` | The locale defining the type and the recorded argument order |
| `extra` | `Record<string, Record<string, string>>` | — | `.lang`-passthrough entries (locale → REAL key → string) to carry for measurement |

Two audiences:

- **Libraries.** Their resources ship inside the package, and the consuming addon's filter folds them into its `.lang`; the library still wants typed verbs over its own strings. `@bedrock-core/config` does exactly this.
- **Addons not running the filter.** Everything works minus what only a build can do: `.lang` emission, the vanilla branch, cross-locale parity checks.

:::caution `asDefault: false` for libraries
A library creating its own instance must pass `{ asDefault: false }` so it never shadows the host addon's bundle as the default translation source. An addon's own `createI18n` call *is* the registration and should keep the default (`true`).
:::

## `createI18n(bundle, options?)`

```ts
function createI18n<B extends I18nBundle>(bundle: B, options?: CreateI18nOptions): I18n<ResourcesOf<B>>
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `asDefault` | `boolean` | `true` | Register this instance as the addon's default translation source |

Returns an `I18n<R>`: the default-locale bound set plus `bundle`, `forLocale`, `forPlayer`, `setLocale`, `clearLocale`.

### `BoundI18n<R>`

What `forPlayer` / `forLocale` return, and what `I18n<R>` extends.

| Member | Type | Description |
| --- | --- | --- |
| `locale` | `string` | The resolved locale this set is bound to |
| `t` | `TranslateFn<R, string>` | Server-resolved, interpolated string |
| `key` | `TranslateFn<R, string>` | The real `.lang` key (plural suffix applied) |
| `raw` | `TranslateFn<R, RawMessage, Interp \| RawMessage>` | `translate` + `with` for the client |
| `resolve` | `TranslationResolver` | Lazy real-key lookup over this bundle |
| `display` | `(value: DisplayText) => string` | Any `DisplayText` to a plain string |

### Other exports

| Export | Kind | Description |
| --- | --- | --- |
| `DisplayText` | type | `string \| RawMessage` — the shared text union |
| `resolveDisplay(resolve, value)` | function | The `display()` primitive over any resolver |
| `overlay(bound, published, bundle)` | function | A library's bound verbs with the world's published resolver laid over them: `t()` prefers a published value, `resolve()` and `display()` become the world's |
| `createResourceBundle(ns, locales, options?)` | function | Build a bundle from objects at runtime |
| `currentI18n()` | function | The addon's registered default instance, or `undefined` |
| `realKeyFor(bundle, path)` | function | Flat path → real `.lang` key |
| `pickLocale(available, candidates, default)` | function | The locale-chain policy, standalone |
| `pluralCategory(locale, count)` | function | The CLDR category for a locale + count |
| `interpolate(template, args?)` | function | Fill `{{var}}` (record) or `%N$s` (array) |
| `templateVars(template)` | function | `{{var}}` names, first-appearance order |
| `toPositional(template, order)` | function | `{{var}}` → `%N$s` against a recorded order |
| `LOCALE_PROPERTY` | const | `'bedrock_core:i18n_locale'` |
| `I18nBundle`, `LangEntries` | types | The bundle shape the filter generates |
| `TranslationResolver`, `TranslateFn`, `BoundI18n`, `I18n`, `CreateI18nOptions` | types | Engine types |
| `Leaf`, `AnyLeaf`, `ArgsOf`, `Interp`, `PathsOf`, `ResolvePath`, `SelectorTree`, `TemplateVars` | types | The compile-time machinery |

## Limits

- **Compile-time guarantees end where dynamic strings begin.** `t()` on a runtime-assembled key the type system never saw returns the key itself, mirroring how Bedrock renders an unknown `.lang` key literally.
- **`$t(other.key)` nesting is a build-time feature.** Bedrock `.lang` has no nesting, so the filter flattens references before emitting; nothing resolves them at runtime.
- **Vanilla `t()` values are partial by design.** Only the vanilla keys your compiled scripts reference as literals or `$.vanilla.` chains ride in the bundle — see [Vanilla strings](./libraries.md#vanilla-strings).
