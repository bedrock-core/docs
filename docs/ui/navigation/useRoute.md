---
sidebar_position: 4
---

# useRoute

Read the name and params of the currently active route from any component inside a `NavigationContainer`.

## Import

```ts
import { useRoute } from '@bedrock-core/navigation';
```

## Signature

```ts
function useRoute<TRoutes, K extends keyof TRoutes>(): RouteObject<TRoutes[K]>
```

Throws if called outside a `NavigationContainer` or when there is no active route.

## RouteObject

```ts
interface RouteObject<TParams> {
  key: string;    // unique identifier for this stack entry
  name: string;   // route name (e.g. 'Profile')
  params: TParams // typed params for this route
}
```

## Usage

```tsx
import { useRoute } from '@bedrock-core/navigation';

function ProfileHeader() {
  const route = useRoute<Routes, 'Profile'>();
  // route.params is typed as { userId: string }

  return <Text>{`Viewing user: ${route.params.userId}`}</Text>;
}
```

:::tip Prefer ScreenProps for screen components
Screen components already receive `route` as a prop via [`ScreenProps`](./createStackNavigator.md#screenprops--typing-screen-components). Use `useRoute` in nested components that need param access but are not directly wired by the navigator.
:::

## Examples

### Accessing required params

```tsx
type Routes = {
  Details: { id: number; title: string };
};

function DetailsTitle() {
  const route = useRoute<Routes, 'Details'>();

  return <Text>{route.params.title}</Text>;
}
```

### Accessing optional params with a fallback

```tsx
type Routes = {
  Modal: { message?: string };
};

function ModalBody() {
  const route = useRoute<Routes, 'Modal'>();
  const message = route.params.message ?? 'No message provided.';

  return <Text>{message}</Text>;
}
```

### Reading the route name

```tsx
function ActiveScreenLabel() {
  const route = useRoute<Routes, keyof Routes>();

  return <Text>{`Current screen: ${route.name}`}</Text>;
}
```
