---
sidebar_position: 2
---

# guides Regolith filter

Compiles **MDX guide content** into the two build artifacts [`@bedrock-core/guides`](./guides.md) consumes:

1. **A guide IR manifest** — `data/guides/guides.generated.json`, written into Regolith's temp workspace (never synced back) and imported in scripts as `@bedrock-core/generated/guides`. It carries the sidebar tree, the pages, the prev/next chain and the block IR.
2. **Auto-localized `.lang` entries** — every heading, paragraph, list item and link label becomes a localization key appended to `RP/texts/<locale>.lang` in a marker-delimited section, so the client resolves guide prose per player language.

## Installation

```bash
regolith install github.com/bedrock-core/regolith-filters/guides
```

```jsonc
"filterDefinitions": {
  "guides": { "url": "github.com/bedrock-core/regolith-filters", "version": "1.0.0" }
},
"profiles": {
  "default": {
    "filters": [
      { "filter": "guides", "settings": { "namespace": "creator_pack" } },
      { "filter": "i18n" },
      { "filter": "bundler" }
    ]
  }
}
```

:::caution Ordering is mandatory: `guides` → `i18n` → `bundler`
`guides` writes its `.lang` entries **before** the [i18n filter](../i18n/regolith-filter.md) carries them into its bundle's passthrough, which is how guide keys reach the runtime's text-measurement source. The bundler then inlines both generated modules.
:::

Add the tsconfig path so the bundler resolves the generated module against the temp workspace, and keep `packs/data/**/*` in `include` so the committed declaration loads:

```json
{
  "compilerOptions": {
    "paths": {
      "@bedrock-core/generated/guides": ["./packs/data/guides/guides.generated.json"]
    }
  },
  "include": ["packs/BP/scripts/**/*", "packs/data/**/*"]
}
```

On real disk the `.json` never exists. The shipped `packs/data/guides/guides.generated.d.ts` — seeded by `regolith install`, and committed — types the module, so the project typechecks without ever running a build.

## Layout

```txt
packs/data/guides/
├── guides.generated.d.ts       ← seeded by `regolith install`; commit it
├── en_US/                      ← defaultLocale: structure, keys, sidebar, fallbacks
│   ├── intro.mdx
│   └── getting-started/
│       ├── _category_.json     ← Docusaurus-style: label / position / collapsed / link / icon / access
│       ├── installation.mdx
│       └── first-screen.mdx
└── es_ES/                      ← translations: same tree, values only
    └── intro.mdx
```

Only **directories** directly under `sourceDir` are read as locales, so the generated files alongside them are never mistaken for content. A page's id is its extension-less path relative to the locale root (`getting-started/installation`).

## Authoring

### Frontmatter

| Field | Type | Effect |
| --- | --- | --- |
| `title` | string | The page title. Wins over a leading `# H1`, which then stays in the body |
| `sidebar_position` | number | Sidebar ordering. Pages without it sort last, then alphabetically by page id |
| `hidden` | boolean | Compiled, but excluded from the sidebar **and** from prev/next |
| `icon` | string | RP texture path used as the sidebar row thumbnail (≤ 80 chars; the pack must ship it) |
| `description` | string | A one-line localized subtitle under the row title — keep it short |
| `home` | boolean | Open the guide on this page instead of the index |
| `access` | `"op"` | Show the page only to world operators. Inherited from a gated `_category_.json` |

```yaml
---
title: Installation
sidebar_position: 1
icon: textures/ui/config/config
description: Add the pack and wire the filters.
---
```

`home: true` pairs naturally with `hidden: true`, since a landing page is usually not also a sidebar row. Two pages claiming it is a warning, not an error — the first in document order wins.

### Access

`access: op` keeps a page for world operators:

```yaml
---
title: Reset the economy
access: op
---
```

Put it in a `_category_.json` instead and the whole section is gated. Access **inherits downward and is never widened by a child** — a page inside a gated category is gated whatever its own frontmatter says — so the manifest carries the *effective* value on every page and sidebar node, and the renderer gates a node by reading one field rather than walking its parents.

Any other value warns and is ignored; `op` is the only level this version understands, and the field is a string rather than a boolean so roles can be added later without breaking the IR.

What the filter bakes for it:

| Manifest field | Meaning |
| --- | --- |
| `gated: true` | Something in this guide is gated — also what tells the renderer the second chain exists |
| `a: "op"` on a page / tree node | Effective access, inheritance already applied. Set on `hidden` pages too, since those stay linkable |
| `pprev` / `pnext` | The prev/next chain walked with gated pages left out — what a non-operator follows |

A guide with nothing gated compiles exactly as it did before access existed: no flag, no `a`, no second chain, not a byte spent on an audience split that does not exist.

:::warning Presentation, not protection
A manifest replicates to every addon in the world and its prose ships in the resource pack's `.lang`, so gating decides what a player is **shown**, the way `hidden` does. What a player may **do** is decided by config authorization, which reads `playerPermissionLevel` on the host.
:::

### `_category_.json`

One per directory, mirroring Docusaurus:

```json
{
  "label": "Getting Started",
  "position": 2,
  "collapsed": true,
  "link": "getting-started/installation",
  "icon": "textures/ui/book_edit_default",
  "access": "op"
}
```

