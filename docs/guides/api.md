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

What the modules the guides filter generates call, and what your own code uses beside them.

| Export | Kind | Description |
| --- | --- | --- |
| `guideHomeScreen(manifest, options?)` | function | Where the guide opens, as a compiled screen: its home page, or the index when it has none. `{ back: true }` compiles the entry a host opens, with a back control, as a second screen |
| `guideIndexScreen(manifest, options?)` | function | The index as a compiled screen: what every page's back and index button open |
| `guidePageScreen(manifest, pageId, options?)` | function | One page as a compiled screen |
| `openGuide(ns, player, options?)` | function | Navigate to a guide's entry by its namespace, from either realm: the operators' entry for an operator when the guide has one. `{ back: true }` opens the entry with a back control, which returns to the screen it was opened from |
| `GuideComponents` | type | `Record<string, FunctionComponent>`, what a `componentsModule` default-exports for `cmp` blocks |

Each screen factory takes `audience: 'op'` to build the operators' set of a guide with [operator-only pages](./authoring.md#operator-only-pages); without it, it builds what everyone reads.
