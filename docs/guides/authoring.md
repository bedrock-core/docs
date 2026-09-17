---
sidebar_position: 2
description: "Where guide pages live, the frontmatter and categories that shape the sidebar, what the renderer makes of each block, and operator-only pages."
---

# Authoring a guide

Guide content lives in `packs/data/guides/<locale>/**`, one tree per locale, and the [`guides` filter](/docs/filters/guides) compiles the default locale's tree into one screen per page:

```txt
packs/data/guides/
├── guides.generated.d.ts       <- seeded by `regolith install`; commit it
├── en_US/                      <- the default locale: structure, keys, sidebar, fallbacks
│   ├── intro.mdx
│   └── getting-started/
│       ├── _category_.json     <- label / position / collapsed / link / icon / access
│       ├── installation.mdx
│       └── first-screen.mdx
└── es_ES/                      <- translations: same tree, values only
    └── intro.mdx
```

Only **directories** directly under the content root are read as locales, so the generated files beside them are never mistaken for content. A page's id is its extension-less path relative to the locale root: `getting-started/installation`.

## Frontmatter

```mdx
---
title: Installation
sidebar_position: 1
icon: textures/ui/config/config
description: "Add the pack and wire the filters."
---

Install the render pack, then add the filters to `config.json`.

:::tip
Run `guides` before `i18n` — the ordering matters.
:::

- Import the `.mcpack`
- Add the filter entries
- Rebuild
```

