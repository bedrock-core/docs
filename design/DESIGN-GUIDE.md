# @bedrock-core Design System

A clean, modern documentation and marketing identity for **@bedrock-core** — a framework for Minecraft Bedrock Edition addons that need to talk to each other across isolated script realms.

This is a **redesign**, not a recreation. The live site runs Docusaurus v3.10.1 with close-to-default theming; this system replaces that theming with a deliberate one, in the spirit of the TanStack docs the user cited as a reference: dark-first, dense, mono-forward, one accent hue per package.

## Sources used

| Source | Access | What was taken |
| --- | --- | --- |
| https://bedrock-core.drav.dev/ | Public, read | Product framing, package inventory, site structure |
| https://bedrock-core.drav.dev/docs/server/get-started/overview | Public, read | Copy + code samples reproduced in the docs UI kit |
| https://bedrock-core.drav.dev/docs/ui/get-started/overview | Public, read | Copy + code samples reproduced in the docs UI kit |
| https://github.com/bedrock-core/ | **Not read** | Docs source lives at `bedrock-core/docs`; no repo was connected to this project |
| `uploads/title.png`, `uploads/icon.png` | Provided | The only brand assets — copied to `assets/` |

> The attached `docs` repo is a Docusaurus site with **no component library of its own** — `src/` contains only the stock homepage and one `HomepageFeatures` block. There was therefore no component inventory to mirror, and the set below is authored: a standard docs-and-marketing kit sized to the surfaces that exist. No Figma file or design spec was provided.
>
> All brand imagery in `assets/` is now the **real** `static/img` content from that repo, not the two chat uploads.

## Products & surfaces

- **Docs site** (`ui_kits/docs-site/`) — the Docusaurus documentation. Two package sections today: `server` and `ui`. Each has a Get started group, per-module reference pages, and an "On this page" rail.
- **Marketing site** (`ui_kits/marketing/`) — the homepage: hero, package grid, feature grid, code tour, CTA, footer.
- **Named-but-unbuilt surfaces** — the user named `filters`, `tools`, `cli` and a future `generator`. Each has a reserved accent token (`--pkg-*`) and appears in the marketing package grid marked *planned*. No docs content exists for them yet.

Package inventory as published today: `@bedrock-core/server` (meta), `@bedrock-core/server-runtime`, `@bedrock-core/sync`, `@bedrock-core/ui`, `@bedrock-core/ui-runtime`, `@bedrock-core/ore-styled`, plus the `flexbox`, `navigation`, `i18n`, `config`, `guides` and CLI docs sections under `ui`.

---

## CONTENT FUNDAMENTALS

The existing docs voice is unusually good and this system preserves it verbatim rather than replacing it.

**Person.** Second person for the reader ("you"), third person for the software ("the runtime already owns exactly one node and hands it to you"). Never "we" except in a genuine recommendation: *"If you're new to React, we strongly recommend starting with the official React tutorial."*

**Casing.** Sentence case everywhere — page titles (*"Install one package"*, *"Your First UI"* is the one legacy exception), headings, buttons, sidebar groups. Package and module names are always lowercase and always in mono: `server-runtime`, `ore-styled`, `sync`. Never Title Case a package name.

**Sentence shape.** Short declaratives that state a mechanism, then a consequence. The house move is a plain-fact sentence followed by the "so what":
- *"Every behavior pack runs its scripts in its own isolated realm. Two packs in the same world cannot import each other, share a module, or see each other's variables."*
- *"Reads are synchronous; writes broadcast a delta."*
- *"None of them imported each other. They found each other at runtime."*

**Feature bullets** follow a strict shape: **bold noun** — em dash — one sentence that says what it does *and* what it protects you from. *"**RPC** — typed request/response calls to another addon, with a timeout so an absent peer can never hang your code."*

**Honesty about maturity.** Every package overview opens with the same Beta admonition. Limitations are stated as facts, not hidden: *"A state change on its own does not repaint their screen."* Optional layers are explicitly optional: *"It's optional — pick it up when you want batteries-included visuals, skip it when you'd rather style every primitive yourself."*

**Page rhythm.** Every docs page ends with a **Next Steps** list of `link — short description` pairs. Keep it.

**Marketing register** is the docs register with the sentences shortened, not a different voice. Headlines are lowercase-feeling declaratives with a full stop: *"Addons that find each other."*, *"One scope, many parts."*, *"Three calls, two packs."* No exclamation marks, no "revolutionary", no "blazing fast".

**Emoji: never.** Not in docs, not in marketing, not in UI. Unicode box-drawing (`├─ └─`) *is* used, inside `text` code fences, to draw realm trees — that is the one decorative typographic device the brand owns.

