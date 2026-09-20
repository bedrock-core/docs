---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/i18n is the localization layer for Minecraft Bedrock addons: typed keys, interpolation and plurals, resolved per player."
---

# i18n

`@bedrock-core/i18n` is the localization layer for Minecraft Bedrock addons: typed keys, typed interpolation and plurals, resolved on the **client** in each player's own language wherever possible, and on the **server** whenever your code needs the actual string.

:::caution Beta
`@bedrock-core/i18n` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## What is @bedrock-core/i18n?

It is the runtime half of a two-part system. The build half is the [`i18n` Regolith filter](/docs/filters/i18n), which turns `packs/data/i18n/<locale>.ts` modules into `.lang` files, a runtime bundle and the types this package's API infers from.

The conventions are i18next's — `{{var}}` interpolation, `_one`/`_other` plural suffixes, the selector call shape — so existing knowledge transfers. Nothing from i18next ships in the script bundle: every locale rides statically in one generated bundle.

## Install

Every addon already depends on `@bedrock-core/server`, which carries it at its own subpath — nothing extra to install:

```tsx
import { createI18n } from '@bedrock-core/server/i18n';
```

A library that does not depend on the meta package adds it directly:

<Install pkg="@bedrock-core/i18n" />

```tsx
import { createI18n } from '@bedrock-core/i18n';
```

Both entries export exactly the same surface — `@bedrock-core/server/i18n` is a one-line re-export of `@bedrock-core/i18n`. The rest of this section writes `@bedrock-core/i18n`; substitute the meta path if you prefer.

## Setup

One instance per addon, built from the bundle the Regolith filter generates:

```ts
// BP/scripts/i18n.ts
import bundle from '@bedrock-core/generated/i18n';
import { createI18n } from '@bedrock-core/i18n';

export const i18n = createI18n(bundle);
```

That is the whole setup. Key paths, interpolation variables and plural forms are all inferred from the bundle's type — no module augmentation, no manual type imports. See [bundler](/docs/filters/bundler) for the `@bedrock-core/generated/i18n` path alias this import needs.

`createI18n` also registers this instance as the addon's default translation source, which is what lets [`Text`](/docs/ui/components/Text) measure localized children with no further wiring.

## What you get

- **Client-first resolution.** `key()` and `raw()` defer to the client, so each player sees their own language at no per-player cost on the server; `t()` resolves now, server-side, for whichever locale you're bound to. See [The three verbs](./api.md#the-three-verbs).
- **Typed everything.** Key paths, required interpolation variables and plural forms all come from the bundle's inferred type — an unknown path or a missing argument is a compile error, not a blank string in game.
- **Plurals without `Intl`.** A built-in CLDR rule table picks `_one` / `_few` / `_other` per locale, since Bedrock's script engine has no `Intl.PluralRules`.
- **One `DisplayText` channel.** [`Text`](/docs/ui/components/Text) children, [`Header`](/docs/ore-styled/Header) and [`MenuRow`](/docs/ore-styled/MenuRow) labels, and registry display fields all accept the same `string | RawMessage` union, resolved lazily by whichever resolver is active.
- **Cross-addon sharing.** `core.translations.provide(bundle)` publishes a bundle; `core.translations.of(addonId)` and `.forPlayer(player)` read across every published addon's strings — see [Cross-addon sharing](./api.md#cross-addon-sharing).

## Next steps

- [Authoring resources](./authoring.md) — locale files, namespacing, interpolation, plurals and the meta branch
- [Libraries and overrides](./libraries.md) — folding a dependency's strings into your bundle, overriding library and vanilla strings
- [API reference](./api.md) — the three verbs, locale resolution, `createI18n` and every export
- [i18n Regolith filter](/docs/filters/i18n) — generating `.lang` files and the runtime bundle from your resources
- [useTranslation](/docs/ui/hooks/useTranslation) — binding the typed verbs to the viewing player inside a component
- [TranslationContext](/docs/ui/api/TranslationContext) — overriding which resolver a subtree sees
