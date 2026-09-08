import type { PrismTheme } from 'prism-react-renderer';

// Syntax palette on the ore accents (colors.css). Code blocks are dark in both
// site themes, so one palette serves both.
const stone = { text: '#d3d3d8', muted: '#8b8b93', faint: '#6a6a72', bright: '#e9e9ec' };
const ore = {
  emerald: '#7ce2a8',
  gold: '#ffd88a',
  goldDeep: '#f2a83b',
  amethyst: '#c6a6f2',
  lapis: '#6f97ef',
  redstone: '#f79ea1',
};

export const bedrockPrism: PrismTheme = {
  plain: { color: stone.text, backgroundColor: '#0e0e10' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: stone.faint, fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: stone.muted } },
    { types: ['operator', 'entity', 'url'], style: { color: stone.bright } },
    { types: ['keyword', 'atrule', 'important', 'rule'], style: { color: ore.amethyst } },
    { types: ['string', 'char', 'inserted', 'attr-value', 'template-string'], style: { color: ore.emerald } },
    { types: ['number', 'boolean', 'constant', 'symbol', 'regex'], style: { color: ore.gold } },
    { types: ['function', 'class-name', 'builtin', 'tag', 'maybe-class-name'], style: { color: ore.lapis } },
    { types: ['property', 'attr-name', 'selector', 'variable'], style: { color: ore.goldDeep } },
    { types: ['deleted'], style: { color: ore.redstone } },
    { types: ['bold'], style: { fontWeight: 'bold' } },
    { types: ['italic'], style: { fontStyle: 'italic' } },
  ],
};
