# Component reference — @bedrock-core design system

Every component, its contract and its usage note, in one file. The runnable
source is NOT part of this drop-in (it is React; the docs site is Docusaurus
and needs no React kit to be themed). This file exists so you can match the
markup and class-free inline styling the design system expects.


## components/core/

### Badge

Mono-type status pill for release state and stability markers.

```jsx
<Badge tone="warning">pre-1.0</Badge>
<Badge tone="accent">v0.9.2</Badge>
```

<details><summary>Props contract</summary>

```ts
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
  uppercase?: boolean;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
```

</details>

### Button

The standard action control — use `primary` once per view, `secondary` for the paired action, `ghost` inside dense toolbars.

```jsx
<Button variant="primary" iconRight="arrow-right">Get started</Button>
<Button variant="secondary" iconLeft="github">GitHub</Button>
```

Sizes sm 28 / md 34 / lg 44px. Press state nudges down 1px; there is no scale or bounce anywhere in this brand.

<details><summary>Props contract</summary>

```ts
/**
 * @startingPoint section="Core" subtitle="Buttons, tags, badges and other primitives" viewport="700x220"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = emerald solid; secondary = raised stone; ghost = bare; accentSoft = tinted; danger = redstone. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'accentSoft' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  /** Lucide icon name rendered after the label. */
  iconRight?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
```

</details>

### Card

Flat stone panel used for every boxed surface in the system.

```jsx
<Card interactive accent="var(--pkg-ui)"><h3>ore-styled</h3></Card>
```

The accent rule sits on the TOP edge — never a coloured left border.

<details><summary>Props contract</summary>

```ts
export interface CardProps {
  children?: React.ReactNode;
  /** Lifts onto --bg-raised with a small shadow. */
  raised?: boolean;
  /** Adds pointer + border-strong hover. */
  interactive?: boolean;
  /** Colour of the 2px top rule — pass a --pkg-* token. Top edge only, never a left border. */
  accent?: string;
  padding?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
```

</details>

### Divider

Hairline separator, optionally with an uppercase mono label.

```jsx
<Divider label="packages" />
```

<details><summary>Props contract</summary>

```ts
export interface DividerProps {
  /** Centred uppercase mono label. */
  label?: string;
  vertical?: boolean;
  style?: React.CSSProperties;
}
export declare function Divider(props: DividerProps): JSX.Element;
```

</details>

### Icon

Monochrome glyph wrapper around the Lucide icon set — use it anywhere an icon is needed instead of inlining SVG.

```jsx
<Icon name="terminal" size="sm" />
<Icon name="arrow-right" color="var(--accent-solid)" />
```

Icons are fetched from the Lucide CDN and inlined as real SVG, so they always take `currentColor` from their parent. Sizes: xs 12 / sm 14 / md 16 / lg 20 / xl 24, or a raw number.

<details><summary>Props contract</summary>

```ts
export interface IconProps {
  /** Lucide icon name in kebab-case, e.g. "terminal", "box", "arrow-right". */
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Any CSS color. Defaults to currentColor. */
  color?: string;
  /** Lucide's own default is 2. */
  strokeWidth?: number;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
```

</details>

### IconButton

Icon-only square control — theme toggle, copy button, sidebar collapse.

```jsx
<IconButton icon="moon" label="Toggle theme" />
<IconButton icon="copy" label="Copy" variant="outline" />
```

<details><summary>Props contract</summary>

```ts
export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  /** Accessible label — also used as the tooltip. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline';
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
```

</details>

### Kbd

Key cap for shortcut hints. Bottom border is 2px to fake the cap edge.

```jsx
<Kbd>⌘</Kbd><Kbd>K</Kbd>
```

<details><summary>Props contract</summary>

```ts
export interface KbdProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Kbd(props: KbdProps): JSX.Element;
```

</details>

### Tag

Chip for package names and topics. The dot carries the package accent.

```jsx
<Tag dot accent="var(--pkg-server)">@bedrock-core/server</Tag>
```

<details><summary>Props contract</summary>

