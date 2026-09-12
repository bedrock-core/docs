---
sidebar_position: 2
description: "Install @bedrock-core/ui, the render pack and the filter that compiles your screens."
---
# Installation

Three things have to be in place: the package, the render pack in the world, and the filter that compiles your screens into the pack.

## Prerequisites

- Node.js 20+ and Yarn or npm — https://nodejs.org
- Regolith — https://regolith-docs.readthedocs.io/en/stable

Regolith is not optional here. A screen is drawn from JSON UI the build writes, so a project with no build has no screens.

## Quick start with the CLI

The [CLI](/docs/cli) scaffolds an addon with `@bedrock-core/ui` configured, TypeScript and ESLint, the Regolith filter stack, the render pack and a working example screen.

<Exec cmd="@bedrock-core/cli" />

## Manual installation

### 1. The package

<Install pkg="@bedrock-core/ui" />

Everything an addon writes comes from the one entry point. Two subpaths carry the parts a screen file does not need:

| Import | What it is |
| --- | --- |
| `@bedrock-core/ui` | components, hooks, `render()`, navigation |
| `@bedrock-core/ui/container` | `createContainerScreen()`, for serving a [container screen](./guides/container-screens.md) |
| `@bedrock-core/ui-runtime/compile` | the build half the [compiler](./compiler/index.md) reads; no addon reaches for it |

### 2. The filter

Add the [`ui-compiler` filter](/docs/filters/ui-compiler) to the Regolith stack. It has to run **after** `i18n` and **before** `bundler`.

```json title="config.json"
{
  "filter": "ui-compiler",
  "settings": { "namespace": "my_addon" }
}
```

The [`core` filter](/docs/filters/core) runs the whole stack in the right order with the namespace declared once, which is what the CLI scaffolds.

The filter writes `@bedrock-core/generated/ui`. Import it once from your entry module so the registrations run:

```ts title="packs/BP/scripts/main.ts"
import '@bedrock-core/generated/ui';
```

### 3. The render pack

The render pack decodes what the build wrote, so it must come from the **same release** as the library. Download it from the [releases page](https://github.com/bedrock-core/ui/releases) and add it as a dependency in your behavior pack's `manifest.json`:

```json title="packs/BP/manifest.json"
{
  "dependencies": [
    {
      "uuid": "761ecd37-ad1c-4a64-862a-d6cc38767426",
      "version": [1, 11, 0]
    }
  ]
}
```

Include the resource pack in your `.mcaddon`:

```txt
pack.mcaddon
├── RP/                     (your addon's resource pack)
├── BP/                     (your addon's behavior pack)
└── core-ui-vx.y.z.mcpack   (render pack from releases)
```

[Render pack](./guides/render-pack.md#getting-the-matching-pack) explains how to check which version a world is running.

## TypeScript configuration

```jsonc title="tsconfig.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@bedrock-core/ui"
  }
}
```

If you also run the i18n filter, it needs one more `paths` alias and an `include` entry so the generated bundle typechecks — see [tsconfig](/docs/filters/i18n#tsconfig).

## Optional: ore-styled

[`@bedrock-core/ore-styled`](/docs/ore-styled) is a themed component layer giving you vanilla-styled buttons, cards, checkboxes and more. Installing `@bedrock-core/ui` already includes it; on a minimal install add it explicitly:

<Install pkg="@bedrock-core/ore-styled" />

```tsx
import { Button, Card } from '@bedrock-core/ore-styled';
```

## Check it works

Write a screen, build, then show it.

```tsx title="packs/BP/scripts/hello.screen.tsx"
import { Panel, Screen, Text } from '@bedrock-core/ui';

export default function Hello(): JSX.Element {
  return (
    <Screen>
      <Panel padding={20}>
        <Text>{'Hello from @bedrock-core/ui'}</Text>
      </Panel>
    </Screen>
  );
}
```

<Exec cmd="regolith run" />

The filter logs one line per screen it compiled. If `render()` throws `UncompiledScreenError` instead, the build did not see the file or `@bedrock-core/generated/ui` was never imported.

## Next steps

- [Hosts](./guides/hosts.md) — which root to write, and what each screen can carry
- [Components](./components/components.md) — every built-in component
- [Hooks](./hooks/hooks.md) — state and effects
- [`ui-compiler` filter](/docs/filters/ui-compiler) — every setting the build takes
