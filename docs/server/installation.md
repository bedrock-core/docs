---
sidebar_position: 2
description: "Get a bedrock-core addon online, then get a second one talking to it."
---

# Installation

Get a bedrock-core addon online, then get a second one talking to it.

## Prerequisites

- Node.js 20+ and Yarn (or npm) — https://nodejs.org/
- Regolith (recommended) — https://regolith-docs.readthedocs.io/en/stable

## Quick start with the CLI

The [CLI](/docs/cli) scaffolds a full-stack addon: `core.register()` called with your ids, a typed config schema, translations and a guide wired to their filters, `@bedrock-core/ui` screens mounted, and the Regolith build. With a scaffold you can skip the rest of this page.

<Exec cmd="@bedrock-core/cli" />

## Manual installation

If you're adding to an existing project, install the package:

<Install pkg="@bedrock-core/server" />

That single dependency pins matching versions of `@bedrock-core/server-runtime` and `@bedrock-core/sync`, and re-exports them:

```ts
import { core } from '@bedrock-core/server';        // the runtime
import { createSync } from '@bedrock-core/server/sync'; // the raw transport, rarely needed
```

:::info The packages ship TypeScript sources
Their `exports` map points at `src/*.ts` rather than at compiled JavaScript, so whatever bundles your behavior pack compiles them along with your own code. The [`bundler` filter](/docs/filters/bundler) handles this out of the box; a hand-rolled build needs a bundler that can consume TypeScript from `node_modules`.
:::

## Register

`register()` is the whole boot sequence — it validates your manifest, brings the addon online, and starts every subsystem. **There is no separate `start()`.** Call it once, near the top of your script entry.

```ts
import { core } from '@bedrock-core/server';

core.register({
  manifest: {
    creator: 'drav0011',       // creator/vendor id — [a-z0-9_]+
    pack: 'economy',           // abbreviated pack id — [a-z0-9_]+
    packName: 'Economy',       // display label only, not part of identity
    version: '1.0.0',
  },
});

console.warn(core.id);        // 'drav0011_economy'
console.warn(core.namespace); // same value — an alias that reads better in some places
```

Calling `register()` a second time on the same runtime throws. So does an invalid manifest.

## Identity: one namespace, declared in two halves

`creator` and `pack` are separate fields, both matching `/^[a-z0-9_]+$/`, joined with an **underscore**:

```
`${creator}_${pack}`

  creator: 'test',   pack: 'demo_a'   →  test_demo_a
  creator: 'drav0011', pack: 'economy' →  drav0011_economy
  creator: 'bt',     pack: 'gc_graves' →  bt_gc_graves
```

:::caution The id is `creator_pack`, never `creator:pack`
There is no colon form anywhere in the API. `core.id` is a plain lowercase namespace string, and that is exactly what you pass to `core.registry.get()`, `core.rpc.request()`, `dependencies: [...]`, and every other place an addon is named.
:::

That one namespace is the sync transport address other addons send to, the replicated-state namespace this addon owns, and the namespace of every command and command enum the addon registers.