`link` accepts a page id, or the Docusaurus `{ "type": "doc", "id": "…" }` form. A broken target warns and is ignored. Labels come from each locale's own `_category_.json`, so they translate too. Without a `label`, the directory name is humanized.

### Supported Markdown

Both `.md` and `.mdx` go through the same MDX-enabled pipeline (remark + GFM + directives + MDX), so a literal `<` must be escaped as `\<`.

| Construct | Notes |
| --- | --- |
| Headings `#` – `###` | Deeper levels clamp to 3 with a warning |
| Paragraphs | Inline runs, wrapped as a row |
| Inline styles | `**bold**` → `§l`, `*italic*` → `§o`, `` `code` `` → `§7`, `~~strike~~` → `§8` (dim — Bedrock has no strikethrough), links → `§9` |
| Internal links | `./page.mdx`, `../intro`, `/abs/page`. Validated at build time — **broken links are a build error** — and rendered as pressable buttons woven into the sentence |
| External links | `http(s)` renders as styled text only; nothing can open a browser from a server form |
| Lists | `-` / `1.`, one nesting level rendered indented |
| Images | `![alt](textures/ui/my_image.png)` alone in a paragraph. Extension stripped; PNG dimensions sniffed for aspect ratio |
| Admonitions | `:::note`, `:::tip`, `:::info`, `:::warning`, `:::danger`, plus `[Custom Title]`. `caution` maps to `warning`; a blockquote renders as `note` |
| Code blocks | Raw and un-localized, hard-wrapped at `maxCodeLineBytes` |
| Rules | `---` |
| MDX components | `<Name prop="x" n={1} flag />` — literal props only; rendered through the [component registry](./guides.md#custom-components) |

**Not supported (warn and skip):** tables, inline images, footnotes, raw HTML, MDX `import`/`export`, JSX expressions, hard line breaks inside a paragraph. Links inside a heading collapse to plain styled text.

## Localization model

- **The default locale is the single source of structural truth.** It defines the page set, key set, sidebar and prev/next chain. Other locales contribute *values only*.
- **Keys are structural, never content-derived.** The same deterministic walk runs over every locale, so identical document structure pairs keys positionally:

  ```txt
  <ns>.guides.<page_path>.<node_path>     page content
  <ns>.guides._cat.<dir_path>             category labels
  ```

  Node paths are `title`, `b<N>` (top-level block), `b<N>.b<M>` (admonition child), `b<N>.t` (admonition custom title), `b<N>.i<M>[.i<P>…]` (list item), and `<path>.r<M>` (inline run).
- **Translators edit the per-locale MDX, never the `.lang`.** The `.lang` section is fully regenerated on every build, so editing a page reshuffles the key indices harmlessly.
- **Every locale's generated section contains the complete default-locale key set.** Untranslated keys are filled with default-locale values; parity drift is reported, and `strictLocales` makes it fatal.
- `RP/texts/languages.json` is updated automatically.

Admonition **default** titles (Note, Tip, …) are not this filter's output. They are `@bedrock-core/guides`' own typed i18n resources under `core.guides.adm.*`, folded into your bundle by the [i18n filter's library discovery](../i18n/regolith-filter.md#libraries) — override them there.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `namespace` | `string` | — (**required**) | Addon namespace in generated keys: `<namespace>.guides.*` |
| `sourceDir` | `string` | `"data/guides"` | Content root; direct child *directories* are locale folders |
| `defaultLocale` | `string` | `"en_US"` | Locale defining structure, keys, sidebar and fallback values. Must exist |
| `include` | `string[]` | `["**/*.md", "**/*.mdx"]` | Page selection globs, relative to each locale folder |
| `exclude` | `string[]` | `[]` | Globs excluding pages matched by `include` |
| `manifestPath` | `string` | `"data/guides/guides.generated.json"` | Manifest output path in the temp workspace |
| `maxCodeLineBytes` | `number` | `60` | Hard-wrap budget (UTF-8 bytes) for code-block lines — code is raw un-localized text, which the runtime caps at 80 bytes |
| `strictLocales` | `boolean` | `false` | Fail the build instead of warning on cross-locale key drift |

Use the same `<creator>_<pack>` join for `namespace` that [the i18n filter derives](../i18n/regolith-filter.md#namespacing) from `core.register({ creator, pack })` and the server runtime builds at startup, so every key your pack emits sits under one prefix.

A missing `sourceDir`, no locale directories, or no pages in the default locale is an **info-level no-op**, not a failure. A missing `defaultLocale` directory, a broken internal link, or any other compile error exits non-zero.

## Coexisting with the i18n filter

Both filters write into `RP/texts/<locale>.lang`, each inside its own marker-delimited section, each rewriting only its own:

```txt
## <core:generated-guides:begin> do not edit — generated by the guides regolith filter
creator_pack.guides.intro.title=Welcome
## <core:generated-guides:end>
```

Re-running is idempotent, and hand-written entries outside the markers are preserved. The i18n filter reads whatever it did not write as `extra` passthrough, so guide prose is measurable by the layout engine.
