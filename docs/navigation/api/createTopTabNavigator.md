---
sidebar_position: 2
description: "Define Minecraft-style top tabs with independent nested state and configurable Back behavior."
---
# createTopTabNavigator

Define peer routes with a tab bar above their content.

## Import

```ts
import { createTopTabNavigator, createTopTabScreen } from '@bedrock-core/navigation';
```

## Signature

```ts
createTopTabNavigator(config): StaticNavigator<'tab'>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `config`<Req /> | `TopTabNavigatorConfig` | — | Static tabs, shared options and Back policy |

The `screens`, `groups`, `id`, `initialRouteName`, `screenOptions` and `screenListeners` fields follow [static screen configuration](./createStackNavigator.md#screen-configuration).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `backBehavior` | Tab Back policy | `'firstRoute'` | Select a tab or bubble Back to the parent |
| `tabBar` | `(props: TopTabBarProps) => JSX.Element` | Built-in top bar | Render a pure custom tab bar |

## Returns

A definition passed to [`createStaticNavigation`](./createStaticNavigation.md) or nested as another navigator's screen.

## Usage

```ts
const Tabs = createTopTabNavigator({
  initialRouteName: 'Shop',
  backBehavior: 'history',
  screens: {
    Shop: ShopStack,
    Account: createTopTabScreen({
      screen: Account,
      options: { tabBarLabel: 'Account', tabBarBadge: 2 },
    }),
  },
});
```

`createTopTabScreen(config)` preserves callback parameter inference. A tab containing a stack retains that stack when another tab is selected.

## Back behavior

| Value | Behavior |
| --- | --- |
| `'firstRoute'` | Select the first declared tab |
| `'initialRoute'` | Select `initialRouteName` |
| `'order'` | Select the preceding tab in declaration order |
| `'history'` | Return through visited tabs, keeping one history entry per tab |
| `'fullHistory'` | Return through visits including repeated tab selections |
| `'none'` | Let the parent or root handle Back |

When the tab policy has no previous target, Back bubbles to its parent. The root then applies its configured caller-or-close policy.

## Tab appearance

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `tabBarLabel` | `DisplayText` | Title or route name | Caption in the tab bar |
| `tabBarShowLabel` | `boolean` | `true` | Show the caption |
| `tabBarIcon` | `({ focused, size }) => JSX.Element` | — | Pure icon renderer for compiled focus variants |
| `tabBarBadge` | `string \| number` | — | Badge beside the tab caption |

Common header options are also accepted. A custom `tabBar` receives `state`, `descriptors`, scoped `navigation`, and a declarative `actions` map keyed by route name. Pass an action to `Link` to keep native tab selection available.

## Notes

Tab selection can run on the client; it does not call icon renderers or other JavaScript while the form is open. See [client navigation](../guides/client-navigation.md) for compilation and server boundaries.

The scoped hook adds `jumpTo(name, params?)`. Preventable `tabPress` listeners require explicit server navigation. Native tab controls do not expose a long-press gesture.
