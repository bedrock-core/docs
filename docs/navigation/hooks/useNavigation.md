---
sidebar_position: 1
description: "Typed route operations, confirmed state, lifecycle hooks and player-scoped refs."
---
# useNavigation

Read and operate the static navigation tree from a screen component.

## Import

```ts
import { useNavigation } from '@bedrock-core/navigation';
```

## Signature

```ts
useNavigation(): NavigationProp
useNavigation(screenName): RegisteredNavigation
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `screenName` | Registered screen name | Root scope | Select the navigator containing this screen |

A named scope resolves the nearest containing navigator. An unqualified call uses the registered root. Nested names must be unambiguous or belong to the containing branch.

## Returns

| Member | Description |
| --- | --- |
| `navigate(name, params?, options?)` | Update the focused matching route or visit another route |
| `goBack()`, `canGoBack()` | Retrace logical history, bubble to a parent, then apply the root Back policy |
| `getState()`, `isFocused()`, `getId()`, `getParent(id?)` | Read confirmed state and containing navigators |
| `reset(state)`, `dispatch(action)` | Replace state or dispatch a portable navigation action |
| `setParams()`, `replaceParams()`, `pushParams()` | Merge, replace or add parameter history |
| `setOptions()` | Change values such as titles without changing compiled geometry |
| `addListener()`, `removeListener()` | Subscribe to server-confirmed events |

Stack scopes also expose `push`, `replace`, `pop`, `popTo`, `popToTop` and `dismiss`. Tab scopes expose `jumpTo`. `CommonActions`, `StackActions` and `TabActions` create corresponding action objects.

## Usage

```tsx
function SaveButton() {
  const navigation = useNavigation();
  return <Button onPress={() => {
    saveSelection();
    navigation.navigate('Done');
  }}><Text>{'Save'}</Text></Button>;
}
```

An ordinary server button inside the navigator automatically confirms the actual local route and history before its callback runs. A callback can therefore call `getState()` or navigate from that confirmed position.

Use [Link](/docs/navigation/components/Link) or `useLinkProps()` for declarative client navigation. Calling a hook method from an `onPress` callback runs on the server.

## Related hooks

[`useRoute()`](./useRoute.md) reads the current page's parameters. [`useNavigationState()`](./useNavigationState.md) selects data from confirmed state. Native toggles do not rerun components; reserve live text dimensions for values that can change.

[`useIsFocused()`](./useIsFocused.md), [`useFocusEffect()`](./useFocusEffect.md) and [`usePreventRemove()`](./usePreventRemove.md) require explicit server navigation on the screen, a containing screen, or the root.

## Events

Configured listeners support `focus`, `blur`, `state` and preventable `beforeRemove`; top tabs also expose preventable `tabPress`. Preventable listeners require server navigation. Local visits do not replay intermediate focus events. Native form cancellation dismisses the host.

`addListener()` returns an idempotent disposer. A listener can also be removed with `removeListener(event, listener)`.

## External access

[`createNavigationContainerRef()`](../api/createNavigationContainerRef.md) gives commands and services a typed handle to a mounted root, addressed explicitly through `forPlayer(player)`.
