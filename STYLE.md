# Writing a docs page

House rules for every page under `docs/`. They extend the "Content fundamentals" in `design/DESIGN-GUIDE.md`; where the two differ, this file wins.

## Sections

One section = one folder under `docs/` = one route = one sidebar. `src/data/sections.ts` is the registry: id, category, status, description. Add a section there first; `docusaurus.config.ts` creates the docs-plugin instance from it.

```text
<section>/
  index.md            slug: /   Overview
  installation.md               only when install differs from `npm install`
  guides/                       concepts and how-tos, sentence-case titles
  components/  hooks/  api/     reference, one page per export, identifier titles
```

Sections with more than six pages use groups; smaller sections stay flat.

Sidebar labels: the section is the lowercase package name (`ore-styled`). Group labels are sentence case (`Get started`, `Guides`, `Components`, `Hooks`, `API`, `Deprecated`). Leaf labels are the identifier as typed (`Form.Toggle`, `useState`, `core.registry`).

Links: relative `.md` inside a section, absolute `/docs/<section>/...` across sections. Another package's mechanics get one sentence and a link, never a paragraph.

## Page types

**Overview** (`index.md`, `slug: /`, one per section)

```md
# ore-styled                       ← package name, lowercase
One sentence.

:::caution Pre-1.0 … :::           ← until this package ships 1.0

## What is @bedrock-core/ore-styled?
## Install
## What you get                    ← **Noun** — mechanism, then what it protects you from
## Next steps                      ← - [`page`](./page.md) — description
```

**Guide** (`guides/*.md`): sentence-case H1, one-sentence intro, sections, `## Next steps`.

**Component** (`components/*.md`)

```md
# Button
One sentence.
![Button](/img/ore-styled/Button.png)   ← optional

## Import
## Usage
## Props
| Prop | Type | Default | Description |
Inherits [control props](../control-props.md).   ← one line, never repeated
## Examples                        ← ### sentence-case titles, one idea each, ≤ 25 lines
## Notes                           ← optional: engine facts only
```

**Function or hook** (`hooks/*.md`, `api/*.md`)

```md
# useState
One sentence.

## Import
## Signature                       ← one ```ts line
## Parameters
| Parameter | Type | Default | Description |
## Returns
## Usage
## Examples
## Notes
```

**Filter** (`filters/*.md`)

```md
# i18n
One sentence: what goes in, what comes out.

## Install                         ← config.json snippet, place in the stack
## Authoring
## What it generates
| Output | Where | Commit it? |
## Settings
| Setting | Type | Default | Description |
## Checks
| Check | What fails |
```

Reference pages end when the content ends: no `Next steps`, no `Best practices`. Overviews and guides always end with `## Next steps`.

## Tables

| Use | Header |
| --- | --- |
| Component props | `\| Prop \| Type \| Default \| Description \|` |
| Function parameters | `\| Parameter \| Type \| Default \| Description \|` |
| Options objects | `\| Option \| Type \| Default \| Description \|` |
| Filter settings | `\| Setting \| Type \| Default \| Description \|` |
| Export index | `\| Export \| Kind \| Description \|` |
| Section index | `\| Page \| Description \|` |

Cell rules: types in backticks, `\|` inside unions; Default is `—` when none and `— (**required**)` when required; descriptions are one sentence with no trailing period; a compound component gets one table per part under `### RadioGroup`, `### Radio`.

## Voice and typography

- Emoji: `✅` and `❌` only, and only where a yes/no scan helps — a yes/no column in a table, or a paired right/wrong code sample. Never in headings, prose or bullet lists. No other emoji or glyphs (`✓ ○ → ⇆ ✕`) outside literal program output.
- Sentence case for every heading. Package names lowercase in backticks. Component, hook and member names exactly as typed.
- Link lists: `` - [`name`](path) — description `` with an em dash.
- American spelling; always `behavior pack`.
- No `---` rules. No "we", "our", "us".
- `## Notes` for behavior facts, `## Limits` for what is not supported. Not `Limitations`, `Caveats`, `Things to know`, `Rules & Restrictions`.
- Front matter on every page: `sidebar_position` (integer) and `description` (one line; it feeds `llms.txt` and the meta tags).

## Never in a page

- Version history, migration guides, before/after blocks, "used to", "no longer", "what changed in". Changelogs live in each package's `CHANGELOG.md`.
- Dated measurements, session logs, spike names, "measured while building".
- Roadmap phrased as a promise ("not yet", "coming"). State the limit as a fact: "Horizontal scrolling is not exposed."
- Links into monorepo source files.
- Generic React tutorial content. The ui overview links react.dev once.

## Examples

- Import from the public package name.
- `console.warn`, never `console.log`.
- Examples take a `Player` parameter. The `world.afterEvents.buttonPush` + `isPlayer` boilerplate appears once, on the ui overview.
- JSX attribute values in braces: `flexDirection={'row'}`.
- One idea per example, at most 25 lines.

## Checks

`grep` over `docs/**/*.md` must return nothing for: `## Best Practices`, `^---$`, `^- Type:`, `## Next Steps`, `## In This Section`, `behaviour`, `colour`, `labelled`, `centred`, `recognise`, `serialised`, `parameterised`, `github.com/bedrock-core/ui/blob`, `used to`, `no longer`. `✅` and `❌` may appear only inside a table row or a code fence; every other emoji is an error.
