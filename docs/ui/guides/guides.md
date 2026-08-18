---
sidebar_position: 1
---

# guides

`@bedrock-core/guides` renders **Docusaurus-style in-game guides**. You author MDX, the [`guides` Regolith filter](./regolith-filter.md) compiles it at build time, and this package renders the result as server forms — sidebar, pages, prev/next, admonitions and all.

```tsx
import guides from '@bedrock-core/generated/guides';
import { createGuide } from '@bedrock-core/guides';

// Build ONCE per manifest and cache it — the returned component holds the open-page
// state, so recreating it each render resets the guide to its home.
const Guide = createGuide(guides, { title: 'My Addon' });

function GuideScreen({ navigation }: ScreenProps<Routes, 'Guide'>) {
  return <Guide onExit={() => navigation.goBack()} />;
}
```

Prose rides `.lang` values, so the client resolves every paragraph in each player's own language and the runtime's raw-text length limits never apply to guide copy.

## Install

```bash
yarn add @bedrock-core/guides
```

Or, if you already depend on `@bedrock-core/ui`:

```tsx
import { createGuide } from '@bedrock-core/ui/guides';
```

Peer dependencies: `@bedrock-core/ui-runtime`, `@bedrock-core/navigation`, `@bedrock-core/ore-styled`.

## `createGuide(manifest, options?)`

```ts
function createGuide(manifest: GuideManifest, options?: GuideOptions): (props: GuideProps) => JSX.Element
```

Builds a **self-contained guide component** for one manifest. It owns its home ⇆ page navigation internally — a page is not a host route — so a host needs a single screen that renders it.

