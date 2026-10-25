---
sidebar_position: 1
description: "Declarative route transitions that compile to bounded native client navigation."
---
# Link

Render a button whose route action can be prepared for client navigation.

## Import

```tsx
import { Link, CommonActions } from '@bedrock-core/navigation';
```

## Usage

```tsx
<Link screen={'Details'} params={{ itemId: 'diamond' }}>
  <Text>{'Details'}</Text>
</Link>
<Link action={CommonActions.goBack()}><Text>{'Back'}</Text></Link>
```

Mount route links inside [a static navigation root](../api/createStaticNavigation.md). Registered route types determine valid names and required parameters.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `screen` | Route name | — | Destination in the selected navigator |
| `params` | Destination parameters | — | Finite plain-data route inputs |
| `in` | Registered screen name | Root scope | Select the navigator containing that screen |
| `action` | `NavigationAction` | — | Supply a portable action directly |
| `navigation` | `'auto' \| 'server'` | `'auto'` | Force a server response for this link |
| `onPress` | Interceptor callback | — | Run on the server and optionally call `preventDefault()` |

Inherits [Button props](/docs/ui/components/Button) except its ordinary `onPress` signature. Supply `screen` and its parameters, or an action. A Link with an interceptor runs on the server.

The compiler discovers finite literal actions in expanded page components. A supported action within the root budget becomes a native toggle. A server route, published alias or exhausted budget uses a form response and confirms the active context before dispatch.

## Custom buttons

Spread the complete [`useLinkProps()`](../hooks/useLinkProps.md) result onto a button to preserve declarative navigation:

```tsx
function DetailsButton() {
  const props = useLinkProps({ screen: 'Details', params: { itemId: 'diamond' } });
  return <Button {...props}><Text>{'Details'}</Text></Button>;
}
```

Wrapping the returned handler in another callback creates a server action. See [client and server navigation](../guides/client-navigation.md) for the complete decision flow.

## Published destinations

Declare a published key as an alias in the same navigator:

```ts
const Root = createStackNavigator({
  screens: { Home, Settings: 'shop:settings' },
});
```

`<Link screen={'Settings'} />` and `useNavigation().navigate('Settings')` use the same alias. [Core integration](/docs/navigation/realm) adds discovery and cross-addon transport.

Standalone compiled entry points also support `<Link to={'shop:settings'} />`, `replace` and `<Link back />`. Those links use server destination history and can be serialized as static references. See [destination operations](/docs/navigation/navigate).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `to` | Namespaced destination key | — | Open a complete compiled or registered host |
| `params` | Public parameter object | — | Supply the destination's validated inputs |
| `replace` | `boolean` | `false` | Retain the caller beneath the current host |
| `back` | `boolean` | `false` | Reopen the previous host instead of naming a destination |

Use `screen` for a route in the mounted tree and `to` for a complete host. Published-host links work independently of a mounted static navigator.
