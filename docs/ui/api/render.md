---
sidebar_position: 2
description: "Show a compiled screen to one player and keep it shown across its state changes."
---
# render

Shows a screen to one player and keeps it shown across its state changes.

## Import

```tsx
import { render } from '@bedrock-core/ui';
```

## Signature

```ts
function render(root: JSX.Element | FunctionComponent, player: Player, options?: RenderOptions): void
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `root`<Req /> | `FunctionComponent \| JSX.Element` | — | The screen: a component or element whose root is [`<Screen>`](../components/Screen.md) or [`<Form>`](../components/Form/Form.md) |
| `player`<Req /> | `Player` | — | Who sees it |
| `options` | `RenderOptions` | `{}` | See below |

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `debug` | `boolean` | `false` | Diff every present against the snapshot the build recorded and warn on drift |

## Returns

`void`

## The screen has to be compiled

A screen is drawn from its layout in the pack, picked by the title the build registered it under. Without that there is nothing to show, so `render()` throws [`UncompiledScreenError`](./errors.md#uncompiledscreenerror) naming the two things that produce a registration:

- the [`ui-compiler` filter](/docs/filters/ui-compiler) seeing the screen — a `*.screen.tsx` under `BP/scripts`, or one of the screens a build compiles from what the addon declared
- `@bedrock-core/generated/ui` being imported once so the build's registrations run

A [`<Container>`](../components/Container.md) is refused too, with `ContainerScreenError`: a container screen belongs to an entity and is served by `createContainerScreen` instead.

## debug

Probing at build cannot see a threshold no probe crossed. `debug` is where such a miss becomes loud instead of silent: every present is diffed against what the build recorded, and a baked prop that changed, a shape that does not match, or a live string past its reservation is warned about.

```ts
render(Screen, player, { debug: true });
```

Leave it off in a shipped build — the diff runs on every present.

## Usage

```ts
import { render } from '@bedrock-core/ui';
import '@bedrock-core/generated/ui';
import Welcome from './welcome.screen';

export function openWelcome(player: Player): void {
  render(Welcome, player);
}
```

## Scrolls

Content renders into a single full-screen **root scroll** by default, which scrolls when it overflows. For independent scroll regions compose [`<Scroll>`](../components/Scroll.md); a form supports two of them beside the root.

## Notes

Each player has one live UI session, and a second `render()` swaps the new tree into it rather than stacking a second one. [State](../guides/state.md#one-ui-slot-per-player) covers what that does to the old tree's hooks and effects, and how to make an async handoff flash-free.

To open a screen by key rather than by component — including another addon's — use [`navigate()`](../guides/navigation.md) instead.
