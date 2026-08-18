---
sidebar_position: 7
---

# TranslationsRegistry

`core.translations` replicates each addon's **i18n bundle** across the world, so one addon can resolve, measure and render another addon's strings server-side.

A registry or config UI has to draw labels it did not author: `packName`, `creatorName` and `description` are translation keys living in *someone else's* resource pack. Without a published bundle the rendering realm can neither resolve them nor measure their width for layout.

## Import

```ts
import { core } from '@bedrock-core/server-runtime';
import type { I18nBundle, TranslationResolver, TranslationsChangeListener } from '@bedrock-core/server-runtime';
```

`I18nBundle` and `TranslationResolver` are re-exported from [`@bedrock-core/i18n`](../ui-integration.md#i18n), which `server-runtime` depends on.

## Usage

```ts
import bundle from '@bedrock-core/generated/i18n';

core.register({ /* …identity… */, translations: bundle });   // publish up front
core.translations.provide(bundle);                            // or publish/replace later

core.translations.of('drav0011_shop');        // another addon's verbs
core.translations.forPlayer(player);          // chained resolver for that player's locale
core.translations.forLocale('en_US');         // chained resolver for one locale
core.translations.subscribe(() => { /* … */ }); // any addon re-published
```

---

## What travels

The registry replicates the **bundle itself** — the module the i18n Regolith filter generates (`@bedrock-core/generated/i18n`), or `createResourceBundle`'s runtime equivalent. Templates stay in `{{var}}` form with their recorded argument order.

```
<your namespace>  →  core-i18n/bundle  →  I18nBundle
```

Late joiners are covered by sync's snapshot exchange, so an addon that loads after everyone else still sees every bundle. A payload that fails structural validation is ignored rather than replacing a good one.

---

## API

### `provide`

```ts
core.translations.provide(bundle: I18nBundle): void
```

Publish this addon's bundle. Usually declared up front through `register({ translations })`; call this directly to publish late or to replace the bundle at runtime.

### `of`

```ts
core.translations.of(addonId: string): I18n<unknown> | undefined
```

The **verbs** over one addon's published strings — `t()`, `key()`, `raw()`, `resolve()`, `display()`, `forLocale()`, `forPlayer()` — exactly what `createI18n` gives that addon locally, minus its compile-time resource types. Those types never travel, so paths are plain strings here.

Returns `undefined` until that addon publishes.

```ts
const shopStrings = core.translations.of('drav0011_shop');
const title = shopStrings?.forPlayer(player).resolve('drav0011_shop.shop.title');
```

Reading a peer's strings never shadows your own addon's default translation source.

### `bundleOf`

```ts
core.translations.bundleOf(addonId: string): I18nBundle | undefined
```

The raw bundle an addon published, straight from the local mirror.

### `forLocale`

```ts
core.translations.forLocale(locale: string): TranslationResolver
```

One resolver over **every** published bundle, for a single locale.

```ts
type TranslationResolver = (key: string) => string | undefined;
```

```ts
const resolve = core.translations.forLocale('en_US');

resolve('drav0011_shop.meta.name');   // string | undefined
```

:::caution It returns a resolver function, not a map
`forLocale` and `forPlayer` return a `TranslationResolver` — a lazy lookup function. There is no merged flat map to iterate; nothing is materialized. Call the resolver with a real `.lang` key.
:::

Collisions resolve the way Bedrock's own world-level `.lang` merge does: **later registrations win**, so the chain probes namespaces in reverse. Resolvers are cached per locale and rebuilt whenever any addon re-publishes.

### `forPlayer`

```ts
core.translations.forPlayer(player: Player, defaultLocale = 'en_US'): TranslationResolver
```

The chained resolver for one player, picked through the same chain the i18n engine uses:

1. a persisted per-player override (the `LOCALE_PROPERTY` dynamic property),
2. the player's client locale,
3. a sibling region of that language,
4. `defaultLocale`,
5. anything published.

```ts
const resolve = core.translations.forPlayer(player);
const label = resolve(addon.packName) ?? addon.packName;
```

A key nothing resolves comes back `undefined` — fall back to rendering the literal key, which is what Bedrock does anyway.

### `subscribe`

```ts
core.translations.subscribe(listener: TranslationsChangeListener): Unsubscribe

type TranslationsChangeListener = () => void;
```

Fires when **any** addon's published bundle changes. It is deliberately coarse — it carries no payload. Re-read through `of()` / `forLocale()` / `forPlayer()`, which return freshly rebuilt views.

---

## Display fields are keys

`packName`, `creatorName` and `description` are i18n keys — see [display fields](./server-runtime.md#display-fields-are-translation-keys) for the `register()` call. Publishing the bundle alongside them is what lets a *different* addon's UI render your `packName` in the player's language: the client resolves a key on its own when the string is sent as a `RawMessage`, but a host realm laying out a screen has to resolve and **measure** it server-side.
