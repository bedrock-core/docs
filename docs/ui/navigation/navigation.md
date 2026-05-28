---
sidebar_position: 1
---

# navigation

`@bedrock-core/navigation` is a stack-based navigation system for Minecraft Bedrock UI, inspired by React Navigation and adapted for `@bedrock-core/ui`'s single-render-per-player model.

:::caution MVP scope
This package covers stack navigation only. There is no support for animations, tab navigators, nested navigators, or deep linking in the current release.
:::

## Install

```bash
npm install @bedrock-core/navigation
```

## Quick Start

The example below wires up a two-screen stack: a `Home` screen that navigates to a `Details` screen and back.

```tsx
import { render } from '@bedrock-core/ui';
import {
  NavigationContainer,
  createStackNavigator,
} from '@bedrock-core/navigation';
import { world } from '@minecraft/server';

// 1. Define your route map — key = route name, value = params type
type Routes = {
  Home:    undefined;
  Details: { id: number; title: string };
};

// 2. Create the navigator once, outside any component
const Stack = createStackNavigator<Routes>({
  screens: {
    Home:    { screen: HomeScreen },
    Details: { screen: DetailsScreen },
  },
  initialRouteName: 'Home',
});

// 3. Screen components receive navigation + route as props
function HomeScreen({ navigation }: ScreenProps<Routes, 'Home'>) {
  return (
    <Panel padding={10} gap={8}>
      <Text>{'Home Screen'}</Text>
      <Button onPress={() => navigation.navigate('Details', { id: 1, title: 'First' })}>
        <Text>{'Open Details'}</Text>
      </Button>
    </Panel>
  );
}

function DetailsScreen({ navigation, route }: ScreenProps<Routes, 'Details'>) {
  return (
    <Panel padding={10} gap={8}>
      <Text>{`Details — ${route.params.title}`}</Text>
      <Button onPress={() => navigation.goBack()}>
        <Text>{'Go Back'}</Text>
      </Button>
    </Panel>
  );
}

// 4. Wrap Navigator in NavigationContainer and render to a player
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator />
    </NavigationContainer>
  );
}

world.afterEvents.playerSpawn.subscribe(({ player }) => {
  render(App, player);
});
```

## How It Works

Navigation state is a plain stack — an array of `{ name, params }` route entries plus an `index` pointing to the active screen. All transitions (navigate, push, goBack, reset) dispatch an action to a pure reducer that produces a new state, which triggers `ui-runtime`'s re-render cycle and presents the updated UI to the player.

```
NavigationContainer   — provides the navigation context
  └─ Stack.Navigator  — owns the stack state, renders the active screen
       └─ ActiveScreen({ navigation, route })
```

## In This Section

| Page | Description |
|---|---|
| [createStackNavigator](./createStackNavigator.md) | Set up a typed stack navigator with screens, params, and initial routes |
| [useNavigation](./useNavigation.md) | Access navigation helpers (`navigate`, `push`, `goBack`, …) from any screen |
| [useRoute](./useRoute.md) | Read the current route name and params inside a screen |
