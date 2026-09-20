---
sidebar_position: 5
description: "Every string the config app draws is a typed i18n resource under the core namespace, folded into your bundle and overridable from it."
---

# Localization

Every string in this package is a typed i18n resource under the `core` namespace, shipped inside the package and declared for the [i18n Regolith filter](/docs/filters/i18n):

```jsonc
"bedrockCore": { "i18n": { "dir": "./src/i18n", "namespace": "core" } }
```

The filter folds them into **your** bundle and generated `.lang`, so they paint, measure and translate exactly like your own keys. The three apps share the namespace with disjoint keys: this package's are `core.config.*`, `core.scope.*`, `core.roster.*`, `core.reset.*`, `core.action.*`, `core.field.*`, `core.list.*`, `core.command.*` and `core.errors.*`.

## Overriding a string

Merge is last-write-wins per key, so you [override any of them](/docs/i18n/libraries#overriding-a-library-string) by authoring the same path in your own resources:

```ts
// packs/data/i18n/en_US.ts
export default {
  core: { action: { save: 'Apply' } },   // renames the save button for your pack
} as const;
```

A locale this package does not ship reaches its strings the same way: an addon that ships `core.scope.server.label` in Spanish gives every Spanish-speaking player a Spanish scope picker, in every addon's settings.

## Strings resolved in script

A screen paints a key and the client resolves it. Three places need the string server-side instead: a breadcrumb trail joined into one title, a native modal heading, and a chat reply to a command. Those go through the package's own verbs, laid over the world's published bundles so the two never disagree:

```ts
import { useTranslation } from '@bedrock-core/config/i18n/index';

function Row() {
  const { t, key, display } = useTranslation();
  // ...
}
```

:::caution Two different `useTranslation` functions
This one takes **no arguments** and is bound to the `core` resources. The runtime's [`useTranslation(instance)`](/docs/ui/hooks/useTranslation) takes your addon's i18n instance. They are different functions with the same name; import deliberately.
:::

Its `resolve` is the *world* resolver, `core.translations.forPlayer(player)` chaining every published bundle, so it localizes another addon's display fields as well as this package's own strings, and an override reaches native modal text as well as painted `.lang` keys. The precedence itself is [`overlay`](/docs/i18n/api#other-exports) from the i18n package.

## Next steps

- [i18n filter](/docs/filters/i18n) — how library resources fold into your bundle
- [`core.translations`](/docs/server/api/translations) — the published bundles the resolver chains
