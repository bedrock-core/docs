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
| `root`<Req /> | `FunctionComponent \| JSX.Element` | — | The screen: a component or element whose root is [`<Screen>`](../components/Screen.md) or [`<Form>`](../components/Form.md) |
| `player`<Req /> | `Player` | — | Who sees it |
| `options` | `RenderOptions` | `{}` | See below |

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `debug` | `boolean` | `false` | Diff every present against the snapshot the build recorded and warn on drift |

## Returns

`void`

## The screen has to be compiled

The [`ui-compiler` stage](/docs/builder/guides/stages#ui-compilation) compiles the screen's layout and automatically loads its runtime registration from the built script entry. It discovers `*.screen.tsx` files under a behavior pack's `scripts` directory and screens supplied by app declarations.

If the running behavior pack has no registration for the screen, `render()` throws [`UncompiledScreenError`](./errors.md#uncompiledscreenerror).

A [`<Container>`](../components/Container.md) is refused too, with `ContainerScreenError`: a container screen belongs to an entity or a block and is served by `createContainerScreen` instead.

## debug

Probing at build cannot see a threshold no probe crossed. `debug` is where such a miss becomes loud instead of silent: every present is diffed against what the build recorded, and a baked prop that changed, a shape that does not match, or a live string past its reservation is warned about.

```ts
render(Screen, player, { debug: true });
```

Leave it off in a shipped build — the diff runs on every present.

## Usage

```ts
import { render } from '@bedrock-core/ui';
import Welcome from './welcome.screen';

export function openWelcome(player: Player): void {
  render(Welcome, player);
}
```

## Scrolls

Content renders into a single full-screen **root scroll** by default, which scrolls when it overflows. For independent scroll regions compose [`<Scroll>`](../components/Scroll.md); a form supports two of them beside the root.

## Notes

Each player has one live UI session, and a second `render()` swaps the new tree into it rather than stacking a second one. [State](../guides/state.md#one-ui-slot-per-player) covers what that does to the old tree's hooks and effects, and how to make an async handoff flash-free.

To open a screen by key rather than by component — including another addon's — use [`navigate()`](/docs/navigation/guides/getting-started) instead.

## Observe render sessions

[`refreshRender(player)`](#refresh-an-open-form) explicitly re-presents an open form. Session observers describe host lifecycle rather than individual presentations.

`observeRenderLifecycle(listener, { replay? })` subscribes to server-side render session facts and returns an idempotent disposer. Set `replay: true` to receive `started` notifications for sessions that are already active.

```ts
import { observeRenderLifecycle } from '@bedrock-core/ui';

const stop = observeRenderLifecycle(event => {
  if (event.type === 'ended') {
    console.warn(`Session ${event.session.id} ended: ${event.reason}`);
  }
}, { replay: true });

stop();
```

| Event | Data |
| --- | --- |
| `started` | The new `session` |
| `replaced` | The new `session` and `previous` session |
| `ended` | The ended `session` and a `reason`: `dismissed`, `closed`, `released` or `error` |

Each session includes its `id`, `ownerId`, `ownerKind` and any compiled `screenKey` and `title`. Session IDs distinguish successive renders for the same owner. `renderSession(ownerId)` reads the current session facts.

State updates and local JSON UI page selections do not emit lifecycle transitions. A server-side session start does not acknowledge that the native client has painted the screen. Listener errors are reported without interrupting rendering.

Navigation subscribes to these events to maintain its own destination state. The renderer does not push, pop or clear a navigation stack.

## End a render session

`endRender(player, options?)` releases the player's render tree and session. It closes native forms by default and emits an `ended` notification when a session exists.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `close` | `boolean` | `true` | Also close the player's native forms |
| `reason` | `RenderEndReason` | `'closed'` | Reason reported to render lifecycle observers |

An adapter can use `endRender(player, { close: false, reason: 'released' })` when another host accepts a handoff and owns the form that remains open.

## Refresh an open form

`refreshRender(player)` closes and re-presents the current form with its existing component fibers. Use it when an external server event must become visible before the player submits another response.

```ts
import { refreshRender } from '@bedrock-core/ui';
import type { Player } from '@minecraft/server';

export function refreshPlayerMenu(player: Player): void {
  refreshRender(player);
}
```

It does nothing when the player has no active render chain. The refresh retains hook state and does not treat its programmatic close as a player cancellation. A queued refresh cannot close a replacement session.
