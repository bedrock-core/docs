---
sidebar_position: 2
---
# Installation

Learn how to install `@bedrock-core/ui` for your Minecraft Bedrock addon project.

## Prerequisites

- Node.js 20+ and Yarn (or npm) https://nodejs.org/
- Regolith (recommended) https://regolith-docs.readthedocs.io/en/stable

## Quick Start with CLI (Recommended)

The fastest way to get started is using our CLI tool to scaffold a complete project:

```bash
npx @bedrock-core/cli
```

This will create a new addon with:

- ✅ `@bedrock-core/ui` pre-configured
- ✅ TypeScript and ESLint setup
- ✅ Regolith build configuration
- ✅ Companion resource pack included
- ✅ Working example to get started

After generation:

```bash
cd your-addon-name
yarn install          # or npm install
yarn regolith-install # Install Regolith filters
yarn build            # Build the addon
yarn watch            # Watch for changes and redeploy
```

Install companion resource pack:

```txt
Open the core-ui-v*.mcpack to add it to your game
```


## Manual Installation

If you're adding to an existing project, install the package:

```bash
yarn add @bedrock-core/ui
```

Download the companion resource pack from the [releases page](https://github.com/bedrock-core/ui/releases) and add it as a dependency in your behavior pack's `manifest.json`:

```json
{
  "dependencies": [
    {
        "uuid": "761ecd37-ad1c-4a64-862a-d6cc38767426",
        "version": [x, y, z]
    }
  ]
}
```

Include the resource pack in your `.mcaddon`:

```txt
pack.mcaddon
├── RP/                     (your addon's resource pack)
├── BP/                     (your addon's behavior pack)
└── core-ui-vx.y.z.mcpack   (companion resource pack from releases)
```

### Optional: ore-styled

[`@bedrock-core/ore-styled`](../ore-styled/ore-styled.md) is a themed component layer that pairs with `@bedrock-core/ui` to give you vanilla-Minecraft-styled buttons, cards, checkboxes, and more. It's entirely optional — skip this section if you'd rather hand-style each primitive yourself.

If you installed `@bedrock-core/ui`, `ore-styled` is already included — no separate install needed. If you're on a minimal install (`@bedrock-core/ui-runtime` only), add it explicitly:

```bash
yarn add @bedrock-core/ore-styled
```

Then import from `@bedrock-core/ore-styled` whenever you want a themed variant:

```tsx
import { Button, Card } from '@bedrock-core/ore-styled';
```

## TypeScript Configuration

Add JSX support to your `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@bedrock-core/ui"
  }
}
```

## Quick Test

Test your installation with a simple render:

```tsx
import { render, Screen, Panel, Text } from '@bedrock-core/ui';
import { world, Player, Entity, ButtonPushAfterEvent } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

const HelloWorld = (
  <Panel padding={20}>
    <Text>{'Hello from @bedrock-core/ui!'}</Text>
  </Panel>
);

const isPlayer = (source: Entity): source is Player => source.typeId === MinecraftEntityTypes.Player;

world.afterEvents.buttonPush.subscribe(({ source }: ButtonPushAfterEvent): void => {
  if (isPlayer(source)) {
    render(HelloWorld, source, Screen.Scroll);
  }
});
```

## Next Steps
- [Components](../ui-runtime/components/components.md) - Built-in components that you can use in your JSX
- [ore-styled](../ore-styled/ore-styled.md) - Themed component layer with vanilla Minecraft textures (optional)
- [Hooks](../ui-runtime/hooks/hooks.md) - Add state and effects to your components
- [API](../ui-runtime/api/api.md) - APIs that are useful for defining components