**British/American spelling** — the live docs mix `behavior` (API-matching, keep as-is when naming Minecraft's behavior packs) with `behaviour` in prose. Prefer American spelling in new copy; always `behavior pack`.

---

## VISUAL FOUNDATIONS

### The idea
Bedrock is a block: cut, opaque, layered, grey. The system is built from **flat stone planes separated by hairlines**, with colour reserved almost entirely for meaning. Nothing is soft. Nothing floats unless it genuinely overlays.

### Colour
- **Neutrals** are a single "stone" ramp (`--stone-0` → `--stone-1000`) sampled from the logo's greys. Dark is the default theme; light is a full remap of the same semantic roles, not a separate palette.
- **Accents** are "ore" hues — emerald, gold, diamond, amethyst, redstone, lapis. **Emerald is the brand primary** (`--accent-solid`); everything else is either a package identity (`--pkg-server`, `--pkg-ui`, …) or a status.
- **One accent per view.** A docs page shows exactly one package colour (the section you are in). The homepage grid is the only place multiple accents sit together, and each is confined to a 2px card rule and a 30px icon.
- Semantic tints are always *solid hue on the rule and icon, ~13% tint on the panel* — never a saturated fill behind body text.

### Type
Space Grotesk (display), IBM Plex Sans (body), JetBrains Mono (code and identifiers). **Mono does real work here**: package names, module names, sidebar leaf pages, version badges, breadcrumb crumbs, table types and metadata are all mono, because they are all identifiers. Sans is for prose only. Display tracking is tight (`-0.035em` at hero, `-0.02em` at heading); body sits at 15px / 1.72 for long-form docs reading.

### Spacing & layout
4px base, no half-steps. Docs layout is fixed-rail: 272px sidebar / 768px content max / 232px TOC, under a 60px sticky header. The header is the only fixed element; the sidebar and TOC are `position: sticky` inside the flow. Page max width 1440px, centred.

### Corner radii
Deliberately small — 3px on badges and inline code, 4px on controls, 6px on cards and code fences, 10–14px only for large overlays, pill for tags and toggles. Nothing in this system is rounder than 14px except a switch knob.

### Cards
Flat: `--bg-surface`, 1px `--border-subtle`, 6px radius, **no shadow by default**. Interactive cards change their *border* to `--border-strong` on hover and lift to `--bg-raised` — they do not scale, glow or translate. When a card carries identity, it takes a **2px accent rule along the top edge**. Never a coloured left border.

### Borders & shadows
Borders are alpha-on-canvas (`rgba(255,255,255,.07/.12/.2)`) so a single value works in both themes. Shadows are rare and functional — `--shadow-sm` for a raised card, `--shadow-md` for popovers, `--shadow-lg` for modals; hero, cards and buttons get none. There is no inner-shadow system beyond `--shadow-inset-top`, used sparingly to imply a bevelled top edge.

### Backgrounds
No photography, no illustration, no repeating texture. The full backdrop vocabulary is two things: a **40px grid rule** at ~4.5% opacity, and **one emerald radial bloom** (`--gradient-hero`) behind the hero and the closing CTA. `--gradient-stone` exists only to echo the logo's bevel and is not used as a page background. Sections alternate between `--bg-canvas` and `--bg-sunken` with a hairline between them — that is how vertical rhythm is signalled, not with colour blocks.

### Transparency & blur
Exactly one use: the sticky header sits at ~82% canvas with `backdrop-filter: blur(10px)`, so code scrolling underneath stays legible. Modals use a `--overlay-scrim` at 66%. Nothing else is translucent — no frosted cards, no glass panels.

### Animation
Short, flat, and functional. 80ms for press feedback, 130ms for hover/colour/border, 200ms for disclosure and tab underlines, 320ms for page-level fades. One easing curve: `cubic-bezier(.2,0,0,1)`. **No bounce, no spring, no scale, no entrance animation on scroll.** The only transform in the system is a 3px arrow nudge on hovered link-cards and a 1px downward press on buttons.

### Interaction states
- **Hover** — lighten by a 5% white overlay (`--bg-hover`) in dark, 4.5% black in light; interactive borders step up one level. Links brighten one accent step and gain a 3px-offset underline.
- **Press** — 9% overlay (`--bg-active`) plus `translateY(1px)`. Solid buttons darken to `--accent-solid-active`. Never a scale-down.
- **Active/selected** — sidebar rows take a 12% emerald tint and emerald text; TOC rows take an emerald **left rule** with no background; nav tabs take a 2px emerald **bottom rule**.
- **Focus** — 2px `--focus-ring` outline at 2px offset; fields additionally get `--shadow-focus` (a 3px emerald glow) and an accent border.
- **Disabled** — 45% opacity, `not-allowed` cursor, no colour change.

### Imagery
There is none, by design. The only raster assets are the two logo PNGs, always rendered with `image-rendering: pixelated` so their block edges stay crisp at any size. If screenshots of in-game UI are added later, they arrive as-is (Minecraft's own colour, warm and saturated) inside a 6px-radius `--border-subtle` frame with no filter, caption in `--text-caption` mono underneath.

---

## ICONOGRAPHY

**No icon set was found in the provided sources.** The live site is stock Docusaurus and ships no custom glyph font, sprite sheet or SVG library, and no repository was connected.

**Substitution (please confirm):** the system uses **[Lucide](https://lucide.dev) 0.544.0 from unpkg**, loaded as a CSS mask so every glyph inherits `currentColor`. Lucide was chosen for its 2px round-cap stroke and 24px grid, which sit comfortably next to Space Grotesk without competing with the blocky logo. All icon use goes through the `Icon` component — **never inline an SVG and never hand-draw one.**

- **Style rules** — outline only, never filled; 16px default in UI, 20px in feature cards, 12–14px inline with mono text. Icons take the surrounding text colour except in feature cards and package tiles, where they take the package accent.
- **Recurring glyphs** — `server`, `layout-panel-left`, `radio`, `database`, `sliders-horizontal`, `toggle-right`, `languages`, `terminal`, `package`, `github`, `message-circle` (Discord), `search`, `sun`/`moon`, `copy`/`check`, `chevron-right`, `arrow-right`.
- **Emoji** — never, in any surface.
- **Unicode as iconography** — box-drawing characters (`├─`, `└─`) inside `text` code fences, and a literal `/` as the breadcrumb separator (it matches the `@scope/package` typography). Nothing else.
- **The logo is not an icon.** `assets/logo-mark.png` appears at 22px in the header and at hero scale; it is never recoloured, rotated, or used as a bullet.

**Assets present** — `assets/logo-mark.png` (block mark) and `assets/logo-wordmark.png` (full `@bedrock-core` lockup), both supplied by the user. No other brand imagery exists and none was invented.

---

## Index

### `integration/docusaurus/`
**Start here if you are shipping this into the docs repo.** A CSS-only drop-in theme for `bedrock-core/docs`: `src/css/custom.css` (seven `@import` lines) plus `src/css/bedrock/` (the six token files copied verbatim, and `infima-bridge.css` which maps them onto Infima's `--ifm-*` variables). No structural, config, or content changes.

**`integration/docusaurus/HANDOFF.md`** is the instruction sheet for whoever applies it — what to copy, how to verify, what is deliberately excluded, and the rules that are easiest to break by accident. Point the next agent at that file.

### Root
- `styles.css` — the single entry point consumers link. `@import` lines only.
- `thumbnail.html` — homepage tile for this design system.
- `SKILL.md` — Agent Skills wrapper for use outside this project.
- `readme.md` — this file.

### `tokens/`
`fonts.css` (Google Fonts + family tokens) · `colors.css` (stone ramp, ore accents, package identity, dark + light semantic roles) · `typography.css` (scale, leading, tracking, weights) · `spacing.css` (4px scale, radii, layout widths) · `elevation.css` (shadows, blur, the two gradients, grid rule) · `motion.css` (durations, easings) · `base.css` (element resets, link colours, focus, selection).

### `assets/`
`logo-mark.png` · `logo-wordmark.png`

### `guidelines/`
24 specimen cards feeding the Design System tab, grouped **Colors** (primary diamond, ore accents, emerald variant, category identity, stone ramp, surfaces dark, surfaces light, text roles, status, borders), **Type** (families, display, headings, body, mono, eyebrows), **Spacing** (scale, radii, layout widths) and **Brand** (elevation, motion, logo mark, wordmark, backdrops).

### Components
Grouped by concern under `components/`. No source defined a component inventory, so this is an authored standard set scoped to the two real surfaces.

**`components/core/`** — `Button`, `IconButton`, `Icon`, `Badge`, `Tag`, `Card`, `Kbd`, `Divider`
**`components/navigation/`** — `NavBar`, `DocsMenu`, `SectionSwitcher`, `SidebarNav`, `TableOfContents`, `Breadcrumbs`, `PaginationNav`, `SiteFooter`
**`components/docs/`** — `Callout`, `CodeBlock`, `DocTabs`, `PropsTable`, `PackageCard`, `FeatureCard`, `NextStepsList`
**`components/forms/`** — `SearchInput`, `Select`, `Switch`, `TextField`

Each has a sibling `.d.ts` (props contract) and `.prompt.md` (what & when + example). Each directory has one `@dsCard` HTML showing its states.

#### Intentional additions
- **`Icon`** — a wrapper over the substituted Lucide set, so every glyph in the system flows through one component and a future swap to a real `@bedrock-core` icon set is a one-file change.
- **`PackageCard` / `FeatureCard` / `NextStepsList`** — not "generic" primitives; each maps to a repeating block that exists on the live site (the docs "What you get" list, the "Next Steps" footer, the package index).
- **`DocsMenu` / `SectionSwitcher`** — the two controls the category IA needs. Neither exists in stock Docusaurus; both are the point of the redesign.

### `ui_kits/`
- `docs-site/` — Docusaurus docs recreation. Interactive: package switcher, sidebar tree, TOC, install-manager tabs, theme toggle. See its README for what is deliberately left blank.
- `marketing/` — homepage. Hero, package grid, feature grid, tabbed code tour, CTA, footer.

## Known substitutions — please confirm

1. **Fonts.** No font files were provided. Space Grotesk / IBM Plex Sans / JetBrains Mono are all Google Fonts stand-ins chosen to fit the blocky, technical mark. Send real files and `tokens/fonts.css` is the only file that changes.
2. **Icons.** Lucide via unpkg, as above.
3. **No mark was invented.** Where a logo is needed, the supplied PNGs are used; where neither fits, the name is set in live mono type (`@bedrock-core/`).
