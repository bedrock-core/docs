---
sidebar_position: 5
---

# ScopedState

`core.state` is the replicated key/value store, pre-scoped to this addon's namespace. It is a thin wrapper over sync's [`State`](../sync/state.md) that does two things for you:

1. **Fills in the namespace**, so you never repeat `core.id` on a call.
2. **Hides the framework's own keys**, so "my namespace" really means "my data".

Reads are local and synchronous — every realm keeps a full in-memory mirror. Writes broadcast a delta to every other realm.

## Import

```ts
import { core } from '@bedrock-core/server-runtime';
import { RESERVED_STATE_PREFIX, isReservedStateKey } from '@bedrock-core/server-runtime';
import { stateKey } from '@bedrock-core/sync';
```

## Usage

```ts
core.state.set('shopOpen', true);
core.state.get('shopOpen');            // unknown → true
core.state.delete('shopOpen');

core.state.getNamespace();             // { …everything this addon wrote }
core.state.namespaces();               // every namespace in the mirror (own + peers)

core.state.subscribe(({ key, value, deleted }) => {
  console.warn(`${key} = ${String(value)}${deleted ? ' (deleted)' : ''}`);
});
```

---

## API

### `set`

```ts
set<T = unknown>(key: StateKey<T>, value: NoInfer<T>): void
set(key: string, value: unknown): void
```

Write a key in this addon's namespace and broadcast the delta. Throws if `key` starts with the [reserved prefix](#reserved-keys).

### `get`

```ts
get<T = unknown>(key: StateKey<T>): NoInfer<T> | undefined
get(key: string): unknown | undefined
```

Read from the local mirror. Returns `undefined` for an absent key, a deleted key, or a reserved key.

### `delete`

```ts
delete(key: string): void
```

Tombstone a key and broadcast the delta. Throws on a reserved key.

### `getNamespace`

```ts
getNamespace(): Record<string, unknown>
```

Everything this addon has written, **without** the framework's keys — safe to serialize and persist whole, which is usually why you ask for it.

### `namespaces`

```ts
namespaces(): string[]
```

All namespaces currently present in the mirror, your own and every peer's. Unlike the other methods this is not scoped — it is the same list the raw `State` returns.

### `subscribe`

```ts
subscribe(listener: StateChangeListener): Unsubscribe

interface StateChange {
  ns: string;
  key: string;
  value: unknown | undefined;   // undefined when deleted
  deleted: boolean;
}
```

Notified when **this addon's own** state changes, whether the write was local or arrived from another realm. Other namespaces and framework keys are filtered out before your listener runs.

:::tip No namespace guard needed
`ScopedState.subscribe` already filters to `core.namespace`, so `if (change.ns !== core.namespace) return;` inside the listener is redundant. Use `core.node.state.subscribe()` when you genuinely want to observe *everything*.
:::

---

## Typed keys

Plain string keys read as `unknown`. Brand a key with `stateKey<T>()` and `get` infers the value type while `set` type-checks it:

```ts
import { stateKey } from '@bedrock-core/sync';

const SHOP_OPEN = stateKey<boolean>('shopOpen');

core.state.set(SHOP_OPEN, true);      // value must be boolean
const open = core.state.get(SHOP_OPEN); // boolean | undefined
```

:::caution Compile-time only
`StateKey<T>` is a branded string. Nothing validates the value at runtime — whatever peer wrote last is what you read. Treat it as an assertion about your own code, not a guarantee about someone else's.
:::

---

## Reserved keys

```ts
RESERVED_STATE_PREFIX;              // 'core-'
isReservedStateKey('core-i18n/bundle'); // true
```

Your namespace carries more than you put there. The framework replicates several of its own payloads under the **same** namespace:

| Key | Written by |
|---|---|
| `core-config/schema` | [ConfigRegistry](./config.md) — the published config schema |
| `core-i18n/bundle` | [TranslationsRegistry](./translations.md) — this addon's i18n bundle |
| `core-guide/manifest` | [GuidesRegistry](./guides.md) — the compiled guide manifest |
| `core-feature/<id>` | [FeatureManager](./features.md) — one boolean per declared feature |

`ScopedState` hides them entirely: it reads, reports and enumerates only what the addon itself wrote, and refuses to let you write into the reserved space. That is what makes `getNamespace()` safe to persist whole — a compiled guide on its own dwarfs a dynamic property's ceiling.

```ts
core.state.set('core-mine', 1);
// Error: cannot set state key 'core-mine': 'core-' is reserved for bedrock-core
```

To reach the raw namespace, framework keys included, use `core.node.state`:

```ts
core.node.state.get(core.id, 'core-config/schema');
```

---

## Reading another addon's state

`core.state` is scoped to you. For cross-namespace reads, go through the node — the mirror is global, so there is no round trip and no second node to create:

```ts
core.node.state.get('drav0011_economy', 'currency');   // unknown
core.node.state.getNamespace('drav0011_economy');      // Record<string, unknown>
```

Writes to another addon's namespace are technically allowed — the store is shared-mutable and conflicts resolve last-write-wins — but treat someone else's namespace as read-only unless you have agreed otherwise. See [strict ownership](../sync/state.md#ownership-and-strictownership) for the opt-in that makes stray writes throw.

---

## Persistence is your job

sync is in-memory only. Nothing here survives a world reload unless you save it. The pattern:

1. Defer everything with `system.run()` — dynamic properties are unreadable during early execution.
2. **Restore first**, then subscribe, so replaying saved keys does not immediately write them all back out.
3. Persist per key rather than one blob per namespace: a string dynamic property caps at 32767 characters, and a namespace that grows a key per player crosses that on some later write, far from the code that added the key.

```ts
import { system, world } from '@minecraft/server';

const SAVE_PREFIX = 'drav0011:economy:';
const DP_STRING_MAX = 32767;

system.run(() => {
  for (const dpKey of world.getDynamicPropertyIds()) {
    if (!dpKey.startsWith(SAVE_PREFIX)) { continue; }

    const saved = world.getDynamicProperty(dpKey);

    if (typeof saved !== 'string') { continue; }

    try {
      core.state.set(dpKey.slice(SAVE_PREFIX.length), JSON.parse(saved) as unknown);
    } catch {
      console.warn(`[economy] could not parse saved state '${dpKey}'`);
    }
  }

  core.state.subscribe((change) => {
    const dpKey = `${SAVE_PREFIX}${change.key}`;

    if (change.deleted) {
      world.setDynamicProperty(dpKey, undefined);

      return;
    }

    const encoded = JSON.stringify(change.value);

    if (encoded.length > DP_STRING_MAX) {
      console.warn(`[economy] '${change.key}' is ${String(encoded.length)} chars — not persisted`);

      return;
    }

    world.setDynamicProperty(dpKey, encoded);
  });
});
```

:::note Use your own namespace for dynamic property keys
`core-` belongs to the framework — the config subsystem stores under `core-cfg:…`. Prefix your saved keys with your own creator and pack.
:::
