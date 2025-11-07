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
import { render, Panel, Text } from '@bedrock-core/ui';
import { world, Player, Entity, ButtonPushAfterEvent } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

const HelloWorld = (
  <Panel width={300} height={200} x={50} y={50}>
    <Text 
      width={250}
      height={30}
      x={25}
      y={25}
      value="Hello from @bedrock-core/ui!"
    />
  </Panel>
);

const isPlayer = (source: Entity): source is Player => source.typeId === MinecraftEntityTypes.Player;

world.afterEvents.buttonPush.subscribe(({ source }: ButtonPushAfterEvent): void => {
  if (isPlayer(source)) {
    render(HelloWorld, source);
  }
});
```

## Next Steps
- [Components](../components) - Built-in components that you can use in your JSX
- [Hooks](../hooks) - Add state and effects to your components
- [API](../api) - APIs that are useful for defining components

