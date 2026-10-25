---
sidebar_position: 4
description: "Address a mounted navigation tree from commands or services with an explicit player."
---
# createNavigationContainerRef

Create a typed handle registry for a mounted navigation root.

## Import

```ts
import { createNavigationContainerRef } from '@bedrock-core/navigation';
```

## Signature

```ts
createNavigationContainerRef<Root>(): NavigationContainerRef<Root>
```

## Parameters

The `Root` type parameter is `typeof` the static navigator definition. The function takes no runtime arguments.

## Returns

A ref with `forPlayer(player)`, which returns an independent handle for that player. Pass the ref to the component returned by [`createStaticNavigation`](./createStaticNavigation.md).

| Member | Result |
| --- | --- |
| `isReady()` | Whether this player's root is mounted on the server |
| `getRootState()` | Confirmed root state, or `undefined` before mounting |
| `getCurrentRoute()` | Confirmed leaf route, or `undefined` before mounting |
| `resetRoot(state)` | Replace this player's mounted root state |
| Navigation methods | The root's [route operations](../hooks/useNavigation.md), including `navigate`, `dispatch` and `goBack` |

Navigation operations throw if that player's root is not mounted. Readiness and state describe the server-confirmed tree; they do not poll native client selection.

## Usage

```tsx
const navigationRef = createNavigationContainerRef<typeof RootStack>();
const Navigation = createStaticNavigation(RootStack);

export default function AppScreen(): JSX.Element {
  return <Screen><Panel width={300} height={200}>
    <Navigation ref={navigationRef} />
  </Panel></Screen>;
}

export function openDetails(player: Player): void {
  const navigation = navigationRef.forPlayer(player);
  if (navigation.isReady()) { navigation.navigate('Details'); }
}
```

Open the host with `render(AppScreen, player)` before addressing its ref. A ref controls an existing tree; it does not open the host or select a default player.

## Notes

One ref can track multiple players. A second mounted root cannot claim the same ref for the same player. Closing or replacing the host removes its controller from the registry.
