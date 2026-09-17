---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/ui writes Minecraft Bedrock screens in JSX and compiles them into the resource pack."
---
# ui

![The catalog, with a row per registered addon](/img/ui/addon-list.png)

`@bedrock-core/ui` writes Minecraft Bedrock screens in JSX and compiles them into the resource pack.

:::caution Beta
`@bedrock-core/ui` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## What is @bedrock-core/ui?

A screen is a component. You write it with JSX, flexbox props and hooks, and the build [compiles](./compiler/index.md) it once into the JSON UI that ships in the pack. At runtime nothing sends a layout: showing a screen sends its title and the values that changed, and the client draws it from the pack it already holds.

Three screens can be drawn on, and the root element picks one — [`<Screen>`](./components/Screen.md) is an action form, [`<Form>`](./components/Form.md) a native modal, [`<Container>`](./components/Container.md) a custom entity's or block's chest screen. One component set serves all three: a toggle is a native field on a modal and a pressed button on a screen of buttons, and it does not know which screen it is on. See [Hosts](./guides/hosts.md).

For a pre-themed component set matching vanilla Minecraft's look, see [`@bedrock-core/ore-styled`](/docs/ore-styled). It is optional — pick it up for batteries-included visuals, skip it to style every primitive yourself.

Localization is built in rather than bolted on: `<Text>` takes literal and localized children on the same channel, so one screen serves every language at once. See [i18n](/docs/i18n).

## Install

<Install pkg="@bedrock-core/ui" />

A world also needs the render pack, which must come from the same release as the library. [Installation](./installation.md) covers both, and the [CLI](/docs/cli) scaffolds them wired together.

## Your first screen

A screen lives in a `*.screen.tsx` file under `BP/scripts` and default-exports its component. That is what the [`ui-compiler` filter](/docs/filters/ui-compiler) looks for.

```tsx title="packs/BP/scripts/welcome.screen.tsx"
import { Button, Panel, Screen, Text } from '@bedrock-core/ui';

export default function Welcome(): JSX.Element {
  return (
    <Screen>
      <Panel padding={10} gap={8}>
        <Text>{'Welcome to Bedrock UI'}</Text>

        <Button onPress={() => console.warn('pressed')}>
          <Text>{'Press me'}</Text>
        </Button>
      </Panel>
    </Screen>
  );
}
```

Show it to a player with [`render()`](./api/render.md):

```ts title="packs/BP/scripts/main.ts"
import { render } from '@bedrock-core/ui';
import '@bedrock-core/generated/ui';
import Welcome from './welcome.screen';
import { world, type Entity, type Player, type ButtonPushAfterEvent } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

const isPlayer = (source: Entity): source is Player => source.typeId === MinecraftEntityTypes.Player;

world.afterEvents.buttonPush.subscribe(({ source }: ButtonPushAfterEvent): void => {
  if (isPlayer(source)) {
    render(Welcome, source);
  }
});
```

The `@bedrock-core/generated/ui` import is what runs the build's registrations. Without it `render()` throws `UncompiledScreenError`, because nothing in the pack answers to the screen's title.

## What you get

**A layout solved once** — [`@bedrock-core/flexbox`](/docs/flexbox) solves every rect at build time against a fixed 320 × 210 canvas. No geometry is measured in game, and a host that serves the screen cannot move a control the layout placed.

**Refusals with names** — each host declares what every kind of component becomes on it. A `<Slider>` outside a `<Form>` or a `<Slot>` outside a container screen fails the build, in that host's own words, instead of drawing something inert.

**Screens other addons can show** — a [static](./guides/navigation.md#static-screens) screen is described by its title, its entry values and one target per press. Publish that table and a realm running none of your script still shows your screens, because the layout is in the pack every client holds.

**Switches that cost nothing** — [`<Tabs>`](./components/Tabs.md) and [`<Disclosure>`](./components/Disclosure.md) change what is drawn entirely on the client. No press, no re-present, no payload.

## Differences from React

A `@minecraft/server-ui` form cannot be mutated while open, so a state change never repaints it: the player sees a new snapshot when they press. A container screen has no such limit.

A compiled screen's **shape** is also frozen. Anything that varies declares itself — `maxLength` for a string, `<List max>` for a row count, `visible` for a branch — and everything else is baked. [State](./guides/state.md) covers what that costs.

If you are new to React, [react.dev/learn](https://react.dev/learn) is the place to start.

## Next steps

- [Installation](./installation.md) — the package, the render pack and the `tsconfig.json` entries
- [Hosts](./guides/hosts.md) — the three screens and what each can carry
- [Components](./components/components.md) — every built-in component
- [Hooks](./hooks/hooks.md) — state, effects and the Minecraft-specific hooks
- [Compiler](./compiler/index.md) — how a screen becomes JSON UI
- [API](./api/api.md) — `render()`, contexts and the compiled-screen registry
