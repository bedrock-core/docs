---
sidebar_position: 4
---

# HostElection

`core.host` answers one question: **should this realm do the work that exactly one realm may do?**

Some jobs cannot be done by every addon at once — rendering a shared config or guide UI is the motivating one. Host election picks a single realm for those, deterministically, with no negotiation messages at all.

## Import

```ts
import { core } from '@bedrock-core/server-runtime';
import { HostElection } from '@bedrock-core/server-runtime';
import type { HostListener } from '@bedrock-core/server-runtime';
```

## Usage

```ts
if (core.host.isHost) {
  renderLocally(player);
} else {
  void core.rpc.request(core.host.hostId, 'core:ui.open', { playerId: player.id });
}

core.host.subscribe(hostId => console.warn('UI host is now', hostId));
```

---

## Why it exists

Bedrock's custom-command registry is **world-global** and has no unregister API, so whichever realm loads first *owns* a given command name for the life of the world. That ownership is immovable — who does the **rendering** is not. The election picks the realm running the newest `@bedrock-core/server-runtime`, and the command owner becomes a router: it forwards the request to `core.host.hostId` instead of rendering locally.

The practical consequence: **installing one up-to-date bedrock-core addon upgrades the shared UI for every addon in the world**, including ones whose authors never shipped again.

---

## The rule

1. Highest `runtimeVersion` wins — that is [`RUNTIME_VERSION`](./server-runtime.md#version-helpers), the version of `@bedrock-core/server-runtime` each addon was built against, **not** the addon's own `version`.
2. Ties are broken by the **lowest namespace**, compared as a plain string.

Every realm sees the same [registry](./registry.md) and applies the same rule, so they all agree on the same winner without exchanging a single message.

The election re-runs whenever a peer appears or disappears.

:::note Peers with no announced runtime version
A peer whose `meta` carries no usable `runtimeVersion` is treated as `0.0.0`. It loses the election instead of corrupting it.
:::

---

## API

### `isHost`

```ts
core.host.isHost: boolean
```

Whether this realm is the current host and should do the work itself.

### `hostId`

```ts
core.host.hostId: string
```

Namespace of the realm running the newest runtime. Falls back to this addon's own id when the registry is somehow empty, so callers always have a target to address.

### `host`

```ts
core.host.host: RegisteredAddon | undefined
```

The elected host's [registry entry](./registry.md#registeredaddon), when it is still present.

### `subscribe`

```ts
core.host.subscribe(listener: HostListener): Unsubscribe

type HostListener = (hostId: string, previousHostId: string | undefined) => void;
```

Notified when hosting **moves**. Fires only on an actual change — including the initial election, if you subscribe before peers appear. Returns an unsubscribe function.

```ts
core.host.subscribe((hostId, previousHostId) => {
  if (hostId === core.id) {
    console.warn(`[economy] took over hosting from ${String(previousHostId)}`);
  }
});
```

---

## The router pattern

The shape this is built for: whichever realm receives a player-facing command does the smallest possible slice of work — identify the player, name the request, forward the raw arguments — and everything that involves a decision happens on the host.

```ts
// In the realm whose command was typed:
function dispatch(player: Player, command: string, args: (string | undefined)[]): void {
  if (core.host.isHost) {
    open(player, command, args);

    return;
  }

  void core.rpc.request(core.host.hostId, 'core:ui.open', {
    playerId: player.id,
    command,
    args,
  }).catch((error: unknown) => console.warn(`[ui] host refused: ${String(error)}`));
}

// Every realm serves the handler, because any of them may win the election later:
core.rpc.onRequest('core:ui.open', (params) => {
  const { playerId, command, args } = params as { playerId: string; command: string; args: (string | undefined)[] };
  const player = world.getAllPlayers().find(candidate => candidate.id === playerId);

  if (!player) { throw new Error(`core:ui.open: player '${playerId}' is not in the world`); }

  open(player, command, args);

  return true;
});
```

:::tip Serve the handler everywhere, not just on the host
Hosting can move at any time — a newer addon loads, the current host's pack is removed. Every realm that participates should register the handler at startup so it is ready if it wins later.
:::

This is exactly how [`@bedrock-core/config`](../ui-integration.md) mounts the shared config and guide UI.

---

## `HostElection` standalone

The class is exported for tests and for framework layers that build their own runtime:

```ts
import { HostElection } from '@bedrock-core/server-runtime';

const host = new HostElection(registry, selfNamespace);

host.start();   // subscribes to registry changes and elects
host.stop();    // unsubscribes and clears listeners
```

In an addon you never construct one — `core.host` is created and started by `core.register()`.