| Field | Type | Effect |
| --- | --- | --- |
| `title` | string | The name shown on the sidebar row and in the page header. Without it, a leading `# heading` supplies the name. The page body renders exactly as written |
| `sidebar_position` | number | Sidebar ordering. Pages without it sort last, then alphabetically by page id |
| `hidden` | boolean | Compiled, but excluded from the sidebar **and** from prev/next |
| `icon` | string | RP texture path used as the sidebar row thumbnail (the pack must ship it) |
| `description` | string | A one-line localized subtitle under the row title — keep it short |
| `home` | boolean | Open the guide on this page instead of the index |
| `access` | `"op"` | Show the page to world operators only. Inherited from an operator-only `_category_.json` — see [Operator-only pages](#operator-only-pages) |

`home: true` pairs naturally with `hidden: true`, since a landing page is usually not also a sidebar row. Two pages claiming it is a warning, not an error — the first in document order wins. [Where a guide opens](./index.md#where-a-guide-opens) has the rest.

## Categories

A directory is a sidebar category, configured by one `_category_.json`, mirroring Docusaurus:

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

## Blocks

Both `.md` and `.mdx` go through the same MDX-enabled pipeline (remark, GFM, directives and MDX), so a literal `<` must be escaped as `\<`. The manifest is a small block union, and each block maps to one rendering:

| Block | Authored as | Rendered as |
| --- | --- | --- |
| `h` | `#` to `###`; deeper levels clamp to 3 with a warning | Heading text, `minecraftTen` for h1, scaled down for h2 and h3 |
| `p` | a paragraph | Wrapping text; with links, a [`Trans`](/docs/ui/components/Trans) whose links are pressable where they are drawn |
| `ul` / `ol` | `-` / `1.`, one nesting level | Bulleted or numbered rows, nested rows indented |
| `img` | `![alt](textures/ui/x.png)` alone in a paragraph; the extension is stripped | An `Image`, aspect ratio from the sniffed PNG size |
| `adm` | `:::note`, `:::tip`, `:::info`, `:::warning` or `:::danger`, optionally with `[Custom Title]`; `:::caution` is a `warning`, a blockquote a `note` | A dark `Card` with a colored title and nested blocks |
| `code` | a fenced block, raw and never localized | A dark `Card`, one dim line per source line, hard-wrapped at the filter's `maxCodeLineBytes` |
| `hr` | a horizontal rule, `---` | A `Divider` |
| `cmp` | `<Name prop="x" n={1} flag />` | Your registered component, or an "unsupported content" placeholder |

Inline styling is baked into the text as `§` codes: `**bold**` is `§l`, `*italic*` is `§o`, `` `code` `` is `§7`, `~~strike~~` is `§8` (dim, since Bedrock has no strikethrough), a link is `§9`, and a link nothing can open is the dimmer `§3`.

## Links

A page **is** a screen, so an internal link is a `<Link>` to that page's screen: where every press leads is data on the tree, and that is what lets a realm show a guide it never compiled.

An internal link is written relative, `./page.mdx` or `../intro`, or absolute, `/abs/page`. Every one is checked at build time, and a broken link is a build error.

A paragraph or list item with links is drawn as a [`Trans`](/docs/ui/components/Trans), each link a numbered tag. The build breaks it into lines in every language, and each link is pressable only over its own text, in whichever language the player reads. Text after a link carries on along the same line.

Pages replace one another rather than stacking, so the index is always the screen under a page. With a home page, the index's back returns to it and the home page's back leaves the guide; without one, the index's back leaves.

External `http(s)` links and anchors on the same page render as `§3` text only. Nothing can open a browser from a server form.

## Operator-only pages

`access: op` shows a page to world operators only:

```yaml
---
title: Reset the economy
access: op
---
```

Put it in a `_category_.json` instead and the whole category is operator-only. Access **inherits downward and is never widened by a child**: a page inside an operator-only category is operator-only whatever its own frontmatter says. `op` is the only level; any other value warns and is ignored.

Everyone else reads the guide without it. Their index, pages and prev/next skip an operator-only page or category, and a link to one draws as plain text.

A guide with anything operator-only is compiled twice, because a compiled screen shows the same thing to every viewer:

| Set | Screens | Pages |
| --- | --- | --- |
| Everyone | `guide_home`, `guide_home_back`, `guide_index`, `guide_<page>` | the pages everyone may read |
| Operators | `guideop_home`, `guideop_home_back`, `guideop_index`, `guideop_<page>` | every page |

Every press leads within its own set, so the choice is made once, on entry. `guides.open`, `<ns>:guide`, the catalog's guide button and `openGuide` open an operator on the operators' set and everyone else on theirs. A `<Link>` to `guide_home` is the same press for every viewer, so it always opens the everyone set: open a guide with `openGuide` or `guides.open` instead. An operator who loses the role mid-read keeps the set they entered.

Access decides what a player is shown, not what they can read: an operator-only page's text ships in the resource pack every player holds, like the rest of the guide, and the operators' screens are published to every addon like any other. Keep anything secret out of guides.

The filter carries the *effective* access on every page and sidebar node, inheritance already applied, so the renderer gates a node by reading one field rather than walking its parents. [The manifest](#the-manifest) lists the fields.

## Custom components

An MDX `cmp` block embeds a real component. Point the filter at a module exporting a registry, and name the component in a page:

```jsonc title="config.json"
{ "filter": "guides", "settings": { "componentsModule": "BP/scripts/guides/components.tsx" } }
```

```tsx title="BP/scripts/guides/components.tsx"
import { Panel } from '@bedrock-core/ui';
import type { GuideComponents } from '@bedrock-core/guides';

export default { Panel } satisfies GuideComponents;
```

```mdx
Here is a live component embedded in the page:

<Panel height={40} />
```

Props are literal-only, strings, numbers and booleans, validated by the filter rather than at render time. An unregistered name renders a placeholder rather than crashing the screen.

## The manifest

What the filter compiles a guide into, and what the screen factories read: the sidebar tree, the pages, the prev/next chain, the blocks, and every paragraph with links as a tagged string in every locale. It is written into Regolith's temp workspace, never synced back to the project, and reaches scripts as `@bedrock-core/generated/guides`.

```ts
interface GuideManifest {
  v: 1;
  ns: string;                              // the addon namespace
  defaultLocale: string;
  locales: string[];
  tree: GuideTreeNode[];                   // the sidebar
  pages: Record<PageId, GuidePageData>;
  gated?: true;                            // set when anything is gated
  home?: PageId;                           // open here instead of the index
  screens?: Record<PageId, string>;        // each page's screen in the set everyone reads
  opScreens?: Record<PageId, string>;      // each page's screen in the operators' set
}

interface GuidePageData {
  id: PageId;
  titleK: LangKey;
  blocks: GuideBlock[];
  prev?: PageId;
  next?: PageId;
  a?: GuideAccess;                         // effective access, on every gated page
  pprev?: PageId;                          // the chain a 'player' reads
  pnext?: PageId;
}

// A paragraph or list item: one key without links; with them, a tagged string in every
// locale ('See <0>the page</0>.') and the page each numbered tag opens.
type GuideInline
  = | { k: LangKey }
    | { text: Record<string, string>; links: PageId[] };

type GuideTreeNode
  = | { t: 'page'; id: PageId; titleK: LangKey; icon?: string; descK?: LangKey; a?: GuideAccess }
    | { t: 'cat'; id: string; labelK: LangKey; collapsed?: boolean; link?: PageId; icon?: string; a?: GuideAccess; children: GuideTreeNode[] };
```

What access adds:

| Field | Meaning |
| --- | --- |
| `gated: true` | Something in this guide is operator-only — also what tells the renderer the second chain exists |
| `a: "op"` on a page or tree node | Effective access, inheritance already applied. Set on `hidden` pages too, since those stay linkable |
| `pprev` / `pnext` | The prev/next chain walked with operator-only pages left out — what everyone else follows |
| `opScreens` | Every page's screen name in the operators' set |

A guide with nothing operator-only carries none of them: no flag, no `a`, no second chain, and compiles one set of screens.

## Limits

- Tables, footnotes, raw HTML, MDX `import` and `export`, JSX expressions and inline images are skipped with a warning.
- Only one level of list nesting is rendered indented; deeper levels flatten.
- Links inside a heading collapse to plain styled text.
- Hard line breaks inside a paragraph become a space.
- A paragraph without links is measured in the **default locale** and wrapped by the client in the player's. A paragraph with links is broken into lines by the build, in every locale.
- A translated link counts when it opens a page the default locale's paragraph links to. A link to any other page is plain text in that locale.

## Next steps

- [Localizing a guide](./localization.md) — structural keys, translated pages and the `.lang` section the filter writes
- [API](./api.md) — every export
- [`guides` filter](/docs/filters/guides) — installing the filter and its settings
