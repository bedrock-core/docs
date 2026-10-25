---
sidebar_position: 1
description: "Define a typed static stack with visited-route history and configurable headers."
---
# createStackNavigator

Define routes whose Back action retraces visited screens.

## Import

```ts
import { createStackNavigator, createStackScreen } from '@bedrock-core/navigation';
```

## Signature

```ts
createStackNavigator(config): StaticNavigator<'stack'>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `config`<Req /> | `StackNavigatorConfig` | — | Static screen map, groups and shared options |

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `screens` | Static screen map | — | Named page components, nested navigators or published destinations |
| `groups` | Static group map | — | Named groups containing screens and shared options |
| `id` | `string` | Containing route path or `'root'` | Stable navigator identity |
| `initialRouteName` | Route name | First route | Initially selected route |
| `screenOptions` | Options or callback | `{}` | Options shared by the stack's screens |
| `screenListeners` | Listener map | — | Listeners for server-confirmed route events |

At least one route is required across `screens` and `groups`. Names must be unique within this navigator. The configuration is static; runtime conditions use a screen or group's `if` predicate.

## Returns

A definition passed to [`createStaticNavigation`](./createStaticNavigation.md) or nested directly in another navigator's screen map. The factory does not open a form.

## Usage

```ts
const Shop = createStackNavigator({
  id: 'shop',
  initialRouteName: 'Products',
  screens: {
    Products,
    Details: createStackScreen({
      screen: Details,
      initialParams: { itemId: 'diamond' },
      options: ({ route }) => ({ title: route.params.itemId }),
    }),
  },
});
```

`createStackScreen(config)` preserves the screen component's parameter type in callbacks. Shorthand `Details` and `{ screen: Details }` are also accepted.

## Screen configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `screen`<Req /> | Component, navigator, published key or reference route | — | Route content or destination |
| `initialParams` | Partial route parameters | — | Default inputs and values available during compilation |
| `getId` | `({ params }) => string \| undefined` | — | Match route instances by a stable identity |
| `if` | `() => boolean` | Always available | Evaluate availability during server rendering |
| `options` | Options or callback | Shared options | Override this screen's appearance |
| `listeners` | Listener map or callback | — | Observe confirmed events for this screen |
| `navigationKey` | `string` | Route identity | Contribute a static route identity |
| `bedrock.navigation` | `'auto' \| 'server'` | `'auto'` | Require a server transition for this screen and its descendants |

Groups accept `screens`, `if`, `screenOptions` and `navigationKey`. Unavailable routes remain visible to compilation. See [nesting and availability](../guides/nesting.md).

## Headers

Options include `title`, `headerShown`, `headerTitle`, `headerBackVisible`, `header`, `headerLeft` and `headerRight`. Header renderers receive the current `route`, resolved `options`, an optional `back` descriptor, and a declarative `backAction`.

Keep header renderers pure. Use a `Link` with `backAction` for a Back control that can participate in local navigation. Runtime title changes must fit the compiled layout.

## Stack operations

The scoped [navigation hook](../hooks/useNavigation.md) exposes `push`, `replace`, `pop`, `popTo`, `popToTop` and `dismiss`. `push` creates a distinct visit; `pop` removes history entries, while `dismiss` removes complete screens including their parameter-history entries.

Back can remain local within the prepared context graph. A server checkpoint retains confirmed logical history and starts another local window.
