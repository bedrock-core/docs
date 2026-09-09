---
sidebar_position: 2
description: "Learn how to install @bedrock-core/ui for your Minecraft Bedrock addon project."
---
# Installation

Learn how to install `@bedrock-core/ui` for your Minecraft Bedrock addon project.

## Prerequisites

- Node.js 20+ and Yarn (or npm) https://nodejs.org/
- Regolith (recommended) https://regolith-docs.readthedocs.io/en/stable

## Quick start with the CLI

The [CLI](/docs/cli) scaffolds an addon with `@bedrock-core/ui` configured, TypeScript and ESLint, the Regolith build, the render pack and a working example screen.

<Exec cmd="@bedrock-core/cli" />

The render pack decodes the runtime's wire format, so it must come from the **same release** as the library. See [Render pack](./guides/render-pack.md) for how to check which version a world is running.

## Manual installation

If you're adding to an existing project, install the package:

<Install pkg="@bedrock-core/ui" />

Download the render pack from the [releases page](https://github.com/bedrock-core/ui/releases) — take it from the same release as the library, as [Render pack](./guides/render-pack.md#getting-the-matching-pack) explains — and add it as a dependency in your behavior pack's `manifest.json`:

```json
{
  "dependencies": [
    {
        "uuid": "761ecd37-ad1c-4a64-862a-d6cc38767426",
        "version": [1, 10, 0]
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

### Optional: ore-styled

[`@bedrock-core/ore-styled`](/docs/ore-styled) is a themed component layer that pairs with `@bedrock-core/ui` to give you vanilla-Minecraft-styled buttons, cards, checkboxes, and more. It's entirely optional — skip this section if you'd rather hand-style each primitive yourself.

If you installed `@bedrock-core/ui`, `ore-styled` is already included — no separate install needed. If you're on a minimal install (`@bedrock-core/ui-runtime` only), add it explicitly:

<Install pkg="@bedrock-core/ore-styled" />

Then import from `@bedrock-core/ore-styled` whenever you want a themed variant:

```tsx
import { Button, Card } from '@bedrock-core/ore-styled';
```

## TypeScript configuration

Add JSX support to your `tsconfig.json`:

```jsonc title="tsconfig.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@bedrock-core/ui"
  }
}
```

If you also run the i18n Regolith filter, it needs one more `paths` alias and an `include` entry so the generated bundle typechecks — see [tsconfig](/docs/filters/i18n#tsconfig).

## Quick test

Test your installation with a simple render:

```tsx
import { render, Panel, Screen, Text } from '@bedrock-core/ui';
import { world, Player, Entity, ButtonPushAfterEvent } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

const HelloWorld = (
  <Screen>
    <Panel padding={20}>
      <Text>{'Hello from @bedrock-core/ui!'}</Text>
    </Panel>
  </Screen>
);

const isPlayer = (source: Entity): source is Player => source.typeId === MinecraftEntityTypes.Player;

world.afterEvents.buttonPush.subscribe(({ source }: ButtonPushAfterEvent): void => {
  if (isPlayer(source)) {
    render(HelloWorld, source);
  }
});
```

## Next steps
- [Components](./components/components.md) — Built-in components that you can use in your JSX
- [ore-styled](/docs/ore-styled) — Themed component layer with vanilla Minecraft textures (optional)
- [Hooks](./hooks/hooks.md) — Add state and effects to your components
- [API](./api/api.md) — APIs that are useful for defining components
