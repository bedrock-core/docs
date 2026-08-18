---
sidebar_position: 1
---
# Overview

Get up and running with `@bedrock-core/ui` in minutes.


:::caution Pre-1.0
`@bedrock-core/ui` is under active development. Breaking changes can still land until `1.0.0` — pin exact versions and read the release notes before upgrading.
:::


## What is @bedrock-core/ui?

`@bedrock-core/ui` is a React-like UI framework for Minecraft Bedrock Edition that enables you to create rich, interactive user interfaces using JSX syntax. It serializes your UI components into a protocol and renders them using JSON UI with the render pack.

For a pre-themed component set that matches vanilla Minecraft's look (buttons, cards, checkboxes, toggles, …), see the [`@bedrock-core/ore-styled`](../ore-styled/ore-styled.md) layer. It's optional — pick it up when you want batteries-included visuals, skip it when you'd rather style every primitive yourself.

Localization is built in rather than bolted on: `<Text>` takes literal and localized children on the same channel, so one screen serves every language at once. See [i18n](../i18n/i18n.md) for the translation verbs and how player locale is resolved.

## Learn React first

If you're new to React, we strongly recommend starting with the official React tutorial:

- React Learn: https://react.dev/learn

### Differences with React

`@minecraft/server-ui` forms cannot be mutated while open — updating one means closing it and presenting a new form, which loses cursor/controller focus.

So your component logic keeps running in the background, but the player only sees a new snapshot of the UI **when they press a button**. A state change on its own does not repaint their screen.

## Your First UI

Here's a simple example to get you started:

```tsx
import { render, Panel, Text, Button } from '@bedrock-core/ui';
import { world, Player, Entity, ButtonPushAfterEvent } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

// Create a simple UI component
function WelcomeScreen() {
  return (
    <Panel padding={10} gap={8}>
      <Text>{'Welcome to Bedrock UI!'}</Text>

      <Button onPress={() => console.log('clicked')}>
        <Text>{'Click Me'}</Text>
      </Button>
    </Panel>
  );
}

const isPlayer = (source: Entity): source is Player => source.typeId === MinecraftEntityTypes.Player;

// Render it to a player
world.afterEvents.buttonPush.subscribe(({ source }: ButtonPushAfterEvent): void => {
  if (isPlayer(source)) {
    render(WelcomeScreen, source);
  }
});
```

## How It Works

1. **Write JSX Components**: Use familiar React-like syntax to define your UI
2. **Serialization**: The framework converts your component tree into a serialized protocol and injects it into @minecraft/server-ui form components
3. **JSON UI Decoding**: The render pack's JSON UI files decode the serialized data
4. **Rendering**: Players see rich, interactive UIs in Minecraft

## Next Steps

- [Installation](./installation.md) - Set up the framework in your project
- [Components](../ui-runtime/components) - Built-in components that you can use in your JSX
- [ore-styled](../ore-styled) - Themed component layer with vanilla Minecraft textures (optional)
- [Hooks](../ui-runtime/hooks) - Add state and effects to your components
- [API](../ui-runtime/api) - APIs that are useful for defining components
- [i18n](../i18n/i18n.md) - Localize your UI so each player reads it in their own language
