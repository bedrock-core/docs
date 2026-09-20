import siteConfig from '@generated/docusaurus.config';
import type * as PrismNamespace from 'prismjs';

// Loads the extra Prism grammars named in themeConfig.prism.additionalLanguages
// and aliases `jsonc` (JSON with comments, used for Regolith and tsconfig
// snippets) to the json5 grammar, which tokenizes comments.
export default function prismIncludeLanguages(PrismObject: typeof PrismNamespace): void {
  const {
    themeConfig: { prism },
  } = siteConfig;
  const { additionalLanguages } = prism as { additionalLanguages: string[] };

  const PrismBefore = (globalThis as { Prism?: unknown }).Prism;
  (globalThis as { Prism?: unknown }).Prism = PrismObject;
  additionalLanguages.forEach((lang) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require(`prismjs/components/prism-${lang}`);
  });
  PrismObject.languages.jsonc = PrismObject.languages.json5;
  delete (globalThis as { Prism?: unknown }).Prism;
  if (typeof PrismBefore !== 'undefined') {
    (globalThis as { Prism?: unknown }).Prism = PrismObject;
  }
}
