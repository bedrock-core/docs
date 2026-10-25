---
sidebar_position: 6
description: "Create portable stack, tab and parameter actions for declarative links and server dispatch."
---
# CommonActions

Create portable action objects for links and navigation dispatch.

## Import

```ts
import { CommonActions, StackActions, TabActions } from '@bedrock-core/navigation';
```

## Common actions

| Factory | Result |
| --- | --- |
| `CommonActions.navigate(name, params?, options?)` | Visit a route or update the focused matching route |
| `CommonActions.goBack()` | Retrace history and bubble to the parent when necessary |
| `CommonActions.reset(state)` | Replace a navigator's logical state |
| `CommonActions.setParams(params)` | Shallow-merge the current route's parameters |
| `CommonActions.replaceParams(params)` | Replace parameters without adding history |
| `CommonActions.pushParams(params)` | Replace parameters and add a history entry |

`navigate` also accepts a destination object with `name` and optional `params`. Its options are `merge`, which defaults to `false`, and `pop`, which defaults to `false` and lets a stack return to an existing matching route.

## Stack actions

| Factory | Result |
| --- | --- |
| `StackActions.push(name, params?)` | Add a distinct route instance |
| `StackActions.replace(name, params?)` | Replace the focused route |
| `StackActions.pop(count?)` | Remove history entries; default count is `1` |
| `StackActions.popTo(name, params?, options?)` | Return to a matching route, or replace the focused route when absent |
| `StackActions.popToTop()` | Return to the first stack route |
| `StackActions.dismiss(count?)` | Remove complete screens and their parameter-history entries; default count is `1` |

`popTo` accepts `merge` in its options. Counts must be positive integers.

## Tab actions

| Factory | Result |
| --- | --- |
| `TabActions.jumpTo(name, params?)` | Select an existing tab and retain its nested state |

## Usage

```tsx
<Link action={CommonActions.goBack()}><Text>{'Back'}</Text></Link>
<Link action={StackActions.push('Details', { itemId: 'diamond' })}>
  <Text>{'Another detail page'}</Text>
</Link>
```

An action describes intent; creating it does not change a screen. A declarative [Link](../components/Link.md) can compile the action into a local transition. `navigation.dispatch(action)` runs it on the server after confirming the active context.

Action types and parameter values are checked at runtime as finite, acyclic JSON data. An action the selected navigator cannot handle follows the root's `onUnhandledAction` callback.
