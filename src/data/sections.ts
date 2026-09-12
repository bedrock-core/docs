// The docs registry. One entry per section: a folder under docs/, a route,
// a sidebar, and a row in every menu. docusaurus.config.ts creates one
// docs-plugin instance per non-planned section from this list; the navbar,
// the sidebar switcher and the home page read it on the client.
//
// Plain data only — this file is imported from Node and from the browser.

export type CategoryId = 'framework' | 'ui' | 'content' | 'tooling';

/** `beta` is a 0.x package, `1.0-rc` a release candidate, `1.0` a released package. */
export type SectionStatus = 'beta' | '1.0-rc' | '1.0' | 'planned';

export interface Category {
  id: CategoryId;
  label: string;
  /** CSS custom property carrying the category colour, e.g. `--cat-framework`. */
  accent: string;
}

export interface Section {
  /** Folder under docs/, plugin id and route: /docs/<id>. */
  id: string;
  /** Package name as shown in menus, lowercase. */
  label: string;
  /** Published package or repository name. */
  pkg: string;
  category: CategoryId;
  status: SectionStatus;
  /** One line for menu rows and package cards. */
  description: string;
  /** Lucide icon name. */
  icon: string;
  /** Source repository. */
  repo: string;
}

export const categories: Category[] = [
  { id: 'framework', label: 'Framework', accent: '--cat-framework' },
  { id: 'ui', label: 'UI', accent: '--cat-ui' },
  { id: 'content', label: 'Content', accent: '--cat-data' },
  { id: 'tooling', label: 'Tooling', accent: '--cat-tooling' },
];

const GH = 'https://github.com/bedrock-core';

export const sections: Section[] = [
  // Framework
  {
    id: 'server',
    label: 'server',
    pkg: '@bedrock-core/server',
    category: 'framework',
    status: 'beta',
    description: 'Registry, RPC, shared state and config across addon realms.',
    icon: 'server',
    repo: `${GH}/server`,
  },
  {
    id: 'db',
    label: 'db',
    pkg: '@bedrock-core/db',
    category: 'framework',
    status: 'beta',
    description: 'Persisted documents on dynamic properties.',
    icon: 'database',
    repo: `${GH}/server`,
  },
  {
    id: 'observable',
    label: 'observable',
    pkg: '@bedrock-core/observable',
    category: 'framework',
    status: 'beta',
    description: 'Reactive values: observable, computed, effect, batch.',
    icon: 'activity',
    repo: `${GH}/server`,
  },
  {
    id: 'sync',
    label: 'sync',
    pkg: '@bedrock-core/sync',
    category: 'framework',
    status: 'beta',
    description: 'The script-event transport: bus, discovery, RPC, replicated state.',
    icon: 'radio',
    repo: `${GH}/server`,
  },

  // UI
  {
    id: 'ui',
    label: 'ui',
    pkg: '@bedrock-core/ui',
    category: 'ui',
    status: 'beta',
    description: 'JSX screens, forms and containers.',
    icon: 'layout-panel-left',
    repo: `${GH}/ui`,
  },
  {
    id: 'ore-styled',
    label: 'ore-styled',
    pkg: '@bedrock-core/ore-styled',
    category: 'ui',
    status: 'beta',
    description: 'Themed components with vanilla Minecraft textures.',
    icon: 'palette',
    repo: `${GH}/ui`,
  },
  {
    id: 'navigation',
    label: 'navigation',
    pkg: '@bedrock-core/navigation',
    category: 'ui',
    status: 'beta',
    description: 'Stack navigation between screens.',
    icon: 'navigation',
    repo: `${GH}/ui`,
  },
  {
    id: 'flexbox',
    label: 'flexbox',
    pkg: '@bedrock-core/flexbox',
    category: 'ui',
    status: '1.0',
    description: 'The layout engine under every screen.',
    icon: 'layout-grid',
    repo: `${GH}/ui`,
  },
  // Content
  {
    id: 'config',
    label: 'config',
    pkg: '@bedrock-core/config',
    category: 'content',
    status: 'beta',
    description: 'The shared addon list, settings screens and guide viewer.',
    icon: 'sliders-horizontal',
    repo: `${GH}/ui`,
  },
  {
    id: 'guides',
    label: 'guides',
    pkg: '@bedrock-core/guides',
    category: 'content',
    status: 'beta',
    description: 'In-game guides authored in MDX.',
    icon: 'book-open',
    repo: `${GH}/ui`,
  },
  {
    id: 'i18n',
    label: 'i18n',
    pkg: '@bedrock-core/i18n',
    category: 'content',
    status: 'beta',
    description: 'Typed keys, interpolation and plurals, resolved per player.',
    icon: 'languages',
    repo: `${GH}/ui`,
  },

  // Tooling
  {
    id: 'filters',
    label: 'filters',
    pkg: 'bedrock-core/regolith-filters',
    category: 'tooling',
    status: 'beta',
    description: 'Regolith filters: manifest, generator, guides, i18n, ui-compiler, bundler.',
    icon: 'funnel',
    repo: `${GH}/regolith-filters`,
  },
  {
    id: 'cli',
    label: 'cli',
    pkg: '@bedrock-core/cli',
    category: 'tooling',
    status: 'beta',
    description: 'Scaffold an addon with the whole stack wired.',
    icon: 'terminal',
    repo: `${GH}/ui`,
  },
  {
    id: 'bds-runner',
    label: 'bds-runner',
    pkg: '@bedrock-core/bds-runner',
    category: 'tooling',
    status: 'beta',
    description: 'Run GameTests headlessly on a Bedrock Dedicated Server.',
    icon: 'flask-conical',
    repo: `${GH}/bds-runner`,
  },
];

/** Sections that have pages today. */
export const publishedSections = sections.filter((s) => s.status !== 'planned');

export function sectionsOf(category: CategoryId): Section[] {
  return sections.filter((s) => s.category === category);
}
