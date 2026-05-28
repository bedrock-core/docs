---
sidebar_position: 2
---

# createStackNavigator

Create a typed stack navigator. This is the main setup step — call it once at module level, then use the returned `Navigator` and `Screen` components to build your navigation tree.

## Import

```ts
import { createStackNavigator } from '@bedrock-core/navigation';
```

## Signature

```ts
function createStackNavigator<TRoutes>(
  options: StackNavigatorOptions<TRoutes>,
): {
  Navigator: (props: { initialRouteName?: keyof TRoutes }) => JSX.Element;
  Screen: <K extends keyof TRoutes>(props: ScreenConfig<K>) => JSX.Element;
  routeNames: (keyof TRoutes)[];
  initialRouteName: keyof TRoutes;
}
```

## TRoutes — Typing Your Routes

The generic `TRoutes` parameter is the single source of truth for every route name and its expected params. Define it as a plain object type before calling `createStackNavigator`.

```ts
type Routes = {
  Home:    undefined;                    // no params
  Profile: { userId: string };           // required params
  Modal:   { message?: string };         // optional params
};

const Stack = createStackNavigator<Routes>({ ... });
```

TypeScript uses this map to:
- Enforce that `navigate('Profile', { userId: '…' })` includes the right shape
- Make params optional when the type is `T | undefined`
- Forbid params entirely when the type is `undefined`

## StackNavigatorOptions

### `screens`

- Type: `ScreensMap<TRoutes>`
- Description: Maps each route name to a screen component, optionally with `initialParams`.

Each entry can be either a bare component or an object:

```ts
const Stack = createStackNavigator<Routes>({
  screens: {
    // Bare component — no default params
    Home: HomeScreen,

    // Object form — provides initial/default params
    Profile: {
      screen: ProfileScreen,
      initialParams: { userId: 'guest' },
    },
  },
});
```

`initialParams` are shallow-merged as defaults — params passed via `navigate` or `push` take precedence.

### `initialRouteName`

- Type: `keyof TRoutes`
- Default: First key in the `screens` map
- Description: The route shown first when the navigator mounts.

```ts
const Stack = createStackNavigator<Routes>({
  screens: { Home: HomeScreen, Profile: ProfileScreen },
  initialRouteName: 'Profile', // start on Profile
});
```

## NavigationContainer

Every navigator must be wrapped in a `NavigationContainer`. It provides the navigation context consumed by [`useNavigation`](./useNavigation.md) and [`useRoute`](./useRoute.md).

```ts
import { NavigationContainer } from '@bedrock-core/navigation';
```

```tsx
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator />
    </NavigationContainer>
  );
}
```

`NavigationContainer` accepts an optional `initialState` prop for restoring a previously serialised navigation state (e.g. from persistent storage).

## Navigator Component

`Stack.Navigator` owns the stack state and renders the active screen. It re-renders the active screen whenever the stack changes.

```tsx
<Stack.Navigator />

// Override the initial screen at render time
<Stack.Navigator initialRouteName="Profile" />
```

## ScreenProps — Typing Screen Components

Use `ScreenProps<TRoutes, K>` to type the props of a screen component. It injects `navigation` (NavigationHelpers) and `route` (RouteObject) with the correct param types for that specific route.

```ts
import type { ScreenProps } from '@bedrock-core/navigation';

function ProfileScreen({ navigation, route }: ScreenProps<Routes, 'Profile'>) {
  // route.params is typed as { userId: string }
  // navigation.navigate is typed for all routes in Routes
  return <Text>{`User: ${route.params.userId}`}</Text>;
}
```

## Full Example

```tsx
import { render, Panel, Text, Button } from '@bedrock-core/ui';
import {
  NavigationContainer,
  createStackNavigator,
} from '@bedrock-core/navigation';
import type { ScreenProps } from '@bedrock-core/navigation';

type Routes = {
  Menu:   undefined;
  Game:   { difficulty: 'easy' | 'hard' };
  Result: { score: number };
};

const Stack = createStackNavigator<Routes>({
  screens: {
    Menu:   MenuScreen,
    Game:   { screen: GameScreen, initialParams: { difficulty: 'easy' } },
    Result: ResultScreen,
  },
  initialRouteName: 'Menu',
});

function MenuScreen({ navigation }: ScreenProps<Routes, 'Menu'>) {
  return (
    <Panel padding={12} gap={8}>
      <Text>{'Main Menu'}</Text>
      <Button onPress={() => navigation.navigate('Game', { difficulty: 'hard' })}>
        <Text>{'Play Hard'}</Text>
      </Button>
    </Panel>
  );
}

function GameScreen({ navigation, route }: ScreenProps<Routes, 'Game'>) {
  return (
    <Panel padding={12} gap={8}>
      <Text>{`Difficulty: ${route.params.difficulty}`}</Text>
      <Button onPress={() => navigation.navigate('Result', { score: 42 })}>
        <Text>{'Finish'}</Text>
      </Button>
    </Panel>
  );
}

function ResultScreen({ navigation, route }: ScreenProps<Routes, 'Result'>) {
  return (
    <Panel padding={12} gap={8}>
      <Text>{`Score: ${route.params.score}`}</Text>
      <Button onPress={() => navigation.reset({ routes: [{ name: 'Menu' }], index: 0 })}>
        <Text>{'Back to Menu'}</Text>
      </Button>
    </Panel>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator />
    </NavigationContainer>
  );
}
```

## Advanced — stackReducer

`stackReducer` is the underlying pure reducer that powers `Navigator`. It is exported for advanced use cases such as testing navigation logic in isolation or building a custom navigator.

```ts
import { stackReducer } from '@bedrock-core/navigation';
import type { StackAction } from '@bedrock-core/navigation';

const nextState = stackReducer(currentState, action, {
  routeNames: ['Home', 'Profile'],
  initialRouteName: 'Home',
});
```