```ts
export interface TagProps {
  children?: React.ReactNode;
  /** Colour of the leading dot — pass a --pkg-* token to carry package identity. */
  accent?: string;
  mono?: boolean;
  dot?: boolean;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
```

</details>

## components/navigation/

### Breadcrumbs

Trail above the docs H1. Separator is a literal slash — it matches the package-scope typography.

```jsx
<Breadcrumbs items={[{label:'server'},{label:'Get started'}]} />
```

<details><summary>Props contract</summary>

```ts
export interface Crumb { label: string; href?: string }
export interface BreadcrumbsProps {
  items: Crumb[];
  style?: React.CSSProperties;
}
export declare function Breadcrumbs(props: BreadcrumbsProps): JSX.Element;
```

</details>

### DocsMenu

Header mega-menu that replaces per-package nav tabs once the docs outgrow two sections — categories across the top, a row per package underneath.

```jsx
<DocsMenu activeId="server" onSelect={go} categories={[
  { id:'framework', label:'Framework', accent:'var(--cat-framework)', items:[
    { id:'server', label:'server', description:'Registry, RPC, state' } ]},
  { id:'tooling', label:'Tooling', accent:'var(--cat-tooling)', items:[
    { id:'generator', label:'generator', status:'planned' } ]},
]} />
```

Use up to four categories per row. `status: "planned"` is how unreleased surfaces stay visible without being clickable.

<details><summary>Props contract</summary>

```ts
export interface DocsMenuItem {
  id: string;
  label: string;
  description?: string;
  /** "planned" dims the row and disables selection; any other string renders as a badge. */
  status?: string;
}
export interface DocsMenuCategory {
  id: string;
  label: string;
  /** Category identity colour — pass a --cat-* token. */
  accent: string;
  items: DocsMenuItem[];
}
export interface DocsMenuProps {
  label?: string;
  categories: DocsMenuCategory[];
  activeId?: string;
  onSelect?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function DocsMenu(props: DocsMenuProps): JSX.Element;
```

</details>

### NavBar

Site header for both the docs and marketing surfaces. Translucent + blurred over the canvas.

```jsx
<NavBar logoSrc="assets/logo-mark.png" activeSection="server"
  sections={[{id:'server',label:'server',accent:'var(--pkg-server)'}]} right={<SearchInput />} />
```

Section labels are lowercase mono — they are package names, not sentence-case nav items.

<details><summary>Props contract</summary>

```ts
export interface NavSection { id: string; label: string; accent?: string }
export interface NavBarProps {
  /** Path to the @bedrock-core mark, usually assets/logo-mark.png. */
  logoSrc?: string;
  /** Left-hand nav slot — put a <DocsMenu> here once the docs outgrow a tab strip. Rendered before `sections`. */
  menu?: React.ReactNode;
  sections?: NavSection[];
  activeSection?: string;
  onSelectSection?: (id: string) => void;
  /** Right-hand slot: search, GitHub/Discord buttons, theme toggle. */
  right?: React.ReactNode;
  sticky?: boolean;
  style?: React.CSSProperties;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
```

</details>

### PaginationNav

Prev/next footer that closes a docs article.

```jsx
<PaginationNav next={{ label: 'Installation' }} />
```

<details><summary>Props contract</summary>

```ts
export interface PageLink { label: string; href?: string; onClick?: (e: React.MouseEvent) => void }
export interface PaginationNavProps {
  prev?: PageLink;
  next?: PageLink;
  style?: React.CSSProperties;
}
export declare function PaginationNav(props: PaginationNavProps): JSX.Element;
```

</details>

### SectionSwitcher

Sidebar header that names the current docs section and drops down to switch. Pair it with `SidebarNav`'s `header` slot — it is the flat, searchable counterpart to `DocsMenu`.

```jsx
<SidebarNav header={<SectionSwitcher sections={all} value={id} onChange={setId} status="pre-1.0" />} … />
```

<details><summary>Props contract</summary>

