---
sidebar_position: 2
---

# Registry

`core.registry` is a live directory of every bedrock-core addon present in the world — the local addon plus every peer [discovery](../sync/discovery.md) can currently see. Each peer's announce `meta` blob is interpreted as an [`AddonManifest`](./server-runtime.md#manifest-fields), keyed by its namespace.

## Import

```ts
import { core } from '@bedrock-core/server-runtime';
import type { RegisteredAddon, AddonListener, CollisionListener } from '@bedrock-core/server-runtime';
```

## Usage

```ts
core.registry.all();                        // RegisteredAddon[] — self + all live peers
core.registry.get('drav0011_economy');      // by namespace, or undefined
core.registry.has('drav0011_economy');      // boolean

core.registry.onRegister(addon => console.warn('joined:', addon.id));
core.registry.onUnregister(addon => console.warn('left:', addon.id));
core.registry.onNamespaceCollision(info => console.error('collision on', info.id));
```

## `RegisteredAddon`

```ts
type RegisteredAddon = AddonManifest & {
  id: string;
  self: boolean;
  runtimeVersion: string;
};
```

Every entry carries the full manifest plus three fields the registry adds:

| Field | Meaning |
|---|---|
| `id` | The namespace, `creator_pack`. The key everything else uses. |
| `self` | `true` for the local addon, `false` for a peer. |
| `runtimeVersion` | The `@bedrock-core/server-runtime` version that addon was built against — **not** its own `version`. This is what the [host election](./host.md) compares. |

:::note Peers can be partially known
A peer's manifest is reconstructed from its discovery `meta`. A node that published no meta keeps its whole namespace as `pack` and an empty string as `creator` — the id is never split back into halves. `runtimeVersion` defaults to `0.0.0` when absent or malformed, so that peer loses the host election rather than corrupting it.
:::

---

## API

### `all`

```ts
core.registry.all(): RegisteredAddon[]
```

Every registered addon: the local one first, then every live peer.

```ts
for (const addon of core.registry.all()) {
  console.warn(`${addon.id} v${addon.version}${addon.self ? ' (me)' : ''}`);
}
```

---

### `get`

```ts
core.registry.get(id: string): RegisteredAddon | undefined
```

Look up an addon by its namespace. Returns the local addon when `id === core.id`.

---

### `has`

```ts
core.registry.has(id: string): boolean
```

Whether an addon with that namespace is present. This is the predicate feature conditions are usually built from — see [FeatureManager](./features.md).

---

### `onRegister`

```ts
core.registry.onRegister(listener: AddonListener): Unsubscribe
```

Fires when a **peer** becomes visible. Returns an unsubscribe function.

```ts
const off = core.registry.onRegister((addon) => {
  if (addon.id === 'drav0011_economy') { startTrading(); }
});

// later
off();
```

:::tip Not a replay
`onRegister` only fires for peers that appear *after* you subscribe. Peers already present are in `all()`. Since addons load in undefined order, code that must react to a peer either way should check `has()`/`all()` first and then subscribe — or use a [feature](./features.md), which evaluates its condition immediately and on every change.
:::

---

### `onUnregister`

```ts
core.registry.onUnregister(listener: AddonListener): Unsubscribe
```

Fires when a peer goes away — that is, when discovery evicts it after its TTL elapses without a heartbeat.

---

### `onNamespaceCollision`

```ts
core.registry.onNamespaceCollision(listener: CollisionListener): Unsubscribe

interface CollisionInfo {
  id: string;
  instanceId: string;
}
```

Fires when **another instance is announcing our own namespace** — two packs both registered `creator` + `pack` with identical halves. The runtime also logs:

```
[bedrock-core] collision: another instance shares identity '<id>'
```

A collision is not recoverable at runtime; both addons are now sharing a transport address, a state namespace and a command namespace. Treat it as a packaging bug and change one of the two `pack` ids.

```ts
core.registry.onNamespaceCollision((info) => {
  console.error(`[economy] another pack is using '${info.id}' (instance ${info.instanceId})`);
});
```

---

## Dependencies

Dependencies are declared and matched by namespace, and they are **soft**: a missing one is reported but never blocks the addon from loading or running.

```ts
core.register({
  creator: 'drav0011',
  pack: 'shop',
  packName: 'Shop',
  version: '1.0.0',
  dependencies: ['drav0011_economy'],
});
```

### `missingDependencies`

```ts
core.registry.missingDependencies(): string[]
```

The declared dependencies that are not currently present.

```ts
core.registry.missingDependencies();   // ['drav0011_economy'] until it registers
```

### `onDependenciesSatisfied`

```ts
core.registry.onDependenciesSatisfied(listener: () => void): Unsubscribe
```

Fires when every declared dependency is present.

- If they are already satisfied when you subscribe — including the common case of **no dependencies declared at all** — the listener fires **immediately**, synchronously, inside the `onDependenciesSatisfied` call.
- After that it is **edge-triggered**: it fires once on each unsatisfied → satisfied transition, not on every peer that joins.

```ts
core.registry.onDependenciesSatisfied(() => {
  const economy = core.registry.get('drav0011_economy');

  if (!economy) { return; }

  const rpc = core.rpc.typed<EconomyRPC>(economy.id);

  rpc.getBalance({ player: 'Steve' })
    .catch((error: unknown) => console.warn(`[shop] ${String(error)}`));
});
```

:::caution Satisfied is not permanent
If a dependency later disappears the transition flips back, and a subsequent recovery fires your listener again. Write the callback so it is safe to run more than once.
:::

### Logging

The registry writes to `console.info` when the dependency picture changes:

```
[bedrock-core] 'drav0011_shop' missing dependencies: drav0011_economy
[bedrock-core] 'drav0011_shop' dependencies resolved: drav0011_economy
```

The first is also emitted once at startup if anything is missing then. Collisions use `console.error`; nothing here throws.
