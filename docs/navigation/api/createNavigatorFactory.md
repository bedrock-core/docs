---
sidebar_position: 7
description: "Create custom navigator layouts using the shared stack or tab router."
---
# createNavigatorFactory

Create a navigator factory with a pure custom layout and shared routing behavior.

## Import

```ts
import { createNavigatorFactory } from '@bedrock-core/navigation/runtime';
```

## Signature

```ts
createNavigatorFactory(type: 'stack' | 'tab', layout?: NavigatorLayout): NavigatorFactory
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `type`<Req /> | `'stack' \| 'tab'` | — | Shared router and action helpers |
| `layout` | `NavigatorLayout` | — | Pure wrapper around a route's composed content |

The layout receives `route`, scoped `navigation`, and `children`. Its children contain the page and configured header or tab bar. Render `children` inside the wrapper.

## Returns

A statically configured factory with the same route, parameter and option inference as the selected built-in navigator. Its definitions nest normally and use the enclosing root's client budget.

## Usage

```tsx
import { Panel, Text } from '@bedrock-core/ui';
import { createStaticNavigation } from '@bedrock-core/navigation';
import { createNavigatorFactory } from '@bedrock-core/navigation/runtime';

export const createFramedNavigator = createNavigatorFactory('stack', ({ route, children }) => (
  <Panel width={'100%'} height={'100%'}>
    <Text maxLength={32}>{route.name}</Text>
    {children}
  </Panel>
));

const Framed = createFramedNavigator({ screens: { Home, Details } });
const Navigation = createStaticNavigation(Framed);
```

Keep all possible layout states visible to compilation. Layouts wrap their own navigator's descendants; nesting does not give an outer layout ownership of another navigator's chrome.

## Host extension entry point

The same `/runtime` entry point exports support for libraries that provide destination hosts:

| Export | Kind | Description |
| --- | --- | --- |
| `currentLocation(player)` | function | Read a copy of the current confirmed destination |
| `checkpoint(player, selection)` | function | Merge confirmed navigator state into the current destination |
| `setNavigator(driver)` | function | Install a destination resolver or restore the default with `undefined` |
| `openScreen(key, player, options?)` | function | Delegate a destination to the local compiled-screen resolver |
| `renderDestination(root, player, location, options?)` | function | Render a private model under its logical destination |

See [destination operations](../navigate.md#navigator-extensions) and [host openers](../realm.md#host-registration) for acceptance and asynchronous rendering contracts.

## Limits

The extension supports the existing stack and tab routers and action vocabulary. Arbitrary router algorithms are outside its contract. History mutation, wire snapshots and compiled-reference bookkeeping remain private.
