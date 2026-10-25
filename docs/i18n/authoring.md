---
sidebar_position: 2
description: "Locale files, namespacing, argument order, $t() nesting, plurals and pack display text: authoring the resources the i18n stage compiles."
---

# Authoring resources

Nested TypeScript objects under `packs/BP/i18n/` are the source of truth for an addon's text. The [i18n builder stage](/docs/builder/guides/stages#translations) reads them and generates the `.lang` files, the runtime bundle and the types.

## Locale files

One module per locale, each default-exporting a nested object:

```ts
// packs/BP/i18n/en_US.ts
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

The default locale (`defaultLocale`, `en_US` unless configured) defines the key shape and interpolation arguments. Strict mode rejects missing or extra keys and variable drift. With `strict: false`, missing keys use default-locale values and extra keys are dropped with warnings.

Use one `<xx_YY>.ts`, `.js`, `.mts` or `.mjs` module per locale. Locale names are checked against the supported client catalog. Declaration files are ignored.

Keys are constrained by what has to survive as both a `.lang` key segment and a TypeScript property:

| Rule | Why |
| --- | --- |
| Segments match `[A-Za-z0-9_]+` | must survive a `key=value` line and a TS property name |
| Values are single-line strings | a `.lang` entry is one line |
| Nesting depth ≤ 6 | past that, type-level path recursion degrades the whole key union to `string` |
| Leaves are strings, branches are objects | arrays and other types are rejected |

## Namespacing

Every key lands in the `.lang` files prefixed with the addon's namespace: `shop.bought` becomes `drav0011_shop.shop.bought`. The prefix is what keeps addons from colliding everywhere their text meets — Bedrock merges every installed pack's `.lang` into one world-wide table, and the server runtime merges every addon's published translation tables under the same namespace.

Builder takes the namespace from `config.json`:

```json title="config.json, project metadata"
{ "namespace": "drav0011_shop" }
```

When using the server framework, match the runtime's `creator_pack` identity. The generated bundle carries this namespace; standalone `compileI18n` callers supply it explicitly.

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

Strict mode rejects unknown references and cycles. With `strict: false`, they produce warnings and empty strings.

:::caution Format functions are not supported
`{{price, currency}}` does not work. A format function is JavaScript and cannot travel to the client. Format in code, pass the result as the argument.
:::

## Tags for `<Trans>`

A string drawn with [`<Trans>`](/docs/ui/components/Trans) marks its links and styles with named tags, which the screen maps to components:

```ts
help: { prices: 'See <shop>the shop</shop> for <gold>today</gold>\'s prices.' },
```

The tags pass through this stage untouched. A translation may move them, reorder them and wrap them around other words. The string is composed at build, so it cannot also take `{{variables}}`.

## Plurals

Author `_one` / `_other` variants (plus `_zero`, `_two`, `_few`, `_many` where a language needs them). A plural group with no `_other` fails the build — it is the universal fallback category, and a group without it resolves to nothing for most counts.

CLDR categories differ per language, so a locale may declare a category the default locale never has. Czech needs `_few`; English does not:

```ts
// packs/BP/i18n/en_US.ts          // packs/BP/i18n/cs_CZ.ts
stock_one:   '{{count}} left',       stock_one:   'Zbývá {{count}} kus',
stock_other: '{{count}} left',       stock_few:   'Zbývají {{count}} kusy',
                                     stock_other: 'Zbývá {{count}} kusů',
```

`cs_CZ.stock_few` is **not** flagged as an extra key: it rides into the bundle, checks its variables against the group's `_other`, and picks up its recorded argument order from the locale that defines it. What parity still requires is that the default locale declares the group (`stock_other`). See [Plurals](./api.md#plurals) for how a plural leaf resolves at runtime.

## Pack display text

Use a `pack` branch for the name and description shown in the pack list:

```ts
export default {
  pack: {
    name: 'Shop',
    description: 'Sells items to players',
    creator: 'DrAv0011',
  },
  shop: { title: 'Shop' },
} as const;
```

These fields use the same names as vanilla manifests. Builder writes their values to the owning pack's language files when its manifest references the literal keys:

```jsonc title="packs/BP/manifest.json and packs/RP/manifest.json"
{
  "header": {
    "name": "pack.name",
    "description": "pack.description"
  }
}
```

A linked resource pack inherits these display translations when it has one behavior-pack owner and no locale modules of its own. A shared resource pack, or one with its own locale modules, keeps its own display metadata.

`config.json` supplies display defaults. Locale `pack` values override those defaults; pack-specific `texts/<locale>.lang` aliases take precedence when they differ from the project defaults. Each generated display key is emitted once. The manifest stage also registers `en_US` in `texts/languages.json` for fallback display text, including builds without the i18n stage.

The resource pack receives namespaced translations such as `<namespace>.pack.name` alongside the manifest aliases it owns. The behavior pack receives its manifest aliases; authored language entries are preserved. `pack.creator` remains a namespaced translation with no manifest alias.

## Next steps

- [`API`](./api.md) — Translate keys and format arguments at runtime
