---
sidebar_position: 7
description: "toNative mints a data-driven form's own observable and keeps it in step with one of yours for the form's lifetime."
---

# toNative

`toNative` mints one of the engine's form observables — `ObservableNumber`, `ObservableString` or `ObservableBoolean` — and keeps it in step with one of yours for the form's lifetime.

A `CustomForm` redraws only for the engine's own observables, one scalar each, so yours cannot *be* theirs. This is the bridge, and the only part of the package that imports `@minecraft/server-ui`.

## Import

```ts
import { toNative, bindNative } from '@bedrock-core/observable/minecraft';
import type { NativeBinding, NativeObservable, NativeScalar, ToNativeOptions } from '@bedrock-core/observable/minecraft';
```

Through the meta package it is on the same subpath as the rest: `@bedrock-core/server/observable`.

## Signature

```ts
toNative(source: ReadonlyObservable<number>, options?: ToNativeOptions): NativeBinding<ObservableNumber>
toNative(source: ReadonlyObservable<string>, options?: ToNativeOptions): NativeBinding<ObservableString>
toNative(source: ReadonlyObservable<boolean>, options?: ToNativeOptions): NativeBinding<ObservableBoolean>
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `source` <Req /> | `ReadonlyObservable<number \| string \| boolean>` | — | Yours: the source of truth for the control |
| `options.clientWritable` | `boolean` | `false` | Let the player's control write the value back into `source`; off, the native is a one-way view |

## Returns

```ts
interface NativeBinding<N> {
  native: N;             // hand this to the form control
  dispose: Unsubscribe;  // release both directions; call it when the form closes
}
```

## Usage

```ts
import { CustomForm } from '@minecraft/server-ui';

const { native: volume, dispose } = toNative(config.player.for(player).volume, { clientWritable: true });

new CustomForm(player, 'Settings')
  .slider('Volume', volume, 0, 100)
  .show()
  .then(dispose);
```

While the form is open, a change to `config.player.for(player).volume` from anywhere — a command, another screen, a peer's RPC — moves the slider; the player moving the slider writes the config leaf, which persists it.

## Examples

### A derived scalar

Scalars only. Derive one with [`computed`](./computed.md) from anything larger:

```ts
const label = computed(() => `${shared.event.get().name} (${String(aliveCount.get())})`, [shared.event, aliveCount]);
const { native, dispose } = toNative(label);
```

### Binding an existing native

`bindNative(source, native, options)` keeps a native observable you already hold in step, and returns the release:

```ts
const release = bindNative(config.server.pvp, existingToggle, { clientWritable: true });
```

## Notes

- **Yours is the source of truth.** The native is pushed on creation and on every change; with `clientWritable`, the native writes back only when the value differs, so the two never ping-pong.
- **`clientWritable` needs a writable source.** On a `ReadonlyObservable` — a `computed`, a peer's shared key — the option has no effect and the native stays a one-way view.
- **Dispose when the form closes.** Nothing releases the engine subscription for you; `show().then(dispose)` is the pattern.
