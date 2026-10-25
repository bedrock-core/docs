---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "Static stacks and top tabs with bounded client navigation and optional Core transport."
---
# navigation

`@bedrock-core/navigation` provides static stack and top-tab navigators for compiled Minecraft forms. Pages, published screen aliases, links and hooks share one route tree. `@bedrock-core/ui/navigation` exposes the same API.

:::caution Beta
`@bedrock-core/navigation` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## What is navigation?

`createStackNavigator()` defines visited-page history. `createTopTabNavigator()` defines peer tabs above their content. `createStaticNavigation()` turns the complete nested definition into a component mounted inside a `Screen`.

`render()` opens that screen. Declarative links can select prepared pages locally; ordinary callbacks and imperative navigation run on the server. Server submissions automatically confirm the active page before invoking its handler.

## Install

<Install pkg="@bedrock-core/navigation" />

Builder registers compiled screens automatically. Enable your addon's generated resource pack and the [shared UI resource pack](/docs/ui/guides/render-pack) in the world.

## Define a route tree

```tsx
import { Panel, Screen, Text } from '@bedrock-core/ui';
import {
  Link, createStackNavigator, createStaticNavigation,
} from '@bedrock-core/navigation';

function Home() {
  return <Panel><Link screen={'Details'}><Text>{'Details'}</Text></Link></Panel>;
}
function Details() {
  return <Panel><Text>{'Details page'}</Text></Panel>;
}

const RootStack = createStackNavigator({ screens: { Home, Details } });
const Navigation = createStaticNavigation(RootStack);

export default function AppScreen() {
  return <Screen><Panel width={300} height={200}><Navigation /></Panel></Screen>;
}
```

Register the root for inferred hook and Link types:

```ts
type AppNavigator = typeof RootStack;
declare module '@bedrock-core/navigation' {
  interface RootNavigator extends AppNavigator {}
}
```

## Client and server navigation

| API | Execution |
| --- | --- |
| `<Link screen={'Details'} />` | Native client transition when finite and within budget |
| `useLinkProps({ screen: 'Details' })` | The same declarative transition when spread intact onto a button |
| `useNavigation().navigate('Details')` | Server transition using the confirmed logical state |
| A screen alias such as `Settings: 'shop:settings'` | Server handoff through the same navigation methods |
| `render(AppScreen, player)` | Opens an independent screen without requiring navigation |

The default local budget is five additional stack entries or tab visits and 128 native contexts across the entire nested tree. Sibling replacements retain the current history depth and are prepared before deeper link histories. Reaching a boundary submits a server action, preserves logical stack/tab state and starts another bounded local window. The budget limits local contexts, not registered route names. Page bodies are shared across matching route parameters.

Server reads describe the last confirmed state. Client-only visits do not invoke JavaScript, focus callbacks or state listeners. Screens that require those notifications use `bedrock: { navigation: 'server' }`.

## Core integration

Pass `createCoreNavigationAdapter(core)` to the root once. Local routes and published aliases continue using the same Link, hook and ref API. Core supplies discovery and transport to another addon's owning realm.

See [Core integration](./realm.md) for setup and host entry points.

## Next steps

- [Build a navigator](./guides/getting-started.md) — complete page, host and startup files
- [Client and server navigation](./guides/client-navigation.md) — the decision flow and shared budget
- [Stacks](./api/createStackNavigator.md) and [top tabs](./api/createTopTabNavigator.md) — static configuration
- [Link](./components/Link.md) and [useNavigation](./hooks/useNavigation.md) — route actions
- [Core integration](./realm.md) — published destinations and host entry points