```ts
export interface SwitcherSection {
  id: string;
  label: string;
  /** Category identity colour — pass a --cat-* token. */
  accent: string;
  /** Category name shown right-aligned in the list. */
  category?: string;
  /** "planned" dims the row and disables selection. */
  status?: string;
}
export interface SectionSwitcherProps {
  sections: SwitcherSection[];
  value?: string;
  onChange?: (id: string) => void;
  scope?: string;
  /** Release badge shown on the closed trigger, e.g. "pre-1.0". */
  status?: string;
  style?: React.CSSProperties;
}
export declare function SectionSwitcher(props: SectionSwitcherProps): JSX.Element;
```

</details>

### SidebarNav

Docs left sidebar. Top-level entries are sans; nested pages are mono (they are file/API names).

```jsx
<SidebarNav items={tree} activeId="overview" onSelect={setId} />
```

<details><summary>Props contract</summary>

```ts
export interface SidebarNode {
  id: string;
  label: string;
  items?: SidebarNode[];
  /** Collapsed on first render when false. */
  defaultOpen?: boolean;
}
export interface SidebarNavProps {
  items: SidebarNode[];
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Slot above the tree — version switcher, package pill. */
  header?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SidebarNav(props: SidebarNavProps): JSX.Element;
```

</details>

### SiteFooter

Footer shared by the docs and marketing surfaces.

```jsx
<SiteFooter wordmarkSrc="assets/logo-wordmark.png" columns={[{title:'Docs',links:[{label:'server'}]}]} />
```

<details><summary>Props contract</summary>

```ts
export interface FooterColumn { title: string; links: { label: string; href?: string }[] }
export interface SiteFooterProps {
  /** Path to the wordmark PNG, usually assets/logo-wordmark.png. */
  wordmarkSrc?: string;
  columns?: FooterColumn[];
  note?: string;
  style?: React.CSSProperties;
}
export declare function SiteFooter(props: SiteFooterProps): JSX.Element;
```

</details>

### TableOfContents

Right-hand page outline. Active item gets an emerald left rule, not a background.

```jsx
<TableOfContents items={[{id:'install',label:'Install one package'}]} activeId="install" />
```

<details><summary>Props contract</summary>

```ts
export interface TocItem { id: string; label: string; depth?: 0 | 1 | 2 }
export interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: string;
  style?: React.CSSProperties;
}
export declare function TableOfContents(props: TableOfContentsProps): JSX.Element;
```

</details>

## components/docs/

### Callout

Admonition block for the docs body — the "Pre-1.0" banner on every package overview is `kind="warning"`.

```jsx
<Callout kind="warning" title="Pre-1.0">Breaking changes can still land until 1.0.0.</Callout>
```

<details><summary>Props contract</summary>

```ts
export interface CalloutProps {
  kind?: 'note' | 'tip' | 'info' | 'warning' | 'danger';
  /** Overrides the default uppercase title. */
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Callout(props: CalloutProps): JSX.Element;
```

</details>

### CodeBlock

Code fence for the docs body and marketing hero. Always dark, in both themes.

```jsx
<CodeBlock language="bash" code="npm install @bedrock-core/server" />
<CodeBlock language="tsx" title="welcome.tsx" showLineNumbers code={src} />
```

<details><summary>Props contract</summary>

```ts
export interface CodeBlockProps {
  code: string;
  /** Shown as an uppercase mono badge in the title bar. */
  language?: string;
  /** Filename or command context, e.g. "main.ts". */
  title?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  style?: React.CSSProperties;
}
export declare function CodeBlock(props: CodeBlockProps): JSX.Element;
```

</details>

### DocTabs

Underlined tab strip for alternative instructions (npm / pnpm / yarn, TS / JS).

```jsx
<DocTabs tabs={[{id:'npm',label:'npm'},{id:'pnpm',label:'pnpm'}]}>
  {(id) => <CodeBlock language="bash" code={\`${id} install @bedrock-core/server\`} />}
</DocTabs>
```

<details><summary>Props contract</summary>

```ts
export interface DocTab { id: string; label: string }
export interface DocTabsProps {
  tabs: DocTab[];
  /** Controlled active tab id. */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Node, or a render function receiving the active tab id. */
  children?: React.ReactNode | ((activeId: string) => React.ReactNode);
  style?: React.CSSProperties;
}
export declare function DocTabs(props: DocTabsProps): JSX.Element;
```

