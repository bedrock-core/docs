---
sidebar_position: 1
---
# Overview

Get up and running with `@bedrock-core/ui` in minutes.


> ⚠️ Beta Status: Active development. Breaking changes may occur until 1.0.0. Pin exact versions for stability.
>
> This is not ready for production use.


## What is @bedrock-core/ui?

`@bedrock-core/ui` is a React-like UI framework for Minecraft Bedrock Edition that enables you to create rich, interactive user interfaces using JSX syntax. It serializes your UI components into a protocol and renders them using JSON UI with the companion Resource Pack.

## Learn React first

If you're new to React, we strongly recommend starting with the official React tutorial:

- React Learn: https://react.dev/learn

### Differences with React

In Minecraft Bedrock because we use @minecraft/server-ui form api we are not able to mutate the UI directly without closing and displaying a new form.

The multiple attempts we made with this resulted in poor player interaction as cursor/controller focus gets lost and there is a delay between form closing and new presentation.

So it was decided to keep the logic executing in the background and present to the player a snapshot of the UI, and only update it on player input.

**TLDR**: UI logic keeps running in background but we only update player presented ui when they press a button.

## Your First UI

Here's a simple example to get you started:

```tsx
import { render, Panel, Text, Button } from '@bedrock-core/ui';
import { world, Player, Entity, ButtonPushAfterEvent } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

// Create a simple UI component
function WelcomeScreen() {
  return (
    <Panel width={300} height={200}>
      <Text x={10} y={10} width={280} height={20} value={'Welcome to Bedrock UI!'} />

      <Button x={10} y={50} width={280} height={40}>
        <Text x={10} y={10} width={260} height={20} value={'Click Me'} />
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
3. **JSON UI Decoding**: Resource Pack companion JSON UI files decode the serialized data
4. **Rendering**: Players see rich, interactive UIs in Minecraft

## Next Steps

- [Installation](./installation.md) - Set up the framework in your project
- [Components](../components) - Built-in components that you can use in your JSX
- [Hooks](../hooks) - Add state and effects to your components
- [API](../api) - APIs that are useful for defining components
