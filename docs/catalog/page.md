---
sidebar_position: 2
description: "What the default addon page shows and how to replace it with a custom layout."
---

# Addon page

The addon page fills the area beside the Catalog's addon list.

## The default page

Installing `registerCatalog()` generates a page from the addon metadata passed to `core.register({ manifest })`. It shows:

- The addon's name, version and icon, with an optional thumbnail banner.
- Its description and author name.
- Config and Guide buttons, enabled when that addon registers the corresponding entry point.

Edit `packName`, `version`, `icon`, `thumbnail`, `description` and `creatorName` to update the content. When `creatorName` is omitted, the page displays `creator`.

## Replace the page

![Custom Economy addon page](/img/catalog/custom-addon-page.png)

Keep the Catalog browser and supply a module containing your own `addon_page`:

1. Create `catalog-pages.tsx` beside `config.json`:

```tsx title="catalog-pages.tsx"
import { Screen, Embed, Panel, Text, type JSX } from '@bedrock-core/ui';
import { Button, FRAME } from '@bedrock-core/ore-styled';
import screens from '@bedrock-core/catalog/compiled';
import { CATALOG_PAGE_AREA, pageTargeted, registerCatalogPage } from '@bedrock-core/catalog/integration';

const Page = (): JSX.Element => (
  <Screen>
    <Embed frame={FRAME} area={CATALOG_PAGE_AREA}>
      <Panel flexDirection={'column'} gap={8} padding={8}>
        <Text>{'Welcome to my addon'}</Text>
        <Button onPress={pageTargeted('config')}>{'Settings'}</Button>
      </Panel>
    </Embed>
  </Screen>
);

export default { ...screens, addon_page: Page };
export function shape(): Record<string, never> {
  registerCatalogPage(Page);
  return {};
}
```

The imported `screens` keep the browser and framework pages. `addon_page` supplies your replacement; `shape()` publishes it. Use `CATALOG_PAGE_AREA` for the `Embed` area: it follows the host layout, while Catalog provides the outer frame and sidebar. Page buttons use `pageTargeted()` to open registered entry points such as `config` or `guide`.

2. Point the Catalog declaration at that module in your existing registration. Keep your manifest and other app declarations:

```ts title="Behavior pack script entry"
import { core } from '@bedrock-core/server';
import { registerCatalog } from '@bedrock-core/catalog';

core.register({
  manifest,
  catalog: {
    ...registerCatalog(),
    compiled: './catalog-pages.tsx',
  },
});
```

The `compiled` path is relative to `config.json`. The module is discovered through this declaration, so keep its `.tsx` filename as shown.

3. Run your normal build and deploy both the behavior and resource packs.

## Next steps

- [API](./api.md) — page publishing functions and types
- [Embed](/docs/ui/components/Embed) — the embedded page and host contract