</details>

### FeatureCard

Feature block for the marketing page's "what you get" grid.

```jsx
<FeatureCard icon="radio" title="Discovery">Addons find each other at runtime.</FeatureCard>
```

<details><summary>Props contract</summary>

```ts
export interface FeatureCardProps {
  /** Lucide icon name. */
  icon?: string;
  title?: string;
  children?: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}
export declare function FeatureCard(props: FeatureCardProps): JSX.Element;
```

</details>

### NextStepsList

Closing link list for a docs page — mono link title, sentence-case description on the same line.

```jsx
<NextStepsList items={[{ title:'Installation', description:'Scaffold with the CLI' }]} />
```

<details><summary>Props contract</summary>

```ts
export interface NextStepItem { title: string; description?: string; href?: string }
export interface NextStepsListProps {
  items: NextStepItem[];
  style?: React.CSSProperties;
}
export declare function NextStepsList(props: NextStepsListProps): JSX.Element;
```

</details>

### PackageCard

Tile for one package in the homepage grid or a docs index.

```jsx
<PackageCard name="server" icon="server" accent="var(--pkg-server)" status="pre-1.0"
  description="Registry, RPC, replicated state and config across addon realms." />
```

<details><summary>Props contract</summary>

```ts
/**
 * @startingPoint section="Docs" subtitle="Package tiles, callouts, code fences and API tables" viewport="700x320"
 */
export interface PackageCardProps {
  /** Package name after the scope, e.g. "server". */
  name: string;
  scope?: string;
  description?: string;
  /** Lucide icon name. */
  icon?: string;
  /** Package identity colour — pass a --pkg-* token. */
  accent?: string;
  /** Short release-state label, e.g. "pre-1.0". */
  status?: string;
  href?: string;
  style?: React.CSSProperties;
}
export declare function PackageCard(props: PackageCardProps): JSX.Element;
```

</details>

### PropsTable

API reference table used under every component/API heading in the docs.

```jsx
<PropsTable rows={[{ name:'timeoutMs', type:'number', default:'2000', description:'RPC timeout.' }]} />
```

<details><summary>Props contract</summary>

```ts
export interface PropsTableRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description?: React.ReactNode;
}
export interface PropsTableProps {
  rows: PropsTableRow[];
  style?: React.CSSProperties;
}
export declare function PropsTable(props: PropsTableProps): JSX.Element;
```

</details>

## components/forms/

### SearchInput

Docs search field for the header.

```jsx
<SearchInput value={q} onChange={setQ} />
```

<details><summary>Props contract</summary>

```ts
export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Second key in the hint; pass null to hide the hint entirely. */
  shortcut?: string | null;
  width?: number | string;
  style?: React.CSSProperties;
}
export declare function SearchInput(props: SearchInputProps): JSX.Element;
```

</details>

### Select

Compact select for version and locale switching. Mono type — the values are identifiers.

```jsx
<Select size="sm" value="0.9" options={[{value:'0.9',label:'v0.9 (latest)'}]} />
```

<details><summary>Props contract</summary>

```ts
export interface SelectOption { value: string; label: string }
export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  width?: number | string;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
```

</details>

### Switch

Boolean toggle for settings rows and config examples.

```jsx
<Switch checked={on} onChange={setOn} label="Enable feature" />
```

<details><summary>Props contract</summary>

```ts
export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
```

</details>

### TextField

Labelled text input for config and settings examples.

```jsx
<TextField label="Pack id" mono value={id} onChange={setId} hint="creator_pack" />
```

<details><summary>Props contract</summary>

```ts
export interface TextFieldProps {
  label?: string;
  /** Helper text under the field; turns red when invalid. */
  hint?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Render the value in JetBrains Mono — use for identifiers and paths. */
  mono?: boolean;
  invalid?: boolean;
  width?: number | string;
  style?: React.CSSProperties;
}
export declare function TextField(props: TextFieldProps): JSX.Element;
```

</details>
