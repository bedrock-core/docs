---
sidebar_position: 9
description: "core.translations announces each addon's i18n bundle across the world, so one addon can resolve, measure and render another addon's strings server-side."
---

# core.translations

`core.translations` announces each addon's **i18n bundle** across the world, so one addon can resolve, measure and render another addon's strings server-side.

A registry or config UI has to draw labels it did not author: `packName`, `creatorName` and `description` are translation keys living in *someone else's* resource pack. Without a published bundle the rendering realm can neither resolve them nor measure their width for layout.

It is an [`Announcement<I18nBundle>`](./announcement.md) — `provide`, `own`, `of`, `namespaces`, `subscribe` over the bundle — with resolvers on top.

## Import

```ts
import { core } from '@bedrock-core/server';
import type { I18nBundle, TranslationResolver } from '@bedrock-core/server';
```

`I18nBundle` and `TranslationResolver` are re-exported from `@bedrock-core/i18n`, which the runtime depends on.

## Usage

```ts
import bundle from '@bedrock-core/generated/i18n';

core.translations.provide(bundle);                    // replace what register() published, or publish another

core.translations.of('drav0011_shop');                // another addon's bundle
core.translations.i18n('drav0011_shop');              // verbs over it: t(), key(), raw(), resolve()
core.translations.forPlayer(player);                  // chained resolver for that player's locale
core.translations.forLocale('en_US');                 // chained resolver for one locale
core.translations.subscribe((namespace) => { ... });   // an addon re-published
```

## What travels

The bundle itself — the module the [i18n filter](/docs/filters/i18n) generates (`@bedrock-core/generated/i18n`), or `createResourceBundle`'s runtime equivalent. Templates stay in `{{var}}` form with their recorded argument order.

```
<your namespace>  ->  core-i18n/bundle  ->  I18nBundle
```

A payload that fails structural validation reads as no bundle rather than replacing a good one.

## API

### `provide`

```ts
core.translations.provide(bundle: I18nBundle): void
```

Publish this addon's bundle. `register()` does this for you on the first tick, with the bundle your default `createI18n` instance was created with, so an addon that draws nothing still has its display keys resolved everywhere. Call it directly to publish a different bundle or to replace it at runtime.

### `of`

```ts
core.translations.of(addonId: string): I18nBundle | undefined
```

The bundle an addon announced, from the local mirror. `own()` is the same read for this addon.

### `i18n`

```ts
core.translations.i18n(addonId: string): I18n<unknown> | undefined
```

The verbs over one addon's strings — `t()`, `key()`, `raw()`, `resolve()`, `forPlayer()` — exactly what `createI18n` gives that addon locally, minus its compile-time resource types: those never travel, so paths are plain strings here. `undefined` until that addon publishes. Cached per addon; rebuilt when any addon re-publishes.

```ts
const shop = core.translations.i18n('drav0011_shop');

shop?.t('shop.title');
```

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

A key nothing resolves comes back `undefined` — fall back to rendering the literal key, which is what Bedrock does anyway. A player whose handle has been invalidated gets the `defaultLocale` resolver.

### `subscribe`

```ts
core.translations.subscribe(listener: (namespace: string) => void): Unsubscribe
```

Fires with the namespace whenever any addon's bundle changes. Re-read through `i18n()` / `forLocale()` / `forPlayer()`, which return freshly rebuilt views.

## Display fields are keys

`packName`, `creatorName` and `description` are i18n keys — see [display fields](./runtime.md#display-fields-are-translation-keys) for the `register()` call. Publishing the bundle alongside them is what lets a *different* addon's UI render your `packName` in the player's language: the client resolves a key on its own when the string is sent as a `RawMessage`, but a host realm laying out a screen has to resolve and **measure** it server-side.