Two addons collide only when **both** halves match. A creator shipping several addons uses distinct `pack` ids (`drav0011_economy`, `drav0011_shop`) and they coexist happily. Two packs registering `drav0011_economy` collide: the runtime logs an error and fires [`core.registry.onNamespaceCollision`](./api/registry.md#onnamespacecollision).

`packName`, `creatorName` and `description` are display labels and play no part in identity. See [manifest fields](./api/runtime.md#manifest-fields) for the full list.

## A minimal working addon

Everything an addon *declares* rides in the one `register()` call. Here is an economy addon that serves a balance over RPC and exposes two settings.

```ts title="packs/BP/scripts/main.ts"
import { core } from '@bedrock-core/server';
import { world } from '@minecraft/server';

// The RPC surface other addons call. Publish this interface from a types package so
// consumers get a typed client.
export interface EconomyRPC {
  getBalance(params: { player: string }): number;
}

// The config schema. `as const` is what gives you literal types on enums and defaults.
const configDef = {
  server: {
    economy: {
      startingBalance: { type: 'number', default: 100, min: 0, max: 10000, step: 1, label: 'Starting Balance' },
      currency: { type: 'enum', default: 'emerald', options: ['emerald', 'gold', 'diamond'], label: 'Currency' },
    },
  },
  player: {
    notifyOnLogin: { type: 'boolean', default: true, label: 'Notify on Login' },
  },
} as const;

export type EconomyConfigDef = typeof configDef;

// register() brings the addon online and, because `config` was given, returns the
// typed scope accessors under `config`.
const { config } = core.register({
  manifest: {
    creator: 'drav0011',
    pack: 'economy',
    packName: 'Economy',
    creatorName: 'DrAv0011',
    version: '1.0.0',
  },
  config: configDef,
});

// ─── Serve RPC ───────────────────────────────────────────────────────────────

core.rpc.serve<EconomyRPC>({
  getBalance: ({ player }) => {
    const balance = core.state.get(`balance.${player}`);

    return typeof balance === 'number' ? balance : 0;
  },
});

// ─── React to config changes ─────────────────────────────────────────────────

// Every scope is a dotted tree mirroring the schema — walk to the node and subscribe.
config.server.economy.currency.subscribe((next, prev) => {
  console.warn(`currency: ${String(prev)} → ${next}`);
});

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn) { return; }

  if (config.player.for(player).notifyOnLogin.get()) {
    player.sendMessage(`Balance: ${String(config.server.economy.startingBalance.get())}`);
  }
});
```

:::caution Dynamic properties are unreadable during early execution
Anything that touches `world.getDynamicProperty` / `setDynamicProperty` — including your own persistence — must be deferred with `system.run()`. The runtime already does this for config: persisted values load one tick after registration, and change listeners fire for every key whose stored value differs from its default, so a subscriber attached right after `register()` still ends up seeing the real values.

Nothing in the shared mirror survives a reload unless the leaf is declared `persisted()` — see [Persistence](./api/shared.md#persistence).
:::

## Getting two addons talking

The second addon declares a dependency on the first by namespace and calls it once it appears.

```ts title="shop — packs/BP/scripts/main.ts"
import { core } from '@bedrock-core/server';

// In a real project this interface comes from the economy addon's published types
// package and is installed as a devDependency.
interface EconomyRPC {
  getBalance(params: { player: string }): number;
}

core.register({
  manifest: {
    creator: 'drav0011',
    pack: 'shop',
    packName: 'Shop',
    version: '1.0.0',
    dependencies: ['drav0011_economy'],            // soft — warns, never blocks
    optionalDependencies: ['drav0011_leaderboard'], // unlocks optional features
  },
});

// Fires immediately if the dependency is already present, otherwise when it appears.
core.registry.onDependenciesSatisfied(() => {
  const economy = core.registry.get('drav0011_economy');

  if (!economy) { return; }

  const economyRpc = core.rpc.typed<EconomyRPC>(economy.id);

  economyRpc.getBalance({ player: 'Steve' })
    .then(balance => console.warn(`[shop] balance: ${String(balance)}`))
    .catch((error: unknown) => console.warn(`[shop] balance request failed: ${String(error)}`));
});

// Behavior that only exists when a leaderboard addon is installed.
core.features.add('leaderboard-sync', {
  condition: ctx => ctx.registry.has('drav0011_leaderboard'),
  onEnable() { console.warn('[shop] leaderboard sync on'); },
  onDisable() { console.warn('[shop] leaderboard sync off'); },
});
```

:::tip Timing is tick-based
Addons load in undefined order and messages flush over ticks, so you will never get an RPC reply on the same tick you sent the request, and a peer may not be visible on tick 0. That is what `onDependenciesSatisfied`, `registry.onRegister` and feature conditions are for — never assume a peer is there at boot.
:::

## Next steps

- [server-runtime](./api/runtime.md) — the full runtime reference
- [ConfigRegistry](./api/config.md) — schema types, scopes, cross-addon access and authorization
- [Registry](./api/registry.md) — enumerating peers, dependencies and collisions
- [sync](/docs/sync) — the transport underneath, when you need it directly
- [UI integration](./guides/ui-integration.md) — turning your schema and guides into player-facing screens
