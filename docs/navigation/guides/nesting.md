---
sidebar_position: 3
description: "Nest stacks and top tabs, retain per-tab history and select the correct hook scope."
---
# Nest stacks and top tabs

Place navigator definitions directly in another navigator's screen map.

## Compose the tree

```ts
const ShopStack = createStackNavigator({
  id: 'shop',
  screens: { Products, Details },
});
const RootTabs = createTopTabNavigator({
  id: 'app',
  backBehavior: 'history',
  screens: { Shop: ShopStack, Account },
});
const Navigation = createStaticNavigation(RootTabs);
```

Only the complete root needs `createStaticNavigation()`. A tab's nested stack retains its selected route and history while another tab is selected. All nested navigators share the root's local context budget.

## Select a scope

An unqualified `useNavigation()` operates on the registered root. Pass a screen name to select its containing navigator:

```tsx
function ProductButton(): JSX.Element {
  const shop = useNavigation('Products');
  return <Button onPress={() => shop.push('Details')}>
    <Text>{'Open details'}</Text>
  </Button>;
}
```

The named scope searches the current branch first. A name elsewhere in the tree must identify one containing navigator. Use distinct names where a component needs to address routes outside its branch.

The declarative equivalent is `<Link in={'Products'} screen={'Details'} />`. The `in` prop is a screen name identifying the containing navigator, not a navigator id.

## Target a child route

Navigate through the parent with nested screen parameters:

```tsx
<Link screen={'Shop'} params={{ screen: 'Details' }}>
  <Text>{'Shop details'}</Text>
</Link>
```

Parameterized child screens supply their own nested `params`. [TypeScript](./typescript.md) infers the accepted nested shape from the static definitions.

## Availability

Screens and groups can declare an `if` predicate. It runs during server rendering; all possible page bodies remain available to compilation. When the focused page becomes unavailable, the next presentation selects an available route. A tree with no available page rejects rendering.

Group `screenOptions` applies to its screens, and individual screen options override shared values. A containing screen's `bedrock.navigation: 'server'` policy applies to the nested navigator.

## Back

The focused child handles Back first. An exhausted stack or tab policy bubbles it to the parent, then to the root's caller-or-close policy. Use the same `CommonActions.goBack()` action for this chain.

## Next steps

- [createStackNavigator](../api/createStackNavigator.md) — stack history and headers
- [createTopTabNavigator](../api/createTopTabNavigator.md) — tab Back policies and appearance
- [Client navigation](./client-navigation.md) — one shared native budget
