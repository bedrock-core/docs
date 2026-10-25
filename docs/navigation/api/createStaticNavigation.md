---
sidebar_position: 3
description: "Compose a complete static navigator tree into one compiled action-form component."
---
# createStaticNavigation

Create the component that renders a complete static navigation tree inside an action form.

## Import

```ts
import { createStaticNavigation } from '@bedrock-core/navigation';
```

## Signature

```ts
createStaticNavigation(navigator, options?): FunctionComponent<NavigationContainerProps>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `navigator`<Req /> | Static navigator definition | — | Complete tree of stacks, top tabs and routes |
| `options` | `StaticNavigationOptions` | `{}` | Transport, client budget and root Back policy |

## Returns

A component supplying route context, native transitions, checkpoints and optional player-scoped refs. Mount it inside a [`Screen`](/docs/ui/components/Screen) with a bounded layout box; it does not create a separate native host.

## Usage

```tsx
const Navigation = createStaticNavigation(RootStack, {
  clientNavigation: { mode: 'auto', maxDepth: 5, maxStates: 128, fallback: 'server' },
  rootBackBehavior: 'caller-or-close',
});

export default function AppScreen(): JSX.Element {
  return <Screen><Panel width={300} height={200}><Navigation /></Panel></Screen>;
}
```

## Root options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `adapter` | `NavigationAdapter` | Local compiled destinations | Supply discovery and destination transport |
| `clientNavigation.mode` | `'auto' \| 'server'` | `'auto'` | Prepare local transitions or use server responses |
| `clientNavigation.maxDepth` | Nonnegative integer | `5` | Limit additional stack entries and tab visits; sibling replacements retain their depth |
| `clientNavigation.history` | `'recent'` | Full history | Flat stacks: collapse revisited page names and retain at most `maxDepth` Back destinations |
| `clientNavigation.entryStates` | `readonly InitialState[]` | `[]` | Seed finite server entry histories when using `history: 'recent'` |
| `clientNavigation.maxStates` | Positive integer | `128` | Limit native contexts across the complete nested tree |
| `clientNavigation.fallback` | `'server' \| 'error'` | `'server'` | Use server transitions or reject local-plan budget exhaustion |
| `rootBackBehavior` | `'caller-or-close' \| 'close'` | `'caller-or-close'` | Return to the calling host or close when route history is empty |

One budget covers all nested navigators. It limits native contexts rather than registered route names. [Client navigation](../guides/client-navigation.md) explains eligibility, parameter variants and server checkpoints.

## Root props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `initialState` | Typed `InitialState` | Configured initial route | Initialize the logical tree when no saved state exists |
| `ref` | `NavigationContainerRef` | — | Expose the mounted tree through player-scoped handles |
| `onReady` | `({ player }) => void` | — | Observe server initialization |
| `onStateChange` | `(state, { player }) => void` | — | Observe server-confirmed state changes |
| `onUnhandledAction` | `(action, { player }) => void` | Console warning | Handle actions the tree cannot apply |

Use [`createNavigationContainerRef`](./createNavigationContainerRef.md) to create the ref. A saved checkpoint for this root's `id` takes precedence over initial route selection.

## Back and lifecycle

Route Back retraces visited pages, then bubbles through containing navigators. At the root, `caller-or-close` reopens the caller when one exists and otherwise closes the form. `close` always closes at the root. Closing the native form dismisses the host instead of dispatching route Back.

Server checkpoints preserve confirmed stack and tab state within the host. A published handoff stores that state with the destination; returning restores the logical tree, while private hook state mounts again with the host.

`onReady` acknowledges a server mount, without acknowledging client paint. Local transitions do not invoke `onStateChange`, focus effects or JavaScript listeners.

## Navigator libraries

[`createNavigatorFactory`](./createNavigatorFactory.md) supplies custom layouts using the shared stack or tab behavior. The root continues to own the client budget and host lifecycle.

## Limits

Each declared route body and finite parameter variant mounts during server rendering, including inactive pages. More page content can increase form opening cost even with a bounded context budget.

Resident routes contain page content. Native modal forms and block/entity containers need separate published host entries. Compiled geometry cannot grow in response to an arbitrary runtime value.
