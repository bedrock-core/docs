---
sidebar_position: 2
---

# i18n Regolith filter

The build half of the localization system. Nested TypeScript objects are the source of truth for your addon's text, and the filter generates everything downstream: the `.lang` files Bedrock resolves on each player's client, the runtime bundle [`@bedrock-core/i18n`](./i18n.md) resolves on the server, and the types that make every key and interpolation variable autocomplete.

It replaces the `translation-keys` filter — see [Migrating](#migrating-from-translation-keys).

## Installation

```bash
regolith install github.com/bedrock-core/regolith-filters/i18n
```

Add it to `config.json` **before** the `bundler` filter, and **after** `guides` if you use it:

```jsonc
{
  "regolith": {
    "profiles": {
      "default": {
        "filters": [
          { "filter": "guides" },
          { "filter": "i18n" },
          { "filter": "bundler" }
        ]
      }
    }
  }
}
```

No settings are required when the namespace scan succeeds.

## Authoring

One module per locale in `packs/data/i18n/`, each default-exporting a nested object:

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

The default locale (`defaultLocale`, `en_US` unless configured) is the **shape**: every other locale file must carry exactly its key set, and the build checks parity in both directions.

Filenames must be `<xx_YY>.ts` and must be a locale code the Bedrock client ships — a locale nobody can select is flagged. `.d.ts` and `.generated.json` files in the same folder are ignored.

Keys are constrained by what has to survive as both a `.lang` key segment and a TypeScript property:

| Rule | Why |
| --- | --- |
| Segments match `[A-Za-z0-9_]+` | must survive a `key=value` line and a TS property name |
| Values are single-line strings | a `.lang` entry is one line |
| Nesting depth ≤ 6 | past that, type-level path recursion degrades the whole key union to `string` |
| Leaves are strings, branches are objects | arrays and other types are rejected |

## Namespacing

Every key you author lands in the `.lang` files prefixed with your addon's namespace: `shop.bought` becomes `drav0011_shop.shop.bought`. The prefix is what keeps addons from colliding everywhere their text meets — Bedrock merges every installed pack's `.lang` into one world-wide table, and the server runtime merges every addon's published translation tables under the same namespace.

The namespace is **derived, not configured**. The filter scans `BP/scripts` for the `core.register({ creator: '…', pack: '…' })` call and joins the two string literals — the same two fields the server runtime joins at startup.

```ts
core.register({ creator: 'drav0011', pack: 'shop', /* … */ });
// → namespace 'drav0011_shop'
```

Only files containing a `.register(` call are considered, so unrelated `creator:`/`pack:` properties elsewhere do not poison the scan; exactly one distinct value per field must remain. When the scan finds no call, or finds `creator`/`pack` composed at runtime instead of written as literals, **the build fails and names the fix**: make them literals, or set the `namespace` setting — which is required only in that case.

Call sites never spell the namespace. `key()` and `raw()` prepend it at runtime from the bundle's metadata.

## What it generates

| Output | Where | Commit it? | Why |
| --- | --- | --- | --- |
| `RP/texts/<locale>.lang` | your pack | n/a (build output) | what Bedrock resolves, per player, in their language |
| `RP/texts/languages.json` | your pack | n/a (build output) | kept in sync with the locales you author |
| `BP/texts/<locale>.lang` | your pack | n/a (build output) | the `meta.*` keys **only** — the behavior pack's own manifest display strings |
| `BP/texts/languages.json` | your pack | n/a (build output) | written alongside, so the game knows which languages the BP declares |
| `data/i18n/i18n.generated.json` | Regolith temp | no — never synced back | per-locale tables + argument order + namespace, inlined into the script bundle |
| `data/i18n/i18n.generated.d.ts` | your project | **yes** | types the bundle module: your resources at the root, libraries and `vanilla` grafted on |
| `data/i18n/vanilla.generated.d.ts` | your project | **yes** | the vanilla key tree, so `$.vanilla.*` autocompletes |

The generated JSON stays in Regolith's temp workspace and is inlined into the script bundle. The two `.d.ts` files are synced back to the real project and **committed** — they are what the IDE reads, so autocompletion works without ever running a build.

### Manifest display strings

A pack's `manifest.json` may name itself with a translation key rather than a literal — and Bedrock resolves that key from **that pack's own** `texts/<locale>.lang`, not from the world's merged table. A behavior pack therefore cannot borrow the resource pack's copy: it needs the strings in its own file, or the pack list shows the raw key.

You declare those strings once, in the `meta` branch — they are the same values `core.register()` receives through `key()`:

```ts
// packs/data/i18n/en_US.ts
export default {
  meta: { name: 'Shop', description: 'Sells items for currency', creator: 'DrAv0011' },
  shop: { title: 'Shop' },
} as const;
```

So the filter emits that branch — **and nothing else** — into `BP/texts/<locale>.lang`, under the same real keys the RP gets:

```jsonc
// packs/BP/manifest.json
"header": {
  "name": "drav0011_shop.meta.name",
  "description": "drav0011_shop.meta.description"
}
```

```txt
## <core:generated-i18n:begin> do not edit — generated by the i18n regolith filter
drav0011_shop.meta.creator=DrAv0011
drav0011_shop.meta.description=Sells items for currency
drav0011_shop.meta.name=Shop
## <core:generated-i18n:end>
```

Only `meta.*` goes into the BP. The RP still carries everything, `meta.*` included, so an RP manifest keyed the same way keeps working.

- **Every locale you author**, exactly like the RP path, plus a `BP/texts/languages.json` kept in sync.
- **The same marker-delimited section**, so hand-written BP entries outside the markers survive and re-running is idempotent.
- **No `meta` branch, no file.** Remove the branch from an addon that had one and the stale generated section is stripped on the next build, leaving your hand-written lines behind.

:::tip Drop the duplicate
If your BP `.lang` still carries hand-written `pack.name` / `pack.description`, delete them and point the manifest header at `<namespace>.meta.name` / `.meta.description`. One declaration, in `packs/data/i18n/`, translated in every locale you ship.
:::

### tsconfig

Add the alias, and keep `packs/data/**/*` in `include` so the committed declarations are picked up:

```json
{
  "compilerOptions": {
    "paths": {
      "@bedrock-core/generated/i18n": ["./packs/data/i18n/i18n.generated.json"]
    }
  },
  "include": ["packs/BP/scripts/**/*", "packs/data/**/*"]
}
```

## Interpolation

`{{var}}` syntax is rewritten to Minecraft's positional form for the `.lang` files, and the argument **order** is recorded alongside it:

```txt
'You bought {{item}} for {{price}}'  →  'You bought %1$s for %2$s'   args: ['item', 'price']
```

The runtime bundle keeps the original `{{var}}` template plus that recorded order, which is the contract with `raw()` in `@bedrock-core/i18n`: it builds the matching `with` array at runtime.

Order comes from **first appearance in the default locale**, deduplicated, so any locale may reorder its sentence freely without reordering arguments.

### `$t()` nesting

`$t(other.key)` references are inlined at build time, recursively — Bedrock `.lang` has no nesting:

```ts
demo: {
  title: 'i18n Demo',
  intro: 'Every verb the library has, live: $t(demo.title).',
},
```

Unknown references and cycles are reported and replaced with `''`.

:::caution Format functions are not supported
`{{price, currency}}` does not work and will not. A format function is JavaScript and cannot travel to the client. Format in code, pass the result as the argument.
:::

## Libraries

A library ships its strings inside its own package and declares them in `package.json`, together with an export that makes them reachable for the generated types:

```jsonc
"bedrockCore": { "i18n": { "dir": "./src/i18n", "namespace": "core" } },
"exports": { "./i18n/*": { "types": "./src/i18n/*.ts", "import": "./src/i18n/*.ts" } }
```

The filter walks your dependency graph for that field and folds each library's resources in under the declared namespace: its keys are emitted into your `.lang` files, its tree appears under `$.core.*`, and its strings ride in your runtime bundle.

Discovery rules:

- **The walk is transitive and sees through non-declaring packages** — a declarer may sit behind an umbrella that declares nothing itself, like `@bedrock-core/config` behind `@bedrock-core/ui`.
- **Resolution follows Node's rules**: nearest `node_modules` first, then ancestors.
- **`devDependencies` count only at the addon root** — transitive devDependencies are not installed.
- **Several packages may share one namespace** (the whole bedrock-core family publishes under `core`). Their trees are merged; a key two packages define with *different* values is a build error naming both.
- A library declaring `bedrockCore.i18n` whose directory has no `<xx_YY>.ts` files is a warning, not an error. `namespace: "vanilla"` is rejected.

### Overriding a library string

Library branches are **override-only** from `data/i18n`. You may author `core.addons.title` to deliberately rename a library string ("Addons" → "Mods") and your value wins — but only for paths the library actually defines:

```ts
// packs/data/i18n/en_US.ts
export default {
  core: { addons: { title: 'Mods' } },   // override — 'core.addons.title' must exist
  shop: { title: 'Shop' },
} as const;
```

An unknown path under a library branch is a build error. Overrides are **exempt from the parity check** — override in one locale without the others and the library's own translation fills the gap — but an override must keep the library's interpolation variable set.

## Vanilla strings

`$.vanilla.*` is always available for autocompletion — the full vanilla tree (~10k keys) is generated into `vanilla.generated.d.ts`. Those strings are **never emitted into your RP**: the client already ships them, so re-adding them would only bloat the pack.

Server-side values (what `t()` returns and what the layout engine measures) are included in the runtime bundle **only for the keys your compiled scripts actually reference**. The filter scans the compiled output — and every discovered library's `src` — for string literals and for `$.vanilla.` selector chains:

```ts
t($ => $.vanilla.item.apple.name);        // found → bundled
t('vanilla.item.apple.name');             // found → bundled
t(`item.${id}.name`);                     // NOT found — assembled at runtime
```

A key that is not found still resolves on the client through `key()`/`raw()`; what degrades is `t()` (falls back to the raw key) and layout measurement for that one string.

Vanilla `.lang` content is fetched per locale from Mojang's `bedrock-samples` and cached under `.regolith/cache/i18n/` for `cacheMaxAgeHours`. A locale whose fetch fails warns and falls back to the default locale's strings. Set `vanilla: false` to skip the fetch, the types and the branch entirely.

:::caution `vanilla` is a reserved branch
Authoring a top-level `vanilla` key in your own resources is a build error.
:::

## What the build checks

Each of these fails the build naming the path to fix.

| Check | What fails |
| --- | --- |
| **Locale parity** | A non-default locale missing a default-locale key (the player would see raw keys), or carrying a key the default locale has no counterpart for (almost always a rename that landed in one file only — such keys are dropped) |
| **Variable parity** | A shared key whose `{{var}}` *set* differs from the default locale's — arguments would land in the wrong placeholders |
| **Override validity** | A library-branch path no library defines; an override that changes the library's variable set |
| **Plural sets** | A plural group with no `_other` form — it is the universal fallback category, and a group without it resolves to nothing for most counts |
| **Reserved branches** | A top-level `vanilla` key; a library namespace of `vanilla` |
| **Usable output** | Multi-line values, key segments outside `[A-Za-z0-9_]`, filenames that are not valid Bedrock locale codes, nesting deeper than 6 |

Set `strict: false` to warn instead of failing (parity, override validity, plural sets, locale-code and file-shape problems). Hard structural failures — a missing default-locale file, an invalid `namespace`, a failed namespace scan, a library declaring a malformed `bedrockCore.i18n` — always fail.

### Locale-only plural variants are legal

CLDR categories differ per language, so a locale may declare a category the default locale never has. Czech needs `_few`; English does not:

```ts
// packs/data/i18n/en_US.ts          // packs/data/i18n/cs_CZ.ts
stock_one:   '{{count}} left',       stock_one:   'Zbývá {{count}} kus',
stock_other: '{{count}} left',       stock_few:   'Zbývají {{count}} kusy',
                                     stock_other: 'Zbývá {{count}} kusů',
```

`cs_CZ.stock_few` is **not** flagged as an extra key, is carried into the bundle, checks its variables against the group's `_other`, and picks up its recorded argument order from the locale that defines it. What parity still requires is that the default locale declares the group (`stock_other`).

## Coexisting with the guides filter

Both filters write into `RP/texts/<locale>.lang`, each inside its own marker-delimited section (i18n uses the same markers for [its BP section](#manifest-display-strings)):

```txt
## <core:generated-i18n:begin> do not edit — generated by the i18n regolith filter
drav0011_shop.shop.title=Shop
## <core:generated-i18n:end>
```

Each filter strips and rewrites only its own section, so hand-written entries in the same file are left untouched — and the i18n filter picks the rest up as **passthrough**: every real key already in `RP/texts/` or `BP/texts/` (guide prose, anything hand-written), minus its own generated sections, rides in the bundle's `extra` table so the layout engine can measure keys that never were resource paths.

Run `guides` first: it writes its section, then i18n reads it as passthrough.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `namespace` | `string` | derived | Overrides the `core.register` scan; **required** only when the scan fails. Must match `^[a-z0-9_]+$` |
| `defaultLocale` | `string` | `"en_US"` | The locale whose file defines the shape and the types |
| `sourceDir` | `string` | `"data/i18n"` | Where the per-locale resource modules live, relative to the Regolith temp workspace |
| `vanilla` | `boolean` | `true` | Generate the `$.vanilla.*` tree and bundle referenced vanilla strings |
| `vanillaLangUrlTemplate` | `string` | bedrock-samples URL | Where vanilla `.lang` is fetched from — `{locale}` is replaced |
| `cacheMaxAgeHours` | `number` | `24` | Hours before a locale's cached vanilla `.lang` is stale |
| `strict` | `boolean` | `true` | Fail the build on check violations instead of warning |

If `data/i18n` does not exist, or contains no locale files, the filter logs and exits cleanly — there is nothing to compile.

## Migrating from translation-keys

`translation-keys` is **removed**; this filter replaces it. If you shipped with it, the filter ships a converter that reads your existing `.lang` files and writes the authoring modules:

```bash
node bin/from-lang.js
# or, when the namespace scan can't derive it:
node bin/from-lang.js --namespace drav0011_shop
```

Run it from your Regolith project root. It:

1. reads every `RP/texts/<locale>.lang` and `BP/texts/<locale>.lang` (RP first, BP overriding), skipping generated marker sections;
2. takes the keys under **your** namespace prefix, strips the prefix, and writes them back as nested `<dataPath>/i18n/<locale>.ts` modules ending in `as const`;
3. leaves `.lang` untouched — it is non-destructive. Pass `--force` to overwrite an existing `<locale>.ts`.

The summary lists what stayed behind: un-namespaced keys (`pack.name`), guide sections and other addons' keys are not migrated. Move `pack.name` / `pack.description` by hand — author them as `meta.name` / `meta.description` and point both manifest headers at `<namespace>.meta.*`, which the filter emits into [the RP and the BP alike](#manifest-display-strings). Values carrying `%s` slots are called out: rename them to `{{var}}` templates for typed, named arguments. A key that cannot become a tree path (a leaf and a branch with the same name) is reported as a conflict for you to restructure.

Then, in order:

1. add the `i18n` filter to `config.json` (before `bundler`, after `guides`);
2. add the [`@bedrock-core/generated/i18n` path alias](#tsconfig) to `tsconfig.json`;
3. build once, so the `.d.ts` files are generated;
4. delete the migrated lines from your `.lang` files — the filter regenerates them, namespaced identically, inside its marker section;
5. replace the call sites.

### Call-site changes

`translation-keys` exposed keys as generated constants used through `Text.localizationKey` and a `TranslationKeysContext` provider. All three are gone — `Text` takes keys and literal text on one channel:

```tsx
// before — translation-keys
<Text localizationKey={'drav0011_shop.shop.title'} />

// after — i18n
<Text>{key($ => $.shop.title)}</Text>
```

There is no provider to mount: `createI18n(bundle)` registers the default translation source, and `render()` injects the resolver at every root. See [In the UI](./i18n.md#in-the-ui).
