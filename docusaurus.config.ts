import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'server',
        path: 'docs/server',
        routeBasePath: 'docs/server',
        sidebarPath: './sidebars.ts',
        editUrl: ({ docPath }) => {
          return `https://github.com/bedrock-core/server/docs/${docPath}`;
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ui',
        path: 'docs/ui',
        routeBasePath: 'docs/ui',
        sidebarPath: './sidebars.ts',
        editUrl: ({ docPath }) => {
          return `https://github.com/bedrock-core/ui/docs/${docPath}`;
        },
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
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'serverSidebar',
          docsPluginId: 'server',
          position: 'left',
          label: 'server',
        },
        {
          type: 'docSidebar',
          sidebarId: 'uiSidebar',
          docsPluginId: 'ui',
          position: 'left',
          label: 'ui',
        },
        {
          label: 'Discord',
          href: 'https://bedrocktweaks.net/discord',
          position: 'right',
        },
        {
          href: 'https://github.com/bedrock-core/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} @bedrock-core. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
