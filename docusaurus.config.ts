import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { existsSync } from 'node:fs';
import { categories, publishedSections, sectionsOf } from './src/data/sections';
import { redirects } from './src/data/redirects';
import { bedrockPrism } from './src/prism/bedrock';

// Sections that have a docs/<id> folder today. Planned sections stay in the
// registry (menus, home page) without an instance.
const liveSections = publishedSections.filter((section) => existsSync(`docs/${section.id}`));
const isLive = (id: string): boolean => liveSections.some((section) => section.id === id);

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '@bedrock-core',
  tagline: 'A framework for Minecraft Bedrock',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://bedrock-core.drav.dev',
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'bedrock-core',
  projectName: 'docs',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  markdown: {
    mdx1Compat: {
      admonitions: true,
    },
    // Warn (don't fail) on not-yet-added screenshots so docs can ship with
    // placeholder images that are dropped in later.
    hooks: {
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // One docs instance per section: docs/<id> served at /docs/<id> with its own sidebar.
  plugins: [
    'docusaurus-plugin-llms',
    ...liveSections.map((section) => [
      '@docusaurus/plugin-content-docs',
      {
        id: section.id,
        path: `docs/${section.id}`,
        routeBasePath: `docs/${section.id}`,
        sidebarPath: './sidebars.ts',
        editUrl: `https://github.com/bedrock-core/docs/edit/main/docs/${section.id}/`,
      },
    ]),
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: 'https://discord.gg/xq9JpJ3',
            from: ['/discord'],
          },
          ...redirects,
        ],
      },
    ],
    // Builds a search index at build time, so search works offline and on the
    // deployed site with no external service or credentials.
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: liveSections.map((section) => `docs/${section.id}`),
        // None of these sections are versioned; this only has to name a real
        // plugin id so the search bar's version lookup has one to fall back
        // on outside a docs route (the home page, the 404 page, /search).
        docsPluginIdForPreferredVersion: 'server',
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '@bedrock-core/',
      logo: {
        alt: '@bedrock-core logo',
        src: 'img/logo/icon.png',
      },
      items: [
        { type: 'custom-docsMenu', position: 'left', label: 'Docs' },
        { type: 'search', position: 'right' },
        { type: 'custom-iconLink', position: 'right', href: 'https://bedrock-core.drav.dev/discord', icon: 'discord', label: 'Discord' },
        { type: 'custom-iconLink', position: 'right', href: 'https://github.com/bedrock-core/', icon: 'github', label: 'GitHub' },
      ],
    },
    // Code blocks stay dark in both themes; one palette serves both.
    prism: {
      theme: bedrockPrism,
      darkTheme: bedrockPrism,
      additionalLanguages: ['json5'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
