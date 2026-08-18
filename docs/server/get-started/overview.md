---
sidebar_position: 1
---

# Overview

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

```bash
npm install @bedrock-core/server
```

That is the answer for an addon. It is a meta-package that pins a matching set of the stack and re-exports everything, so `import { core } from '@bedrock-core/server'` is all you need. The transport stays available at `@bedrock-core/server/sync` if you ever want it, and the runtime already owns exactly one node and hands it to you as `core.node`.

The two packages underneath — [`@bedrock-core/server-runtime`](../server-runtime/server-runtime.md) (registry, features, config, guides, translations, host election) and [`@bedrock-core/sync`](../sync/sync.md) (bus, discovery, RPC, replicated state) — are strictly layered and installable on their own if you are building a framework layer of your own.

## What you get

- **[Registry](../server-runtime/registry.md)** — declare `creator` + `pack` once and every other bedrock-core addon sees you, with version, dependencies and display labels. Missing soft dependencies log and fire an event; they never block loading.
- **[RPC](../sync/rpc.md)** — typed request/response calls to another addon, with a timeout so an absent peer can never hang your code.
- **[Replicated state](../server-runtime/scoped-state.md)** — a shared key/value store every realm mirrors locally. Reads are synchronous; writes broadcast a delta.
- **[Config](../server-runtime/config.md)** — a declarative schema in three scopes (server, dimension, player), persisted automatically and editable in game.
- **[Features](../server-runtime/features.md)** — behaviour that auto-enables when a condition over the registry becomes true, and auto-disables when it stops being true.
- **[Translations](../server-runtime/translations.md)** and **[guides](../server-runtime/guides.md)** — publish your i18n bundle and compiled guide so any addon's UI can render your content.
- **[Host election](../server-runtime/host.md)** — a deterministic rule for "which realm does the work only one realm may do".

## Next Steps

- [Installation](./installation.md) - Scaffold with the CLI, or install and register by hand
- [server-runtime](../server-runtime/server-runtime.md) - The runtime reference: `core`, registry, features, host, state, config
- [sync](../sync/sync.md) - The transport reference: nodes, discovery, RPC, replicated state
- [UI integration](../ui-integration.md) - How config, translations and guides feed the UI packages
