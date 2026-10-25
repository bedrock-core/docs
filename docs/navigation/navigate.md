---
sidebar_position: 5
description: "Open compiled hosts by key and return to their callers."
---
# Moving between screens

Open a registered screen by key, including another screen in the same addon. The default resolver uses this bundle's screens; [Core integration](./realm.md) adds published destinations and their owning realms.

## Choose the navigation scope

| Move | Use |
| --- | --- |
| Between pages or tabs in a mounted navigator | [Link](./components/Link.md), [useNavigation](./hooks/useNavigation.md), or [route actions](./api/actions.md) |
| Open another complete screen by its registered key | The `navigate` and `navigateAsync` functions on this page |

For example, `useNavigation().navigate('Details')` selects a route in the mounted tree. The imported `navigate('shop:details', player)` opens the registered screen. Declarative route links can stay on the client; the functions on this page run on the server.

## Import

```ts
import { navigate, navigateAsync, back, closeUi } from '@bedrock-core/navigation';
```

## Signatures

```ts
navigate(key: DestinationKey, player: Player, options?: DestinationOptions): boolean
navigateAsync(key: DestinationKey, player: Player, options?: DestinationOptions): Promise<boolean>
back(player: Player, options?: Omit<DestinationOptions, 'replace'>): boolean
closeUi(player: Player): void
```

| Call | Result |
| --- | --- |
| `navigate` | Open a destination and retain its caller |
| `navigateAsync` | Wait for the destination host to accept or reject opening |
| `back` | Reopen the previous host with its parameters and confirmed navigator state |
| `closeUi` | Close the current host and clear its history and pending opens |

Synchronous navigation returns `true` for local acceptance or asynchronous dispatch. `navigateAsync()` resolves after host acceptance, without waiting for the player to finish using the screen. A thrown opener can throw synchronously or reject the asynchronous call.

Unknown keys, invalid parameters and rejected destinations preserve the previous state. `back()` returns `false` when no caller remains. Inside a mounted navigator, use its [route actions and hooks](./hooks/useNavigation.md) to navigate pages and tabs.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `params` | `Readonly<Record<string, unknown>>` | — | Public inputs for the component or registered host |
| `replace` | `boolean` | `false` | Open the target without adding the current host to history |
| `debug` | `boolean` | `false` | Compare rendering with the compiled snapshot |
| `checkpoint` | `NavigationCheckpoint` | — | Confirmed navigator state supplied to the target host |

Parameters fill values reserved by the compiled layout. They must be finite, acyclic JSON data. [Runtime parameter contracts](./references.md#declare-accepted-parameters) validate them before the host opens. Data-only compiled references use their baked values and accept no parameters.

## Examples

### Open a parameterized screen

```ts
await navigateAsync('shop:item', player, { params: { itemId: 'diamond', price: 64 } });
```

### Replace the current host

```ts
navigate('shop:offers', player, { replace: true });
```

The existing caller remains available to Back.

## Navigator extensions

Advanced navigator and host libraries use the dedicated runtime entry point:

```ts
import { currentLocation, checkpoint } from '@bedrock-core/navigation/runtime';

const location = currentLocation(player);
checkpoint(player, { navigatorStates: { [rootId]: confirmedState } });
```

`currentLocation()` returns an independent copy containing the host key, public parameters and confirmed navigator states. `checkpoint()` merges confirmed states into the current location and does nothing when no destination exists. Ordinary static navigation roots confirm state automatically before server actions and handoffs. These functions read server-confirmed state and do not poll native controls.

See [navigator libraries](/docs/navigation/api/createStaticNavigation#navigator-libraries) for the custom factory and host extension contract. [Core transport](./realm.md#cross-realm-transitions) carries caller history and checkpoints between realms.

Native block/entity screens require their real host or a registered opener. A registry key alone does not create a container session.

## Next steps

- [Route actions, hooks and refs](./hooks/useNavigation.md)
- [Host entry points and Core transport](./realm.md)
