---
sidebar_position: 4
description: "Every export of @bedrock-core/guides: the app, and the screens."
---

# API

Everything below is on the root export.

## The app

The field `core.register()` takes. Also on `@bedrock-core/guides/server`, for a bundle that wants the app alone.

| Export | Kind | Description |
| --- | --- | --- |
| `registerGuides(options?)` | function | The field `core.register()` takes: installs the command and the show method, announces the guide once the build's pages are in hand, and hands back a `Guides` |
| `GuidesOptions` | type | `{ commands?: boolean }` |
| `Guides` | type | `{ open(player, addonId?) }`, what the field hands back |
| `GuidesDeclaration` | type | What the field hands `register()`: the installer and `app: 'guide'` |
| `guidesOf(core)` | function | This realm's `Guides`, or `undefined` when this addon installed none |

## The screens

What the modules the guides stage generates call, and what your own code uses beside them.

| Export | Kind | Description |
| --- | --- | --- |
| `guideNavigationScreen(manifest, options?)` | function | The generated guide layout with shared page content and bounded local visited-page history |
| `GuideNavigationOptions` | type | Canvas, title, components and audience, plus `entry?: 'home' \| 'index' \| { page: string }`, `back?: boolean` and an optional `screenRoot` component |
| `openGuide(ns, player, options?)` | function | Navigate to a guide's entry by its namespace, from either realm: the operators' entry for an operator when the guide has one. `{ back: true }` opens the entry with a back control, which returns to the screen it was opened from |
| `GuideComponents` | type | `Record<string, FunctionComponent>`, what a `componentsModule` default-exports for `cmp` blocks |
| `GuideManifest` | type | Compiled localized page content and its navigation tree |

Each screen factory takes `audience: 'op'` to build the operators' set of a guide with [operator-only pages](./authoring.md#operator-only-pages); without it, it builds what everyone reads.

## Resident screen runtime

`screenRoot` defaults to `Screen`. Set it to `Experimental_OreUI` to use the same guide views and navigation graph on the [experimental Ore host](/docs/ui/guides/experimental-ore), with that host's client requirements.

`guideNavigationScreen` keeps reading inside one client form. Previous/Next replaces the current page; index rows and inline links add a visit. Revisiting a retained page removes the loop, including through pagination. The stack keeps up to five Back destinations and discards older visits. Page content mounts once, and category folding stays on the client. Compilation rejects a guide whose complete bounded history exceeds the native state budget.
```tsx
import { guideNavigationScreen } from '@bedrock-core/guides';
import manifest from './manifest.json';

export default guideNavigationScreen(manifest, { title: 'Guide', back: true });
```

`entry` selects the initial home, index or page. Audience-specific trees omit pages the reader cannot access. Header Back returns through linked page visits. The footer Index action returns to the guide index at the root. At the root, `back: true` returns to the caller or closes, while the default closes. Explicit server actions confirm the current bounded history; reading can continue locally after the action.

### Custom MDX navigation

Custom components use the standard navigation package. A declarative `Link` or intact `useLinkProps()` spread can be local. An ordinary button handler runs on the server after the active route is confirmed.

```tsx
import { Link, useNavigation } from '@bedrock-core/navigation';
import { Button, Panel, Text } from '@bedrock-core/ui';

export function HelpActions() {
  const navigation = useNavigation();

  return (
    <Panel>
      <Link action={{ type: 'NAVIGATE', payload: { name: 'page:details' } }}>
        <Text>{'Details'}</Text>
      </Link>
      <Button onPress={() => console.warn(navigation.getState())}>
        <Text>{'Inspect confirmed state'}</Text>
      </Button>
    </Panel>
  );
}
```

### Generated entries

The builder calls `guideNavigationScreen` for home, index and direct page entries. Each receives the MDX component registry and the complete filtered route tree. A confirmed navigator state takes precedence over the entry's initial page, including when returning through Core.

Translated inline links size their hitboxes to localized text. Build both the behavior and resource packs so runtime snapshots and installed layouts agree.
