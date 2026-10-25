---
sidebar_position: 7
description: "Connect the static route tree to Core discovery, host entry points and cross-addon transport."
---
# Core integration

`createCoreNavigationAdapter(core)` connects the normal static route tree to Core discovery and cross-addon transport.

## Import

```ts
import { createCoreNavigationAdapter, navigation } from '@bedrock-core/navigation/core';
```

## Root integration

Create the adapter after registering the Core runtime. Import generated UI registrations once during startup.

```tsx
const adapter = createCoreNavigationAdapter(core);
const RootStack = createStackNavigator({
  screens: {
    Home,
    Settings: 'shop:settings',
    Published: createScreenReference(),
  },
});
const Navigation = createStaticNavigation(RootStack, { adapter });
```

Local pages and published aliases use the same Link, hooks and player-scoped refs. For example, `navigation.navigate('Settings')` opens the alias; `navigation.navigate('Published', { screen: key, params })` opens a discovered key. Published transitions run on the server.

The adapter exposes read-only `screens.all(owner?)`, `screens.get(key)` and `screens.find(owner, name)`. Repeated adapter creation for one Core runtime shares the connection. Without the adapter, aliases resolve this bundle's compiled entries.

## Host registration

The advanced `navigation(core)` service publishes compiled descriptors and registers application-owned host entry points. Catalog, config and Guides use it for their private model loading. One service is stored per runtime.

```ts
interface ServerNavigation {
  readonly screens: ScreensRegistry;
  register(screen: ScreenDescriptor, open?: ScreenOpener): () => void;
}
type ScreenOpener = (
  player: Player, options: ScreenOpenOptions,
) => boolean | void | Promise<boolean | void>;
```

An opener's options contain public `params`, render debug settings and the complete destination `location`.

## Register a host entry point

This example uses a compiled `Settings` screen and the app's local `buildSettingsModel()` function:

```tsx title="settings-navigation.tsx"
import type { Runtime } from '@bedrock-core/server-runtime';
import { navigation } from '@bedrock-core/navigation/core';
import { render } from '@bedrock-core/ui';
import Settings from './settings.screen';
import { buildSettingsModel } from './settings-model';

export function registerSettings(core: Runtime): () => void {
  return navigation(core).register({
    key: `${core.id}:settings`,
    kind: 'custom',
    parameters: {
      section: { type: 'string', enum: ['general', 'audio'], optional: true },
    },
  }, (player, { params }) => {
    const section = params?.section === 'audio' ? 'audio' : 'general';
    const model = buildSettingsModel(player, section);

    render(<Settings model={model} />, player);

    return true;
  });
}
```

An opener receives validated public parameters and `ScreenOpenOptions.location`, including confirmed client selections. It rebuilds private models, checks player permissions and opens the appropriate host. Synchronous renders inherit the navigation driver's logical destination; a render after `await` uses [`renderDestination()`](#async-host-renders) to supply it explicitly. Runtime instances, players, callbacks and JSX do not travel as parameters.

Return `false` to reject the transition. `void` or `true` accepts it. A promise resolves when the opener has accepted or rejected the transition; it should not wait for the player to finish using the screen. The returned disposer removes this entry point and its opener; calling it again has no effect. Registering the same entry-point key twice on the service throws.

A logical entry can choose among several compiled action or modal screens. The navigation library keeps that logical destination while the selected physical host renders a private model.

`register(descriptor)` without an opener publishes metadata and uses the normal compiled-screen resolver when available. A `custom` destination needs an opener or a corresponding compiled screen to be usable. Registering a host does not compile its layout.

## Async host renders

`renderDestination(root, player, location, options?)` renders under a library-owned logical destination. Use it when an opener awaits private model loading before rendering. Its `options` are the renderer's optional debug settings; routing stays in `location`.

```tsx
import { renderDestination } from '@bedrock-core/navigation/runtime';
import type { ScreenOpenOptions } from '@bedrock-core/navigation/core';
import type { Player } from '@minecraft/server';
import Settings from './settings.screen';
import { loadSettingsModel } from './settings-model';

export async function openSettings(player: Player, options: ScreenOpenOptions): Promise<boolean> {
  const model = await loadSettingsModel(player, options.params);

  renderDestination(<Settings model={model} />, player, options.location, { debug: options.debug });

  return true;
}
```

Pass this opener to `navigation(core).register()`. Return after the destination accepts or rejects opening, without waiting for the player to close its form. Plain `render()` remains available for standalone screens and synchronous host renders.

## Cross-realm transitions

Static references can be shown locally from the client's installed pack. A dynamic destination is sent to its published owner through `core:navigation.open`. The request carries the destination and the complete navigation history, including parameters and confirmed page/tab context.

Back consumes that same destination history. When a previous screen belongs to another realm, the adapter resolves its registered owner and transfers the remaining snapshot to it. An empty history makes `back()` return `false`.

The receiving realm checks the request, finds the connected player, validates the target contract and invokes its opener. A rejection retains the source state. An accepted request retires the source render session without closing the destination form. An older response cannot retire a newer local navigation.

For example, after `shop:home` opens a guide and that guide opens another realm's settings, Back reopens the guide with its public parameters and confirmed page context. The next Back returns to `shop:home`. All three destinations belong to the same transferred history, even though their hosts can run in different realms.

Ownership comes from the publishing realm, not from the key's UI namespace. Ambiguous keys are rejected. Native block/entity screens are registered for discovery but need their real host or an explicitly registered opener.

## Restore confirmed client context

A static navigation root confirms the active local route and bounded history before an ordinary button handler or server link runs. Before a published handoff, it stores the logical tree in `location.navigatorStates`, keyed by the root navigator id.

Back returns to the source host with that checkpoint. The same root restores its confirmed stacks, selected tabs and nested state. Private component hook state belongs to the current render session and is rebuilt after returning from another host.

Generated Guides use the same static root and restore their logical route history from `location.navigatorStates`. The free `checkpoint()` function records state known to an advanced host; it does not poll native controls.

## Custom runtime resolvers

An independent host can install `setNavigator(resolver)` from `@bedrock-core/navigation/runtime`. The resolver receives `(key, player, options)` and returns `true`, `false` or a promise of those values. Acceptance records the destination; rejection restores the previous state. Delegate ordinary compiled screens to `openScreen(key, player, options)` from the same entry point. `setNavigator(undefined)` restores the local resolver.

Core installs its own resolver. The advanced `'handed-off'` result is for a resolver that has already transferred the full snapshot and released the source session, so the source runtime must not record the destination locally. Most registered host openers should use the boolean/void acceptance contract above.
