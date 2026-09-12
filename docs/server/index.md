---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "Get two Minecraft addons talking to each other."
---

# server

Get two Minecraft addons talking to each other.

:::caution Pre-1.0
The `@bedrock-core` server packages are under active development. Breaking changes can still land until `1.0.0` — pin exact versions and read the release notes before upgrading.
:::

## What is @bedrock-core/server?

Every behavior pack runs its scripts in its **own isolated realm**. Two packs in the same world cannot import each other, share a module, or see each other's variables.

`@bedrock-core/server` builds a framework on top of the one thing that does cross a realm boundary: script events. Addons discover each other at runtime, call each other, share state, and expose their settings and guides through one common surface.

```
world
 ├─ drav0011_economy    serves getBalance over RPC, publishes its config schema
 ├─ drav0011_shop       depends on economy, calls it, publishes its own schema
 └─ someone_leaderboard shop's optional feature lights up because it is present
```

None of them imported each other. They found each other at runtime.

## Install one package

<Install pkg="@bedrock-core/server" />

That is the answer for an addon. It is a meta package that pins a matching set of the stack and re-exports everything, so `import { core } from '@bedrock-core/server'` is all you need. Each package underneath stays reachable at its own subpath — `/sync`, `/db`, `/observable` — for when you reach past `core` to the thing itself.

The packages underneath are strictly layered and installable on their own if you are building a framework layer of your own: [`@bedrock-core/server-runtime`](./api/runtime.md) (registry, features, config, shared, events, guides, translations, host election), [`@bedrock-core/sync`](/docs/sync) (bus, discovery, RPC, the mirror, events), [`@bedrock-core/db`](/docs/db) (persisted documents) and [`@bedrock-core/observable`](/docs/observable) (the reactive primitive every accessor is).

## What you get

- **[Registry](./api/registry.md)** — declare `creator` + `pack` once and every other bedrock-core addon sees you, with version, dependencies and display labels. Missing soft dependencies log and fire an event; they never block loading.
- **[RPC](/docs/sync/rpc)** — typed request/response calls to another addon, with a timeout so an absent peer can never hang your code, and [one rule](./api/authorize.md) a handler applies on behalf of a player.
- **[Shared](./api/shared.md)** — a flat shape every realm mirrors locally, one observable per key. Reads are synchronous; writes broadcast a delta; only the owner writes.
- **[Events](./api/events.md)** — a broadcast delivered and forgotten, typed by its payload, so a peer hears that something happened without polling for it.
- **[Db](./api/db.md)** — persisted documents keyed by target, on whatever dynamic properties the target itself can hold, with versions and lazy migrations. Local: a peer reaches one only through a method you wrote.
- **[Config](./api/config.md)** — a declarative schema in three scopes (server, dimension, player), stored as documents and editable in game.
- **[Features](./api/features.md)** — behavior that auto-enables when a condition over the registry becomes true, and auto-disables when it stops being true.
- **[Translations](./api/translations.md)** — announce your i18n bundle so any addon's UI can resolve and measure your strings. Your screens and your list page are announced by [`@bedrock-core/navigation`](/docs/navigation/references).
- **[Host election](./api/host.md)** — a deterministic rule for "which realm does the work only one realm may do".

## Next steps

- [Installation](./installation.md) — scaffold with the CLI, or install and register by hand
- [Sharing data between addons](./guides/channels.md) — which of shared, events and RPC carries what, and what stays local
- [Trust model](./guides/trust-model.md) — what the framework defends against, and what it cannot
- [`core`](./api/runtime.md) — the runtime reference: registry, features, host, shared, events, db, config
- [sync](/docs/sync) — the transport reference: nodes, discovery, RPC, the mirror, events
- [UI integration](./guides/ui-integration.md) — how config, translations and guides feed the UI packages
