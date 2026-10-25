---
sidebar_position: 2
description: "How declarative actions become local transitions and where server checkpoints are required."
---
# Client and server navigation

One planner prepares native transitions for stacks, tabs, and reading menus, then validates the same compiled format against each opened form.

## The flow

1. The build renders every declared page and reads action metadata from `Link` and intact `useLinkProps()` handlers.
2. It prepares a bounded graph of reachable route and history contexts, sharing page content across those contexts.
3. Opening the host replays that plan against the confirmed state, parameters and available routes, enabling a local input only when it still matches.
4. A local press selects native JSON UI controls inside the open form. It does not execute JavaScript or submit a response.
5. A server press submits the form, confirms the active local context, runs its action, and presents the next bounded window.

## Choose the execution path

| Input or destination | Execution |
| --- | --- |
| `Link` to a local route | Local when the action has a valid prepared context |
| Intact `useLinkProps()` handler | The same local eligibility as a Link |
| A Link with `navigation={'server'}` or an `onPress` interceptor | Server |
| An ordinary callback or imperative hook/ref operation | Server |
| A namespaced published key or reference route | Server handoff |
| A transition outside the available local plan | Server checkpoint by default |

Wrapping a described handler in another callback hides its navigation metadata from the compiler. The callback remains a server action.

## Configure the shared budget

```ts
const Navigation = createStaticNavigation(RootStack, {
  clientNavigation: { mode: 'auto', maxDepth: 5, maxStates: 128, fallback: 'server' },
});
```

`maxDepth` limits additional stack entries and tab visits across the whole nested tree. Sibling replacements retain that depth; Back reduces it. `maxStates` limits combined native contexts, including sibling pages. The default budget is five additional history levels and 128 native contexts. The planner prepares shallower histories first.

Flat stacks can set `history: 'recent'` to collapse revisited page names and discard the oldest entries beyond `maxDepth` Back destinations. This policy uses a complete graph shared by all entry pages and retains its bounded history across server actions. If that graph exceeds `maxStates`, the same planner leaves uncovered transitions on the server unless `fallback: 'error'` requires a build error. Guides require a complete plan with five Back destinations. Use `entryStates` to declare finite initial histories reached through server actions rather than local links; [Config](/docs/config) uses these for player and dimension menus entered from a live roster.

Repeated sibling replacements can stay local for an entire reading session when their states fit the context budget. Parameters, route policy or an exhausted history/context budget can require a server checkpoint. `fallback: 'error'` makes local-plan allocation failure a build error. Explicit server actions and published destinations still use the server.

## Force server navigation

```ts
const RootStack = createStackNavigator({
  screens: {
    Home,
    Editor: { screen: Editor, bedrock: { navigation: 'server' } },
  },
});
```

A server-only screen also makes its nested routes server-only. Set `clientNavigation.mode: 'server'` on the root to apply that policy to the whole tree. Focus hooks and preventable events require this policy for their affected routes.

## Parameters and availability

`initialParams` supplies values needed to compile a parameterized page. Finite literal Link parameters can create additional prepared bodies. Runtime parameters must fit an existing compiled body and context to use a local input; otherwise the action uses the server.

Complete reading plans validate their starting history when opened. Declare permitted server entry histories with `entryStates`.

Availability predicates run on the server. The next presentation uses their current results. A native page selection does not recheck permissions, poll data or rerun component code; validate permission-sensitive work in its server handler.

## State and Back

Ordinary application navigation preserves repeated screen instances, route parameters, and each tab's retained child stack. The reading policy applies only when you select `history: 'recent'`.

Before a server callback runs, the library confirms the active route and the history represented by its local context. Server checkpoints retain that logical history, selected tabs and nested stacks. Their next form presentation starts from the confirmed state. Local pagination reuses that saved parent history.

Published handoffs save confirmed navigator state with the calling destination. Back restores that state when the host returns. Private component hook state belongs to a render session and mounts again after a host change.

Root refs, state reads and listeners describe confirmed server state. They do not receive intermediate local visits or acknowledge native paint.

## Opening cost

A bounded context graph controls the amount of native history. Every declared route body and finite parameter variant still mounts during server rendering. Keep page content small, avoid expensive work in inactive page components, and load expensive sections through separate hosts when needed.

## Next steps

- [createStaticNavigation](../api/createStaticNavigation.md) — root options and callbacks
- [Link](../components/Link.md) — declarative actions and interception
- [useNavigation](../hooks/useNavigation.md) — confirmed state and server operations
