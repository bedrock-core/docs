---
sidebar_position: 3
---

# useNavigation

Access the navigation helpers for the current stack from any component inside a `NavigationContainer`.

## Import

```ts
import { useNavigation } from '@bedrock-core/navigation';
```

## Signature

```ts
function useNavigation<TRoutes>(): NavigationHelpers<TRoutes>
```

Throws if called outside a `NavigationContainer`.

## Usage

```tsx
import { useNavigation } from '@bedrock-core/navigation';

function BackButton() {
  const navigation = useNavigation<Routes>();

  return (
    <Button onPress={() => navigation.goBack()}>
      <Text>{'Back'}</Text>
    </Button>
  );
}
```

:::tip Prefer ScreenProps for screen components
Screen components already receive `navigation` as a prop via [`ScreenProps`](./createStackNavigator.md#screenprops--typing-screen-components). Use `useNavigation` in nested components that are not directly passed props by the navigator.
:::

---

## NavigationHelpers API

### `navigate`

```ts
navigation.navigate('Home')
navigation.navigate('Profile', { userId: '123' })
```

Navigate to a route by name. If the route is already present in the stack, pops back to it and merges the new params. If it is not in the stack, pushes a new entry.

| Behaviour | When |
|---|---|
| Push new entry | Route not in stack |
| Pop-to + merge params | Route already in stack |

Use [`push`](#push) if you always want a new entry regardless of duplicates.

---

### `push`

```ts
navigation.push('Profile', { userId: '456' })
```

Always push a new stack entry, even if a screen with the same name is already in the stack. Useful for flows where visiting the same screen multiple times is intentional (e.g. drill-down item detail).

---

### `goBack`

```ts
navigation.goBack()
```

Pop the current screen and return to the previous one. No-op if the stack has only one entry. Check [`canGoBack`](#cangoback) first when in doubt.

---

### `canGoBack`

```ts
if (navigation.canGoBack()) {
  navigation.goBack();
}
```

Returns `true` when there is at least one screen below the current one in the stack (`index > 0`).

---

### `reset`

```ts
navigation.reset({
  routes: [{ name: 'Home' }, { name: 'Profile', params: { userId: '1' } }],
  index: 1,
})
```

Replace the entire navigation stack with a new one. The `index` must point to the active screen in the new `routes` array. Invalid route names are silently filtered out; `index` is clamped to the resulting array length.

Useful for flows that should not allow the player to go back (e.g. after completing an action, reset to a fresh state):

```ts
// After a game ends, clear the history and go back to the main menu
navigation.reset({ routes: [{ name: 'Menu' }], index: 0 });
```

---

### `setParams`

```ts
navigation.setParams('Profile', { userId: '789' })
```

Merge partial params into the first matching screen in the stack without navigating. Only the provided keys are updated — other existing params are preserved.

```ts
// Only update the title; other params stay the same
navigation.setParams('Details', { title: 'Updated Title' });
```

---

### `getState`

```ts
const state = navigation.getState();
// {
//   type: 'stack',
//   routes: [{ key, name, params }, ...],
//   index: 1,
//   routeNames: ['Home', 'Profile'],
//   stale: false,
// }
```

Returns a snapshot of the current `NavigationState`. Useful for debugging or persisting navigation state.
