---
sidebar_position: 4
description: "Infer route names, parameters and nested targets from static navigator definitions."
---
# Type navigation

Infer route names and parameters from page props and the static navigator tree.

## Type page parameters

```tsx
import type { StaticScreenProps } from '@bedrock-core/navigation';

export function Details({ route }: StaticScreenProps<{ itemId: string }>): JSX.Element {
  return <Text maxLength={64}>{route.params.itemId}</Text>;
}

const RootStack = createStackNavigator({
  screens: {
    Home,
    Details: { screen: Details, initialParams: { itemId: 'diamond' } },
  },
});
```

`StaticScreenProps` supplies `route`; navigation operations come from a hook. `initialParams` gives the compiler a valid initial rendering. Reserve layout bounds for values that can change.

## Register the root type

```ts
type AppNavigator = typeof RootStack;
declare module '@bedrock-core/navigation' {
  interface RootNavigator extends AppNavigator {}
}
```

The type registration supplies default inference for `Link`, `useNavigation`, `useRoute` and action factories. Keep it in a module included by the project's TypeScript configuration. A separate component library can use explicitly typed props and action objects without registering an application's root.

```tsx
<Link screen={'Details'} params={{ itemId: 'diamond' }}>
  <Text>{'Diamond'}</Text>
</Link>
```

TypeScript checks the route name and required `itemId`. It also infers nested target parameters from navigator definitions.

## Read inferred types

`StaticParamList<typeof RootStack>` extracts the parameter list. `RouteProp<Params, Name>`, `StackNavigationProp<Params>` and `TopTabNavigationProp<Params>` describe explicitly typed values. `NavigatorScreenParams` describes a nested navigator target.

`createStackScreen()` and `createTopTabScreen()` retain a screen's parameter inference in `options`, `listeners` and `getId` callbacks. Use them when a separately declared screen configuration needs contextual callback types.

## Type published keys

Augment `PublishedScreens` when an application knows a published destination's public inputs:

```ts
declare module '@bedrock-core/navigation' {
  interface PublishedScreens {
    'shop:item': { itemId: string };
  }
}
```

A screen-map alias such as `Item: 'shop:item'` then carries those route parameters. Unknown published keys accept plain-data parameter objects.

## Runtime contracts

TypeScript types do not validate another addon's request. Independently compiled host entries export a [`parameters` contract](../references.md#declare-accepted-parameters) for runtime validation.

Route parameters must be finite, acyclic JSON data. Functions, players, runtime instances and JSX are private host data; rebuild them in the receiving host.

## Next steps

- [Build a navigator](./getting-started.md) — complete file and startup example
- [Nested navigators](./nesting.md) — scopes and nested target parameters
- [Screen registry](../references.md) — published metadata and validation
