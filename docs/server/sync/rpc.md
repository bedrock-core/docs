---
sidebar_position: 3
---

# Rpc

`sync.rpc` — and `core.rpc`, which is the same object — is request/response messaging between addons. A request sends a `req` envelope and returns a promise; the matching `res` envelope resolves or rejects it.

Because responses are just more script events, **every request carries a tick-based timeout**, so a peer that never answers (or was never there) can never leak a pending promise or hang your code.

## Import

```ts
import type { RequestHandler, RequestOptions, RpcOptions, TypedClient, RPCHandlerMap } from '@bedrock-core/sync';
```

`TypedClient` and `RPCHandlerMap` are also re-exported from `@bedrock-core/server-runtime`.

## Usage

```ts
// Expose a method
core.rpc.onRequest('getBalance', (params, from) => {
  const { player } = params as { player: string };

  return lookupBalance(player);
});

// Call another addon — the target is its namespace
const balance = await core.rpc.request('drav0011_economy', 'getBalance', { player: 'Steve' });
```

---

## Serving

### `onRequest`

```ts
onRequest(method: string, handler: RequestHandler): Unsubscribe

type RequestHandler = (params: unknown, from: string) => unknown | Promise<unknown>;
```

Register the handler for one method name. `from` is the requester's addon id. The handler may be async; whatever it returns (or resolves with) becomes the response. Registering the same method again **replaces** the previous handler.

Throwing inside a handler rejects the caller's promise with your error message — which is the right way to refuse a request, because the caller learns why instead of watching it time out.

```ts
core.rpc.onRequest('buy', (params, from) => {
  const { itemId } = params as { itemId: string };

  if (!isSellable(itemId)) { throw new Error(`'${itemId}' is not for sale`); }

  return purchase(itemId, from);
});
```

An unknown method is answered automatically with `unknown method '<name>'` — the caller rejects rather than waiting for the timeout.

### `serve`

```ts
serve<T>(handlers: RPCHandlerMap<T>): Unsubscribe
```

Register a whole typed handler map at once. Each key is type-checked against the interface, and the single returned function removes every handler.

```ts
export interface EconomyRPC {
  getBalance(params: { player: string }): number;
  transfer(params: { from: string; to: string; amount: number }): boolean;
}

core.rpc.serve<EconomyRPC>({
  getBalance: ({ player }) => {
    const balance = core.state.get(`balance.${player}`);

    return typeof balance === 'number' ? balance : 0;
  },
  transfer: ({ from, to, amount }) => moveFunds(from, to, amount),
});
```

`RPCHandlerMap<T>` maps each `(params: P) => R` in the interface to `(params: P, from: string) => R | Promise<Awaited<R>>`, so handlers get typed params and may still be async.

---

## Calling

### `request`

```ts
request(dst: string, method: string, params?: unknown, options?: RequestOptions): Promise<unknown>

interface RequestOptions { timeoutTicks?: number }
```

Call `method` on addon `dst`. Resolves with its response, or rejects on a handler error or a timeout:

```
RPC 'getBalance' to 'drav0011_economy' timed out
```

The default timeout is **100 ticks (5 seconds at 20 tps)**. Raise it per call for something genuinely slow:

```ts
await core.rpc.request('drav0011_economy', 'rebuildIndex', {}, { timeoutTicks: 400 });
```

`RpcOptions.defaultTimeoutTicks` changes the default when constructing an `Rpc` yourself.

### `typed`

```ts
typed<T>(targetId: string): TypedClient<T>
```

A `Proxy`-backed client whose methods dispatch to `request(targetId, methodName, params)`. This is the ergonomic way to call a peer whose interface you have.

```ts
const economy = core.rpc.typed<EconomyRPC>('drav0011_economy');

const balance = await economy.getBalance({ player: 'Steve' });   // Promise<number>
```

`TypedClient<T>` maps each `(params: P) => R` to `(params: P) => Promise<Awaited<R>>`.

:::tip Publish your RPC interface
Export the interface from a types package (`@drav0011/economy-types`) and let consumers install it as a devDependency. They get compile-time safety over a wire protocol neither side can otherwise check.
:::

---

## Calling yourself

A node may call **itself**:

```ts
await core.rpc.request(core.id, 'getBalance', { player: 'Steve' });
```

Self-addressed messages are delivered locally on the **next tick** rather than going over the wire, so the timing is the same as a real hop. That keeps one "always go through RPC" model even when the target turns out to be the caller.

---

## Patterns

### Never assume the peer is there

```ts
core.registry.onDependenciesSatisfied(() => {
  const economy = core.registry.get('drav0011_economy');

  if (!economy) { return; }

  core.rpc.typed<EconomyRPC>(economy.id)
    .getBalance({ player: 'Steve' })
    .then(balance => console.warn(`[shop] ${String(balance)}`))
    .catch((error: unknown) => console.warn(`[shop] balance request failed: ${String(error)}`));
});
```

### Always handle rejection

Every `request` can reject — timeout, unknown method, or a handler that threw. An unhandled rejection in a Bedrock script realm is noisy and easy to miss, so attach a `.catch` (or wrap in `try`/`catch`) at every call site.

### Namespace your method names

The framework's own methods are namespaced (`core:config.get-server`, `core:ui.open`). Method names are per-node, so collisions are only possible within your own addon — but a prefix keeps framework methods and yours visibly apart.

---

## Lifecycle

`rpc.start()` subscribes the request and response handlers; `rpc.stop()` unsubscribes them and **rejects every pending request** with `RPC stopped`. Both are driven by `SyncNode.start()` / `stop()`, so an addon using `core` never calls them directly — but it is worth knowing that `core.stop()` will reject anything still in flight.