### `GuideOptions`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Guide'` | Header title. Raw text, so `§` colour codes work |
| `components` | `GuideComponents` | — | Registry for MDX `cmp` blocks — see [Custom components](#custom-components) |
| `audience` | `'op' \| 'player'` | `'op'` | Who this instance renders for — see [Operator-only pages](#operator-only-pages) |

### `GuideProps`

| Prop | Type | Description |
| --- | --- | --- |
| `onExit` | `() => void` | Leave the guide from its home screen. Omit for a root guide (no back button on home) |

:::caution Create it once, outside render
The returned component holds the open-page state. Recreating it on every render resets the guide to its home screen every time the host re-renders. Build it at module scope, or cache it per addon.
:::

### Where a guide opens

| Manifest | Opens on | Sidebar |
| --- | --- | --- |
| Several pages, no `home` | the index | yes |
| Several pages, `home: true` on a page | that page | yes, one press away |
| A single page | that page | no index at all |
| A `home` naming no page | the index | yes (ignored, not an error) |

`home` is set in a page's frontmatter and pairs naturally with `hidden: true`, since a landing page is usually not also a sidebar row.

## Authoring

Guide content lives in `packs/data/guides/<locale>/**`:

```txt
packs/data/guides/
├── guides.generated.d.ts       ← seeded by `regolith install`; commit it
├── en_US/                      ← the default locale: structure, keys, sidebar, fallbacks
│   ├── intro.mdx
│   └── getting-started/
│       ├── _category_.json     ← label / position / collapsed / link / icon
│       ├── installation.mdx
│       └── first-screen.mdx
└── es_ES/                      ← translations: same tree, values only
    └── intro.mdx
```

```mdx
---
title: Installation
sidebar_position: 1
icon: textures/ui/config/config
description: Add the pack and wire the filters.
---

Install the render pack, then add the filters to `config.json`.

:::tip
Run `guides` before `i18n` — the ordering matters.
:::

- Import the `.mcpack`
- Add the filter entries
- Rebuild
```

See the [filter page](./regolith-filter.md#authoring) for the full frontmatter list and the supported Markdown subset.

## Blocks

The manifest IR is a small block union, and each block maps to one rendering:

| Block | Authored as | Rendered as |
| --- | --- | --- |
| `h` | `#` – `###` (deeper clamps to 3) | Heading text, `minecraftTen` for h1, scaled down for h2/h3 |
| `p` | a paragraph | A wrapping row of inline runs |
| `ul` / `ol` | `-` / `1.`, one nesting level | Bulleted / numbered rows, nested rows indented |
| `img` | `![alt](textures/ui/x.png)` alone in a paragraph | An `Image`, aspect-ratio from the sniffed PNG size |
| `adm` | `:::note` … `:::danger` | A dark `Card` with a coloured title and nested blocks |
| `code` | a fenced block | A dark `Card`, one dim line per source line |
| `hr` | `---` | A `Divider` |
| `cmp` | `<Name prop="x" />` | Your registered component, or an "unsupported content" placeholder |

Inline styling is baked into the `.lang` values as `§` codes — `**bold**` → `§l`, `*italic*` → `§o`, `` `code` `` → `§7`, `~~strike~~` → `§8`, links → `§9`.

**Internal links** are woven into the sentence as pressable transparent buttons and navigate within the guide. **External `http(s)` links** render as styled text only — nothing can open a browser from a server form.

## Operator-only pages

A page (or a whole category) can be marked `access: op` when authoring — see [Access](./regolith-filter.md#access). Pass the audience when you build the guide, and the renderer resolves everything else per viewer:

```tsx
import { createGuide, hasVisiblePages } from '@bedrock-core/guides';
import { PlayerPermissionLevel } from '@minecraft/server';

const audience = player.playerPermissionLevel === PlayerPermissionLevel.Operator ? 'op' : 'player';
const Guide = createGuide(guides, { title: 'My Addon', audience });
```

What changes for a `'player'`:

- Gated pages and categories leave the sidebar; a category that empties out goes with them.
- The landing page is resolved over what they can see — a guide of one public page and three operator ones is a single-page guide to them, and a `home` they cannot open falls back to the index.
- Prev/next follows the chain that skips gated pages, so pagination never walks into one.
- An inline link to a gated page renders as plain prose; the sentence still reads.

`hasVisiblePages(manifest, audience)` answers whether there is anything in there for them at all. Check it before offering a way in — a guide that is entirely gated should have no button and no command landing on an empty index. `@bedrock-core/config` does exactly that: the list button greys out, and a `:guide` command clamps to the addon list.

Build the component **per audience**, and key any cache you keep by audience as well as by addon — the landing page and sidebar are decided when the component is built, so an operator's copy is not a player's.

:::warning Presentation, not protection
Manifests replicate to every addon in the world and their prose ships in the pack's `.lang`. Gating decides what a player is **shown**, the way `hidden` does — not what they may **do**.
:::

## Custom components

MDX `cmp` blocks let a guide embed a real component. Register it by name:

```tsx
import { ItemRenderer } from '@bedrock-core/ui';

const Guide = createGuide(guides, {
  title: 'My Addon',
  components: { ItemRenderer },
});
```

```mdx
Here is what the reward looks like:

<ItemRenderer itemId="minecraft:diamond" />
```

Props are literal-only (strings, numbers, booleans) — they are validated by the authoring filter, not at render time. An unregistered name renders a placeholder rather than crashing the screen.

## Rendering blocks yourself

`GuideBlockList` renders a block array outside a full guide — useful for embedding a page's content in your own screen.

```tsx
import { GuideBlockList } from '@bedrock-core/guides';

<GuideBlockList
  blocks={manifest.pages['intro'].blocks}
  ns={manifest.ns}
  onNavigate={(pageId) => navigation.navigate('GuidePage', { pageId })}
/>
```

| Prop | Type | Description |
| --- | --- | --- |
| `blocks` | `GuideBlock[]` | The blocks to render |
| `ns` | `string` | The manifest namespace |
| `onNavigate` | `(pageId: PageId) => void` | Where internal link presses go |
| `canOpen` | `(pageId: PageId) => boolean` | Whether a link target may be opened. A refused link renders as plain prose instead of a pressable. Defaults to every link being open |
| `components` | `GuideComponents` | Registry for `cmp` blocks |

## `isGuideManifest(value)`

```ts
function isGuideManifest(value: unknown): value is GuideManifest
```

Narrows a replicated payload to a manifest, so a peer publishing something malformed degrades instead of crashing the screen hosting it. The check is shallow: version, namespace, tree and pages shape, not every block.

```tsx
function PeerGuide({ payload }: { payload: unknown }) {
  if (!isGuideManifest(payload)) {
    return <Text>{'This addon has no guide.'}</Text>;
  }

  return <PeerGuideView manifest={payload} />;
}
```

## The manifest

A manifest does **not** have to be generated. Keys that match no `.lang` entry render literally, so a hand-written single-page manifest can carry its prose inline.

```ts
interface GuideManifest {
  v: 1;
  ns: string;                              // the addon namespace
  defaultLocale: string;
  locales: string[];
  tree: GuideTreeNode[];                   // the sidebar
  pages: Record<PageId, GuidePageData>;
  home?: PageId;                           // open here instead of the index
}

interface GuidePageData {
  id: PageId;
  titleK: LangKey;
  blocks: GuideBlock[];
  prev?: PageId;
  next?: PageId;
}

type GuideTreeNode
  = | { t: 'page'; id: PageId; titleK: LangKey; icon?: string; descK?: LangKey }
    | { t: 'cat'; id: string; labelK: LangKey; collapsed?: boolean; link?: PageId; icon?: string; children: GuideTreeNode[] };
```

## Publishing a guide

Pass the manifest to the server runtime's [registration](/docs/server/server-runtime/registry) and every realm in the world can render it — the [`GuidesRegistry`](/docs/server/server-runtime/guides) replicates it, which is how your guide reaches the [shared addon list](../config/config.md):

```ts
import guides from '@bedrock-core/generated/guides';

core.register({ /* … */, guide: guides });
```

## API reference

| Export | Kind | Description |
| --- | --- | --- |
| `createGuide(manifest, options?)` | function | Build the guide component |
| `GuideOptions`, `GuideProps` | types | Its options and props |
| `GuideBlockList` | component | Render a block array directly |
| `hasVisiblePages(manifest, audience)` | function | Whether an audience has anything to read |
| `visiblePageIds`, `visibleTree`, `paginationFor`, `canSee` | functions | The per-audience filters the renderer uses |
| `GuideAccess`, `GuideAudience` | types | `'op'`, and `'op' \| 'player'` |
| `isGuideManifest(value)` | function | Narrow replicated data to a manifest |
| `GuideManifest`, `GuidePageData`, `GuideTreeNode`, `GuideBlock`, `GuideListItem`, `GuideRun` | types | The IR |
| `AdmonitionKind` | type | `'note' \| 'tip' \| 'info' \| 'warning' \| 'danger'` |
| `GuideComponents` | type | `Record<string, FunctionComponent>` |
| `LangKey`, `PageId` | types | String aliases used across the IR |

## Limits

These are documented v1 limitations of the authoring pipeline:

- Tables, footnotes, raw HTML, MDX `import`/`export`, JSX expressions and inline images are skipped with a warning.
- Only one level of list nesting is rendered indented; deeper levels flatten.
- Links inside a heading collapse to plain styled text.
- Hard line breaks inside a paragraph become a space.
- Server-side text measurement (ellipsis, `maxLines`) uses the **default-locale** strings; actual paragraph wrapping happens client-side per player language and is always correct.

## In This Section

| Page | Description |
| --- | --- |
| [guides Regolith filter](./regolith-filter.md) | Authoring MDX, settings, generated outputs, and the namespaced-keys breaking change |
