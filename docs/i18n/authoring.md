---
sidebar_position: 2
description: "Locale files, namespacing, argument order, $t() nesting, plurals and the meta branch: authoring the resources the i18n filter compiles."
---

# Authoring resources

Nested TypeScript objects under `packs/data/i18n/` are the source of truth for an addon's text. The [i18n Regolith filter](/docs/filters/i18n) reads them and generates the `.lang` files, the runtime bundle and the types.

## Locale files

One module per locale, each default-exporting a nested object:

```ts
// packs/data/i18n/en_US.ts
export default {
  shop: {
    title: 'Shop',
    bought: 'You bought {{item}} for {{price}} emeralds.',
    stock_one: '{{count}} left in stock',
    stock_other: '{{count}} left in stock',
  },
} as const;
```

:::caution `as const` is not optional
It is what lets the compiler infer the key space and the interpolation variables each template requires. Without it every template widens to `string` and you lose typed arguments entirely.
:::

The default locale (`defaultLocale`, `en_US` unless configured) is the **shape**: every other locale file must carry exactly its key set, checked in both directions — a locale missing a key falls back to the default locale's value, and a key with no default-locale counterpart is dropped.

Filenames must be `<xx_YY>.ts` and must be a locale code the Bedrock client ships — a locale nobody can select is flagged. `.d.ts` and `.generated.json` files in the same folder are ignored.

Keys are constrained by what has to survive as both a `.lang` key segment and a TypeScript property:

| Rule | Why |
| --- | --- |
| Segments match `[A-Za-z0-9_]+` | must survive a `key=value` line and a TS property name |
| Values are single-line strings | a `.lang` entry is one line |
| Nesting depth ≤ 6 | past that, type-level path recursion degrades the whole key union to `string` |
| Leaves are strings, branches are objects | arrays and other types are rejected |

## Namespacing

Every key lands in the `.lang` files prefixed with the addon's namespace: `shop.bought` becomes `drav0011_shop.shop.bought`. The prefix is what keeps addons from colliding everywhere their text meets — Bedrock merges every installed pack's `.lang` into one world-wide table, and the server runtime merges every addon's published translation tables under the same namespace.

The namespace is **derived, not configured**. The filter scans `BP/scripts` for the `core.register({ manifest: { creator: '…', pack: '…' } })` call and joins the two string literals:

```ts
core.register({ manifest: { creator: 'drav0011', pack: 'shop', /* ... */ } });
// -> namespace 'drav0011_shop'
```

Only files containing a `.register(` call are considered, so unrelated `creator:`/`pack:` properties elsewhere do not poison the scan. When the scan finds no call, or finds `creator`/`pack` composed at runtime instead of written as literals, the build fails and names the fix: make them literals, or set the filter's `namespace` setting — required only in that case.

Call sites never spell the namespace. `key()` and `raw()` prepend it at runtime from the bundle's metadata, so renaming the addon's namespace never touches a call site.

## Argument order

`{{var}}` syntax is rewritten to Minecraft's positional form for the `.lang` files:

```txt
'You bought {{item}} for {{price}}'  ->  'You bought %1$s for %2$s'
```

The placeholders are numbered by first appearance in the **default locale**. Because every locale's `.lang` uses those same numbers, a translation may put the arguments in any order its sentence needs and each still lands in the right place — reordering the words never reorders the values. The runtime bundle keeps the original `{{var}}` template and substitutes by name, so script-side text (`t()`, `raw()`) is unaffected by argument order either way.

### Nesting with `$t()`

`$t(other.key)` references are inlined at build time, recursively — Bedrock `.lang` has no nesting:

```ts
demo: {
  title: 'i18n Demo',
  intro: 'Every verb the library has, live: $t(demo.title).',
},
```

Unknown references and cycles are reported and replaced with `''`.

:::caution Format functions are not supported
`{{price, currency}}` does not work. A format function is JavaScript and cannot travel to the client. Format in code, pass the result as the argument.
:::

## Tags for `<Trans>`

A string drawn with [`<Trans>`](/docs/ui/components/Trans) marks its links and styles with named tags, which the screen maps to components:

```ts
help: { prices: 'See <shop>the shop</shop> for <gold>today</gold>\'s prices.' },
```

The tags pass through this filter untouched. A translation may move them, reorder them and wrap them around other words. The string is composed at build, so it cannot also take `{{variables}}`.

## Plurals

Author `_one` / `_other` variants (plus `_zero`, `_two`, `_few`, `_many` where a language needs them). A plural group with no `_other` fails the build — it is the universal fallback category, and a group without it resolves to nothing for most counts.

CLDR categories differ per language, so a locale may declare a category the default locale never has. Czech needs `_few`; English does not:

```ts
// packs/data/i18n/en_US.ts          // packs/data/i18n/cs_CZ.ts
stock_one:   '{{count}} left',       stock_one:   'Zbývá {{count}} kus',
stock_other: '{{count}} left',       stock_few:   'Zbývají {{count}} kusy',
                                     stock_other: 'Zbývá {{count}} kusů',
```

`cs_CZ.stock_few` is **not** flagged as an extra key: it rides into the bundle, checks its variables against the group's `_other`, and picks up its recorded argument order from the locale that defines it. What parity still requires is that the default locale declares the group (`stock_other`). See [Plurals](./api.md#plurals) for how a plural leaf resolves at runtime.

## Meta branch

A `meta` branch names the addon for the pack list:

```ts
export default {
  meta: {
    name: 'Shop',
    description: 'Sells items to players',
  },
  shop: { title: 'Shop' },
} as const;
```

`meta.name` and `meta.description` are copied onto the two literal keys Bedrock resolves a manifest header from — `pack.name` and `pack.description` — written into **both** packs' generated `.lang` sections, since each manifest resolves from its own pack's texts:

```jsonc title="packs/BP/manifest.json and packs/RP/manifest.json"
{
  "header": {
    "name": "pack.name",
    "description": "pack.description"
  }
}
```

The resource pack's `.lang` carries everything: the namespaced `<namespace>.meta.name` / `<namespace>.meta.description` keys (what `key()` resolves and what rides in the runtime bundle) plus the two `pack.name` / `pack.description` aliases. The behavior pack's `.lang` carries only the two aliases — nothing else, since a manifest looks up nothing but those literal keys. Other `meta.*` keys, such as `meta.creator`, are ordinary namespaced strings with no alias.
