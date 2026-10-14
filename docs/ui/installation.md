---
sidebar_position: 2
description: "Install @bedrock-core/ui, the render pack and the stage that compiles your screens."
---
# Installation

Three things have to be in place: the package, the render pack in the world, and the stage that compiles your screens into the pack.

## Prerequisites

- Node.js 22.18+ and Git — [https://nodejs.org/](https://nodejs.org/)
- [builder](/docs/builder) — pack compilation and exports

Screens require the JSON UI and runtime registrations produced by the build.

## Quick start with the CLI

The [CLI](/docs/cli) scaffolds an addon with `@bedrock-core/ui` configured, TypeScript and ESLint, builder profiles, the render pack and a working example screen.

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

### 2. The builder

Install the build tool:

<Install pkg="@bedrock-core/builder@next" dev />

Configure project metadata, packs and destinations as described in [builder configuration](/docs/builder/guides/configuration). The `ui-compiler` stage discovers screens automatically and runs after translations and before bundling. It uses the project's installed UI compiler and runtime toolkit.

In a project with several packs, select the owner and its linked resource pack in the profile's `stages` map:

```json title="bedrockCore.profiles.default.stages"
{
  "ui-compiler": { "owner": "gameplay", "resourcePack": "assets" }
}
```

The owner's manifest must declare the resource pack as a local dependency. [UI stage settings](/docs/builder/guides/stages#ui-compilation) describe discovery and output.

The stage registers `@bedrock-core/generated/ui`. Import it from the script entry to install compiled screen registrations:

```ts title="packs/BP/scripts/main.ts"
import '@bedrock-core/generated/ui';
```

### 3. The render pack

The shared resource pack supplies the textures used by compiled screens. Use the asset pack supplied with the library release. Download it from the [releases page](https://github.com/bedrock-core/ui/releases) and add it as a dependency in your behavior pack's `manifest.json`:

```json title="packs/BP/manifest.json"
{
  "dependencies": [
    {
      "uuid": "761ecd37-ad1c-4a64-862a-d6cc38767426",
      "version": "1.12.1"
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

[Shared resource pack](./guides/render-pack.md#install-the-assets) explains how pack versions track UI releases.

## TypeScript configuration

```jsonc title="tsconfig.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@bedrock-core/ui"
  }
}
```

Run a first build to write editor declarations, then include `.bedrock-core/generated/**/*.d.ts` alongside authored sources in tsconfig. Generated runtime imports resolve automatically during [script bundling](/docs/builder/guides/stages#script-bundling).

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

```bash
npx bc-builder build config.json
```

Run the build before launching Minecraft. If `render()` throws `UncompiledScreenError` instead, the build did not see the file or `@bedrock-core/generated/ui` was never imported.

## Next steps

- [Hosts](./guides/hosts.md) — which root to write, and what each screen can carry
- [Components](./components/components.md) — every built-in component
- [Hooks](./hooks/hooks.md) — state and effects
- [`ui-compiler` stage](/docs/builder/guides/stages#ui-compilation) — every setting the build takes
