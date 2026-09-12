---
sidebar_position: 3
description: "Navigation bound to the player the screen is being shown to."
---
# useNavigation

Navigation bound to the player the screen is being shown to.

## Import

```tsx
import { useNavigation } from '@bedrock-core/navigation';
```

## Signature

```ts
function useNavigation(): Navigation
```

## Returns

| Member | Type | Description |
| --- | --- | --- |
| `navigate` | `(key: ScreenKey, options?: NavigateOptions) => boolean` | Show that screen, putting this one behind the player |
| `replace` | `(key: ScreenKey, options?) => boolean` | Show that screen in this one's place, leaving the stack as deep as it is |
| `reset` | `(key: ScreenKey, options?) => boolean` | Show that screen as the only one the player has been on |
| `back` | `(options?) => boolean` | Go back to the screen navigated from; `false` when there is none |
| `canGoBack` | `boolean` | Whether there is a screen behind this one |
| `key` | `ScreenKey \| undefined` | The key of the screen this is |
| `history` | `readonly string[]` | The keys behind it, oldest first |

The same calls as the [free functions](./navigate.md), with the player already in hand — which inside a screen is the only player there is.

## Usage

```tsx
function Footer(): JSX.Element {
  const { back, canGoBack } = useNavigation();

  return (
    <Button visible={canGoBack} onPress={() => back()}>
      <Text>{'Back'}</Text>
    </Button>
  );
}
```

## Examples

### A row of destinations

```tsx
function Menu(): JSX.Element {
  const { navigate } = useNavigation();

  return (
    <Panel gap={4}>
      <Button onPress={() => navigate('shop:catalog')}><Text>{'Catalog'}</Text></Button>
      <Button onPress={() => navigate('shop:orders')}><Text>{'Orders'}</Text></Button>
    </Panel>
  );
}
```

### Knowing which screen this is

```tsx
function Breadcrumb(): JSX.Element {
  const { key, history } = useNavigation();

  return <Text maxLength={48}>{[...history, key ?? ''].join(' > ')}</Text>;
}
```

`key` is the screen's own key, so a component shared by several screens can tell which one it is drawing in without being told.

## Notes

Prefer [`<Link to>`](/docs/ui/components/Link) over a `navigate()` in an `onPress` when the destination is fixed. A link's target is data the build reads off the tree, which is what lets the screen be described to another addon; a closure is script only this realm can run.

`canGoBack` and `history` are read at render time. A form cannot change while it is open, so they are a snapshot of the moment the screen was presented — which is the same moment everything else on it was decided.

There is no `useRoute()`. Params arrive as the screen component's own **props**, because `navigate(key, player, { params })` renders it with them, so there is no route object to read them out of. The route's name is `key` above.
