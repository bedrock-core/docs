---
sidebar_position: 4
description: "core.host is an election over the registry that nothing uses today. It is reserved for capabilities: shared state that exactly one addon may run."
---

# core.host

`core.host` picks one realm out of the [registry](./registry.md), deterministically, with no negotiation messages at all. **Nothing in the stack calls it today.** Read it as a mechanism waiting for its first user, not as a description of how anything currently behaves.

## Import

```ts
import { core } from '@bedrock-core/server';
import type { HostElection, HostListener } from '@bedrock-core/server';
```

`HostElection` is the shape of `core.host` itself; `HostListener` is what `subscribe` takes.

## Why it exists

Some state no addon can own alone: an energy grid, a fluid network, a physics world. Two addons that both ship the library must run **one** simulation, not two, and every addon has to see the same state through its own copy of the code. That needs exactly one owner, which is what an election over the registry gives. Until such a capability exists, the mechanism has no caller.

The UI does not need it. A screen is drawn by the addon whose pack holds it, and a request for it crosses to that realm over its own show method, so no realm has to be chosen for everyone.

## The rule

1. Highest `runtimeVersion` wins, the version of `@bedrock-core/server-runtime` each addon was built against, which is [`RUNTIME_VERSION`](./runtime.md#runtime_version), **not** the addon's own `version`.
2. Ties are broken by the **lowest namespace**, compared as a plain string.

Every realm sees the same registry and applies the same rule, so they all agree on the same winner without exchanging a single message. The winner is `computed` over `core.registry.addons` and re-derives itself whenever an addon appears or disappears. A peer whose `meta` carries no usable `runtimeVersion` is treated as `0.0.0`, so it loses rather than corrupting the election.

## API

```ts
core.host.isHost: boolean                       // whether this realm won
core.host.id: ReadonlyObservable<string>        // the winner's namespace, as an observable
core.host.host: RegisteredAddon | undefined     // the winner's registry entry, while present
core.host.subscribe(listener): Unsubscribe      // told when the winner moves
```

`id` falls back to this addon's own namespace when the registry is somehow empty, so a caller always has a target. `subscribe` fires only on an actual change and does not deliver the current winner, which `id` already has.
