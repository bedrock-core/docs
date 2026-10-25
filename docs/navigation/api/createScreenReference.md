---
sidebar_position: 5
description: "Declare a route whose published destination key is selected at runtime."
---
# createScreenReference

Declare a route that opens a published screen chosen through route parameters.

## Import

```ts
import { createScreenReference } from '@bedrock-core/navigation';
```

## Signature

```ts
createScreenReference(): ScreenReferenceRoute<PublishedScreenParams>
```

## Parameters

The function takes no arguments.

## Returns

A route source accepted by a stack or top-tab screen map. Its default parameters contain a namespaced `screen` key and optional public `params` for that destination.

## Usage

```tsx
const RootStack = createStackNavigator({
  screens: { Home, Published: createScreenReference() },
});

function SettingsLink(): JSX.Element {
  return <Link screen={'Published'} params={{
    screen: 'shop:settings', params: { section: 'audio' },
  }}><Text>{'Settings'}</Text></Link>;
}
```

For a fixed destination, use the shorter `Settings: 'shop:settings'` screen-map entry. Both forms use the same Link, hook and ref operations.

## Notes

Published destinations always use a server handoff. Without an adapter, the root resolves this bundle's compiled entries. [`createCoreNavigationAdapter`](../realm.md) adds registered owners and cross-addon transport.

The receiving host validates public parameters against its declared contract. A registry entry for a native container still requires its real host or a registered opener.
